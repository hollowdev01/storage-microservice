import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { config } from './config/envs.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(Logger));

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
