import { UserRepositoryPort } from '../../ports/outbound/users/user-repository.port';
import { CareerRepositoryPort } from '../../ports/outbound/academic/career-repository.port';
import { ModalityRepositoryPort } from '../../ports/outbound/academic/modality-repository.port';
import { CurriculumRepositoryPort } from '../../ports/outbound/academic/curriculum-repository.port';
import { SubjectRepositoryPort } from '../../ports/outbound/academic/subject-repository.port';
import { FacultyRepositoryPort } from '../../ports/outbound/academic/faculty-repository.port';
import { TeacherRepositoryPort } from '../../ports/outbound/users/teacher-repository.port';
import { StudentRepositoryPort } from '../../ports/outbound/users/student-repository.port';
export class GetDashboardStatsUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly careerRepository: CareerRepositoryPort,
    private readonly modalityRepository: ModalityRepositoryPort,
    private readonly curriculumRepository: CurriculumRepositoryPort,
    private readonly subjectRepository: SubjectRepositoryPort,
    private readonly facultyRepository: FacultyRepositoryPort,
    private readonly teacherRepository: TeacherRepositoryPort,
    private readonly studentRepository: StudentRepositoryPort,
  ) {}

  async execute(): Promise<any> {
    const counts = await this.userRepository.getCountsByRole();
    const teacherCount = await this.teacherRepository.count();
    const studentCount = await this.studentRepository.count();
    const allCareers = await this.careerRepository.findAll();
    const allModalities = await this.modalityRepository.findAll();
    const modalityMap = new Map(allModalities.map((m) => [m.id, m.name]));

    const coordinatorIds = allCareers
      .map((c) => c.coordinatorId)
      .filter((id): id is string => !!id);
    const users =
      coordinatorIds.length > 0
        ? await this.userRepository.findByIds(coordinatorIds)
        : [];
    const userMap = new Map(
      users.map((u) => [u.id, `${u.firstName} ${u.lastName}`]),
    );

    const allCurriculums =
      allCareers.length > 0
        ? await this.curriculumRepository.findByCareerIds(
            allCareers.map((c) => c.id),
          )
        : [];
    const curriculumsByCareer = new Map<string, typeof allCurriculums>();
    for (const cur of allCurriculums) {
      if (!curriculumsByCareer.has(cur.careerId)) {
        curriculumsByCareer.set(cur.careerId, []);
      }
      curriculumsByCareer.get(cur.careerId)!.push(cur);
    }

    const careersDetails = allCareers.map((career) => {
      const coordinatorName = career.coordinatorId
        ? userMap.get(career.coordinatorId) || null
        : null;

      const modalityNames = (career.modalityIds || [])
        .map((id) => modalityMap.get(id))
        .filter((n): n is string => n !== undefined);

      const curriculums = curriculumsByCareer.get(career.id) || [];
      const activeCurriculums = curriculums
        .filter((c) => c.isActive)
        .map((c) => ({ id: c.id, name: c.name }));

      return {
        id: career.id,
        code: career.code,
        name: career.name,
        coordinatorName,
        modalityNames,
        durationSemesters: career.durationSemesters,
        isActive: career.isActive,
        activeCurriculums,
        facultyId: career.facultyId || null,
      };
    });

    const allFaculties = await this.facultyRepository.findAll();

    return {
      users: {
        student: studentCount,
        teacher: teacherCount,
        coordinator: counts['coordinator'] || 0,
        treasury: counts['treasury'] || 0,
        admin: counts['admin'] || 0,
        secretary: counts['secretary'] || 0,
        human_resources: counts['human_resources'] || 0,
      },
      academic: {
        totalCareers: allCareers.length,
        totalSubjects: await this.subjectRepository.count(),
        totalFaculties: allFaculties.length,
        faculties: allFaculties.map((f) => ({
          id: f.id,
          code: f.code,
          name: f.name,
        })),
        careers: careersDetails,
      },
    };
  }
}
