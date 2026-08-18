import { StudentRepositoryPort } from '../../ports/outbound/users/student-repository.port';
import { TuitionRepositoryPort } from '../../ports/outbound/academic/tuition-repository.port';
import { AcademicTermRepositoryPort } from '../../ports/outbound/academic/academic-term-repository.port';
import { NotFoundException } from '@nestjs/common';

export class ListOverdueStudentsUseCase {
  constructor(
    private readonly studentRepository: StudentRepositoryPort,
    private readonly tuitionRepository: TuitionRepositoryPort,
    private readonly academicTermRepository: AcademicTermRepositoryPort,
  ) {}

  async execute(): Promise<{
    data: {
      studentId: string;
      firstName: string;
      lastName: string;
      paidInstallments: number;
      expectedInstallments: number;
      overdueMonths: number;
      nextDueDate: string;
    }[];
  }> {
    const terms = await this.academicTermRepository.findAll();
    const activeTerm = terms.find((t) => t.isActive);
    if (!activeTerm) {
      throw new NotFoundException('No hay período académico activo');
    }

    const now = new Date();
    const startDate = new Date(activeTerm.startDate);

    const installmentDates: Date[] = [];
    for (let i = 0; i < 4; i++) {
      const due = new Date(startDate);
      due.setMonth(due.getMonth() + i);
      installmentDates.push(due);
    }

    const { data: students } = await this.studentRepository.findPaginated(1, 100000);
    const { data: tuitions } = await this.tuitionRepository.findAllWithStudent();

    const tuitionMap = new Map(tuitions.map((t) => [t.studentId, t]));

    const overdue = students
      .filter((student) => {
        const tuition = tuitionMap.get(student.id);
        if (!student.isActive) return false;
        if (!tuition) return true;

        const paid = tuition.paidInstallments;
        const expected = installmentDates.filter((d) => now >= d).length;

        return paid < expected;
      })
      .map((student) => {
        const tuition = tuitionMap.get(student.id);
        const paid = tuition ? tuition.paidInstallments : 0;
        const expected = installmentDates.filter((d) => now >= d).length;
        const overdueMonths = expected - paid;

        let nextDueDate = '';
        for (const d of installmentDates) {
          if (d > now) {
            nextDueDate = d.toISOString().split('T')[0];
            break;
          }
        }

        return {
          studentId: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          paidInstallments: paid,
          expectedInstallments: expected,
          overdueMonths: Math.max(0, overdueMonths),
          nextDueDate,
        };
      });

    return { data: overdue };
  }
}
