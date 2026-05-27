import { Entity, OneToOne, JoinColumn, Column, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('students')
export class StudentEntity {
  @PrimaryColumn({ name: 'id_user', type: 'uuid' })
  idUser: string;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'id_user', referencedColumnName: 'id' })
  user: UserEntity;

  @Column({ name: 'enrollment_date', type: 'date' })
  enrollmentDate: Date;

  @Column({ type: 'varchar', length: 255 })
  career: string;

  @Column({ type: 'int' })
  semester: number;

  @Column({ type: 'varchar', length: 50 })
  group: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
