import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropertyDto } from '../dtos/property.dto';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePropertyDto) {

    const last = await this.prisma.property.findFirst({
      orderBy: { order: 'desc' },
    });

    const newOrder = last ? last.order + 1 : 0;

    return this.prisma.property.create({
      data: {
        title: data.title,
        title_en: data.title_en ?? '',
        subtitle: data.subtitle ?? "",
        subtitle_en: data.subtitle_en ?? '',
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        images: data.images,
        price: data.price,
        description: data.description ?? "",
        description_en: data.description_en ?? '',
        country: data.country,
        available: data.available ?? true,
        order: newOrder, 
      },
    });
  }

  async update(id: number, data: Partial<CreatePropertyDto>) {
  return this.prisma.property.update({
    where: { id },
    data: {
      title: data.title,
      title_en: data.title_en ?? '',
      subtitle: data.subtitle ?? "",
      subtitle_en: data.subtitle_en ?? '',
      location: data.location,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      price: data.price,
      description: data.description ?? "",
      description_en: data.description_en ?? '',
      available: data.available,
      order: data.order,
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

  async geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'MiProyectoPropiedades/1.0 (tomas.casas7@hotmail.com)', 
    },
  });
  const data = await res.json();
  if (data.length === 0) {
    throw new Error('No se pudo geocodificar la dirección');
  }
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
}

}
