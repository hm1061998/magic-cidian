import { IsOptional, IsEnum, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { ExerciseType } from '../entities/exercise.entity';

export class ExerciseQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(ExerciseType)
  type?: ExerciseType;

  @IsOptional()
  @IsString()
  difficulty?: string;
}
