import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CareerSubjectRepositoryPort } from '@domain/ports/outbound/academic/career-subject-repository.port';
import { CareerSubjectOrmEntity } from '../../../database/entities/academic/career-subject.orm-entity';
import { CareerSubject } from '@domain/entities/academic/career-subject.entity';

@Injectable()
export class CareerSubjectPostgresRepository implements CareerSubjectRepositoryPort {
  constructor(
    @InjectRepository(CareerSubjectOrmEntity)
    private readonly repository: Repository<CareerSubjectOrmEntity>,
  ) {}

  private mapToDomain(ormEntity: CareerSubjectOrmEntity): CareerSubject {
    return new CareerSubject(
      ormEntity.id,
      ormEntity.careerId,
      ormEntity.subjectId,
      ormEntity.semester,
      ormEntity.curriculumId,
    );
  }

  private mapToOrm(domainEntity: CareerSubject): CareerSubjectOrmEntity {
    const ormEntity = new CareerSubjectOrmEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.careerId = domainEntity.careerId;
    ormEntity.subjectId = domainEntity.subjectId;
    ormEntity.semester = domainEntity.semester;
    ormEntity.curriculumId = domainEntity.curriculumId;
    return ormEntity;
  }

  async save(careerSubject: CareerSubject): Promise<CareerSubject> {
    const saved = await this.repository.save(this.mapToOrm(careerSubject));
    return this.mapToDomain(saved);
  }

  async deleteByCareerAndSubject(
    careerId: string,
    subjectId: string,
  ): Promise<void> {
    await this.repository.delete({ careerId, subjectId });
  }

  async findByCareer(careerId: string): Promise<CareerSubject[]> {
    const found = await this.repository.find({
      where: { careerId },
      relations: ['subject'],
    });
    return found.map((f) => this.mapToDomain(f));
  }

  async findByCareerIds(careerIds: string[]): Promise<CareerSubject[]> {
    if (careerIds.length === 0) return [];
    const found = await this.repository.find({
      where: { careerId: In(careerIds) },
      relations: ['subject'],
    });
    return found.map((f) => this.mapToDomain(f));
  }

  async findBySubjectIds(subjectIds: string[]): Promise<CareerSubject[]> {
    if (subjectIds.length === 0) return [];
    const found = await this.repository.find({
      where: { subjectId: In(subjectIds) },
    });
    return found.map((f) => this.mapToDomain(f));
  }

  async findByCareerAndSubject(
    careerId: string,
    subjectId: string,
  ): Promise<CareerSubject | null> {
    const found = await this.repository.findOne({
      where: { careerId, subjectId },
    });
    if (!found) return null;
    return this.mapToDomain(found);
  }

  async findBySubject(subjectId: string): Promise<CareerSubject[]> {
    const found = await this.repository.find({ where: { subjectId } });
    return found.map((f) => this.mapToDomain(f));
  }

  async deleteBySubject(subjectId: string): Promise<void> {
    await this.repository.delete({ subjectId });
  }

  async findByCurriculum(curriculumId: string): Promise<CareerSubject[]> {
    const found = await this.repository.find({
      where: { curriculumId },
      relations: ['subject'],
    });
    return found.map((f) => this.mapToDomain(f));
  }

  async findSubjectsByCareerAndSemester(
    careerId: string,
    semester: number,
  ): Promise<any[]> {
    const found = await this.repository.find({
      where: { careerId, semester },
      relations: ['subject'],
    });
    return found.map((cs) => ({
      id: cs.subject?.id ?? cs.subjectId,
      name: cs.subject?.name ?? '',
      code: cs.subject?.code ?? '',
      credits: cs.subject?.credits ?? 0,
      hours: cs.subject?.hours ?? 0,
      semester: cs.semester,
    }));
  }

  async findSemestersByCareer(careerId: string): Promise<number[]> {
    const found = await this.repository.find({
      where: { careerId },
      select: ['semester'],
    });
    return [...new Set(found.map((cs) => cs.semester))].sort((a, b) => a - b);
  }
}
