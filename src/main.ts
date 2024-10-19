import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { config } from './config/envs.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(Logger));

  app.enableCors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    origin: '*',
  });

  const doc = new DocumentBuilder()
    .setTitle('Images API')
    .setDescription('API for managing images')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, doc);
  SwaggerModule.setup('api', app, document);

  await app.listen(config.PORT);
  console.log(`Application is running on port ${config.PORT}`);
}
bootstrap();
