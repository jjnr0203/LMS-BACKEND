import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/auth/guards/roles.guard';
import { Roles } from '@infrastructure/auth/decorators/roles.decorator';
import { DataSource } from 'typeorm';

@Controller('admin/backups')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class BackupController {
  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  @Get('download')
  async downloadBackup(@Res() res: any) {
    try {
      res.setHeader('Content-Type', 'application/sql');
      res.setHeader('Content-Disposition', 'attachment; filename=backup.sql');

      let sqlDump = `-- Respaldo de Base de Datos\n-- Generado el: ${new Date().toISOString()}\n\nBEGIN;\n\n`;

      const orderedTableNames = [
        'roles',
        'faculties',
        'modalities',
        'academic_shifts',
        'academic_terms',
        'institution_config',
        'users',
        'teachers',
        'teacher_faculties',
        'students',
        'careers',
        'career_modalities',
        'career_jornadas',
        'curriculums',
        'subjects',
        'career_subjects',
        'coordinator_subject_colors',
        'teacher_subjects',
        'schedules',
        'tuitions',
        'inscriptions',
        'enrollment_details',
        'enrollment_subjects',
        'certificates',
        'audit_logs',
        'refresh_tokens',
        'semester_colors'
      ];

      const queryRunner = this.dataSource.createQueryRunner();
      const dbTables = await queryRunner.query(
        `SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'`
      );
      
      const dbTableNames = dbTables.map((t: any) => t.tablename);
      
      // Filter existing tables in exact requested order
      const tablesToExport = orderedTableNames.filter(t => dbTableNames.includes(t));
      // Append any other table that exists in DB but not in our explicit order (just in case)
      const remainingTables = dbTableNames.filter((t: string) => !orderedTableNames.includes(t));
      
      const allTables = [...tablesToExport, ...remainingTables];

      for (const tableName of allTables) {
        const rows = await queryRunner.query(`SELECT * FROM "${tableName}"`);
        
        if (rows.length > 0) {
          sqlDump += `-- Datos para la tabla ${tableName}\n`;
          for (const row of rows) {
            const columns = Object.keys(row).map(c => `"${c}"`).join(', ');
            const values = Object.values(row).map(v => {
              if (v === null) return 'NULL';
              if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
              if (v instanceof Date) return `'${v.toISOString()}'`;
              if (typeof v === 'object') return `'${JSON.stringify(v).replace(/'/g, "''")}'`;
              return v;
            }).join(', ');
            sqlDump += `INSERT INTO "${tableName}" (${columns}) VALUES (${values});\n`;
          }
          sqlDump += '\n';
        }
      }

      sqlDump += `COMMIT;\n`;

      await queryRunner.release();
      res.send(sqlDump);
    } catch (error) {
      console.error('Backup error:', error);
      if (!res.headersSent) {
        res.status(500).send('Backup failed');
      }
    }
  }
}
