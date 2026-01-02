import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('search_logs')
export class SearchLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ length: 255 })
  query: string;

  @Column({ default: false })
  found: boolean;

  @Column({ length: 50, nullable: true })
  mode: string; // database or ai

  @CreateDateColumn()
  createdAt: Date;
}
