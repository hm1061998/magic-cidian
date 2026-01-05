import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ReportType } from '../entities/dictionary-report.entity';
import { Transform } from 'class-transformer';

export class CreateReportDto {
  @IsNotEmpty()
  @Transform(({ value }) => (value ? String(value) : value))
  idiomId: string;

  @IsNotEmpty()
  @IsEnum(ReportType)
  type: ReportType;

  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  description: string;
}
