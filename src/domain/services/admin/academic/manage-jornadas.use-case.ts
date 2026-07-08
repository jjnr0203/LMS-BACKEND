import { Jornada } from '../../../entities/academic/jornada.entity';
import { JornadaRepositoryPort } from '../../../ports/outbound/academic/jornada-repository.port';
import { v4 as uuidv4 } from 'uuid';

export interface CreateJornadaDto {
  name: string;
  isActive?: boolean;
  description?: string;
}

export class ManageJornadasUseCase {
  constructor(private readonly repository: JornadaRepositoryPort) {}

  async create(data: CreateJornadaDto): Promise<Jornada> {
    const jornada = new Jornada(
      uuidv4(),
      data.name,
      data.isActive ?? true,
      data.description,
    );
    return this.repository.save(jornada);
  }

  async update(
    id: string,
    data: Partial<CreateJornadaDto>,
  ): Promise<Jornada | null> {
    const jornada = await this.repository.findById(id);
    if (!jornada) return null;

    if (data.name !== undefined) jornada.name = data.name;
    if (data.isActive !== undefined) jornada.isActive = data.isActive;
    if (data.description !== undefined) jornada.description = data.description;

    return this.repository.save(jornada);
  }

  async findAll(): Promise<Jornada[]> {
    return this.repository.findAll();
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
