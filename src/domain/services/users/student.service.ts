import { Injectable, NotFoundException } from '@nestjs/common';
import { StudentRepositoryPort } from '../../ports/outbound/users/student-repository.port';
import { StudentEntity } from '../../entities/users/student.entity';

@Injectable()
export class StudentService {
  constructor(private readonly studentRepository: StudentRepositoryPort) {}

  async getPaginated(page: number, limit: number, search?: string) {
    return this.studentRepository.findPaginated(page, limit, search);
  }

  async getById(id: string) {
    const student = await this.studentRepository.findById(id);
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async create(data: Partial<StudentEntity>) {
    const student = new StudentEntity(
      data.id as string,
      data.firstName as string,
      data.lastName as string,
      data.email as string,
      data.isActive ?? true,
      data.birthDate,
      data.phone,
      data.avatarUrl,
    );
    return this.studentRepository.save(student);
  }

  async update(id: string, data: Partial<StudentEntity>) {
    const student = await this.getById(id);
    const updated = new StudentEntity(
      student.id,
      data.firstName ?? student.firstName,
      data.lastName ?? student.lastName,
      data.email ?? student.email,
      data.isActive ?? student.isActive,
      data.birthDate !== undefined ? data.birthDate : student.birthDate,
      data.phone !== undefined ? data.phone : student.phone,
      data.avatarUrl !== undefined ? data.avatarUrl : student.avatarUrl,
      student.createdAt,
      new Date(),
      student.deletedAt,
      data.address !== undefined ? data.address : student.address,
      data.linkedIn !== undefined ? data.linkedIn : student.linkedIn,
      data.cvUrl !== undefined ? data.cvUrl : student.cvUrl,
      student.certificates,
    );
    return this.studentRepository.save(updated);
  }

  async delete(id: string) {
    await this.getById(id);
    await this.studentRepository.softDelete(id);
  }
}
