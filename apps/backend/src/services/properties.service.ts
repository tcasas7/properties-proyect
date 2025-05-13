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
        description: data.description ?? "",
        country: data.country,
        available: data.available ?? true,
      },
    });
  }

  async update(id: number, data: Partial<CreatePropertyDto>) {
  return this.prisma.property.update({
    where: { id },
    data: {
      title: data.title,
      location: data.location,
      price: data.price,
      description: data.description ?? "",
      available: data.available,
      // no actualizamos imágenes en este flujo (por ahora)
    },
  });
}

  async replaceImage(id: number, index: number, newPath: string) {
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property) throw new Error('Propiedad no encontrada');

    const updatedImages = [...property.images];
    updatedImages[index] = newPath;

    return this.prisma.property.update({
      where: { id },
      data: { images: updatedImages },
    });
  }

  async addImages(id: number, newImages: string[]) {
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property) throw new Error('Propiedad no encontrada');

    return this.prisma.property.update({
      where: { id },
      data: {
        images: [...property.images, ...newImages],
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
