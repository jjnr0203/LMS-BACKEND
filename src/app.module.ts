import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './application/modules/auth.module';
import { UsersModule } from './application/modules/users.module';
import { AdminModule } from './application/modules/admin.module';
import { CoordinatorModule } from './application/modules/coordinator.module';
import { TreasuryModule } from './application/modules/treasury.module';
import { TeacherModule } from './application/modules/teacher.module';
import { SecretaryModule } from './application/modules/secretary.module';
import { DatabaseModule } from './application/modules/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    AdminModule,
    CoordinatorModule,
    TreasuryModule,
    TeacherModule,
    SecretaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
