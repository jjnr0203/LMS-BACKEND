export abstract class RefreshUseCasePort {
  abstract execute(token: string): Promise<{ accessToken: string; refreshToken: string }>;
}
