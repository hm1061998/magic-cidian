import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExerciseQueryDto } from './dto/exercise-query.dto';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get('progress')
  @UseGuards(JwtAuthGuard)
  getUserProgress(@Req() req: any) {
    return this.exercisesService.getUserProgress(req.user.id);
  }

  @Post('progress')
  @UseGuards(JwtAuthGuard)
  saveProgress(
    @Req() req: any,
    @Body() body: { exerciseId: string; score: number },
  ) {
    return this.exercisesService.saveProgress(
      req.user.id,
      body.exerciseId,
      body.score,
    );
  }

  @Delete('progress')
  @UseGuards(JwtAuthGuard)
  resetProgress(@Req() req: any) {
    return this.exercisesService.resetUserProgress(req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() query: ExerciseQueryDto) {
    return this.exercisesService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.exercisesService.findOne(id);
  }
}
