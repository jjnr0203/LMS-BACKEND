import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitutionConfigOrmEntity } from '@infrastructure/database/entities/institution/institution-config.orm-entity';
import { InstitutionConfigPostgresRepository } from '@infrastructure/adapters/database/repositories/institution/institution-config-postgres.repository';
import { ManageInstitutionConfigUseCase } from '@domain/services/institution/manage-institution-config.use-case';
import { InstitutionConfigController } from '../controllers/admin/institution-config.controller';
import { INSTITUTION_CONFIG_REPOSITORY } from '@domain/ports/outbound/institution/institution-config-repository.port';
import { RepositoryProvidersModule } from './repository-providers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InstitutionConfigOrmEntity]),
    RepositoryProvidersModule,
  ],
  controllers: [InstitutionConfigController],
  providers: [
    {
      provide: INSTITUTION_CONFIG_REPOSITORY,
      useClass: InstitutionConfigPostgresRepository,
    },
    {
      provide: ManageInstitutionConfigUseCase,
      useFactory: (repo: InstitutionConfigPostgresRepository) =>
        new ManageInstitutionConfigUseCase(repo),
      inject: [INSTITUTION_CONFIG_REPOSITORY],
    },
  ],
  exports: [ManageInstitutionConfigUseCase],
})
export class InstitutionModule {}
