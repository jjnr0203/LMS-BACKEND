import { Faculty } from '../../../entities/academic/faculty.entity';
import { FacultyRepositoryPort } from '../../../ports/outbound/academic/faculty-repository.port';
import { v4 as uuidv4 } from 'uuid';

export interface CreateFacultyDto {
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
}

export class ManageFacultiesUseCase {
  constructor(private readonly repository: FacultyRepositoryPort) {}

  async create(data: CreateFacultyDto): Promise<Faculty> {
    const faculty = new Faculty(
      uuidv4(),
      data.name,
      data.code,
      data.description || null,
      data.isActive,
      new Date(),
    );
    return this.repository.save(faculty);
  }

  async update(
    id: string,
    data: Partial<CreateFacultyDto>,
  ): Promise<Faculty | null> {
    const faculty = await this.repository.findById(id);
    if (!faculty) return null;

    if (data.name !== undefined) faculty.name = data.name;
    if (data.code !== undefined) faculty.code = data.code;
    if (data.description !== undefined) faculty.description = data.description;
    if (data.isActive !== undefined) faculty.isActive = data.isActive;

    return this.repository.save(faculty);
  }

  async findAll(): Promise<Faculty[]> {
    return this.repository.findAll();
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
