import { ListTuitionsUseCasePort } from '../../ports/inbound/treasury/list-tuitions.use-case.port';
import { TuitionRepositoryPort } from '../../ports/outbound/academic/tuition-repository.port';
import { TuitionEntity } from '../../entities/academic/tuition.entity';

export class ListTuitionsUseCase implements ListTuitionsUseCasePort {
  constructor(private readonly tuitionRepository: TuitionRepositoryPort) {}

  async execute(): Promise<{ tuitions: TuitionEntity[] }> {
    const { data } = await this.tuitionRepository.findAllWithStudent();
    return { tuitions: data };
  }
}
