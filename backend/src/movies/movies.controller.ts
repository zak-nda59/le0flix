import { Controller, Get, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
    constructor(private readonly movies: MoviesService) { }

    @Get()
    list() {
        return this.movies.listPublished();
    }

    @Get(':id')
    get(@Param('id') id: string) {
        return this.movies.getPublishedById(id);
    }
}
