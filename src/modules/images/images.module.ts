import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { StorageModule } from '../storage/storage.module';
import { Thumbnail } from './entity/thumbnail.entity';
import { LogsService } from '../../shared/context/logger.service';
import { Image } from './entity/image.entity';
import { CacheService } from '../../shared/context/cache.service';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, LogsService, CacheService],
  imports: [StorageModule, TypeOrmModule.forFeature([Image, Thumbnail])],
})
export class ImagesModule {}
