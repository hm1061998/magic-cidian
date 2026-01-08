import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExerciseEntity } from './exercise.entity';

export enum QuestionType {
  MATCHING = 'MATCHING',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  FILL_BLANKS = 'FILL_BLANKS',
}

@Entity('questions')
export class QuestionEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  exerciseId: string;

  @ManyToOne(() => ExerciseEntity, (exercise) => exercise.questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'exerciseId' })
  exercise: ExerciseEntity;

  @Column({
    type: 'enum',
    enum: QuestionType,
  })
  type: QuestionType;

  @Column({ type: 'jsonb' })
  content: any;
  /*
    MATCHING: { 
      pairs: { left: string; right: string }[] 
    }
    MULTIPLE_CHOICE: {
      question: string;
      options: { id: string; text: string }[];
      correctOptionId: string;
      explanation?: string;
    }
    FILL_BLANKS: {
      text: string; // e.g. "Tôi [0] đi học bằng [1]"
      wordBank: string[]; // All available words (correct + distractors)
      correctAnswers: { position: number; word: string }[]; // Mapping of position to correct word
    }
  */

  @Column({ default: 10 })
  points: number;

  @Column({ default: 0 })
  order: number; // Thứ tự câu hỏi trong bài tập

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
