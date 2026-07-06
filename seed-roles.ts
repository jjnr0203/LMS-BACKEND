import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const roles = [
  { name: 'admin', description: 'Administrador del sistema' },
  { name: 'coordinator', description: 'Coordinador académico' },
  { name: 'treasury', description: 'Personal de tesorería' },
  { name: 'teacher', description: 'Docente' },
  { name: 'student', description: 'Estudiante' },
];

async function seed() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '12345',
    database: process.env.DB_DATABASE || 'lms_db',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  try {
    await client.connect();
    for (const role of roles) {
      await client.query(
        `INSERT INTO roles (id, name, description) VALUES (gen_random_uuid(), $1, $2) ON CONFLICT (name) DO NOTHING`,
        [role.name, role.description],
      );
      console.log(`Role "${role.name}" inserted/verified`);
    }
    console.log('All roles seeded successfully');
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    await client.end();
  }
}

seed();
