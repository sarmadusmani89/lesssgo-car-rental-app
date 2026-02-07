import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.enableCors();

  // Configure body parser to preserve rawBody while maintaining size limits
  app.use(json({
    limit: '50mb',
    verify: (req: any, res, buf) => {
      if (req.url && req.url.includes('/payment/webhook')) {
        req.rawBody = buf;
      }
    }
  }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
