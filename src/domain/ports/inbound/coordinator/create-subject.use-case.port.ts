import { SubjectEntity } from '../../../entities/academic/subject.entity';

export interface CreateSubjectCommand {
  name: string;
  code: string;
  credits: number;
  teacherId?: string;
  description?: string;
}

export abstract class CreateSubjectUseCasePort {
  abstract execute(
    command: CreateSubjectCommand,
  ): Promise<{ subject: SubjectEntity }>;
}
