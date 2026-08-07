import { UserEntity } from '../../../entities/users/user.entity';

export abstract class UploadCvUseCasePort {
  abstract execute(
    userId: string,
    fileBuffer: Buffer | null,
    fileName?: string,
  ): Promise<{ cvUrl: string | null }>;
}
