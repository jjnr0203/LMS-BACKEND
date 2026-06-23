import { Client } from 'pg';

async function run() {
  const client = new Client({
    host: 'ep-lingering-snow-ai8jyox4-pooler.c-4.us-east-1.aws.neon.tech',
    port: 5432,
    user: 'neondb_owner',
    password: 'npg_xV7zqZn0Wevm',
    database: 'neondb',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    // Add description to modalities
    await client.query(`ALTER TABLE modalities ADD COLUMN IF NOT EXISTS description text;`);
    console.log('Added description to modalities');

    // Make modality_id in careers optional
    await client.query(`ALTER TABLE careers ALTER COLUMN modality_id DROP NOT NULL;`);
    console.log('Made modality_id nullable in careers');

    // Rename coordinator_id to teacher_id in subjects and make it optional
    await client.query(`ALTER TABLE subjects RENAME COLUMN coordinator_id TO teacher_id;`);
    console.log('Renamed coordinator_id to teacher_id in subjects');
    
    await client.query(`ALTER TABLE subjects ALTER COLUMN teacher_id DROP NOT NULL;`);
    console.log('Made teacher_id nullable in subjects');

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

run();
