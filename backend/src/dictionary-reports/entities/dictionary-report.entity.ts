import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { IdiomEntity } from '../../idioms/entities/idiom.entity';

export enum ReportType {
  CONTENT_ERROR = 'content_error',
  AUDIO_ERROR = 'audio_error',
  MISSING_INFO = 'missing_info',
  OTHER = 'other',
}

export enum ReportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

@Entity('dictionary_reports')
export class DictionaryReportEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Column()
  userId: string;

  @ManyToOne(() => IdiomEntity)
  idiom: IdiomEntity;

  @Column()
  idiomId: string;

  @Column({
    type: 'enum',
    enum: ReportType,
    default: ReportType.OTHER,
  })
  type: ReportType;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  status: ReportStatus;

  @Column({ type: 'text', nullable: true })
  adminNote: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
