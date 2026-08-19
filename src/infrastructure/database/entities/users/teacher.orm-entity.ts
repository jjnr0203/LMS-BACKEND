import { TeacherEntity } from '@domain/entities/users/teacher.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { FacultyOrmEntity } from '../academic/faculty.orm-entity';

@Entity('teachers')
export class TeacherOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  id: string;

  @Column({ type: 'varchar', length: 100, name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', length: 100, name: 'last_name' })
  lastName: string;

  @Column({ type: 'date', name: 'birth_date', nullable: true })
  birthDate?: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, name: 'avatar_url', nullable: true })
  avatarUrl?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address?: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'linkedin_url',
    nullable: true,
  })
  linkedIn?: string;

  @Column({ type: 'varchar', length: 255, name: 'cv_url', nullable: true })
  cvUrl?: string | null;

  @Column({ type: 'jsonb', default: [] })
  certificates: string[];

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @ManyToMany(() => FacultyOrmEntity)
  @JoinTable({
    name: 'teacher_faculties',
    joinColumn: { name: 'teacher_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'faculty_id', referencedColumnName: 'id' },
  })
  faculties: FacultyOrmEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  static toDomain(orm: TeacherOrmEntity): TeacherEntity {
    return new TeacherEntity(
      orm.id,
      orm.firstName,
      orm.lastName,
      orm.email,
      orm.isActive,
      orm.birthDate,
      orm.phone,
      orm.avatarUrl,
      orm.createdAt,
      orm.updatedAt,
      orm.deletedAt,
      orm.address,
      orm.linkedIn,
      orm.cvUrl,
      orm.certificates,
      orm.faculties?.map((f) => ({ id: f.id, name: f.name })),
    );
  }

  static fromDomain(entity: TeacherEntity): TeacherOrmEntity {
    const orm = new TeacherOrmEntity();
    orm.id = entity.id;
    orm.firstName = entity.firstName;
    orm.lastName = entity.lastName;
    orm.email = entity.email;
    orm.isActive = entity.isActive;
    orm.birthDate = entity.birthDate;
    orm.phone = entity.phone;
    orm.avatarUrl = entity.avatarUrl;
    orm.address = entity.address;
    orm.linkedIn = entity.linkedIn;
    orm.cvUrl = entity.cvUrl;
    orm.certificates = entity.certificates;
    orm.createdAt = entity.createdAt as any;
    orm.updatedAt = entity.updatedAt as any;
    orm.deletedAt = entity.deletedAt;
    if (entity.faculties) {
      orm.faculties = entity.faculties.map((f) => {
        const faculty = new FacultyOrmEntity();
        faculty.id = f.id;
        faculty.name = f.name ?? '';
        return faculty;
      });
    }
    return orm;
  }
}
