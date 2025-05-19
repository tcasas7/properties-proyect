import { IsString, IsEmail, IsInt, IsDateString, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  propertyId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber()
  totalPrice: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;
}