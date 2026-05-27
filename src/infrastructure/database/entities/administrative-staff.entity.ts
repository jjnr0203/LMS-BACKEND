import { Entity, OneToOne, JoinColumn, Column, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('administrative_staff')
export class AdministrativeStaffEntity {
  @PrimaryColumn({ name: 'id_user', type: 'uuid' })
  idUser: string;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'id_user', referencedColumnName: 'id' })
  user: UserEntity;

  @Column({ name: 'assigned_department', type: 'varchar', length: 50 })
  assignedDepartment: string;

  @Column({ name: 'hire_date', type: 'date' })
  hireDate: Date;

  @Column({ type: 'varchar', length: 100 })
  position: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
