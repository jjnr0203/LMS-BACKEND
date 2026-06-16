import { AssignmentEntity } from '../../../entities/academic/assignment.entity';

export abstract class AssignmentRepositoryPort {
  abstract findById(id: string): Promise<AssignmentEntity | null>;
  abstract save(assignment: AssignmentEntity): Promise<AssignmentEntity>;
  abstract findBySubjectId(subjectId: string): Promise<AssignmentEntity[]>;
  abstract findByTeacherId(teacherId: string): Promise<AssignmentEntity[]>;
}
