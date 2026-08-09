import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { InscriptionEntity } from '@domain/entities/secretary/inscription.entity';
import { StudentOrmEntity } from '../users/student.orm-entity';
import { CareerOrmEntity } from '../academic/career.orm-entity';

@Entity('inscriptions')
export class InscriptionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 20, name: 'student_id' })
  studentId: string;

  @ManyToOne(() => StudentOrmEntity)
  @JoinColumn({ name: 'student_id' })
  student: StudentOrmEntity;

  @Index()
  @Column({ type: 'uuid', name: 'career_id' })
  careerId: string;

  @ManyToOne(() => CareerOrmEntity)
  @JoinColumn({ name: 'career_id' })
  career: CareerOrmEntity;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'document_url',
    nullable: true,
  })
  documentUrl?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  static toDomain(orm: InscriptionOrmEntity): InscriptionEntity {
    return new InscriptionEntity(
      orm.id,
      orm.studentId,
      orm.careerId,
      orm.status,
      orm.documentUrl,
      orm.notes,
      orm.createdAt,
      orm.updatedAt,
      orm.deletedAt,
    );
  }

  static fromDomain(entity: InscriptionEntity): InscriptionOrmEntity {
    const orm = new InscriptionOrmEntity();
    orm.id = entity.id;
    orm.studentId = entity.studentId;
    orm.careerId = entity.careerId;
    orm.status = entity.status;
    orm.documentUrl = entity.documentUrl;
    orm.notes = entity.notes;
    return orm;
  }
}
