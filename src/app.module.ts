import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageModule } from './modules/storage/storage.module';
import { ImagesModule } from './modules/images/images.module';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmModuleConfig } from './config/typeorm.config';
import { config } from './config/envs.config';
import { redisStore } from 'cache-manager-redis-yet';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { pinoOptions } from './config/logger.config';

@Module({
  imports: [
    //Modules
    StorageModule,
    ImagesModule,
    AuthModule,

    //ORM
    TypeOrmModule.forRoot(getTypeOrmModuleConfig()),

    //Cache
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: config.REDIS_HOST,
            port: config.REDIS_PORT,
          },
        }),
      }),
    }),

    //Logger
    LoggerModule.forRoot(pinoOptions),

    //JWT
    JwtModule.register({
      secret: config.JWT_SECRET,
      signOptions: { expiresIn: config.JWT_EXP }, // Token expiration
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
