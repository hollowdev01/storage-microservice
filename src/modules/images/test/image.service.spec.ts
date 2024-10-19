import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../entity/image.entity';
import { ImagesService } from '../images.service';
import { Thumbnail } from '../entity/thumbnail.entity';
import { StorageService } from '../../storage/storage.service';
import { CacheService } from '../../../shared/context/cache.service';
import { LogsService } from '../../../shared/context/logger.service';
import { NotFoundException } from '@nestjs/common';

describe('ImagesService', () => {
  let service: ImagesService;
  let imageRepository: Repository<Image>;
  let cacheService: CacheService;
  let logsService: LogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImagesService,
        {
          provide: getRepositoryToken(Image),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Thumbnail),
          useClass: Repository,
        },
        {
          provide: StorageService,
          useValue: {
            uploadImageToStorage: jest.fn(),
            deletedImageToStorage: jest.fn(),
          },
        },
        {
          provide: CacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
        {
          provide: LogsService,
          useValue: {
            logInfo: jest.fn(),
            logWarn: jest.fn(),
            logError: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ImagesService>(ImagesService);
    imageRepository = module.get<Repository<Image>>(getRepositoryToken(Image));
    cacheService = module.get<CacheService>(CacheService);
    logsService = module.get<LogsService>(LogsService);
  });

  it('should return cached images if available', async () => {
    const cachedData = [
      { id: 'image1', url: 'https://example.com/image1.jpg' },
    ];
    jest.spyOn(cacheService, 'get').mockResolvedValue(cachedData);

    const result = await service.findAllImages({ skip: 0, take: 10 });

    expect(cacheService.get).toHaveBeenCalledWith('images:0:10');
    expect(result).toEqual(cachedData);
    expect(logsService.logInfo).toHaveBeenCalledWith(
      'Cache hit for key: images:0:10',
    );
  });

  it('should return images from repository if cache is missed', async () => {
    const repositoryData = [
      { id: 'image1', url: 'https://example.com/image1.jpg' },
    ];
    jest.spyOn(cacheService, 'get').mockResolvedValue(null);
    jest
      .spyOn(imageRepository, 'findAndCount')
      .mockResolvedValue([repositoryData as Image[], 1]);

    const result = await service.findAllImages({ skip: 0, take: 10 });

    expect(cacheService.get).toHaveBeenCalledWith('images:0:10');
    expect(imageRepository.findAndCount).toHaveBeenCalled();
    expect(result).toEqual({
      total: 1,
      data: repositoryData,
    });
  });

  it('should throw NotFoundException if image does not exist', async () => {
    jest.spyOn(imageRepository, 'findOne').mockResolvedValue(null);

    await expect(service.findById('nonexistent-id')).rejects.toThrow(
      NotFoundException,
    );
    expect(logsService.logError).toHaveBeenCalledWith(
      'Image not found: nonexistent-id',
    );
  });

  it('should return cached image if available', async () => {
    const cachedImage = {
      id: 'image123',
      url: 'https://example.com/image.jpg',
    };
    jest.spyOn(cacheService, 'get').mockResolvedValue(cachedImage);

    const result = await service.findById('image123');

    expect(result).toEqual(cachedImage);
    expect(logsService.logInfo).toHaveBeenCalledWith(
      'Cache hit for image ID: image123',
    );
  });
});
