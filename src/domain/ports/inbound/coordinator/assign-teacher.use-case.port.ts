export interface AssignTeacherCommand {
  subjectId: string;
  teacherId: string;
  curriculumId?: string;
  academicTermId?: string;
  modalityId?: string;
  jornadaId?: string;
}

export abstract class AssignTeacherUseCasePort {
  abstract execute(command: AssignTeacherCommand): Promise<void>;
}
