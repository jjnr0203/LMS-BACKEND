import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { StudentOrmEntity } from '../users/student.orm-entity';

@Entity('tuitions')
export class TuitionOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 20, name: 'student_id' })
  studentId: string;

  @ManyToOne(() => StudentOrmEntity)
  @JoinColumn({ name: 'student_id' })
  student: StudentOrmEntity;

  @Column({ type: 'varchar', length: 20, default: 'no_paga' })
  status: string;

  @Column({ type: 'int', name: 'paid_installments', default: 0 })
  paidInstallments: number;
}
