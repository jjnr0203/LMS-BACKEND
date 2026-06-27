import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';
import { UserOrmEntity } from '../users/user.orm-entity';
import { ModalityOrmEntity } from './modality.orm-entity';

@Entity('subjects')
export class SubjectOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ type: 'int' })
  credits: number;

  @Index()
  @Column({ type: 'varchar', length: 20, name: 'teacher_id', nullable: true })
  teacherId: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'teacher_id' })
  teacher: UserOrmEntity;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToMany(() => ModalityOrmEntity)
  @JoinTable({
    name: 'subject_modalities',
    joinColumn: { name: 'subject_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'modality_id', referencedColumnName: 'id' },
  })
  modalities: ModalityOrmEntity[];
}
