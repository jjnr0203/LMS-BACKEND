import { Injectable, NotFoundException } from '@nestjs/common';
import { TeacherRepositoryPort } from '../../ports/outbound/users/teacher-repository.port';
import { TeacherEntity } from '../../entities/users/teacher.entity';

@Injectable()
export class TeacherService {
  constructor(private readonly teacherRepository: TeacherRepositoryPort) {}

  async getPaginated(page: number, limit: number, search?: string) {
    return this.teacherRepository.findPaginated(page, limit, search);
  }

  async getById(id: string) {
    const teacher = await this.teacherRepository.findById(id);
    if (!teacher) throw new NotFoundException('Teacher not found');
    return teacher;
  }

  async create(data: Partial<TeacherEntity>) {
    const teacher = new TeacherEntity(
      data.id as string,
      data.firstName as string,
      data.lastName as string,
      data.email as string,
      data.isActive ?? true,
      data.birthDate,
      data.phone,
      data.avatarUrl
    );
    return this.teacherRepository.save(teacher);
  }

  async update(id: string, data: Partial<TeacherEntity>) {
    const teacher = await this.getById(id);
    const updated = new TeacherEntity(
      teacher.id,
      data.firstName ?? teacher.firstName,
      data.lastName ?? teacher.lastName,
      data.email ?? teacher.email,
      data.isActive ?? teacher.isActive,
      data.birthDate !== undefined ? data.birthDate : teacher.birthDate,
      data.phone !== undefined ? data.phone : teacher.phone,
      data.avatarUrl !== undefined ? data.avatarUrl : teacher.avatarUrl,
      teacher.createdAt,
      new Date()
    );
    return this.teacherRepository.save(updated);
  }

  async delete(id: string) {
    await this.getById(id);
    await this.teacherRepository.softDelete(id);
  }
}