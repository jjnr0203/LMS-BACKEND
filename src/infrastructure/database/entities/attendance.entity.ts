import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StudentEntity } from './student.entity';
import { LessonEntity } from './lesson.entity';

@Entity('attendance')
export class AttendanceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_user', type: 'uuid' })
  idUser: string;

  @ManyToOne(() => StudentEntity)
  @JoinColumn({ name: 'id_user' })
  student?: StudentEntity;

  @Column({ name: 'id_lesson', type: 'uuid' })
  idLesson: string;

  @ManyToOne(() => LessonEntity)
  @JoinColumn({ name: 'id_lesson' })
  lesson?: LessonEntity;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'varchar', length: 20, default: 'present' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
