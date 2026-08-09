import { UploadCvUseCasePort } from '../../ports/inbound/users/upload-cv.use-case.port';
import { UserRepositoryPort } from '../../ports/outbound/users/user-repository.port';
import { TeacherRepositoryPort } from '../../ports/outbound/users/teacher-repository.port';
import { StudentRepositoryPort } from '../../ports/outbound/users/student-repository.port';
import { ImageUploadPort } from '../../ports/outbound/storage/image-upload.port';
import { UserEntity } from '../../entities/users/user.entity';
import { TeacherEntity } from '../../entities/users/teacher.entity';
import { StudentEntity } from '../../entities/users/student.entity';
import { NotFoundException } from '@nestjs/common';

export class UploadCvUseCase implements UploadCvUseCasePort {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly teacherRepository: TeacherRepositoryPort,
    private readonly studentRepository: StudentRepositoryPort,
    private readonly imageUploadService: ImageUploadPort,
  ) {}

  async execute(
    userId: string,
    fileBuffer: Buffer | null,
    fileName?: string,
  ): Promise<{ cvUrl: string | null }> {
    if (fileBuffer && !this.imageUploadService.uploadDocument) {
      throw new Error(
        'uploadDocument method is not implemented in ImageUploadPort',
      );
    }

    let cvUrl: string | null = null;
    if (fileBuffer) {
      cvUrl = await this.imageUploadService.uploadDocument!(
        fileBuffer,
        `lms/cvs/${userId}`,
        fileName,
      );
    }

    let updated = false;

    const user = await this.userRepository.findById(userId);
    if (user) {
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
        user.avatarUrl,
        user.createdAt,
        user.updatedAt,
        user.deletedAt,
        user.roleName,
        user.faculties,
        user.requiresPasswordChange,
        user.address,
        user.linkedIn,
        cvUrl, // New CV URL
        user.certificates,
      );
      await this.userRepository.save(updatedUser);
      updated = true;
    }

    const teacher = await this.teacherRepository.findById(userId);
    if (teacher) {
      const updatedTeacher = new TeacherEntity(
        teacher.id,
        teacher.firstName,
        teacher.lastName,
        teacher.email,
        teacher.isActive,
        teacher.birthDate,
        teacher.phone,
        teacher.avatarUrl,
        teacher.createdAt,
        teacher.updatedAt,
        teacher.deletedAt,
        teacher.address,
        teacher.linkedIn,
        cvUrl,
        teacher.certificates,
      );
      await this.teacherRepository.save(updatedTeacher);
      updated = true;
    }

    const student = await this.studentRepository.findById(userId);
    if (student) {
      const updatedStudent = new StudentEntity(
        student.id,
        student.firstName,
        student.lastName,
        student.email,
        student.isActive,
        student.birthDate,
        student.phone,
        student.avatarUrl,
        student.createdAt,
        student.updatedAt,
        student.deletedAt,
        student.address,
        student.linkedIn,
        cvUrl,
        student.certificates,
      );
      await this.studentRepository.save(updatedStudent);
      updated = true;
    }

    if (!updated) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return { cvUrl };
  }
}
