import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './infrastructure/filters/all-exceptions.filter';
import { requestContext } from './infrastructure/context/request-context';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use((req: any, res: any, next: any) => {
    requestContext.run({}, () => next());
  });

  app.setGlobalPrefix('api', { exclude: ['/'] });

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  Logger.log(
    `🚀 LMS Backend running on http://localhost:${port}/api`,
    'Bootstrap',
  );
}
void bootstrap();
