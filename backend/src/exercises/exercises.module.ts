import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { ExerciseEntity } from './entities/exercise.entity';
import { QuestionEntity } from './entities/question.entity';
import { UserExerciseHistory } from './entities/user-exercise-history.entity';

import { AdminExercisesController } from './admin-exercises.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExerciseEntity,
      QuestionEntity,
      UserExerciseHistory,
    ]),
  ],
  controllers: [ExercisesController, AdminExercisesController],
  providers: [ExercisesService],
  exports: [ExercisesService],
})
export class ExercisesModule {}
