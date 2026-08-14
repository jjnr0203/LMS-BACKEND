import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log('Adding prerequisite_ids column to career_subjects...');
  
  try {
    await dataSource.query(`ALTER TABLE "career_subjects" ADD COLUMN IF NOT EXISTS "prerequisite_ids" jsonb DEFAULT '[]'::jsonb`);
    console.log('Column added successfully!');
  } catch (error) {
    console.error('Error adding column:', error);
  }

  await app.close();
}

bootstrap();
