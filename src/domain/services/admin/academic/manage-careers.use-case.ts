import { Career } from '../../../entities/academic/career.entity';
import { CareerSubject } from '../../../entities/academic/career-subject.entity';
import { CareerRepositoryPort } from '../../../ports/outbound/academic/career-repository.port';
import { CareerSubjectRepositoryPort } from '../../../ports/outbound/academic/career-subject-repository.port';
import { v4 as uuidv4 } from 'uuid';

export interface CreateCareerDto {
  code: string;
  name: string;
  modalityId?: string;
  coordinatorId?: string;
  durationSemesters: number;
  isActive: boolean;
}

export class AssignSubjectsDto {
  subjectIds: string[];
}

export class ManageCareersUseCase {
  constructor(
    private readonly careerRepository: CareerRepositoryPort,
    private readonly careerSubjectRepository: CareerSubjectRepositoryPort,
  ) {}

  async create(data: CreateCareerDto): Promise<Career> {
    const career = new Career(
      uuidv4(),
      data.name,
      data.code,
      data.durationSemesters,
      data.modalityId,
      data.coordinatorId,
      data.isActive,
    );
    return this.careerRepository.save(career);
  }

  async update(id: string, data: Partial<CreateCareerDto>): Promise<Career | null> {
    const career = await this.careerRepository.findById(id);
    if (!career) return null;

    if (data.name !== undefined) career.name = data.name;
    if (data.code !== undefined) career.code = data.code;
    if (data.durationSemesters !== undefined) career.durationSemesters = data.durationSemesters;
    if (data.modalityId !== undefined) career.modalityId = data.modalityId;
    if (data.coordinatorId !== undefined) career.coordinatorId = data.coordinatorId;
    if (data.isActive !== undefined) career.isActive = data.isActive;

    return this.careerRepository.save(career);
  }

  async findAll(): Promise<Career[]> {
    return this.careerRepository.findAll();
  }

  async delete(id: string): Promise<void> {
    await this.careerRepository.delete(id);
  }

  // Career Subject Assignment
  async getAssignedSubjects(careerId: string): Promise<string[]> {
    const relations = await this.careerSubjectRepository.findByCareer(careerId);
    return relations.map(r => r.subjectId);
  }

  async assignSubjects(careerId: string, data: AssignSubjectsDto): Promise<void> {
    // Para simplificar, borramos todas las asignaciones y re-insertamos.
    // Esto es válido para la UI de multi-select (que manda la lista final).
    const existing = await this.careerSubjectRepository.findByCareer(careerId);
    
    // Eliminar las que ya no están
    for (const rel of existing) {
      if (!data.subjectIds.includes(rel.subjectId)) {
        await this.careerSubjectRepository.deleteByCareerAndSubject(careerId, rel.subjectId);
      }
    }

    // Agregar las nuevas
    const existingIds = existing.map(e => e.subjectId);
    for (const subjectId of data.subjectIds) {
      if (!existingIds.includes(subjectId)) {
        const newRel = new CareerSubject(uuidv4(), careerId, subjectId, 1);
        await this.careerSubjectRepository.save(newRel);
      }
    }
  }
}
