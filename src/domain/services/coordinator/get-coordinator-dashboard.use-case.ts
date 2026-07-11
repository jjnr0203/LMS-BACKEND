import { CareerRepositoryPort } from '../../ports/outbound/academic/career-repository.port';
import { SubjectRepositoryPort } from '../../ports/outbound/academic/subject-repository.port';
import { ModalityRepositoryPort } from '../../ports/outbound/academic/modality-repository.port';
import { CareerSubjectRepositoryPort } from '../../ports/outbound/academic/career-subject-repository.port';

export class GetCoordinatorDashboardUseCase {
  constructor(
    private readonly careerRepository: CareerRepositoryPort,
    private readonly careerSubjectRepository: CareerSubjectRepositoryPort,
    private readonly modalityRepository: ModalityRepositoryPort,
  ) {}

  async execute(coordinatorId: string) {
    const careers = await this.careerRepository.findByCoordinatorId(
      coordinatorId,
    );
    const careerIds = careers.map(c => c.id);
    let totalSubjects = 0;
    if (careerIds.length > 0) {
      const careerSubjects = await this.careerSubjectRepository.findByCareerIds(careerIds);
      totalSubjects = new Set(careerSubjects.map(cs => cs.subjectId)).size;
    }
    
    const modalities = await this.modalityRepository.findAll();
    const modalityMap = new Map(modalities.map((m) => [m.id, m.name]));

    const careersWithModalities = careers.map((c) => ({
      id: c.id,
      code: c.code,
      name: c.name,
      durationSemesters: c.durationSemesters,
      isActive: c.isActive,
      facultyId: c.facultyId,
      modalityNames: (c.modalityIds || [])
        .map((id) => modalityMap.get(id))
        .filter((n): n is string => n !== undefined),
    }));

    return { careers: careersWithModalities, totalSubjects };
  }
}
