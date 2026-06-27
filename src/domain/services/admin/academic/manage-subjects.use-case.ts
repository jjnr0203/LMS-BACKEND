import { SubjectEntity } from '../../../entities/academic/subject.entity';
import { SubjectRepositoryPort } from '../../../ports/outbound/academic/subject-repository.port';
import { CareerSubjectRepositoryPort } from '../../../ports/outbound/academic/career-subject-repository.port';
import { CareerSubject } from '../../../entities/academic/career-subject.entity';
import { v4 as uuidv4 } from 'uuid';

export interface CreateSubjectDto {
  code: string;
  name: string;
  credits: number;
  teacherId?: string;
  description?: string;
  careerId?: string;
  semester?: number;
  modalityIds?: string[];
  curriculumId?: string;
}

export interface UpdateSubjectDto {
  code?: string;
  name?: string;
  credits?: number;
  teacherId?: string;
  description?: string;
  careerId?: string;
  semester?: number;
  modalityIds?: string[];
  curriculumId?: string;
}

export class ManageSubjectsUseCase {
  constructor(
    private readonly repository: SubjectRepositoryPort,
    private readonly careerSubjectRepository: CareerSubjectRepositoryPort,
  ) {}

  async create(data: CreateSubjectDto): Promise<SubjectEntity> {
    const subject = new SubjectEntity(
      uuidv4(),
      data.name,
      data.code,
      data.credits,
      data.modalityIds || [],
      data.teacherId,
      data.description,
    );
    const savedSubject = await this.repository.save(subject);

    if (data.careerId && data.semester) {
      const relation = new CareerSubject(
        uuidv4(),
        data.careerId,
        savedSubject.id,
        data.semester,
        data.curriculumId,
      );
      await this.careerSubjectRepository.save(relation);
    }

    return savedSubject;
  }

  async update(
    id: string,
    data: Partial<CreateSubjectDto>,
  ): Promise<SubjectEntity | null> {
    const subject = await this.repository.findById(id);
    if (!subject) return null;

    if (data.name !== undefined) subject.name = data.name;
    if (data.code !== undefined) subject.code = data.code;
    if (data.credits !== undefined) subject.credits = data.credits;
    if (data.modalityIds !== undefined) subject.modalityIds = data.modalityIds;
    if (data.teacherId !== undefined) subject.teacherId = data.teacherId;
    if (data.description !== undefined) subject.description = data.description;

    const savedSubject = await this.repository.save(subject);

    if (
      data.careerId !== undefined ||
      data.semester !== undefined ||
      data.curriculumId !== undefined
    ) {
      const existingRelations =
        await this.careerSubjectRepository.findBySubject(savedSubject.id);

      if (existingRelations.length > 0) {
        const rel = existingRelations[0];
        if (data.careerId !== undefined && data.careerId !== rel.careerId) {
          await this.careerSubjectRepository.deleteBySubject(savedSubject.id);
          if (data.careerId) {
            const newRel = new CareerSubject(
              uuidv4(),
              data.careerId,
              savedSubject.id,
              data.semester !== undefined ? data.semester : rel.semester,
              data.curriculumId !== undefined
                ? data.curriculumId
                : rel.curriculumId,
            );
            await this.careerSubjectRepository.save(newRel);
          }
        } else {
          if (data.semester !== undefined) {
            rel.semester = data.semester;
          }
          if (data.curriculumId !== undefined) {
            rel.curriculumId = data.curriculumId;
          }
          if (data.semester !== undefined || data.curriculumId !== undefined) {
            await this.careerSubjectRepository.save(rel);
          }
        }
      } else {
        if (data.careerId && data.semester !== undefined) {
          const relation = new CareerSubject(
            uuidv4(),
            data.careerId,
            savedSubject.id,
            data.semester,
            data.curriculumId,
          );
          await this.careerSubjectRepository.save(relation);
        }
      }
    }

    return savedSubject;
  }

  async findAll(): Promise<any[]> {
    const subjects = await this.repository.findAll();
    if (subjects.length === 0) return [];

    const subjectIds = subjects.map((s) => s.id);
    const allRelations =
      await this.careerSubjectRepository.findBySubjectIds(subjectIds);
    const relMap = new Map<string, CareerSubject>();
    for (const rel of allRelations) {
      if (!relMap.has(rel.subjectId)) {
        relMap.set(rel.subjectId, rel);
      }
    }

    return subjects.map((subject) => {
      const rel = relMap.get(subject.id);
      return {
        ...subject,
        careerId: rel?.careerId || null,
        semester: rel?.semester || null,
        curriculumId: rel?.curriculumId || null,
      };
    });
  }

  async delete(id: string): Promise<void> {
    const existing = await this.careerSubjectRepository.findBySubject(id);
    for (const rel of existing) {
      await this.careerSubjectRepository.deleteByCareerAndSubject(
        rel.careerId,
        rel.subjectId,
      );
    }
    await this.repository.delete(id);
  }

  async deleteAll(): Promise<void> {
    const allSubjects = await this.repository.findAll();
    for (const subject of allSubjects) {
      const relations = await this.careerSubjectRepository.findBySubject(
        subject.id,
      );
      for (const rel of relations) {
        await this.careerSubjectRepository.deleteByCareerAndSubject(
          rel.careerId,
          rel.subjectId,
        );
      }
      await this.repository.delete(subject.id);
    }
  }
}
