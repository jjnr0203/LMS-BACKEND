import { CareerRepositoryPort } from '../../ports/outbound/academic/career-repository.port';
import { ModalityRepositoryPort } from '../../ports/outbound/academic/modality-repository.port';
import { CurriculumRepositoryPort } from '../../ports/outbound/academic/curriculum-repository.port';
import { SubjectRepositoryPort } from '../../ports/outbound/academic/subject-repository.port';
import { CareerSubjectRepositoryPort } from '../../ports/outbound/academic/career-subject-repository.port';
import { TeacherSubjectRepositoryPort } from '../../ports/outbound/academic/teacher-subject-repository.port';
import { UserRepositoryPort } from '../../ports/outbound/users/user-repository.port';

export interface SubjectEntry {
  id: string;
  code: string;
  name: string;
  credits: number;
  semester: number;
  modalityIds: string[];
  modalityNames: string[];
  teacherId: string | null;
  teacherName: string | null;
}

export interface SemesterGroup {
  semester: number;
  subjects: SubjectEntry[];
}

export interface CurriculumDetail {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  semesters: SemesterGroup[];
}

export class GetCareerDetailUseCase {
  constructor(
    private readonly careerRepository: CareerRepositoryPort,
    private readonly modalityRepository: ModalityRepositoryPort,
    private readonly curriculumRepository: CurriculumRepositoryPort,
    private readonly subjectRepository: SubjectRepositoryPort,
    private readonly careerSubjectRepository: CareerSubjectRepositoryPort,
    private readonly teacherSubjectRepository: TeacherSubjectRepositoryPort,
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(careerId: string) {
    const career = await this.careerRepository.findById(careerId);
    if (!career) throw new Error('No se encontró la carrera');

    const allModalities = await this.modalityRepository.findAll();
    const modalityMap = new Map(allModalities.map((m) => [m.id, m.name]));

    const careerModalityNames = (career.modalityIds || [])
      .map((id) => modalityMap.get(id))
      .filter((n): n is string => n !== undefined);

    const curriculums = await this.curriculumRepository.findByCareer(careerId);
    const careerSubjects =
      await this.careerSubjectRepository.findByCareer(careerId);
    const subjectIds = [
      ...new Set(careerSubjects.map((cs) => cs.subjectId)),
    ];
    const subjects =
      subjectIds.length > 0
        ? await this.subjectRepository.findByIds(subjectIds)
        : [];
    const subjectMap = new Map(subjects.map((s) => [s.id, s]));

    const allTeacherSubjects =
      subjectIds.length > 0
        ? await Promise.all(
            subjectIds.map((sid) =>
              this.teacherSubjectRepository.findBySubjectId(sid),
            ),
          ).then((results) => results.flat())
        : [];

    const teacherByCurriculum = new Map<string, Map<string, string>>();
    for (const ts of allTeacherSubjects) {
      const key = ts.curriculumId || '__shared__';
      if (!teacherByCurriculum.has(key)) {
        teacherByCurriculum.set(key, new Map());
      }
      teacherByCurriculum.get(key)!.set(ts.subjectId, ts.teacherId);
    }

    const teacherIds = [
      ...new Set(allTeacherSubjects.map((ts) => ts.teacherId)),
    ];
    const teachers =
      teacherIds.length > 0
        ? await this.userRepository.findByIds(teacherIds)
        : [];
    const teacherNameMap = new Map(
      teachers.map((u) => [
        u.id,
        `${u.firstName} ${u.lastName}`,
      ]),
    );

    const curriculumList = await Promise.all(
      curriculums.map(async (cur) => {
        const relations = careerSubjects.filter(
          (cs) => cs.curriculumId === cur.id || !cs.curriculumId,
        );

        const curAssignments =
          teacherByCurriculum.get(cur.id) ||
          teacherByCurriculum.get('__shared__') ||
          new Map<string, string>();

        const semesterMap = new Map<number, SubjectEntry[]>();

        for (const rel of relations) {
          const sub = subjectMap.get(rel.subjectId);
          if (!sub) continue;

          const semester = rel.semester || 1;
          if (!semesterMap.has(semester)) {
            semesterMap.set(semester, []);
          }

          const assignedTeacherId =
            curAssignments.get(sub.id) || null;
          const teacherName = assignedTeacherId
            ? teacherNameMap.get(assignedTeacherId) || null
            : null;

          semesterMap.get(semester)!.push({
            id: sub.id,
            code: sub.code,
            name: sub.name,
            credits: sub.credits,
            semester,
            modalityIds: sub.modalityIds || [],
            modalityNames: (sub.modalityIds || [])
              .map((id) => modalityMap.get(id))
              .filter((n): n is string => n !== undefined),
            teacherId: assignedTeacherId,
            teacherName,
          });
        }

        const semesters: SemesterGroup[] = Array.from(semesterMap.entries())
          .map(([sem, subs]) => ({
            semester: sem,
            subjects: subs.sort((a, b) => a.name.localeCompare(b.name)),
          }))
          .sort((a, b) => a.semester - b.semester);

        return {
          id: cur.id,
          name: cur.name,
          description: cur.description,
          isActive: cur.isActive,
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
        isActive: career.isActive,
        modalityNames: careerModalityNames,
      },
      curriculums: curriculumList,
    };
  }
}
