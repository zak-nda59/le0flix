import { MoviesService } from './movies.service';
export declare class MoviesController {
    private readonly movies;
    constructor(movies: MoviesService);
    list(): Promise<import("./movie.entity").Movie[]>;
    get(id: string): Promise<import("./movie.entity").Movie>;
}
