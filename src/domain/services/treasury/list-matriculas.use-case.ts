import { StudentRepositoryPort } from '../../ports/outbound/users/student-repository.port';
import { TuitionRepositoryPort } from '../../ports/outbound/academic/tuition-repository.port';

export class ListMatriculasUseCase {
  constructor(
    private readonly studentRepository: StudentRepositoryPort,
    private readonly tuitionRepository: TuitionRepositoryPort,
  ) {}

  async execute(): Promise<{
    data: {
      studentId: string;
      firstName: string;
      lastName: string;
      status: string;
      paidInstallments: number;
    }[];
  }> {
    const { data: students } = await this.studentRepository.findPaginated(1, 100000);
    const { data: tuitions } = await this.tuitionRepository.findAllWithStudent();

    const tuitionMap = new Map(tuitions.map((t) => [t.studentId, t]));

    const data = students.map((student) => {
      const tuition = tuitionMap.get(student.id);
      return {
        studentId: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        status: tuition ? tuition.status : 'no_paga',
        paidInstallments: tuition ? tuition.paidInstallments : 0,
      };
    });

    return { data };
  }
}
