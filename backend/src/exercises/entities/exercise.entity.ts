import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { QuestionEntity } from './question.entity';

export enum ExerciseType {
  MATCHING = 'MATCHING',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  FILL_BLANKS = 'FILL_BLANKS',
}

@Entity('exercises')
export class ExerciseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'easy' })
  difficulty: string; // easy, medium, hard

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => QuestionEntity, (question) => question.exercise, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  questions: QuestionEntity[];
}
