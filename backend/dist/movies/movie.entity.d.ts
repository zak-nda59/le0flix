import { Category } from './category.entity';
export declare class Movie {
    id: string;
    title: string;
    synopsis: string | null;
    releaseYear: number | null;
    durationMinutes: number | null;
    maturityRating: string | null;
    thumbnailUrl: string | null;
    backdropUrl: string | null;
    hlsBasePath: string;
    isPublished: number;
    categories: Category[];
    createdAt: Date;
    updatedAt: Date;
}
