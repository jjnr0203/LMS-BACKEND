import { InstitutionConfigEntity } from '@domain/entities/institution/institution-config.entity';

export const INSTITUTION_CONFIG_REPOSITORY = 'INSTITUTION_CONFIG_REPOSITORY';

export interface InstitutionConfigRepositoryPort {
  findOne(): Promise<InstitutionConfigEntity | null>;
  save(
    config: Partial<InstitutionConfigEntity>,
  ): Promise<InstitutionConfigEntity>;
}
