import { Jornada } from '../../../entities/academic/jornada.entity';

export const JORNADA_REPOSITORY = Symbol('JORNADA_REPOSITORY');

export interface JornadaRepositoryPort {
  save(jornada: Jornada): Promise<Jornada>;
  findById(id: string): Promise<Jornada | null>;
  findAll(): Promise<Jornada[]>;
  delete(id: string): Promise<void>;
}
