import { IsString, IsArray, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsString()
  location: string;

  @IsArray()
  images: string[];

  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  title_en?: string;

  @IsOptional()
  @IsString()
  subtitle_en?: string;

  @IsOptional()
  @IsString()
  description_en?: string;

  @IsOptional()
  @IsNumber()
  order?: number;


}

