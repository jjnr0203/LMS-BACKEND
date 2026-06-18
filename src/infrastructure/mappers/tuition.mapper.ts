import { TuitionEntity } from '@domain/entities/academic/tuition.entity';
import { TuitionOrmEntity } from '../database/entities/academic/tuition.orm-entity';

export class TuitionMapper {
  static toDomain(orm: TuitionOrmEntity): TuitionEntity {
    return new TuitionEntity(
      orm.id,
      orm.studentId,
      orm.status as TuitionEntity['status'],
      orm.paidInstallments,
    );
  }

  static toOrm(entity: TuitionEntity): TuitionOrmEntity {
    const orm = new TuitionOrmEntity();
    orm.id = entity.id;
    orm.studentId = entity.studentId;
    orm.status = entity.status;
    orm.paidInstallments = entity.paidInstallments;
    return orm;
  }
}
