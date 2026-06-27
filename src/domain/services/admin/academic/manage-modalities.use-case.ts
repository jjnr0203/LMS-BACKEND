import { Modality } from '../../../entities/academic/modality.entity';
import { ModalityRepositoryPort } from '../../../ports/outbound/academic/modality-repository.port';
import { v4 as uuidv4 } from 'uuid';

export interface CreateModalityDto {
  name: string;
  isActive: boolean;
  description?: string;
}

export class ManageModalitiesUseCase {
  constructor(private readonly repository: ModalityRepositoryPort) {}

  async create(data: CreateModalityDto): Promise<Modality> {
    const modality = new Modality(
      uuidv4(),
      data.name,
      data.isActive,
      data.description,
    );
    return this.repository.save(modality);
  }

  async update(
    id: string,
    data: Partial<CreateModalityDto>,
  ): Promise<Modality | null> {
    const modality = await this.repository.findById(id);
    if (!modality) return null;

    if (data.name !== undefined) modality.name = data.name;
    if (data.isActive !== undefined) modality.isActive = data.isActive;
    if (data.description !== undefined) modality.description = data.description;

    return this.repository.save(modality);
  }

  async findAll(): Promise<Modality[]> {
    return this.repository.findAll();
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
