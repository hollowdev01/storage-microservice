import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { imageFilter } from '../../utils/image-filters';
import { FilterImages } from './dtos/filter-images.dto';
import { GetUser } from '../../shared/decorators/get-user.decorator';
//import { AuthGuard } from '@nestjs/passport';

@Controller('images')
//@UseGuards(AuthGuard('jwt'))
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      fileFilter: imageFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadImage(
    @UploadedFiles() images: Express.Multer.File[],
    @GetUser() user: any,
  ) {
    return await this.imagesService.upload(images, user.id);
  }

  @Get()
  async findAllImages(@Query() filters: FilterImages) {
    return await this.imagesService.findAllImages(filters);
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.imagesService.findById(id);
  }

  @Delete(':id')
  async deletedImage(@Param('id', ParseUUIDPipe) id: string) {
    return await this.imagesService.deletedImage(id);
  }
}
