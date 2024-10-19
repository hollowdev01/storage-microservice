import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Image } from './entity/image.entity';
import { StorageService } from '../storage/storage.service';
import { FilterImages } from './dtos/filter-images.dto';
import * as sharp from 'sharp';
import { Thumbnail } from './entity/thumbnail.entity';
import { TypeThumbnail } from '../../interface/type-thumbnail';
import { CacheService } from '../../shared/context/cache.service';
import { LogsService } from '../../shared/context/logger.service';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    @InjectRepository(Thumbnail)
    private thumbnailRepository: Repository<Thumbnail>,
    private storageService: StorageService,
    private cacheService: CacheService,
    private logsService: LogsService,
  ) {}

  private readonly TLL_CACHE = 600; // 10 min

  async upload(images: Express.Multer.File[], userId: string) {
    const uploadedImages = [];

    for (const image of images) {
      const fileName = `${image.originalname}-${Date.now()}`;

      // Subir imagen principal
      const url = await this.storageService.uploadImageToStorage(
        image.buffer,
        fileName,
        image.mimetype,
      );

      this.logsService.logInfo(
        `Uploaded image: ${fileName} by user: ${userId}`,
      );
      const thumbnailUrls =
        await this.handleMultipleThumbnailsGenerationAndUpload(
          image,
          fileName,
          image.mimetype,
        );

      const imageEntity = this.imageRepository.create({
        fileName,
        url,
        size: image.size,
        uploadedBy: userId,
      });

      const savedImage = await this.imageRepository.save(imageEntity);

      for (const [url, fileName, type] of thumbnailUrls) {
        const thumbnailEntity = this.thumbnailRepository.create({
          url,
          type,
          fileName,
          file: savedImage,
        });
        await this.thumbnailRepository.save(thumbnailEntity);
      }

      uploadedImages.push(savedImage);
    }

    return uploadedImages;
  }

  async findAllImages({ allData, skip = 0, take = 10 }: FilterImages) {
    try {
      const cacheKey = `images:${skip}:${take}`;
      const cachedData = await this.cacheService.get(cacheKey);

      if (cachedData) {
        this.logsService.logInfo(`Cache hit for key: ${cacheKey}`);
        return cachedData;
      }
      this.logsService.logWarn(`Cache miss for key: ${cacheKey}`);
      const where: FindManyOptions = {};

      if (skip) where.skip = skip;
      if (take) where.take = take;
      if (allData) delete where.take;

      const [data = [], total = 0] = await this.imageRepository.findAndCount({
        take: 0,
        skip: 0,
        relations: {
          thumbnails: true,
        },
      });

      await this.cacheService.set(cacheKey, data, this.TLL_CACHE);
      this.logsService.logInfo(`Cached images for key: ${cacheKey}`);

      return {
        total,
        data,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async findById(id: string) {
    const cacheKey = `image:${id}`;

    const cachedImage = await this.cacheService.get(cacheKey);

    if (cachedImage) {
      this.logsService.logInfo(`Cache hit for image ID: ${id}`);
      return cachedImage;
    }
    this.logsService.logWarn(`Cache miss for image ID: ${id}`);

    const image = await this.imageRepository.findOne({
      where: {
        id,
      },
    });

    if (!image) {
      this.logsService.logError(`Image not found: ${id}`);
      throw new NotFoundException('Image not found');
    }
    await this.cacheService.set(cacheKey, image, this.TLL_CACHE);
    this.logsService.logInfo(`Cached image ID: ${id}`);
    return image;
  }

  async deletedImage(id: string) {
    const image = await this.imageRepository.findOne({
      where: {
        id,
      },
    });

    if (!image) {
      this.logsService.logError(`Image not found for deletion: ${id}`);
      throw new NotFoundException('Image not found');
    }

    await this.cacheService.del(`image:${id}`);
    await this.cacheService.del(`images:*`);
    this.logsService.logInfo(`Deleted image ID: ${id} and cleared cache`);

    this.storageService.deletedImageToStorage(image.fileName);

    for (const thumbnail of image.thumbnails) {
      await this.storageService.deletedImageToStorage(thumbnail.fileName);
    }

    return this.imageRepository.delete(image.id);
  }

  async generateThumbnail(
    file: Express.Multer.File,
    resize: number,
  ): Promise<Buffer> {
    return await sharp(file.buffer).resize(resize).toBuffer();
  }

  private async handleMultipleThumbnailsGenerationAndUpload(
    file: Express.Multer.File,
    originalFileName: string,
    mimetype: string,
  ): Promise<[string, string, TypeThumbnail][]> {
    const thumbnailSizes = [
      { size: 200, type: TypeThumbnail.SMALL },
      { size: 400, type: TypeThumbnail.MEDIUM },
      { size: 800, type: TypeThumbnail.LARGE },
    ];

    const thumbnailPromises = thumbnailSizes.map(async ({ size, type }) => {
      const bufferThumbnail = await this.generateThumbnail(file, size);
      const thumbnailFileName = `${type.toLowerCase()}-thumbnail-${originalFileName}-${Date.now()}`;
      const url = await this.storageService.uploadImageToStorage(
        bufferThumbnail,
        thumbnailFileName,
        mimetype,
      );
      this.logsService.logInfo(
        `Uploaded thumbnail: ${type} for image: ${thumbnailFileName}`,
      );
      return [url, thumbnailFileName, type] as [string, string, TypeThumbnail];
    });

    return await Promise.all(thumbnailPromises);
  }
}
