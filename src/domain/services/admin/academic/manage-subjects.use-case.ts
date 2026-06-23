import { SubjectEntity } from '../../../entities/academic/subject.entity';
import { SubjectRepositoryPort } from '../../../ports/outbound/academic/subject-repository.port';
import { v4 as uuidv4 } from 'uuid';

export interface CreateSubjectDto {
  code: string;
  name: string;
  credits: number;
  teacherId?: string;
  description?: string;
}

export interface UpdateSubjectDto {
  code?: string;
  name?: string;
  credits?: number;
  teacherId?: string;
  description?: string;
}

export class ManageSubjectsUseCase {
  constructor(
    private readonly repository: SubjectRepositoryPort,
  ) {}

  async create(data: CreateSubjectDto): Promise<SubjectEntity> {
    const subject = new SubjectEntity(
      uuidv4(),
      data.name,
      data.code,
      data.credits,
      data.teacherId,
      data.description,
    );
    return this.repository.save(subject);
  }

  async update(id: string, data: Partial<CreateSubjectDto>): Promise<SubjectEntity | null> {
    const subject = await this.repository.findById(id);
    if (!subject) return null;

    if (data.name !== undefined) subject.name = data.name;
    if (data.code !== undefined) subject.code = data.code;
    if (data.credits !== undefined) subject.credits = data.credits;
    if (data.teacherId !== undefined) subject.teacherId = data.teacherId;
    if (data.description !== undefined) subject.description = data.description;

    return this.repository.save(subject);
  }

  async findAll(): Promise<SubjectEntity[]> {
    return this.repository.findAll();
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
