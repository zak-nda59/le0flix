import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email!: string;

    @Column({ type: 'varchar', length: 255, name: 'password_hash' })
    passwordHash!: string;

    @Column({ type: 'varchar', length: 80, name: 'display_name' })
    displayName!: string;

    @Column({
        type: 'enum',
        enum: ['user', 'admin'],
        default: 'user',
    })
    role!: 'user' | 'admin';

    @Column({ type: 'tinyint', width: 1, name: 'is_email_verified', default: 0 })
    isEmailVerified!: number;

    @CreateDateColumn({ type: 'datetime', name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
    updatedAt!: Date;
}
