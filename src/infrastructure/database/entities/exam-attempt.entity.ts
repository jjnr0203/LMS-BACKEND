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
import { StudentEntity } from './student.entity';
import { ExamAnswerEntity } from './exam-answer.entity';

@Entity('exam_attempts')
export class ExamAttemptEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_exam', type: 'uuid' })
  idExam: string;

  @ManyToOne(() => ExamEntity)
  @JoinColumn({ name: 'id_exam' })
  exam?: ExamEntity;

  @Column({ name: 'id_user', type: 'uuid' })
  idUser: string;

  @ManyToOne(() => StudentEntity)
  @JoinColumn({ name: 'id_user' })
  student?: StudentEntity;

  @Column({
    name: 'started_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  startedAt: Date;

  @Column({ name: 'ended_at', type: 'timestamp', nullable: true })
  endedAt: Date | null;

  @Column({
    name: 'total_score',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  totalScore: number | null;

  @Column({ type: 'varchar', length: 20, default: 'in_progress' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => ExamAnswerEntity, (a) => a.attempt)
  answers?: ExamAnswerEntity[];
}
