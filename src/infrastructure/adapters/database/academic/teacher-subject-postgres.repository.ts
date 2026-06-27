import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeacherSubjectRepositoryPort } from '../../../../domain/ports/outbound/academic/teacher-subject-repository.port';
import { TeacherSubjectEntity } from '../../../../domain/entities/academic/teacher-subject.entity';
import { TeacherSubjectOrmEntity } from '../../../database/entities/academic/teacher-subject.orm-entity';

@Injectable()
export class TeacherSubjectPostgresRepository implements TeacherSubjectRepositoryPort {
  constructor(
    @InjectRepository(TeacherSubjectOrmEntity)
    private readonly repository: Repository<TeacherSubjectOrmEntity>,
  ) {}

  async save(relation: TeacherSubjectEntity): Promise<TeacherSubjectEntity> {
    const ormEntity = this.repository.create({
      id: relation.id,
      teacherId: relation.teacherId,
      subjectId: relation.subjectId,
      assignedAt: relation.assignedAt,
    });
    const saved = await this.repository.save(ormEntity);
    return new TeacherSubjectEntity(
      saved.id,
      saved.teacherId,
      saved.subjectId,
      saved.assignedAt,
    );
  }

  async findByTeacherAndSubject(
    teacherId: string,
    subjectId: string,
  ): Promise<TeacherSubjectEntity | null> {
    const found = await this.repository.findOne({
      where: { teacherId, subjectId },
    });
    if (!found) return null;
    return new TeacherSubjectEntity(
      found.id,
      found.teacherId,
      found.subjectId,
      found.assignedAt,
    );
  }

  async findBySubjectId(subjectId: string): Promise<TeacherSubjectEntity[]> {
    const found = await this.repository.find({
      where: { subjectId },
    });
    return found.map(
      (f) =>
        new TeacherSubjectEntity(f.id, f.teacherId, f.subjectId, f.assignedAt),
    );
  }
}
