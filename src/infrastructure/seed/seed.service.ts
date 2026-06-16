import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleOrmEntity } from '../database/entities/users/role.orm-entity';
import { UserOrmEntity } from '../database/entities/users/user.orm-entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(RoleOrmEntity)
    private readonly roleRepository: Repository<RoleOrmEntity>,
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seedRoles();
    await this.seedAdmin();
  }

  private async seedRoles(): Promise<void> {
    const count = await this.roleRepository.count();
    if (count > 0) {
      this.logger.log('Roles ya existen, saltando seed de roles');
      return;
    }

    const roles = [
      { id: 'a0000000-0000-0000-0000-000000000001', name: 'admin', description: 'Administrador del sistema' },
      { id: 'a0000000-0000-0000-0000-000000000002', name: 'coordinador', description: 'Coordinador de carrera' },
      { id: 'a0000000-0000-0000-0000-000000000003', name: 'tesoreria', description: 'Personal de tesorería' },
      { id: 'a0000000-0000-0000-0000-000000000004', name: 'docente', description: 'Docente/Profesor' },
      { id: 'a0000000-0000-0000-0000-000000000005', name: 'estudiante', description: 'Estudiante' },
    ];

    for (const role of roles) {
      const orm = new RoleOrmEntity();
      orm.id = role.id;
      orm.name = role.name;
      orm.description = role.description;
      await this.roleRepository.save(orm);
    }

    this.logger.log('Roles creados exitosamente');
  }

  private async seedAdmin(): Promise<void> {
    const admin = await this.userRepository.findOne({ where: { id: '0000000000' } });
    if (admin) {
      this.logger.log('Admin ya existe, saltando seed de admin');
      return;
    }

    const role = await this.roleRepository.findOne({ where: { name: 'admin' } });
    if (!role) {
      this.logger.error('Rol admin no encontrado, no se puede crear admin');
      return;
    }

    const passwordHash = await bcrypt.hash('Admin123!', 10);

    const orm = new UserOrmEntity();
    orm.id = '0000000000';
    orm.firstName = 'Admin';
    orm.lastName = 'Sistema';
    orm.email = 'admin@lms.com';
    orm.password = passwordHash;
    orm.roleId = role.id;
    orm.isActive = true;
    await this.userRepository.save(orm);

    this.logger.log('Usuario admin creado — email: admin@lms.com / password: Admin123!');
  }
}
