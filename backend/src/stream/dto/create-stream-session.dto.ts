import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateStreamSessionDto {
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    movieId!: string;

    @IsOptional()
    @IsString()
    @IsIn(['360p', '720p', '1080p', '4k'])
    quality?: '360p' | '720p' | '1080p' | '4k';
}
