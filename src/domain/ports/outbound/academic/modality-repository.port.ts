import { Modality } from '../../../entities/academic/modality.entity';

export const MODALITY_REPOSITORY = Symbol('MODALITY_REPOSITORY');

export interface ModalityRepositoryPort {
  save(modality: Modality): Promise<Modality>;
  findById(id: string): Promise<Modality | null>;
  findAll(): Promise<Modality[]>;
  delete(id: string): Promise<void>;
}
