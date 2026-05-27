import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExamQuestionEntity } from './exam-question.entity';
import { ExamAttemptEntity } from './exam-attempt.entity';

@Entity('exam_answers')
export class ExamAnswerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_attempt', type: 'uuid' })
  idAttempt: string;

  @ManyToOne(() => ExamAttemptEntity, (a) => a.answers)
  @JoinColumn({ name: 'id_attempt' })
  attempt?: ExamAttemptEntity;

  @Column({ name: 'id_question', type: 'uuid' })
  idQuestion: string;

  @ManyToOne(() => ExamQuestionEntity, (q) => q.answers)
  @JoinColumn({ name: 'id_question' })
  question?: ExamQuestionEntity;

  @Column({ type: 'text', nullable: true })
  answer: string | null;

  @Column({ name: 'is_correct', type: 'boolean', nullable: true })
  isCorrect: boolean | null;

  @Column({
    name: 'score',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  score: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
