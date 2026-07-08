export class ScheduleEntity {
  id?: string;
  teacherSubjectId: string;
  dayOfWeek: string;
  startTime: string; // 'HH:mm'
  endTime: string; // 'HH:mm'
}
