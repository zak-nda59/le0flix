import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity({ name: 'movies' })
export class Movie {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: string;

    @Column({ type: 'varchar', length: 255 })
    title!: string;

    @Column({ type: 'text', nullable: true })
    synopsis!: string | null;

    @Column({ type: 'smallint', unsigned: true, name: 'release_year', nullable: true })
    releaseYear!: number | null;

    @Column({
        type: 'smallint',
        unsigned: true,
        name: 'duration_minutes',
        nullable: true,
    })
    durationMinutes!: number | null;

    @Column({ type: 'varchar', length: 20, name: 'maturity_rating', nullable: true })
    maturityRating!: string | null;

    @Column({ type: 'varchar', length: 500, name: 'thumbnail_url', nullable: true })
    thumbnailUrl!: string | null;

    @Column({ type: 'varchar', length: 500, name: 'backdrop_url', nullable: true })
    backdropUrl!: string | null;

    @Column({ type: 'varchar', length: 500, name: 'hls_base_path' })
    hlsBasePath!: string;

    @Column({ type: 'tinyint', width: 1, name: 'is_published', default: 0 })
    isPublished!: number;

    @ManyToMany(() => Category, { eager: true })
    @JoinTable({
        name: 'movie_categories',
        joinColumn: { name: 'movie_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
    })
    categories!: Category[];

    @CreateDateColumn({ type: 'datetime', name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
    updatedAt!: Date;
}
