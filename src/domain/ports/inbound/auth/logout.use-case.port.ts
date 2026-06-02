export abstract class LogoutUseCasePort {
  abstract execute(token: string): Promise<void>;
}
