export interface AssignTeacherCommand {
  subjectId: string;
  teacherId: string;
  curriculumId?: string;
}

export abstract class AssignTeacherUseCasePort {
  abstract execute(command: AssignTeacherCommand): Promise<void>;
}
