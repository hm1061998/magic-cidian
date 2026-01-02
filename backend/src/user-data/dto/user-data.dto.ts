import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsDefined,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateSRSDto {
  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  idiomId: string;

  @IsNotEmpty()
  @IsNumber()
  interval: number;

  @IsNotEmpty()
  @IsNumber()
  repetition: number;

  @IsDefined({ message: 'efactor hoặc easeFactor không được để trống' })
  @IsNumber()
  @Transform(({ value, obj }) => value ?? obj.easeFactor)
  efactor: number;

  @IsOptional()
  @IsNumber()
  easeFactor?: number;

  @IsNotEmpty()
  nextReviewDate: string | number;
}
