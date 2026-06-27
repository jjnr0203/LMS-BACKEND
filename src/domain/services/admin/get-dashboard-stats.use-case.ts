import { UserRepositoryPort } from '../../ports/outbound/users/user-repository.port';
import { CareerRepositoryPort } from '../../ports/outbound/academic/career-repository.port';
import { SubjectRepositoryPort } from '../../ports/outbound/academic/subject-repository.port';
import { CareerSubjectRepositoryPort } from '../../ports/outbound/academic/career-subject-repository.port';
import { ModalityRepositoryPort } from '../../ports/outbound/academic/modality-repository.port';

export class GetDashboardStatsUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly careerRepository: CareerRepositoryPort,
    private readonly subjectRepository: SubjectRepositoryPort,
    private readonly careerSubjectRepository: CareerSubjectRepositoryPort,
    private readonly modalityRepository: ModalityRepositoryPort,
  ) {}

  async execute(): Promise<any> {
    const counts = await this.userRepository.getCountsByRole();
    const allCareers = await this.careerRepository.findAll();
    const allSubjects = await this.subjectRepository.findAll();
    const allModalities = await this.modalityRepository.findAll();
    const modalityMap = new Map(allModalities.map((m) => [m.id, m.name]));

    const careerIds = allCareers.map((c) => c.id);
    const allCareerSubjects =
      careerIds.length > 0
        ? await this.careerSubjectRepository.findByCareerIds(careerIds)
        : [];

    const teacherIds = allSubjects
      .map((s) => s.teacherId)
      .filter((id): id is string => !!id);
    const coordinatorIds = allCareers
      .map((c) => c.coordinatorId)
      .filter((id): id is string => !!id);
    const allUserIds = [...new Set([...teacherIds, ...coordinatorIds])];
    const users =
      allUserIds.length > 0
        ? await this.userRepository.findByIds(allUserIds)
        : [];
    const userMap = new Map(
      users.map((u) => [u.id, `${u.firstName} ${u.lastName}`]),
    );

    const careerSubjectsMap = new Map<string, typeof allCareerSubjects>();
    for (const cs of allCareerSubjects) {
      if (!careerSubjectsMap.has(cs.careerId)) {
        careerSubjectsMap.set(cs.careerId, []);
      }
      careerSubjectsMap.get(cs.careerId)!.push(cs);
    }

    const subjectMap = new Map(allSubjects.map((s) => [s.id, s]));

    const careersDetails = allCareers.map((career) => {
      const coordinatorName = career.coordinatorId
        ? userMap.get(career.coordinatorId) || null
        : null;

      const modalityNames = (career.modalityIds || [])
        .map((id) => modalityMap.get(id))
        .filter((n): n is string => n !== undefined);

      const careerSubjects = careerSubjectsMap.get(career.id) || [];
      const mappedSubjects = careerSubjects.map((cs) => {
        const subjectDetail = subjectMap.get(cs.subjectId);
        const subjModalityNames = (subjectDetail?.modalityIds || [])
          .map((id) => modalityMap.get(id))
          .filter((n): n is string => n !== undefined);
        const teacherName = subjectDetail?.teacherId
          ? userMap.get(subjectDetail.teacherId) || null
          : null;

        return {
          id: cs.subjectId,
          name: subjectDetail ? subjectDetail.name : 'Desconocida',
          semester: cs.semester,
          modalityNames: subjModalityNames,
          teacherName,
        };
      });

      mappedSubjects.sort((a, b) => a.semester - b.semester);

      return {
        id: career.id,
        name: career.name,
        coordinatorName,
        modalityNames,
        durationSemesters: career.durationSemesters,
        subjects: mappedSubjects,
      };
    });

    return {
      users: {
        student: counts['student'] || 0,
        teacher: counts['teacher'] || 0,
        coordinator: counts['coordinator'] || 0,
        treasury: counts['treasury'] || 0,
        admin: counts['admin'] || 0,
      },
      academic: {
        totalCareers: allCareers.length,
        totalSubjects: allSubjects.length,
        careers: careersDetails,
      },
    };
  }
}
