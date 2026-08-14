import { Curriculum } from '../../../entities/academic/curriculum.entity';
import { CurriculumRepositoryPort } from '../../../ports/outbound/academic/curriculum-repository.port';
import { CareerSubjectRepositoryPort } from '../../../ports/outbound/academic/career-subject-repository.port';
import { SubjectRepositoryPort } from '../../../ports/outbound/academic/subject-repository.port';
import { v4 as uuidv4 } from 'uuid';

export interface CreateCurriculumDto {
  careerId: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

export class ManageCurriculumsUseCase {
  constructor(
    private readonly repository: CurriculumRepositoryPort,
    private readonly careerSubjectRepository: CareerSubjectRepositoryPort,
    private readonly subjectRepository: SubjectRepositoryPort,
  ) {}

  async create(data: CreateCurriculumDto): Promise<Curriculum> {
    const curriculum = new Curriculum(
      uuidv4(),
      data.careerId,
      data.name,
      data.description || null,
      data.isActive ?? true,
      new Date(),
    );
    return this.repository.save(curriculum);
  }

  async update(
    id: string,
    data: Partial<CreateCurriculumDto>,
  ): Promise<Curriculum | null> {
    const curriculum = await this.repository.findById(id);
    if (!curriculum) return null;

    if (data.name !== undefined) curriculum.name = data.name;
    if (data.description !== undefined)
      curriculum.description = data.description || null;
    if (data.isActive !== undefined) curriculum.isActive = data.isActive;

    return this.repository.save(curriculum);
  }

  async findAllByCareer(careerId: string): Promise<Curriculum[]> {
    return this.repository.findByCareer(careerId);
  }

  async delete(id: string): Promise<void> {
    const relations = await this.careerSubjectRepository.findByCurriculum(id);
    for (const rel of relations) {
      await this.careerSubjectRepository.deleteByCareerAndSubject(
        rel.careerId,
        rel.subjectId,
      );
    }
    await this.repository.delete(id);
  }

  async getSubjectsByCurriculum(curriculumId: string): Promise<any[]> {
    const relations =
      await this.careerSubjectRepository.findByCurriculum(curriculumId);
    const subjectIds = relations.map((r) => r.subjectId);
    if (subjectIds.length === 0) return [];

    const subjects = await this.subjectRepository.findByIds(subjectIds);
    const subjectMap = new Map(subjects.map((s) => [s.id, s]));

    return relations.map((rel) => {
      const sub = subjectMap.get(rel.subjectId);
      return {
        id: sub?.id,
        relationId: rel.id,
        careerId: rel.careerId,
        curriculumId: rel.curriculumId,
        subjectId: rel.subjectId,
        semester: rel.semester,
        code: sub?.code || '',
        name: sub?.name || '',
        credits: sub?.credits || 0,
        hours: sub?.hours || 0,
        prerequisiteIds: rel.prerequisiteIds,
      };
    });
  }
}
