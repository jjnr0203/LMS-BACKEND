import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CourseEntity } from './course.entity';
import { AssignmentSubmissionEntity } from './assignment-submission.entity';

@Entity('assignments')
export class AssignmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_course', type: 'uuid' })
  idCourse: string;

  @ManyToOne(() => CourseEntity)
  @JoinColumn({ name: 'id_course' })
  course?: CourseEntity;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'max_score', type: 'decimal', precision: 5, scale: 2 })
  maxScore: number;

  @Column({ name: 'due_date', type: 'timestamp' })
  dueDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => AssignmentSubmissionEntity, (s) => s.assignment)
  submissions?: AssignmentSubmissionEntity[];
}
