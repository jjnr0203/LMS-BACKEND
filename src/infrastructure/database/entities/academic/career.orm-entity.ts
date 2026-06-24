import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
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

  @ManyToMany(() => ModalityOrmEntity)
  @JoinTable({
    name: 'career_modalities',
    joinColumn: { name: 'career_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'modality_id', referencedColumnName: 'id' }
  })
  modalities: ModalityOrmEntity[];

  @Column({ type: 'varchar', length: 20, name: 'coordinator_id', nullable: true })
  coordinatorId?: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'coordinator_id' })
  coordinator: UserOrmEntity;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;
}
