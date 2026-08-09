import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { CertificateEntity } from '@domain/entities/secretary/certificate.entity';
import { StudentOrmEntity } from '../users/student.orm-entity';

@Entity('certificates')
export class CertificateOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 20, name: 'student_id' })
  studentId: string;

  @ManyToOne(() => StudentOrmEntity)
  @JoinColumn({ name: 'student_id' })
  student: StudentOrmEntity;

  @Column({ type: 'varchar', length: 30 })
  type: string;

  @Column({ type: 'varchar', length: 255, name: 'pdf_url', nullable: true })
  pdfUrl?: string;

  @Column({
    type: 'timestamp',
    name: 'generated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  generatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  static toDomain(orm: CertificateOrmEntity): CertificateEntity {
    return new CertificateEntity(
      orm.id,
      orm.studentId,
      orm.type,
      orm.pdfUrl,
      orm.generatedAt,
      orm.createdAt,
    );
  }

  static fromDomain(entity: CertificateEntity): CertificateOrmEntity {
    const orm = new CertificateOrmEntity();
    orm.id = entity.id;
    orm.studentId = entity.studentId;
    orm.type = entity.type;
    orm.pdfUrl = entity.pdfUrl;
    return orm;
  }
}
