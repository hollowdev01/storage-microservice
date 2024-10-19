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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

import { ImagesService } from './images.service';
import { imageFilter } from '../../utils/image-filters';
import { FilterImages } from './dtos/filter-images.dto';
import { GetUser } from '../../shared/decorators/get-user.decorator';
//import { AuthGuard } from '@nestjs/passport';
import { ApiUploadBullImages } from '../../shared/decorators/swagger-file.decorator';

@Controller('images')
@ApiTags('Images')
//@UseGuards(AuthGuard('jwt'))
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @ApiUploadBullImages()
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
  @ApiOperation({
    summary: 'Retrieve all images',
    description: 'Get a list of all images with optional filters.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved list of images.',
  })
  async findAllImages(@Query() filters: FilterImages) {
    return await this.imagesService.findAllImages(filters);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve image by ID',
    description: 'Get the details of a specific image by its ID.',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the image.', type: String })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved image details.',
  })
  @ApiResponse({ status: 404, description: 'Image not found.' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.imagesService.findById(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete image',
    description: 'Delete an image by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the image to delete.',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Image successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Image not found.' })
  async deletedImage(@Param('id', ParseUUIDPipe) id: string) {
    return await this.imagesService.deletedImage(id);
  }
}
