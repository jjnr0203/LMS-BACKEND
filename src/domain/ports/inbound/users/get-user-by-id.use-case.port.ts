export abstract class GetUserByIdUseCasePort {
  abstract execute(id: string): Promise<any>;
}
