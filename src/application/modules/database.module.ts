import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserOrmEntity } from '@infrastructure/database/entities/users/user.orm-entity';
import { RoleOrmEntity } from '@infrastructure/database/entities/users/role.orm-entity';
import { RefreshTokenOrmEntity } from '@infrastructure/database/entities/auth/refresh-token.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', '2004'),
        database: configService.get<string>('DB_DATABASE', 'lms_db'),
        entities: [UserOrmEntity, RoleOrmEntity, RefreshTokenOrmEntity],
        synchronize: true, // Only for dev, change to false later
      }),
    }),
    TypeOrmModule.forFeature([
      UserOrmEntity,
      RoleOrmEntity,
      RefreshTokenOrmEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
