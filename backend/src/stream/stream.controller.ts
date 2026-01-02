import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AccessTokenPayload } from '../auth/jwt-payload.type';
import { MoviesService } from '../movies/movies.service';
import { CreateStreamSessionDto } from './dto/create-stream-session.dto';
import { StreamService } from './stream.service';

@Controller()
export class StreamController {
    constructor(
        private readonly stream: StreamService,
        private readonly movies: MoviesService,
        private readonly config: ConfigService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('stream/sessions')
    async createSession(@Req() req: Request, @Body() body: CreateStreamSessionDto) {
        const user = req.user as AccessTokenPayload;
        const movie = await this.movies.getPublishedById(String(body.movieId));

        const ttl = Number(this.config.get<string>('STREAM_SESSION_TTL_SECONDS', '300'));
        const { token, expiresAt } = await this.stream.createSession({
            userId: user.sub,
            movieId: String(movie.id),
            ip: req.ip ?? null,
            userAgent: req.headers['user-agent'] ?? null,
            ttlSeconds: Number.isFinite(ttl) ? ttl : 300,
        });

        const quality = body.quality ?? '1080p';

        return {
            playbackUrl: this.stream.buildPlaybackUrl(String(movie.id), quality, token),
            expiresAt,
        };
    }

    @Get('hls/:movieId/:quality/:file')
    async serveHls(
        @Param('movieId') movieId: string,
        @Param('quality') quality: string,
        @Param('file') file: string,
        @Query('token') token: string,
        @Res() res: Response,
    ) {
        if (!token) return res.status(401).send('Missing token');

        await this.stream.assertValidToken(token, movieId);

        const rootDir = this.config.get<string>('HLS_ROOT_DIR', '../hls');
        const absoluteRoot = path.resolve(process.cwd(), rootDir);

        if (file.includes('..') || file.includes('/') || file.includes('\\')) {
            return res.status(400).send('Invalid path');
        }

        const absoluteFile = path.resolve(absoluteRoot, movieId, quality, file);

        if (!fs.existsSync(absoluteFile) || !fs.statSync(absoluteFile).isFile()) {
            return res.status(404).send('Not found');
        }

        if (absoluteFile.endsWith('.m3u8')) {
            res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
            const raw = fs.readFileSync(absoluteFile, 'utf8');
            const rewritten = raw
                .split(/\r?\n/)
                .map((line) => {
                    if (!line || line.startsWith('#')) return line;
                    if (line.includes('://')) return line;
                    if (line.includes('token=')) return line;

                    const joiner = line.includes('?') ? '&' : '?';
                    return `${line}${joiner}token=${encodeURIComponent(token)}`;
                })
                .join('\n');
            return res.send(rewritten);
        }

        if (absoluteFile.endsWith('.ts')) {
            res.setHeader('Content-Type', 'video/mp2t');
        }

        return fs.createReadStream(absoluteFile).pipe(res);
    }
}
