import { DeleteCertificateUseCasePort } from '../../ports/inbound/users/delete-certificate.use-case.port';
import { UserRepositoryPort } from '../../ports/outbound/users/user-repository.port';
import { TeacherRepositoryPort } from '../../ports/outbound/users/teacher-repository.port';
import { StudentRepositoryPort } from '../../ports/outbound/users/student-repository.port';
import { UserEntity } from '../../entities/users/user.entity';
import { TeacherEntity } from '../../entities/users/teacher.entity';
import { StudentEntity } from '../../entities/users/student.entity';
import { NotFoundException } from '@nestjs/common';

export class DeleteCertificateUseCase implements DeleteCertificateUseCasePort {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly teacherRepository: TeacherRepositoryPort,
    private readonly studentRepository: StudentRepositoryPort,
  ) {}

  async execute(userId: string, certificateUrl: string): Promise<void> {
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
        user.cvUrl,
        user.certificates.filter((url) => url !== certificateUrl),
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
        teacher.cvUrl,
        teacher.certificates.filter((url) => url !== certificateUrl),
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
        student.cvUrl,
        student.certificates.filter((url) => url !== certificateUrl),
      );
      await this.studentRepository.save(updatedStudent);
      updated = true;
    }

    if (!updated) {
      throw new NotFoundException('Usuario no encontrado');
    }
  }
}
