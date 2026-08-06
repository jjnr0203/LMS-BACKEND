import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TeacherOrmEntity } from '../users/teacher.orm-entity';

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

  @Column({ type: 'int', default: 0 })
  hours: number;

  @Index()
  @Column({ name: 'teacher_id', type: 'uuid', nullable: true })
  teacherId?: string;

  @ManyToOne(() => TeacherOrmEntity)
  @JoinColumn({ name: 'teacher_id' })
  teacher: TeacherOrmEntity;

  @Column({ type: 'text', nullable: true })
  description?: string;



  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
