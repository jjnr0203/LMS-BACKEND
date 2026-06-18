import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokenRepositoryPort } from '@domain/ports/outbound/auth/refresh-token-repository.port';
import { RefreshTokenEntity } from '@domain/entities/auth/refresh-token.entity';
import { RefreshTokenOrmEntity } from '../../database/entities/auth/refresh-token.orm-entity';

@Injectable()
export class RefreshTokenPostgresRepository implements RefreshTokenRepositoryPort {
  constructor(
    @InjectRepository(RefreshTokenOrmEntity)
    private readonly repository: Repository<RefreshTokenOrmEntity>,
  ) {}

  async save(token: RefreshTokenEntity): Promise<RefreshTokenEntity> {
    const ormEntity = RefreshTokenOrmEntity.fromDomain(token);
    const saved = await this.repository.save(ormEntity);
    return RefreshTokenOrmEntity.toDomain(saved);
  }

  async findByToken(token: string): Promise<RefreshTokenEntity | null> {
    const ormEntity = await this.repository.findOne({ where: { token } });
    return ormEntity ? RefreshTokenOrmEntity.toDomain(ormEntity) : null;
  }

  async revoke(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.repository.delete({ userId });
  }

  async hasActiveSession(userId: string): Promise<boolean> {
    const count = await this.repository.count({ where: { userId } });
    return count > 0;
  }
}
