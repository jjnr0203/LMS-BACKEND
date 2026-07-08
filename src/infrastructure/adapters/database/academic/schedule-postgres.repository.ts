import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleRepositoryPort } from '../../../../domain/ports/outbound/academic/schedule-repository.port';
import { ScheduleOrmEntity } from '../../../database/entities/academic/schedule.orm-entity';
import { ScheduleEntity } from '../../../../domain/entities/academic/schedule.entity';

@Injectable()
export class SchedulePostgresRepository implements ScheduleRepositoryPort {
  constructor(
    @InjectRepository(ScheduleOrmEntity)
    private readonly repository: Repository<ScheduleOrmEntity>,
  ) {}

  async findByTeacherSubject(teacherSubjectId: string): Promise<ScheduleEntity[]> {
    const ormEntities = await this.repository.find({
      where: { teacherSubjectId },
    });
    return ormEntities.map((orm) => this.toDomain(orm));
  }

  async saveMultiple(schedules: ScheduleEntity[]): Promise<void> {
    const ormEntities = schedules.map((s) => this.toOrm(s));
    await this.repository.save(ormEntities);
  }

  async deleteByTeacherSubject(teacherSubjectId: string): Promise<void> {
    await this.repository.delete({ teacherSubjectId });
  }

  private toDomain(orm: ScheduleOrmEntity): ScheduleEntity {
    const entity = new ScheduleEntity();
    entity.id = orm.id;
    entity.teacherSubjectId = orm.teacherSubjectId;
    entity.dayOfWeek = orm.dayOfWeek;
    entity.startTime = orm.startTime;
    entity.endTime = orm.endTime;
    return entity;
  }

  private toOrm(entity: ScheduleEntity): ScheduleOrmEntity {
    const orm = new ScheduleOrmEntity();
    if (entity.id) {
      orm.id = entity.id;
    }
    orm.teacherSubjectId = entity.teacherSubjectId;
    orm.dayOfWeek = entity.dayOfWeek;
    orm.startTime = entity.startTime;
    orm.endTime = entity.endTime;
    return orm;
  }
}
