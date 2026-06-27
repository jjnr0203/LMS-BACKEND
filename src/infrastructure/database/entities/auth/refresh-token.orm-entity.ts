import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { RefreshTokenEntity } from '@domain/entities/auth/refresh-token.entity';
import { UserOrmEntity } from '../users/user.orm-entity';

@Entity('refresh_tokens')
export class RefreshTokenOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 500 })
  token: string;

  @Index()
  @Column({ type: 'varchar', length: 20, name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;

  @Column({ type: 'boolean', name: 'is_revoked', default: false })
  isRevoked: boolean;

  @Column({ type: 'timestamp', name: 'expires_at' })
  expiresAt: Date;

  static toDomain(ormEntity: RefreshTokenOrmEntity): RefreshTokenEntity {
    return new RefreshTokenEntity(
      ormEntity.id,
      ormEntity.token,
      ormEntity.userId,
      ormEntity.expiresAt,
      ormEntity.isRevoked,
    );
  }

  static fromDomain(entity: RefreshTokenEntity): RefreshTokenOrmEntity {
    const orm = new RefreshTokenOrmEntity();
    orm.id = entity.id;
    orm.token = entity.token;
    orm.userId = entity.userId;
    orm.expiresAt = entity.expiresAt;
    orm.isRevoked = entity.isRevoked;
    return orm;
  }
}
