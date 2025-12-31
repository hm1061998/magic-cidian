import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import {
  SavedIdiomEntity,
  SRSProgressEntity,
} from '../../user-data/entities/user-data.entities';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ type: 'varchar', nullable: true, select: false })
  refreshToken: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => SavedIdiomEntity, (saved) => saved.user)
  savedIdioms: SavedIdiomEntity[];

  @OneToMany(() => SRSProgressEntity, (srs) => srs.user)
  srsProgress: SRSProgressEntity[];
}
