import { InscriptionEntity } from '../../../entities/secretary/inscription.entity';

export abstract class InscriptionRepositoryPort {
  abstract findById(id: string): Promise<InscriptionEntity | null>;
  abstract findByStudentId(studentId: string): Promise<InscriptionEntity[]>;
  abstract save(inscription: InscriptionEntity): Promise<InscriptionEntity>;
  abstract findAll(): Promise<InscriptionEntity[]>;
  abstract findAllWithDetails(): Promise<any[]>;
  abstract updateStatus(id: string, status: string): Promise<void>;
}
