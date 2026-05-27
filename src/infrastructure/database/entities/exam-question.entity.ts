import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ExamEntity } from './exam.entity';
import { ExamAnswerEntity } from './exam-answer.entity';

@Entity('exam_questions')
export class ExamQuestionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_exam', type: 'uuid' })
  idExam: string;

  @ManyToOne(() => ExamEntity, (e) => e.questions)
  @JoinColumn({ name: 'id_exam' })
  exam?: ExamEntity;

  @Column({ type: 'text' })
  question: string;

  @Column({ name: 'question_type', type: 'varchar', length: 50 })
  questionType: string;

  @Column({ type: 'int' })
  order: number;

  @Column({ name: 'points', type: 'decimal', precision: 5, scale: 2 })
  points: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => ExamAnswerEntity, (a) => a.question)
  answers?: ExamAnswerEntity[];
}
