import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { StreamingSession } from './streaming-session.entity';

@Injectable()
export class StreamService {
    constructor(
        @InjectRepository(StreamingSession)
        private readonly sessionsRepo: Repository<StreamingSession>,
        private readonly config: ConfigService,
    ) { }

    async createSession(params: {
        userId: string;
        movieId: string;
        ip: string | null;
        userAgent: string | null;
        ttlSeconds: number;
    }) {
        const token = crypto.randomBytes(32).toString('hex');
        const sessionTokenHash = this.hashToken(token);

        const expiresAt = new Date(Date.now() + params.ttlSeconds * 1000);

        const session = this.sessionsRepo.create({
            userId: params.userId,
            movieId: params.movieId,
            sessionTokenHash,
            ip: params.ip,
            userAgent: params.userAgent,
            expiresAt,
        });

        await this.sessionsRepo.save(session);

        return { token, expiresAt };
    }

    async assertValidToken(token: string, movieId: string) {
        const sessionTokenHash = this.hashToken(token);

        const session = await this.sessionsRepo.findOne({
            where: { sessionTokenHash, movieId },
        });

        if (!session) throw new UnauthorizedException('Invalid token');

        if (new Date(session.expiresAt).getTime() < Date.now()) {
            throw new UnauthorizedException('Token expired');
        }

        return session;
    }

    buildPlaybackUrl(movieId: string, quality: string, token: string) {
        const base = this.config.get<string>('STREAM_BASE_URL', 'http://localhost:4000');
        return `${base}/hls/${encodeURIComponent(movieId)}/${encodeURIComponent(quality)}/index.m3u8?token=${encodeURIComponent(token)}`;
    }

    private hashToken(token: string) {
        const secret = this.config.get<string>('STREAM_TOKEN_SECRET', 'change-me');
        return crypto
            .createHash('sha256')
            .update(`${token}.${secret}`)
            .digest('hex');
    }
}
