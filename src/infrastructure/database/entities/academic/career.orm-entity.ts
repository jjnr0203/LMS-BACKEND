import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserOrmEntity } from '../users/user.orm-entity';
import { ModalityOrmEntity } from './modality.orm-entity';

@Entity('careers')
export class CareerOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ type: 'int', name: 'duration_semesters' })
  durationSemesters: number;

  @Column({ type: 'uuid', name: 'modality_id', nullable: true })
  modalityId?: string;

  @ManyToOne(() => ModalityOrmEntity)
  @JoinColumn({ name: 'modality_id' })
  modality: ModalityOrmEntity;

  @Column({ type: 'varchar', length: 20, name: 'coordinator_id', nullable: true })
  coordinatorId?: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'coordinator_id' })
  coordinator: UserOrmEntity;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;
}
