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
import { CreateCalendarDto } from 'src/dtos/calendar.dto';
import { title } from 'process';
import { CloudinaryService } from 'src/cloudinary/cloudinary,service';
import { CreateSeasonalPriceDto } from 'src/dtos/seasonal-price.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService, private readonly cloudinaryService: CloudinaryService) {}

@Post()
@UseGuards(JwtAuthGuard)
async create(@Body() body: any) {
  const urls = body.images || [];

  const propertyData = {
    title: body.title,
    title_en: body.title_en,
    subtitle: body.subtitle ?? '',
    subtitle_en: body.subtitle_en ?? '',
    location: body.location,
    latitude: body.latitude ? Number(body.latitude) : undefined,
    longitude: body.longitude ? Number(body.longitude) : undefined,
    price: Number(body.price),
    description: body.description ?? '',
    description_en: body.description_en ?? '',
    country: body.country,
    images: urls,
    available: true,
    order: body.order ?? 0,
  };

  if (!propertyData.latitude || !propertyData.longitude) {
    const { lat, lng } = await this.propertiesService.geocodeAddress(propertyData.location);
    propertyData.latitude = lat;
    propertyData.longitude = lng;
  }

  return this.propertiesService.create(propertyData);
}

 @Patch(':id/replace-image/:index')
@UseGuards(JwtAuthGuard)
async replaceImage(
  @Param('id', ParseIntPipe) id: number,
  @Param('index', ParseIntPipe) index: number,
  @Body() body: { image: string }, 
) {
  if (!body.image) {
    throw new HttpException('Debe enviar una URL de imagen', HttpStatus.BAD_REQUEST);
  }

  return this.propertiesService.replaceImage(id, index, body.image);
}


  @Patch(':id/add-images')
  @UseGuards(JwtAuthGuard)
  async addImages(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { images: string[] },
  ) {
    if (!Array.isArray(body.images)) {
      throw new HttpException('Debe enviar un array de imágenes', HttpStatus.BAD_REQUEST);
    }

    return this.propertiesService.addImages(id, body.images);
  }

  
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    if ((!body.latitude || !body.longitude) && body.location) {
      const { lat, lng } = await this.propertiesService.geocodeAddress(body.location);
      body.latitude = lat;
      body.longitude = lng;
  }
    
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
  
  @Post(':id/seasonal-prices')
@UseGuards(JwtAuthGuard)
addSeasonalPrice(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: CreateSeasonalPriceDto,
) {
  return this.propertiesService.addSeasonalPrice(id, dto);
}

@Get(':id/seasonal-prices')
getSeasonalPrices(@Param('id', ParseIntPipe) id: number) {
  return this.propertiesService.getSeasonalPrices(id);
}

@Delete(':propertyId/seasonal-prices/:priceId')
@UseGuards(JwtAuthGuard)
deleteSeasonalPrice(@Param('priceId', ParseIntPipe) priceId: number) {
  return this.propertiesService.deleteSeasonalPrice(priceId);
}

@Put(':propertyId/seasonal-prices/:priceId')
@UseGuards(JwtAuthGuard)
updateSeasonalPrice(
  @Param('priceId', ParseIntPipe) priceId: number,
  @Body() dto: CreateSeasonalPriceDto
) {
  return this.propertiesService.updateSeasonalPrice(priceId, dto);
}

}
