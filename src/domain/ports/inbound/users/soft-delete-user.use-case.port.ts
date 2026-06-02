export abstract class SoftDeleteUserUseCasePort {
  abstract execute(id: string): Promise<void>;
}
