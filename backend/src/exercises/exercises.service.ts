import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseEntity } from './entities/exercise.entity';
import { QuestionEntity } from './entities/question.entity';
import { UserExerciseHistory } from './entities/user-exercise-history.entity';
import { ExerciseQueryDto } from './dto/exercise-query.dto';

@Injectable()
export class ExercisesService implements OnModuleInit {
  constructor(
    @InjectRepository(ExerciseEntity)
    private exerciseRepository: Repository<ExerciseEntity>,
    @InjectRepository(QuestionEntity)
    private questionRepository: Repository<QuestionEntity>,
    @InjectRepository(UserExerciseHistory)
    private historyRepository: Repository<UserExerciseHistory>,
  ) {}

  async onModuleInit() {
    await this.migrateLegacyData();
  }

  private async migrateLegacyData() {
    const exercises = await this.exerciseRepository.find({
      relations: ['questions'],
    });

    let migratedCount = 0;
    for (const exercise of exercises) {
      if (
        exercise.content &&
        (!exercise.questions || exercise.questions.length === 0)
      ) {
        // Migrate legacy content to a new question
        const question = this.questionRepository.create({
          exercise: exercise,
          content: exercise.content,
          type: exercise.type as any,
          points: exercise.points,
          order: 0,
        });
        await this.questionRepository.save(question);
        migratedCount++;
      }
    }
    if (migratedCount > 0) {
      console.log(`Migrated ${migratedCount} exercises to new structure.`);
    }
  }

  async findAll(query: ExerciseQueryDto) {
    const { page = 1, limit = 12, type, difficulty } = query;
    const skip = (page - 1) * limit;

    const whereCondition: any = {};
    if (type) whereCondition.type = type;
    if (difficulty) whereCondition.difficulty = difficulty;

    const [data, total] = await this.exerciseRepository.findAndCount({
      where: whereCondition,
      order: { createdAt: 'DESC' },
      take: limit,
      skip: skip,
      relations: ['questions'], // Load questions for list view if needed, or remove if too heavy
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(id: string) {
    const exercise = await this.exerciseRepository.findOne({
      where: { id },
      relations: ['questions'],
    });
    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }
    // Sort questions by order
    if (exercise.questions) {
      exercise.questions.sort((a, b) => a.order - b.order);
    }
    return exercise;
  }

  async create(data: Partial<ExerciseEntity>) {
    // strict handling for new structure
    const exercise = this.exerciseRepository.create(data);
    return await this.exerciseRepository.save(exercise);
  }

  async bulkCreate(data: Partial<ExerciseEntity>[]) {
    const exercises = this.exerciseRepository.create(data);
    return await this.exerciseRepository.save(exercises);
  }

  async update(id: string, data: Partial<ExerciseEntity>) {
    const exercise = await this.findOne(id);

    // If updating questions, we might need to handle them carefully.
    // For now, relies on TypeORM cascade if data.questions is provided.
    // However, merging updates to 'questions' via 'Object.assign' on the parent might not work as expected for deep updates without 'save'.
    // But since we use repositories, let's try standard save.

    // NOTE: Object.assign merge of relations can be tricky.
    // If data.questions is present, it will re-assign the array.
    // If the frontend sends the full array of questions (including IDs for existing ones), save() with cascade updates them.

    Object.assign(exercise, data);
    return await this.exerciseRepository.save(exercise);
  }

  async remove(id: string) {
    const exercise = await this.findOne(id);
    // Delete related history first to avoid FK constraint error
    await this.historyRepository.delete({ exerciseId: id });
    return await this.exerciseRepository.remove(exercise);
  }

  // User Progress Methods
  async saveProgress(userId: string, exerciseId: string, score: number) {
    let history = await this.historyRepository.findOne({
      where: { userId, exerciseId },
    });

    if (history) {
      history.score = score;
      history.completedAt = new Date();
    } else {
      history = this.historyRepository.create({
        userId,
        exerciseId,
        score,
      });
    }
    return await this.historyRepository.save(history);
  }

  async getUserProgress(userId: string) {
    return await this.historyRepository.find({
      where: { userId },
      relations: ['exercise'],
    });
  }

  async resetUserProgress(userId: string) {
    return await this.historyRepository.delete({ userId });
  }
}
