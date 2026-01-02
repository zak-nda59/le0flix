import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { MoviesService } from '../movies/movies.service';
import { CreateStreamSessionDto } from './dto/create-stream-session.dto';
import { StreamService } from './stream.service';
export declare class StreamController {
    private readonly stream;
    private readonly movies;
    private readonly config;
    constructor(stream: StreamService, movies: MoviesService, config: ConfigService);
    createSession(req: Request, body: CreateStreamSessionDto): Promise<{
        playbackUrl: string;
        expiresAt: Date;
    }>;
    serveHls(movieId: string, quality: string, file: string, token: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
