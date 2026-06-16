import { AssignmentEntity } from '../../../entities/academic/assignment.entity';

export interface CreateAssignmentCommand {
  title: string;
  description: string;
  subjectId: string;
  teacherId: string;
  dueDate: Date;
  maxScore: number;
}

export abstract class CreateAssignmentUseCasePort {
  abstract execute(
    command: CreateAssignmentCommand,
  ): Promise<{ assignment: AssignmentEntity }>;
}
