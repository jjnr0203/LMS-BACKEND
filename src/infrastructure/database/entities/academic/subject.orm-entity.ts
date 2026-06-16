import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserOrmEntity } from '../users/user.orm-entity';

@Entity('subjects')
export class SubjectOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ type: 'int' })
  credits: number;

  @Column({ type: 'varchar', length: 20, name: 'coordinator_id' })
  coordinatorId: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'coordinator_id' })
  coordinator: UserOrmEntity;

  @Column({ type: 'text', nullable: true })
  description?: string;
}
