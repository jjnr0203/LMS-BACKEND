import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StudentEntity } from './student.entity';

@Entity('payments')
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_user', type: 'uuid' })
  idUser: string;

  @ManyToOne(() => StudentEntity)
  @JoinColumn({ name: 'id_user' })
  student?: StudentEntity;

  @Column({ name: 'amount', type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'payment_date', type: 'date' })
  paymentDate: Date;

  @Column({ type: 'varchar', length: 100 })
  concept: string;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: string;

  @Column({
    name: 'reference_number',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  referenceNumber: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
