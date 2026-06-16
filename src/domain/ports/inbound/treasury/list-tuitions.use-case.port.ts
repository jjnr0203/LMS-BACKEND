import { TuitionEntity } from '../../../entities/academic/tuition.entity';

export abstract class ListTuitionsUseCasePort {
  abstract execute(): Promise<{ tuitions: TuitionEntity[] }>;
}
