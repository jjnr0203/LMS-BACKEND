import { UploadAvatarUseCasePort } from '../../ports/inbound/users/upload-avatar.use-case.port';
import { UserRepositoryPort } from '../../ports/outbound/users/user-repository.port';
import { ImageUploadPort } from '../../ports/outbound/storage/image-upload.port';
import { UserEntity } from '../../entities/users/user.entity';
import { NotFoundException } from '@nestjs/common';

export class UploadAvatarUseCase implements UploadAvatarUseCasePort {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly imageUploadService: ImageUploadPort,
  ) {}

  async execute(userId: string, fileBuffer: Buffer): Promise<{ user: UserEntity }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const avatarUrl = await this.imageUploadService.uploadImage(fileBuffer, `lms/avatars/${userId}`);

    const updatedUser = new UserEntity(
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      user.passwordHash,
      user.roleId,
      user.isActive,
      user.birthDate,
      user.phone,
      avatarUrl, // New avatar URL
      user.createdAt,
      user.updatedAt,
      user.deletedAt,
    );

    const savedUser = await this.userRepository.save(updatedUser);
    return { user: savedUser };
  }
}
