import { IsDateString, IsInt } from 'class-validator';

export class CreateCalendarDto {
  @IsInt()
  propertyId: number;

  @IsDateString()
  date: string;
}
