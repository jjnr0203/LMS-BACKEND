export interface CoordinatorSubjectColorRepositoryPort {
  findByCoordinatorId(
    coordinatorId: string,
  ): Promise<{ subjectId: string; color: string }[]>;
  save(coordinatorId: string, subjectId: string, color: string): Promise<void>;
}

export const COORDINATOR_SUBJECT_COLOR_REPOSITORY = Symbol(
  'COORDINATOR_SUBJECT_COLOR_REPOSITORY',
);
