import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('semester_colors')
export class SemesterColorOrmEntity {
  @PrimaryColumn({ type: 'int' })
  semester: number;

  @Column({ type: 'varchar', length: 50, default: 'info' })
  color: string;
}
