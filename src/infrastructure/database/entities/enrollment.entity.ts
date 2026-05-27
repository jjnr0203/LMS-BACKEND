import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StudentEntity } from './student.entity';
import { CourseEntity } from './course.entity';

@Entity('enrollments')
export class EnrollmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_user', type: 'uuid' })
  idUser: string;

  @ManyToOne(() => StudentEntity)
  @JoinColumn({ name: 'id_user' })
  student?: StudentEntity;

  @Column({ name: 'id_course', type: 'uuid' })
  idCourse: string;

  @ManyToOne(() => CourseEntity)
  @JoinColumn({ name: 'id_course' })
  course?: CourseEntity;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @Column({ type: 'date', nullable: true })
  completedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
