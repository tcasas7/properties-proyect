import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCalendarDto } from '../dtos/calendar.dto';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCalendarDto) {
    return this.prisma.calendar.create({
      data,
    });
  }

  async findAllByProperty(propertyId: number) {
    return this.prisma.calendar.findMany({
      where: { propertyId },
      orderBy: { date: 'asc' },
    });
  }

  async remove(id: string) {
    return this.prisma.calendar.delete({
      where: { id },
    });
  }

async removeByDate(propertyId: number, date: string) {
  const record = await this.prisma.calendar.findFirst({
    where: {
      propertyId,
      date: {
        gte: new Date(`${date}T00:00:00.000Z`),
        lt: new Date(`${date}T23:59:59.999Z`),
      },
    },
  });

  if (!record) {
    throw new Error('Registro no encontrado');
  }

  return this.prisma.calendar.delete({
    where: { id: record.id },
  });
}


}
