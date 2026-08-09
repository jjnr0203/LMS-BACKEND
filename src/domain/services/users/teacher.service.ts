import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TeacherRepositoryPort } from '../../ports/outbound/users/teacher-repository.port';
import { TeacherEntity } from '../../entities/users/teacher.entity';

@Injectable()
export class TeacherService {
  constructor(
    private readonly teacherRepository: TeacherRepositoryPort,
    private readonly dataSource: DataSource,
  ) {}

  async getPaginated(page: number, limit: number, search?: string) {
    return this.teacherRepository.findPaginated(page, limit, search);
  }

  async getById(id: string) {
    const teacher = await this.teacherRepository.findById(id);
    if (!teacher) throw new NotFoundException('Teacher not found');
    return teacher;
  }

  async getStats(teacherId: string) {
    const careersResult = await this.dataSource.query(
      `
      SELECT DISTINCT c.id, c.name 
      FROM teacher_subjects ts
      JOIN curriculums cur ON cur.id = ts.curriculum_id
      JOIN careers c ON c.id = cur.career_id
      WHERE ts.teacher_id = $1
    `,
      [teacherId],
    );

    const subjectsResult = await this.dataSource.query(
      `
      SELECT DISTINCT sub.id, sub.name 
      FROM teacher_subjects ts
      JOIN subjects sub ON sub.id = ts.subject_id
      WHERE ts.teacher_id = $1
    `,
      [teacherId],
    );

    const schedulesResult = await this.dataSource.query(
      `
      SELECT s.start_time, s.end_time 
      FROM schedules s
      JOIN teacher_subjects ts ON ts.id = s.teacher_subject_id
      WHERE ts.teacher_id = $1
    `,
      [teacherId],
    );

    let totalHours = 0;
    for (const sched of schedulesResult) {
      if (sched.start_time && sched.end_time) {
        const startParts = sched.start_time.split(':');
        const endParts = sched.end_time.split(':');
        const startMins =
          parseInt(startParts[0], 10) * 60 + parseInt(startParts[1], 10);
        const endMins =
          parseInt(endParts[0], 10) * 60 + parseInt(endParts[1], 10);
        const diff = (endMins - startMins) / 60;
        if (diff > 0) totalHours += diff;
      }
    }

    return {
      totalHours,
      careers: careersResult,
      subjects: subjectsResult,
    };
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
      data.avatarUrl,
      undefined, // createdAt
      undefined, // updatedAt
      undefined, // deletedAt
      data.address,
      data.linkedIn,
      data.cvUrl,
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
      new Date(),
      teacher.deletedAt,
      data.address !== undefined ? data.address : teacher.address,
      data.linkedIn !== undefined ? data.linkedIn : teacher.linkedIn,
      data.cvUrl !== undefined ? data.cvUrl : teacher.cvUrl,
      teacher.certificates,
    );
    return this.teacherRepository.save(updated);
  }

  async delete(id: string) {
    await this.getById(id);
    await this.teacherRepository.softDelete(id);
  }
}
