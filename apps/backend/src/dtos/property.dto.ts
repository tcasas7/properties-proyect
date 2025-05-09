import { IsString, IsArray, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  title: string;

  @IsString()
  location: string;

  @IsArray()
  images: string[];

  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @IsNumber()
  price: number;
}

