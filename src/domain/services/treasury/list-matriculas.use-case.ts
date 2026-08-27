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
      enrolled: boolean;
      status: string;
      paidInstallments: number;
    }[];
  }> {
    const { data: students } = await this.studentRepository.findPaginated(1, 100000);
    const { data: tuitions } = await this.tuitionRepository.findAllWithStudent(
      100000,
      0,
    );

    const statusPriority: Record<string, number> = {
      pago_total: 4,
      convenio: 3,
      pendiente: 2,
      no_paga: 1,
    };
    const tuitionMap = new Map<string, any>();
    for (const t of tuitions) {
      const existing = tuitionMap.get(t.studentId);
      if (
        !existing ||
        (statusPriority[t.status] ?? 0) > (statusPriority[existing.status] ?? 0)
      ) {
        tuitionMap.set(t.studentId, t);
      }
    }

    const data = students.map((student) => {
      const tuition = tuitionMap.get(student.id);
      const enrolled = tuition != null;
      return {
        studentId: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        enrolled,
        status: tuition ? tuition.status : 'no_paga',
        paidInstallments: tuition ? tuition.paidInstallments : 0,
      };
    });

    return { data };
  }
}
