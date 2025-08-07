import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from '../dtos/booking.dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

async create(dto: CreateBookingDto) {
  const days: Date[] = [];
  let current = new Date(dto.startDate);
  const end = new Date(dto.endDate);

  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const seasonalPrices = await this.prisma.seasonalPrice.findMany({
    where: {
      propertyId: dto.propertyId,
      OR: days.map(date => ({
        startDate: { lte: date },
        endDate: { gte: date },
      })),
    },
  });

  const property = await this.prisma.property.findUnique({
    where: { id: dto.propertyId },
  });

  if (!property) throw new Error('Propiedad no encontrada');

  let total = 0;
  for (const day of days) {
    const seasonal = seasonalPrices.find(p =>
      new Date(p.startDate) <= day && new Date(p.endDate) >= day
    );
    total += seasonal?.price || property.price;
  }

  return this.prisma.booking.create({
    data: {
      ...dto,
      totalPrice: total,
    },
  });
}

}
