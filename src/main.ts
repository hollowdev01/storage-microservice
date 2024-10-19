import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { config } from './config/envs.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(Logger));

  await app.listen(config.PORT);
  console.log(`Application is running on port ${config.PORT}`);
}
bootstrap();
