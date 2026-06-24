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
      const relation = new CareerSubject(uuidv4(), data.careerId, savedSubject.id, data.semester);
      await this.careerSubjectRepository.save(relation);
    }

    return savedSubject;
  }

  async update(id: string, data: Partial<CreateSubjectDto>): Promise<SubjectEntity | null> {
    const subject = await this.repository.findById(id);
    if (!subject) return null;

    if (data.name !== undefined) subject.name = data.name;
    if (data.code !== undefined) subject.code = data.code;
    if (data.credits !== undefined) subject.credits = data.credits;
    if (data.modalityIds !== undefined) subject.modalityIds = data.modalityIds;
    if (data.teacherId !== undefined) subject.teacherId = data.teacherId;
    if (data.description !== undefined) subject.description = data.description;

    const savedSubject = await this.repository.save(subject);

    if (data.careerId !== undefined || data.semester !== undefined) {
      const existingRelations = await this.careerSubjectRepository.findBySubject(savedSubject.id);
      
      // We assume 1-to-1 for subjects to careers in UI
      if (existingRelations.length > 0) {
        const rel = existingRelations[0];
        // If careerId changed, we might need to delete and recreate or just update
        if (data.careerId !== undefined && data.careerId !== rel.careerId) {
          await this.careerSubjectRepository.deleteBySubject(savedSubject.id);
          if (data.careerId) {
             const newRel = new CareerSubject(uuidv4(), data.careerId, savedSubject.id, data.semester !== undefined ? data.semester : rel.semester);
             await this.careerSubjectRepository.save(newRel);
          }
        } else {
          // Career didn't change, just update semester
          if (data.semester !== undefined) {
            rel.semester = data.semester;
            await this.careerSubjectRepository.save(rel);
          }
        }
      } else {
        // No existing relation
        if (data.careerId && data.semester !== undefined) {
          const relation = new CareerSubject(uuidv4(), data.careerId, savedSubject.id, data.semester);
          await this.careerSubjectRepository.save(relation);
        }
      }
    }
    
    return savedSubject;
  }

  async findAll(): Promise<any[]> {
    const subjects = await this.repository.findAll();
    const result: any[] = [];
    for (const subject of subjects) {
      const relations = await this.careerSubjectRepository.findBySubject(subject.id);
      if (relations.length > 0) {
        // Just take the first one since it's 1-to-1 in UI
        const rel = relations[0];
        result.push({
          ...subject,
          careerId: rel.careerId,
          semester: rel.semester
        });
      } else {
        result.push({
          ...subject,
          careerId: null,
          semester: null
        });
      }
    }
    return result;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
