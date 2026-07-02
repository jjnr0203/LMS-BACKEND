import { CareerRepositoryPort } from '../../../ports/outbound/academic/career-repository.port';
import { CurriculumRepositoryPort } from '../../../ports/outbound/academic/curriculum-repository.port';
import { CareerSubjectRepositoryPort } from '../../../ports/outbound/academic/career-subject-repository.port';
import { SubjectRepositoryPort } from '../../../ports/outbound/academic/subject-repository.port';
import { ModalityRepositoryPort } from '../../../ports/outbound/academic/modality-repository.port';
import { UserRepositoryPort } from '../../../ports/outbound/users/user-repository.port';
interface SubjectBreakdown {
  id: string;
  code: string;
  name: string;
  credits: number;
  semester: number;
  modalityNames: string[];
  teacherName: string | null;
}

interface SemesterBreakdown {
  semester: number;
  subjects: SubjectBreakdown[];
}

interface CurriculumBreakdown {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  semesters: SemesterBreakdown[];
}

interface CareerBreakdownResult {
  career: {
    id: string;
    code: string;
    name: string;
    durationSemesters: number;
    coordinatorName: string | null;
    modalityNames: string[];
    isActive: boolean;
  };
  curriculums: CurriculumBreakdown[];
}

export class GetCareerBreakdownUseCase {
  constructor(
    private readonly careerRepository: CareerRepositoryPort,
    private readonly curriculumRepository: CurriculumRepositoryPort,
    private readonly careerSubjectRepository: CareerSubjectRepositoryPort,
    private readonly subjectRepository: SubjectRepositoryPort,
    private readonly modalityRepository: ModalityRepositoryPort,
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(careerId: string): Promise<CareerBreakdownResult | null> {
    const career = await this.careerRepository.findById(careerId);
    if (!career) return null;

    const allModalities = await this.modalityRepository.findAll();
    const modalityMap = new Map(allModalities.map((m) => [m.id, m.name]));

    const coordinatorName = career.coordinatorId
      ? await this.userRepository
          .findByIds([career.coordinatorId])
          .then((users) =>
            users.length > 0
              ? `${users[0].firstName} ${users[0].lastName}`
              : null,
          )
      : null;

    const modalityNames = (career.modalityIds || [])
      .map((id) => modalityMap.get(id))
      .filter((n): n is string => n !== undefined);

    const curriculums = await this.curriculumRepository.findByCareer(careerId);
    const curriculumsBreakdown = await Promise.all(
      curriculums.map(async (curriculum) => {
        const relations = await this.careerSubjectRepository.findByCurriculum(
          curriculum.id,
        );
        const subjectIds = relations.map((r) => r.subjectId);
        const subjects =
          subjectIds.length > 0
            ? await this.subjectRepository.findByIds(subjectIds)
            : [];
        const subjectMap = new Map(subjects.map((s) => [s.id, s]));

        const teacherIds = subjects
          .map((s) => s.teacherId)
          .filter((id): id is string => !!id);
        const teacherNames =
          teacherIds.length > 0
            ? await this.userRepository.findByIds(teacherIds)
            : [];
        const teacherMap = new Map(
          teacherNames.map((u) => [u.id, `${u.firstName} ${u.lastName}`]),
        );

        const semesterMap = new Map<number, SubjectBreakdown[]>();
        for (const rel of relations) {
          const sub = subjectMap.get(rel.subjectId);
          if (!sub) continue;
          const sem = rel.semester || 1;
          if (!semesterMap.has(sem)) {
            semesterMap.set(sem, []);
          }
          semesterMap.get(sem)!.push({
            id: rel.subjectId,
            code: sub.code,
            name: sub.name,
            credits: sub.credits,
            semester: sem,
            modalityNames: (sub.modalityIds || [])
              .map((id) => modalityMap.get(id))
              .filter((n): n is string => n !== undefined),
            teacherName: sub.teacherId
              ? teacherMap.get(sub.teacherId) || null
              : null,
          });
        }

        const semesters = Array.from(semesterMap.entries())
          .map(([semester, subjects]) => ({
            semester,
            subjects: subjects.sort((a, b) => a.name.localeCompare(b.name)),
          }))
          .sort((a, b) => a.semester - b.semester);

        return {
          id: curriculum.id,
          name: curriculum.name,
          description: curriculum.description,
          isActive: curriculum.isActive,
          createdAt: curriculum.createdAt,
          semesters,
        };
      }),
    );

    return {
      career: {
        id: career.id,
        code: career.code,
        name: career.name,
        durationSemesters: career.durationSemesters,
        coordinatorName,
        modalityNames,
        isActive: career.isActive,
      },
      curriculums: curriculumsBreakdown,
    };
  }
}
