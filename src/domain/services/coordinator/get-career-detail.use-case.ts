import { CareerRepositoryPort } from '../../ports/outbound/academic/career-repository.port';
import { ModalityRepositoryPort } from '../../ports/outbound/academic/modality-repository.port';
import { JornadaRepositoryPort } from '../../ports/outbound/academic/jornada-repository.port';
import { CurriculumRepositoryPort } from '../../ports/outbound/academic/curriculum-repository.port';
import { SubjectRepositoryPort } from '../../ports/outbound/academic/subject-repository.port';
import { CareerSubjectRepositoryPort } from '../../ports/outbound/academic/career-subject-repository.port';
import { TeacherSubjectRepositoryPort } from '../../ports/outbound/academic/teacher-subject-repository.port';
import { UserRepositoryPort } from '../../ports/outbound/users/user-repository.port';
import { TeacherRepositoryPort } from '../../ports/outbound/users/teacher-repository.port';
import { ScheduleRepositoryPort } from '../../ports/outbound/academic/schedule-repository.port';
import { TeacherSubjectEntity } from '../../entities/academic/teacher-subject.entity';

export interface SubjectAssignment {
  id: string;
  teacherId: string;
  teacherName: string;
  academicTermId: string;
  modalityId: string;
  modalityName: string;
  jornadaId: string;
  jornadaName: string;
  schedules?: any[];
}

export interface SubjectEntry {
  id: string;
  code: string;
  name: string;
  credits: number;
  semester: number;
  assignments: SubjectAssignment[];
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
    private readonly jornadaRepository: JornadaRepositoryPort,
    private readonly scheduleRepository: ScheduleRepositoryPort,
    private readonly teacherRepository: TeacherRepositoryPort,
  ) {}

  async execute(careerId: string) {
    const career = await this.careerRepository.findById(careerId);
    if (!career) throw new Error('No se encontró la carrera');

    const allModalities = await this.modalityRepository.findAll();
    const modalityMap = new Map(allModalities.map((m) => [m.id, m.name]));

    const allJornadas = await this.jornadaRepository.findAll();
    const jornadaMap = new Map(allJornadas.map((j) => [j.id, j.name]));

    const careerModalityNames = (career.modalityIds || [])
      .map((id) => modalityMap.get(id))
      .filter((n): n is string => n !== undefined);

    const curriculums = await this.curriculumRepository.findByCareer(careerId);
    const careerSubjects = await this.careerSubjectRepository.findByCareer(careerId);
    const subjectIds = [...new Set(careerSubjects.map((cs) => cs.subjectId))];
    
    const subjects = subjectIds.length > 0
      ? await this.subjectRepository.findByIds(subjectIds)
      : [];
    const subjectMap = new Map(subjects.map((s) => [s.id, s]));

    const allTeacherSubjects = subjectIds.length > 0
      ? await Promise.all(
          subjectIds.map((sid) => this.teacherSubjectRepository.findBySubjectId(sid)),
        ).then((results) => results.flat())
      : [];

    const teacherIds = [...new Set(allTeacherSubjects.map((ts) => ts.teacherId))];
    const teachers = teacherIds.length > 0
      ? await this.teacherRepository.findByIds(teacherIds)
      : [];
    const teacherNameMap = new Map(
      teachers.map((u) => [u.id, `${u.firstName} ${u.lastName}`]),
    );

    const allTeacherSubjectIds = allTeacherSubjects.map((ts) => ts.id);
    const allSchedules = allTeacherSubjectIds.length > 0
      ? await this.scheduleRepository.findByTeacherSubjectIds(allTeacherSubjectIds)
      : [];
    const schedulesByTeacherSubject = new Map<string, any[]>();
    for (const sched of allSchedules) {
      if (!schedulesByTeacherSubject.has(sched.teacherSubjectId)) {
        schedulesByTeacherSubject.set(sched.teacherSubjectId, []);
      }
      schedulesByTeacherSubject.get(sched.teacherSubjectId)!.push({
        id: sched.id,
        dayOfWeek: sched.dayOfWeek,
        startTime: sched.startTime,
        endTime: sched.endTime,
      });
    }

    // Group assignments by curriculumId -> subjectId -> array of TeacherSubjectEntity
    const assignmentsByCurriculum = new Map<string, Map<string, TeacherSubjectEntity[]>>();
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

    const curriculumList = await Promise.all(
      curriculums.map(async (cur) => {
        const relations = careerSubjects.filter(
          (cs) => cs.curriculumId === cur.id || !cs.curriculumId,
        );

        const curAssignmentsMap = assignmentsByCurriculum.get(cur.id) || new Map<string, TeacherSubjectEntity[]>();
        const sharedAssignmentsMap = assignmentsByCurriculum.get('__shared__') || new Map<string, TeacherSubjectEntity[]>();

        const semesterMap = new Map<number, SubjectEntry[]>();

        for (const rel of relations) {
          const sub = subjectMap.get(rel.subjectId);
          if (!sub) continue;

          const semester = rel.semester || 1;
          if (!semesterMap.has(semester)) {
            semesterMap.set(semester, []);
          }

          const rawAssignments = [
            ...(curAssignmentsMap.get(sub.id) || []),
            ...(sharedAssignmentsMap.get(sub.id) || []),
          ];

          const assignments: SubjectAssignment[] = rawAssignments.map(ts => ({
            id: ts.id,
            teacherId: ts.teacherId,
            teacherName: teacherNameMap.get(ts.teacherId) || 'Desconocido',
            academicTermId: ts.academicTermId || '',
            modalityId: ts.modalityId || '',
            modalityName: ts.modalityId ? modalityMap.get(ts.modalityId) || 'Sin Modalidad' : 'Sin Modalidad',
            jornadaId: ts.jornadaId || '',
            jornadaName: ts.jornadaId ? jornadaMap.get(ts.jornadaId) || 'Sin Jornada' : 'Sin Jornada',
            schedules: schedulesByTeacherSubject.get(ts.id) || [],
          }));

          semesterMap.get(semester)!.push({
            id: sub.id,
            code: sub.code,
            name: sub.name,
            credits: sub.credits,
            semester,
            assignments,
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
        modalityIds: career.modalityIds || [],
        jornadaIds: career.jornadaIds || [],
        facultyId: career.facultyId,
      },
      curriculums: curriculumList,
    };
  }
}
