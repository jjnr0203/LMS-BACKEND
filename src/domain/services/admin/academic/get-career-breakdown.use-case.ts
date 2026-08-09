import { CareerRepositoryPort } from '../../../ports/outbound/academic/career-repository.port';
import { CurriculumRepositoryPort } from '../../../ports/outbound/academic/curriculum-repository.port';
import { CareerSubjectRepositoryPort } from '../../../ports/outbound/academic/career-subject-repository.port';
import { SubjectRepositoryPort } from '../../../ports/outbound/academic/subject-repository.port';
import { ModalityRepositoryPort } from '../../../ports/outbound/academic/modality-repository.port';
import { UserRepositoryPort } from '../../../ports/outbound/users/user-repository.port';
import { TeacherRepositoryPort } from '../../../ports/outbound/users/teacher-repository.port';
import { TeacherSubjectRepositoryPort } from '../../../ports/outbound/academic/teacher-subject-repository.port';
import { JornadaRepositoryPort } from '../../../ports/outbound/academic/jornada-repository.port';
import { TeacherSubjectEntity } from '../../../entities/academic/teacher-subject.entity';
interface SubjectAssignment {
  id: string;
  teacherId: string;
  teacherName: string;
  academicTermId: string;
  modalityId: string;
  modalityName: string;
  jornadaId: string;
  jornadaName: string;
}

interface SubjectBreakdown {
  id: string;
  code: string;
  name: string;
  credits: number;
  hours: number;
  semester: number;
  assignments: SubjectAssignment[];
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
    private readonly teacherSubjectRepository: TeacherSubjectRepositoryPort,
    private readonly jornadaRepository: JornadaRepositoryPort,
    private readonly teacherRepository: TeacherRepositoryPort,
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

    const allJornadas = await this.jornadaRepository.findAll();
    const jornadaMap = new Map(allJornadas.map((j) => [j.id, j.name]));

    const curriculums = await this.curriculumRepository.findByCareer(careerId);
    const allCareerSubjects =
      await this.careerSubjectRepository.findByCareer(careerId);
    const subjectIds = [
      ...new Set(allCareerSubjects.map((cs) => cs.subjectId)),
    ];
    const subjects =
      subjectIds.length > 0
        ? await this.subjectRepository.findByIds(subjectIds)
        : [];
    const subjectMap = new Map(subjects.map((s) => [s.id, s]));

    const allTeacherSubjects =
      subjectIds.length > 0
        ? await this.teacherSubjectRepository.findBySubjectIds(subjectIds)
        : [];

    const teacherIds = [
      ...new Set(allTeacherSubjects.map((ts) => ts.teacherId)),
    ];
    const teacherNames =
      teacherIds.length > 0
        ? await this.teacherRepository.findByIds(teacherIds)
        : [];
    const teacherMap = new Map(
      teacherNames.map((u) => [u.id, `${u.firstName} ${u.lastName}`]),
    );

    // Group assignments by curriculumId -> subjectId -> array of TeacherSubjectEntity
    const assignmentsByCurriculum = new Map<
      string,
      Map<string, TeacherSubjectEntity[]>
    >();
    for (const ts of allTeacherSubjects) {
      const key = ts.curriculumId || '__shared__';
      if (!assignmentsByCurriculum.has(key)) {
        assignmentsByCurriculum.set(key, new Map());
      }
      const subjectMap = assignmentsByCurriculum.get(key)!;
      if (!subjectMap.has(ts.subjectId)) {
        subjectMap.set(ts.subjectId, []);
      }
      subjectMap.get(ts.subjectId)!.push(ts);
    }

    const curriculumsBreakdown = curriculums.map((curriculum) => {
      const relations = allCareerSubjects.filter(
        (cs) => cs.curriculumId === curriculum.id || !cs.curriculumId,
      );

      const curAssignmentsMap =
        assignmentsByCurriculum.get(curriculum.id) ||
        new Map<string, TeacherSubjectEntity[]>();
      const sharedAssignmentsMap =
        assignmentsByCurriculum.get('__shared__') ||
        new Map<string, TeacherSubjectEntity[]>();

      const semesterMap = new Map<number, SubjectBreakdown[]>();
      for (const rel of relations) {
        const sub = subjectMap.get(rel.subjectId);
        if (!sub) continue;
        const sem = rel.semester || 1;
        if (!semesterMap.has(sem)) {
          semesterMap.set(sem, []);
        }

        const rawAssignments = [
          ...(curAssignmentsMap.get(sub.id) || []),
          ...(sharedAssignmentsMap.get(sub.id) || []),
        ];

        const assignments: SubjectAssignment[] = rawAssignments.map((ts) => ({
          id: ts.id,
          teacherId: ts.teacherId,
          teacherName: teacherMap.get(ts.teacherId) || 'Desconocido',
          academicTermId: ts.academicTermId || '',
          modalityId: ts.modalityId || '',
          modalityName: ts.modalityId
            ? modalityMap.get(ts.modalityId) || 'Sin Modalidad'
            : 'Sin Modalidad',
          jornadaId: ts.jornadaId || '',
          jornadaName: ts.jornadaId
            ? jornadaMap.get(ts.jornadaId) || 'Sin Jornada'
            : 'Sin Jornada',
        }));

        semesterMap.get(sem)!.push({
          id: rel.subjectId,
          code: sub.code,
          name: sub.name,
          credits: sub.credits,
          hours: sub.hours || 0,
          semester: sem,
          assignments,
        });
      }

      const semesters = Array.from(semesterMap.entries())
        .map(([semester, semesterSubjects]) => ({
          semester,
          subjects: semesterSubjects.sort((a, b) =>
            a.name.localeCompare(b.name),
          ),
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
    });

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
