import { AcademicTerm } from '../../../entities/academic/academic-term.entity';
import { AcademicTermRepositoryPort } from '../../../ports/outbound/academic/academic-term-repository.port';
import { v4 as uuidv4 } from 'uuid';

export class CreateAcademicTermDto {
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export class ManageAcademicTermsUseCase {
  constructor(private readonly repository: AcademicTermRepositoryPort) {}

  async create(data: CreateAcademicTermDto): Promise<AcademicTerm> {
    const term = new AcademicTerm(
      uuidv4(),
      data.name,
      data.startDate,
      data.endDate,
      data.isActive,
    );

    const saved = await this.repository.save(term);

    // Si se creó como activo, desactivar los demás
    if (saved.isActive) {
      await this.repository.deactivateAllExcept(saved.id);
    }

    return saved;
  }

  async update(
    id: string,
    data: Partial<CreateAcademicTermDto>,
  ): Promise<AcademicTerm | null> {
    const term = await this.repository.findById(id);
    if (!term) return null;

    if (data.name !== undefined) term.name = data.name;
    if (data.startDate !== undefined) term.startDate = data.startDate;
    if (data.endDate !== undefined) term.endDate = data.endDate;
    if (data.isActive !== undefined) {
      term.isActive = data.isActive;
    }

    const saved = await this.repository.save(term);

    // Si se actualizó a activo, desactivar los demás
    if (saved.isActive) {
      await this.repository.deactivateAllExcept(saved.id);
    }

    return saved;
  }

  async findAll(): Promise<AcademicTerm[]> {
    return this.repository.findAll();
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
