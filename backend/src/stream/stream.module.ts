import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesModule } from '../movies/movies.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StreamController } from './stream.controller';
import { StreamingSession } from './streaming-session.entity';
import { StreamService } from './stream.service';

@Module({
    imports: [TypeOrmModule.forFeature([StreamingSession]), MoviesModule],
    controllers: [StreamController],
    providers: [StreamService, JwtAuthGuard],
})
export class StreamModule { }
