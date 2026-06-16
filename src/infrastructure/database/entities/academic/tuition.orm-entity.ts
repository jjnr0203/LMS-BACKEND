import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserOrmEntity } from '../users/user.orm-entity';

@Entity('tuitions')
export class TuitionOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 20, name: 'student_id' })
  studentId: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'student_id' })
  student: UserOrmEntity;

  @Column({ type: 'varchar', length: 20, default: 'no_paga' })
  status: string;

  @Column({ type: 'int', name: 'paid_installments', default: 0 })
  paidInstallments: number;
}
