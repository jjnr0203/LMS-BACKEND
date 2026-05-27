import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CourseModuleEntity } from './course-module.entity';

@Entity('lessons')
export class LessonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_module', type: 'uuid' })
  idModule: string;

  @ManyToOne(() => CourseModuleEntity, (m) => m.lessons)
  @JoinColumn({ name: 'id_module' })
  module?: CourseModuleEntity;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ name: 'video_url', type: 'varchar', length: 500, nullable: true })
  videoUrl: string | null;

  @Column({ type: 'int' })
  order: number;

  @Column({ name: 'duration_minutes', type: 'int', nullable: true })
  durationMinutes: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
