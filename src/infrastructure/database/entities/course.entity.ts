import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { TeacherEntity } from './teacher.entity';
import { CourseModuleEntity } from './course-module.entity';
import { CourseCategoryEntity } from './course-category.entity';

@Entity('courses')
export class CourseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'id_category', type: 'uuid', nullable: true })
  idCategory: string | null;

  @ManyToOne(() => CourseCategoryEntity)
  @JoinColumn({ name: 'id_category' })
  category?: CourseCategoryEntity;

  @Column({ name: 'id_teacher', type: 'uuid' })
  idTeacher: string;

  @ManyToOne(() => TeacherEntity)
  @JoinColumn({ name: 'id_teacher' })
  teacher?: TeacherEntity;

  @Column({ name: 'is_published', type: 'boolean', default: false })
  isPublished: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => CourseModuleEntity, (m) => m.course)
  modules?: CourseModuleEntity[];
}
