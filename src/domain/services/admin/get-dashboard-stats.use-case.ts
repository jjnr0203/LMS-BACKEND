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
    
    // Academic Stats
    const allCareers = await this.careerRepository.findAll();
    const allSubjects = await this.subjectRepository.findAll();
    
    const careersDetails = await Promise.all(
      allCareers.map(async (career) => {
        let coordinatorName: string | null = null;
        if (career.coordinatorId) {
          const user = await this.userRepository.findById(career.coordinatorId);
          if (user) coordinatorName = `${user.firstName} ${user.lastName}`;
        }
        
        let modalityNames: string[] = [];
        if (career.modalityIds && career.modalityIds.length > 0) {
          const modalities = await Promise.all(
            career.modalityIds.map(id => this.modalityRepository.findById(id))
          );
          modalityNames = modalities.filter(m => m !== null).map(m => m!.name);
        }

        const allModalities = await this.modalityRepository.findAll();
        
        const careerSubjects = await this.careerSubjectRepository.findByCareer(career.id);
        const mappedSubjects = await Promise.all(careerSubjects.map(async cs => {
          const subjectDetail = allSubjects.find(s => s.id === cs.subjectId);
          let subjModalityNames: string[] = [];
          let teacherName: string | null = null;
          
          if (subjectDetail) {
            if (subjectDetail.modalityIds && subjectDetail.modalityIds.length > 0) {
              subjModalityNames = subjectDetail.modalityIds
                .map(id => allModalities.find(m => m.id === id)?.name)
                .filter((n): n is string => n !== undefined);
            }
            if (subjectDetail.teacherId) {
              const teacher = await this.userRepository.findById(subjectDetail.teacherId);
              if (teacher) teacherName = `${teacher.firstName} ${teacher.lastName}`;
            }
          }
          
          return {
            id: cs.subjectId,
            name: subjectDetail ? subjectDetail.name : 'Desconocida',
            semester: cs.semester,
            modalityNames: subjModalityNames,
            teacherName: teacherName
          };
        }));
        
        mappedSubjects.sort((a, b) => a.semester - b.semester);

        return {
          id: career.id,
          name: career.name,
          coordinatorName,
          modalityNames,
          durationSemesters: career.durationSemesters,
          subjects: mappedSubjects
        };
      })
    );

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
        careers: careersDetails
      }
    };
  }
}
