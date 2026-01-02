import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
export declare class MoviesService {
    private readonly moviesRepo;
    constructor(moviesRepo: Repository<Movie>);
    listPublished(): Promise<Movie[]>;
    getPublishedById(id: string): Promise<Movie>;
}
