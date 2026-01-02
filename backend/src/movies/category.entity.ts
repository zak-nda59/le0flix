import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: string;

    @Column({ type: 'varchar', length: 80 })
    name!: string;

    @Column({ type: 'varchar', length: 80, unique: true })
    slug!: string;

    @CreateDateColumn({ type: 'datetime', name: 'created_at' })
    createdAt!: Date;
}
