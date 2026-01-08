import { IsOptional, IsEnum, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { ExerciseType } from '../entities/exercise.entity';

export class ExerciseQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  hasQuestions?: boolean;
}
