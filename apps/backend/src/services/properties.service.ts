import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropertyDto } from '../dtos/property.dto';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePropertyDto) {
    return this.prisma.property.create({
      data: {
        title: data.title,
        location: data.location,
        images: data.images,
        price: data.price,
        available: data.available ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.property.findMany();
  }

  async findOne(id: number) {
    return this.prisma.property.findUnique({
      where: { id },
    });
  }

  async remove(id: number) {
    return this.prisma.property.delete({
      where: { id },
    });
  }
}
