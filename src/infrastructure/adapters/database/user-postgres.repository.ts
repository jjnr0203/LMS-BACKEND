import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, In } from 'typeorm';
import { UserRepositoryPort } from '@domain/ports/outbound/users/user-repository.port';
import { UserEntity } from '@domain/entities/users/user.entity';
import { UserOrmEntity } from '../../database/entities/users/user.orm-entity';

@Injectable()
export class UserPostgresRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  async findById(id: string): Promise<UserEntity | null> {
    const ormEntity = await this.repository.findOne({
      where: { id },
      withDeleted: true,
      relations: ['role'],
    });
    return ormEntity ? UserOrmEntity.toDomain(ormEntity) : null;
  }

  async findByIds(ids: string[]): Promise<UserEntity[]> {
    if (!ids || ids.length === 0) return [];

    const ormEntities = await this.repository.find({
      where: { id: In(ids) },
      withDeleted: true,
      relations: ['role'],
    });
    return ormEntities.map((e) => UserOrmEntity.toDomain(e));
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const ormEntity = await this.repository.findOne({
      where: { email },
      withDeleted: true,
      relations: ['role'],
    });
    return ormEntity ? UserOrmEntity.toDomain(ormEntity) : null;
  }

  async save(user: UserEntity): Promise<UserEntity> {
    const ormEntity = UserOrmEntity.fromDomain(user);
    const saved = await this.repository.save(ormEntity);
    return UserOrmEntity.toDomain(saved);
  }

  async findPaginated(
    page: number,
    limit: number,
    role?: string | string[],
    search?: string,
  ): Promise<{ data: UserEntity[]; total: number }> {
    let searchCondition = '';
    const params: any[] = [];

    if (search) {
      searchCondition = ` AND (
        u.id ILIKE $1 OR 
        u.first_name ILIKE $1 OR 
        u.last_name ILIKE $1 OR 
        u.email ILIKE $1
      )`;
      params.push(`%${search}%`);
    }

    const usersQuery = `
      SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.birth_date, u.is_active, u.created_at, r.name as role_name, r.id as role_id, u.avatar_url, u.updated_at, u.requires_password_change, u.address, u.linkedin_url, u.cv_url, u.certificates
      FROM users u 
      INNER JOIN roles r ON u.role_id = r.id 
      WHERE u.deleted_at IS NULL ${searchCondition}
    `;
    const teachersQuery = `
      SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.birth_date, u.is_active, u.created_at, 'teacher' as role_name, NULL as role_id, u.avatar_url, u.updated_at, false as requires_password_change, u.address, u.linkedin_url, u.cv_url, u.certificates
      FROM teachers u
      WHERE u.deleted_at IS NULL ${searchCondition}
    `;
    const studentsQuery = `
      SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.birth_date, u.is_active, u.created_at, 'student' as role_name, NULL as role_id, u.avatar_url, u.updated_at, false as requires_password_change, u.address, u.linkedin_url, u.cv_url, u.certificates
      FROM students u
      WHERE u.deleted_at IS NULL ${searchCondition}
    `;

    const unionQuery = `
      ${usersQuery}
      UNION ALL
      ${teachersQuery}
      UNION ALL
      ${studentsQuery}
    `;

    let finalQuery = `SELECT * FROM (${unionQuery}) as q`;

    const whereClauses: string[] = [];

    // Filter by role
    if (role) {
      const rolesArray = Array.isArray(role) ? role : [role];
      const roleParams = rolesArray.map((_, i) => `$${params.length + i + 1}`);
      const roleCondition = `q.role_name IN (${roleParams.join(', ')})`;
      params.push(...rolesArray);
      whereClauses.push(roleCondition);
    }

    if (whereClauses.length > 0) {
      finalQuery += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    const offset = (page - 1) * limit;
    const paginatedQuery = `
      ${finalQuery}
      ORDER BY created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const countQuery = `SELECT COUNT(*) as total FROM (${finalQuery}) as counted_q`;

    const [rawData, countResult] = await Promise.all([
      this.repository.query(paginatedQuery, [...params, limit, offset]),
      this.repository.query(countQuery, params),
    ]);

    const data = rawData.map(
      (row: any) =>
        new UserEntity(
          row.id,
          row.first_name,
          row.last_name,
          row.email,
          '',
          row.role_id,
          row.is_active,
          row.birth_date,
          row.phone,
          row.avatar_url,
          row.created_at,
          row.updated_at,
          undefined,
          row.role_name,
          row.requires_password_change,
          row.address,
          row.linkedin_url,
          row.cv_url,
          row.certificates,
        ),
    );

    return { data, total: parseInt(countResult[0].total, 10) };
  }

  async softDelete(id: string): Promise<void> {
    const entity = await this.repository.findOne({ where: { id: id as any } }); if (entity) { await this.repository.softRemove(entity); } else { await this.repository.softDelete(id); }
  }

  async getCountsByRole(): Promise<Record<string, number>> {
    const counts = await this.repository
      .createQueryBuilder('user')
      .innerJoin('user.role', 'role')
      .where('user.deletedAt IS NULL')
      .select('role.name', 'roleName')
      .addSelect('COUNT(user.id)', 'count')
      .groupBy('role.name')
      .getRawMany();

    const result: Record<string, number> = {};
    for (const row of counts) {
      result[row.roleName] = parseInt(row.count, 10);
    }
    return result;
  }

  async findByResetToken(tokenHash: string): Promise<UserEntity | null> {
    const ormEntity = await this.repository.findOne({
      where: { resetPasswordToken: tokenHash },
      withDeleted: true,
      relations: ['role'],
    });
    return ormEntity ? UserOrmEntity.toDomain(ormEntity) : null;
  }
}

