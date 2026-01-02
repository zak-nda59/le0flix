import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { SignOptions } from 'jsonwebtoken';
import { AccessTokenPayload } from './jwt-payload.type';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly usersRepo: Repository<User>,
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
    ) { }

    async register(dto: RegisterDto) {
        const existing = await this.usersRepo.findOne({ where: { email: dto.email } });
        if (existing) throw new ConflictException('Email already in use');

        const passwordHash = await bcrypt.hash(dto.password, 12);

        const user = this.usersRepo.create({
            email: dto.email.toLowerCase(),
            passwordHash,
            displayName: dto.displayName,
            role: 'user',
            isEmailVerified: 0,
        });
        const saved = await this.usersRepo.save(user);

        const accessToken = await this.issueAccessToken(saved);

        return {
            accessToken,
            user: this.publicUser(saved),
        };
    }

    async login(dto: LoginDto) {
        const user = await this.usersRepo.findOne({ where: { email: dto.email.toLowerCase() } });
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const ok = await bcrypt.compare(dto.password, user.passwordHash);
        if (!ok) throw new UnauthorizedException('Invalid credentials');

        const accessToken = await this.issueAccessToken(user);

        return {
            accessToken,
            user: this.publicUser(user),
        };
    }

    private async issueAccessToken(user: User) {
        const payload: AccessTokenPayload = {
            sub: String(user.id),
            email: user.email,
            role: user.role,
        };

        const expiresInRaw = this.config.get<string>('JWT_ACCESS_EXPIRES_IN', '15m');
        const expiresIn = expiresInRaw as unknown as SignOptions['expiresIn'];

        return this.jwt.signAsync(payload, {
            secret: this.config.get<string>('JWT_ACCESS_SECRET', 'change-me'),
            expiresIn,
        });
    }

    private publicUser(user: User) {
        return {
            id: String(user.id),
            email: user.email,
            displayName: user.displayName,
            role: user.role,
        };
    }
}
