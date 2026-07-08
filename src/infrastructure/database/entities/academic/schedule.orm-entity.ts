import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { TeacherSubjectOrmEntity } from './teacher-subject.orm-entity';

@Entity('schedules')
export class ScheduleOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid', name: 'teacher_subject_id' })
  teacherSubjectId: string;

  @ManyToOne(() => TeacherSubjectOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teacher_subject_id' })
  teacherSubject: TeacherSubjectOrmEntity;

  @Column({ type: 'varchar', length: 20, name: 'day_of_week' })
  dayOfWeek: string; // 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'

  @Column({ type: 'time', name: 'start_time' })
  startTime: string; // 'HH:mm'

  @Column({ type: 'time', name: 'end_time' })
  endTime: string; // 'HH:mm'
}
