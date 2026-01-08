import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ExerciseEntity } from './entities/exercise.entity';
import { QuestionEntity } from './entities/question.entity';
import { UserExerciseHistory } from './entities/user-exercise-history.entity';
import { ExerciseQueryDto } from './dto/exercise-query.dto';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(ExerciseEntity)
    private exerciseRepository: Repository<ExerciseEntity>,
    @InjectRepository(QuestionEntity)
    private questionRepository: Repository<QuestionEntity>,
    @InjectRepository(UserExerciseHistory)
    private historyRepository: Repository<UserExerciseHistory>,
  ) {}

  async findAll(query: ExerciseQueryDto) {
    const { page = 1, limit = 12, difficulty } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.exerciseRepository
      .createQueryBuilder('exercise')
      .leftJoin('exercise.questions', 'questions')
      .addSelect('COUNT(questions.id)', 'questionCount')
      .groupBy('exercise.id')
      .orderBy('exercise.createdAt', 'DESC')
      .take(limit)
      .skip(skip);

    if (difficulty) {
      queryBuilder.andWhere('exercise.difficulty = :difficulty', {
        difficulty,
      });
    }

    if (query.hasQuestions === true || String(query.hasQuestions) === 'true') {
      queryBuilder.having('COUNT(questions.id) > 0');
    }

    const { entities, raw } = await queryBuilder.getRawAndEntities();

    // Get total count - need to count before HAVING filter
    // Create a separate query for total count
    const totalQueryBuilder = this.exerciseRepository
      .createQueryBuilder('exercise')
      .leftJoin('exercise.questions', 'questions')
      .groupBy('exercise.id');

    if (difficulty) {
      totalQueryBuilder.andWhere('exercise.difficulty = :difficulty', {
        difficulty,
      });
    }

    if (query.hasQuestions === true || String(query.hasQuestions) === 'true') {
      totalQueryBuilder.having('COUNT(questions.id) > 0');
    }

    const total = await totalQueryBuilder.getCount();

    // Merge raw count into entities
    const data = entities.map((entity) => {
      const rawRow = raw.find((r) => r.exercise_id === entity.id);
      return {
        ...entity,
        questionCount: rawRow ? parseInt(rawRow.questionCount, 10) : 0,
      };
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
