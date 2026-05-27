import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CourseEntity } from './course.entity';
import { LessonEntity } from './lesson.entity';

@Entity('course_modules')
export class CourseModuleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_course', type: 'uuid' })
  idCourse: string;

  @ManyToOne(() => CourseEntity, (c) => c.modules)
  @JoinColumn({ name: 'id_course' })
  course?: CourseEntity;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'int' })
  order: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => LessonEntity, (l) => l.module)
  lessons?: LessonEntity[];
}
