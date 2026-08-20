import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLogOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'user_id', nullable: true })
  userId: string | null;

  @Column({ type: 'varchar', length: 50 })
  action: string;

  @Column({ type: 'varchar', name: 'entity_name', length: 100 })
  entityName: string;

  @Column({ type: 'varchar', name: 'entity_id', nullable: true })
  entityId: string | null;

  @Column({ type: 'jsonb', name: 'old_values', nullable: true })
  oldValues: any;

  @Column({ type: 'jsonb', name: 'new_values', nullable: true })
  newValues: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
