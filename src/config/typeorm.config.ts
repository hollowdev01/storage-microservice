import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from './envs.config';
import { Image } from '../modules/images/entity/image.entity';
import { Thumbnail } from '../modules/images/entity/thumbnail.entity';

export const getTypeOrmModuleConfig = (): TypeOrmModuleOptions =>
  ({
    type: 'postgres',
    host: config.DB_HOST,
    port: config.DB_PORT,
    database: config.DB_NAME,
    username: config.DB_USER,
    password: config.DB_PASSWORD,
    entities: [Image, Thumbnail],
    //entities: [__dirname + '../**/*.entity{.ts,.js}'],
    synchronize: true,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  }) as TypeOrmModuleOptions;

export default new DataSource(getTypeOrmModuleConfig() as DataSourceOptions);
