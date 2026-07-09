import { ScheduleEntity } from '../../../entities/academic/schedule.entity';

export abstract class ScheduleRepositoryPort {
  abstract findByTeacherSubject(teacherSubjectId: string): Promise<ScheduleEntity[]>;
  abstract findByTeacherSubjectIds(teacherSubjectIds: string[]): Promise<ScheduleEntity[]>;
  abstract saveMultiple(schedules: ScheduleEntity[]): Promise<void>;
  abstract deleteByTeacherSubject(teacherSubjectId: string): Promise<void>;
}
