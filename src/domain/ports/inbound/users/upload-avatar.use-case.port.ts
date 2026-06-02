import { UserEntity } from '../../../entities/users/user.entity';

export abstract class UploadAvatarUseCasePort {
  abstract execute(userId: string, fileBuffer: Buffer): Promise<{ user: UserEntity }>;
}
