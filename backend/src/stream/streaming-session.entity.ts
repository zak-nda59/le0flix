import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'streaming_sessions' })
export class StreamingSession {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: string;

    @Column({ type: 'bigint', unsigned: true, name: 'user_id' })
    userId!: string;

    @Column({ type: 'bigint', unsigned: true, name: 'movie_id' })
    movieId!: string;

    @Column({ type: 'varchar', length: 255, name: 'session_token_hash' })
    sessionTokenHash!: string;

    @Column({ type: 'varchar', length: 45, nullable: true })
    ip!: string | null;

    @Column({ type: 'varchar', length: 255, name: 'user_agent', nullable: true })
    userAgent!: string | null;

    @Column({ type: 'datetime', name: 'expires_at' })
    expiresAt!: Date;

    @CreateDateColumn({ type: 'datetime', name: 'created_at' })
    createdAt!: Date;
}
