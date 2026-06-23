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

  @Column({ type: 'varchar', length: 20, name: 'teacher_id', nullable: true })
  teacherId: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'teacher_id' })
  teacher: UserOrmEntity;

  @Column({ type: 'text', nullable: true })
  description?: string;
}
