import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';

import { HttpExceptionFilter, ResponseInterceptor } from './infrastructure';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 8080;



  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.enableCors({
    // // origin: 'http://localhost:4034',
    // origin: 'https://heaven-chat-fe.vercel.app',
    origin: '*',

    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Accept,x-api-key,x-client-id,authorization',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor(new Reflector()));

  await app.listen(port, '0.0.0.0');
}
bootstrap();
