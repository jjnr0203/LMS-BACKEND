import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InstitutionConfigRepositoryPort } from '@domain/ports/outbound/institution/institution-config-repository.port';
import { InstitutionConfigEntity } from '@domain/entities/institution/institution-config.entity';
import { InstitutionConfigOrmEntity } from '@infrastructure/database/entities/institution/institution-config.orm-entity';

@Injectable()
export class InstitutionConfigPostgresRepository implements InstitutionConfigRepositoryPort {
  constructor(
    @InjectRepository(InstitutionConfigOrmEntity)
    private readonly repository: Repository<InstitutionConfigOrmEntity>,
  ) {}

  private toDomain(orm: InstitutionConfigOrmEntity): InstitutionConfigEntity {
    return new InstitutionConfigEntity(
      orm.id,
      orm.name,
      orm.ruc,
      orm.slogan,
      orm.logoUrl,
      orm.address,
      orm.phone,
      orm.mobile,
      orm.email,
      orm.website,
      orm.createdAt,
      orm.updatedAt,
      orm.deletedAt,
    );
  }

  async findOne(): Promise<InstitutionConfigEntity | null> {
    const orm = await this.repository.findOne({ where: {} });
    return orm ? this.toDomain(orm) : null;
  }

  async save(
    data: Partial<InstitutionConfigEntity>,
  ): Promise<InstitutionConfigEntity> {
    // Singleton: find existing or create new
    let orm = await this.repository.findOne({ where: {} });
    if (orm) {
      Object.assign(orm, {
        name: data.name ?? orm.name,
        ruc: data.ruc ?? orm.ruc,
        slogan: data.slogan ?? orm.slogan,
        logoUrl: data.logoUrl !== undefined ? data.logoUrl : orm.logoUrl,
        address: data.address ?? orm.address,
        phone: data.phone ?? orm.phone,
        mobile: data.mobile ?? orm.mobile,
        email: data.email ?? orm.email,
        website: data.website ?? orm.website,
      });
    } else {
      orm = this.repository.create({
        name: data.name ?? '',
        ruc: data.ruc ?? null,
        slogan: data.slogan ?? null,
        logoUrl: data.logoUrl ?? null,
        address: data.address ?? null,
        phone: data.phone ?? null,
        mobile: data.mobile ?? null,
        email: data.email ?? null,
        website: data.website ?? null,
      });
    }
    const saved = await this.repository.save(orm);
    return this.toDomain(saved);
  }
}
