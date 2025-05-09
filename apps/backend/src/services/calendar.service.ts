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

  async remove(id: number) {
    return this.prisma.calendar.delete({
      where: { id },
    });
  }
}
