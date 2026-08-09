import { ScheduleRepositoryPort } from '../../ports/outbound/academic/schedule-repository.port';
import { ScheduleEntity } from '../../entities/academic/schedule.entity';

export interface ScheduleInput {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export class ManageSchedulesUseCase {
  constructor(private readonly scheduleRepository: ScheduleRepositoryPort) {}

  async getSchedules(teacherSubjectId: string): Promise<ScheduleEntity[]> {
    return this.scheduleRepository.findByTeacherSubject(teacherSubjectId);
  }

  async saveSchedules(
    teacherSubjectId: string,
    schedules: ScheduleInput[],
  ): Promise<void> {
    // 1. Delete existing schedules for this assignment
    await this.scheduleRepository.deleteByTeacherSubject(teacherSubjectId);

    // 2. Insert new ones
    if (schedules && schedules.length > 0) {
      const newSchedules = schedules.map((s) => ({
        teacherSubjectId,
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
      }));
      await this.scheduleRepository.saveMultiple(newSchedules);
    }
  }
}
