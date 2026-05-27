import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AssignmentEntity } from './assignment.entity';
import { StudentEntity } from './student.entity';

@Entity('assignment_submissions')
export class AssignmentSubmissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_assignment', type: 'uuid' })
  idAssignment: string;

  @ManyToOne(() => AssignmentEntity, (a) => a.submissions)
  @JoinColumn({ name: 'id_assignment' })
  assignment?: AssignmentEntity;

  @Column({ name: 'id_user', type: 'uuid' })
  idUser: string;

  @ManyToOne(() => StudentEntity)
  @JoinColumn({ name: 'id_user' })
  student?: StudentEntity;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ name: 'file_url', type: 'varchar', length: 500, nullable: true })
  fileUrl: string | null;

  @Column({
    name: 'score',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  score: number | null;

  @Column({ type: 'text', nullable: true })
  feedback: string | null;

  @Column({
    name: 'submitted_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  submittedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
