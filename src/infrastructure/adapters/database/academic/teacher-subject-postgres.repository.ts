import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
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
      curriculumId: relation.curriculumId,
      academicTermId: relation.academicTermId,
      modalityId: relation.modalityId,
      jornadaId: relation.jornadaId,
      assignedAt: relation.assignedAt,
    });
    const saved = await this.repository.save(ormEntity);
    return new TeacherSubjectEntity(
      saved.id,
      saved.teacherId,
      saved.subjectId,
      saved.assignedAt,
      saved.curriculumId,
      saved.academicTermId,
      saved.modalityId,
      saved.jornadaId,
    );
  }

  async saveMany(relations: TeacherSubjectEntity[]): Promise<void> {
    if (relations.length === 0) return;
    const ormEntities = relations.map((relation) =>
      this.repository.create({
        id: relation.id,
        teacherId: relation.teacherId,
        subjectId: relation.subjectId,
        curriculumId: relation.curriculumId,
        academicTermId: relation.academicTermId,
        modalityId: relation.modalityId,
        jornadaId: relation.jornadaId,
        assignedAt: relation.assignedAt,
      }),
    );
    await this.repository.save(ormEntities);
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
      found.curriculumId,
      found.academicTermId,
      found.modalityId,
      found.jornadaId,
    );
  }

  async findBySubjectId(
    subjectId: string,
    curriculumId?: string,
  ): Promise<TeacherSubjectEntity[]> {
    const where: any = { subjectId };
    if (curriculumId !== undefined) {
      where.curriculumId = curriculumId;
    }
    const found = await this.repository.find({ where });
    return found.map(
      (f) =>
        new TeacherSubjectEntity(
          f.id,
          f.teacherId,
          f.subjectId,
          f.assignedAt,
          f.curriculumId,
          f.academicTermId,
          f.modalityId,
          f.jornadaId,
        ),
    );
  }

  async findBySubjectIds(
    subjectIds: string[],
  ): Promise<TeacherSubjectEntity[]> {
    if (subjectIds.length === 0) return [];

    const found = await this.repository.find({
      where: {
        subjectId: In(subjectIds),
      },
    });

    return found.map(
      (f) =>
        new TeacherSubjectEntity(
          f.id,
          f.teacherId,
          f.subjectId,
          f.assignedAt,
          f.curriculumId,
          f.academicTermId,
          f.modalityId,
          f.jornadaId,
        ),
    );
  }

  async deleteBySubjectId(
    subjectId: string,
    curriculumId?: string,
  ): Promise<void> {
    const where: any = { subjectId };
    if (curriculumId !== undefined) {
      where.curriculumId = curriculumId;
    }
    await this.repository.delete(where);
  }

  async deleteByContext(
    subjectId: string,
    academicTermId: string,
    modalityId: string,
    jornadaId: string,
    curriculumId?: string,
  ): Promise<void> {
    const where: any = { subjectId, academicTermId, modalityId, jornadaId };
    if (curriculumId !== undefined) {
      where.curriculumId = curriculumId;
    }
    await this.repository.delete(where);
  }

  async deleteBySubjectAndTerm(
    subjectId: string,
    academicTermId: string,
    curriculumId?: string,
  ): Promise<void> {
    const where: any = { subjectId, academicTermId };
    if (curriculumId !== undefined) {
      where.curriculumId = curriculumId;
    }
    await this.repository.delete(where);
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete({ id });
  }
}
