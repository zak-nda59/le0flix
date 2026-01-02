import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { StreamingSession } from './streaming-session.entity';
export declare class StreamService {
    private readonly sessionsRepo;
    private readonly config;
    constructor(sessionsRepo: Repository<StreamingSession>, config: ConfigService);
    createSession(params: {
        userId: string;
        movieId: string;
        ip: string | null;
        userAgent: string | null;
        ttlSeconds: number;
    }): Promise<{
        token: string;
        expiresAt: Date;
    }>;
    assertValidToken(token: string, movieId: string): Promise<StreamingSession>;
    buildPlaybackUrl(movieId: string, quality: string, token: string): string;
    private hashToken;
}
