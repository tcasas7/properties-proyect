import { IsDateString, IsNumber } from 'class-validator';

export class CreateSeasonalPriceDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber()
  price: number;
}
