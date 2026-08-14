import { TuitionEntity } from '../../../entities/academic/tuition.entity';

export abstract class GetTreasuryDashboardUseCasePort {
  abstract execute(): Promise<{ stats: any; recentTuitions: TuitionEntity[] }>;
}
