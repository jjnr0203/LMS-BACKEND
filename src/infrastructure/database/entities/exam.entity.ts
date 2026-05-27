import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CourseEntity } from './course.entity';
import { ExamQuestionEntity } from './exam-question.entity';

@Entity('exams')
export class ExamEntity {
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

  @Column({ name: 'duration_minutes', type: 'int' })
  durationMinutes: number;

  @Column({ name: 'max_score', type: 'decimal', precision: 5, scale: 2 })
  maxScore: number;

  @Column({ name: 'passing_score', type: 'decimal', precision: 5, scale: 2 })
  passingScore: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => ExamQuestionEntity, (q) => q.exam)
  questions?: ExamQuestionEntity[];
}
