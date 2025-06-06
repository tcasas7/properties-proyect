import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { CalendarService } from '../services/calendar.service';
import { CreateCalendarDto } from '../dtos/calendar.dto';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  create(@Body() createCalendarDto: CreateCalendarDto) {
    return this.calendarService.create(createCalendarDto);
  }

  @Get(':propertyId')
  findAll(@Param('propertyId', ParseIntPipe) propertyId: number) {
    return this.calendarService.findAllByProperty(propertyId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string) {
    return this.calendarService.remove(id);
  }

  @Delete(':propertyId/:date')
  removeByDate(
  @Param('propertyId', ParseIntPipe) propertyId: number,
  @Param('date') date: string
) {
  return this.calendarService.removeByDate(propertyId, date);
}

}
