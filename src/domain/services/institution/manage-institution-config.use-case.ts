import { InstitutionConfigRepositoryPort } from '@domain/ports/outbound/institution/institution-config-repository.port';
import { InstitutionConfigEntity } from '@domain/entities/institution/institution-config.entity';

export class ManageInstitutionConfigUseCase {
  constructor(private readonly repo: InstitutionConfigRepositoryPort) {}

  async get(): Promise<InstitutionConfigEntity | null> {
    return this.repo.findOne();
  }

  async upsert(data: Partial<InstitutionConfigEntity>): Promise<InstitutionConfigEntity> {
    return this.repo.save(data);
  }
}
