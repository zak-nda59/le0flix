import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';

@Injectable()
export class MoviesService {
    constructor(
        @InjectRepository(Movie) private readonly moviesRepo: Repository<Movie>,
    ) { }

    async listPublished() {
        return this.moviesRepo.find({
            where: { isPublished: 1 },
            order: { createdAt: 'DESC' },
        });
    }

    async getPublishedById(id: string) {
        const movie = await this.moviesRepo.findOne({
            where: { id, isPublished: 1 },
        });
        if (!movie) throw new NotFoundException('Movie not found');
        return movie;
    }
}
