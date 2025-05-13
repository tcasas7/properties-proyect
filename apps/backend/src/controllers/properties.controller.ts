import {
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  Body,
  Patch,
  ParseIntPipe,
  UseGuards,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { PropertiesService } from '../services/properties.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guar';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + extname(file.originalname));
      },
    }),
  }))

  async create(
    @Body() body: any,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    const imagePaths = files.images?.map(file => `/uploads/${file.filename}`) || [];
    const propertyData = {
      title: body.title,
      location: body.location,
      price: parseFloat(body.price),
      description: body.description ?? '',
      country: body.country, 
      images: imagePaths,
      available: true,
    };
    return this.propertiesService.create(propertyData);
  }

  @Patch(':id/replace-image/:index')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }], {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + extname(file.originalname));
      },
    }),
  }))

  async replaceImage(
    @Param('id', ParseIntPipe) id: number,
    @Param('index', ParseIntPipe) index: number,
    @UploadedFiles() files: { image?: Express.Multer.File[] },
  ) {
    const imagePath = `/uploads/${files.image?.[0].filename}`;
    return this.propertiesService.replaceImage(id, index, imagePath);
  }

  @Patch(':id/add-images')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + extname(file.originalname));
      },
    }),
  }))
  async addImages(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    const paths = files.images?.map(file => `/uploads/${file.filename}`) || [];
    return this.propertiesService.addImages(id, paths);
  }

  
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.propertiesService.update(id, body);
  }

  @Get()
  async findAll() {
    return this.propertiesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.propertiesService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.propertiesService.remove(id);
  }
}
