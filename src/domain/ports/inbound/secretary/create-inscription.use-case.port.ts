import { InscriptionEntity } from '../../../entities/secretary/inscription.entity';

export interface CreateInscriptionCommand {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  careerId: string;
  notes?: string;
}

export abstract class CreateInscriptionUseCasePort {
  abstract execute(command: CreateInscriptionCommand): Promise<{ inscription: InscriptionEntity }>;
}
