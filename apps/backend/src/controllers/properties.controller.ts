import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Body,
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
    try {
      const imagePaths = files.images?.map(file => `/uploads/${file.filename}`) || [];

      const propertyData = {
        title: body.title,
        location: body.location,
        price: parseFloat(body.price),
        images: imagePaths,
        available: true,
      };

      return await this.propertiesService.create(propertyData);
    } catch (error) {
      console.error('Error al crear propiedad:', error);
      throw new HttpException('No se pudo crear la propiedad', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    return await this.propertiesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.propertiesService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.propertiesService.remove(id);
  }
}