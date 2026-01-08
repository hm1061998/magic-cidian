import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ExerciseEntity, ExerciseType } from './entities/exercise.entity';
import { QuestionEntity } from './entities/question.entity';
import { UserExerciseHistory } from './entities/user-exercise-history.entity';

@Injectable()
export class ExerciseMigrationScript {
  constructor(
    @InjectRepository(ExerciseEntity)
    private exerciseRepository: Repository<ExerciseEntity>,
    @InjectRepository(QuestionEntity)
    private questionRepository: Repository<QuestionEntity>,
    @InjectRepository(UserExerciseHistory)
    private historyRepository: Repository<UserExerciseHistory>,
  ) {}

  async runMigration() {
    await this.fixSequences();
    await this.migrateLegacyData();
    await this.consolidateExercises();
  }

  private async fixSequences() {
    try {
      // Reset sequences for exercises and questions tables
      const resetSeq = async (table: string) => {
        const query = `
          SELECT setval(
            pg_get_serial_sequence('${table}', 'id'),
            COALESCE((SELECT MAX(id) FROM ${table}), 0) + 1,
            false
          );
        `;
        await this.exerciseRepository.query(query);
      };

      await resetSeq('exercises');
      await resetSeq('questions');
      console.log('Database sequences synchronized.');
    } catch (err) {
      console.warn(
        'Could not reset sequences (maybe not Postgres or not Serial?):',
        err.message,
      );
    }
  }

  private async migrateLegacyData() {
    const exercises = await this.exerciseRepository.find({
      relations: ['questions'],
    });

    let migratedCount = 0;
    for (const exercise of exercises) {
      const exAny = exercise as any;
      if (
        exAny.content &&
        (!exercise.questions || exercise.questions.length === 0)
      ) {
        // Determine type from content
        let qType: any = 'MULTIPLE_CHOICE';
        const c = exAny.content;
        if (c.pairs) qType = 'MATCHING';
        else if (c.text && c.wordBank) qType = 'FILL_BLANKS';

        // Migrate legacy content to a new question
        const question = this.questionRepository.create({
          exercise: exercise,
          exerciseId: exercise.id, // Explicitly set FK
          content: exAny.content,
          type: qType,
          points: exAny.points || 0,
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

  private async consolidateExercises() {
    // Reload exercises to get fresh data including newly created questions
    const exercises = await this.exerciseRepository.find({
      relations: ['questions'],
    });

    // Filter exercises that strictly have 1 question.
    const candidates = exercises.filter(
      (e) => e.questions && e.questions.length === 1,
    );

    if (candidates.length === 0) return;

    console.log(
      `Found ${candidates.length} single-question exercises. Starting consolidation...`,
    );

    // Group candidates by difficulty ONLY (since type is mixed)
    const groups: Record<string, ExerciseEntity[]> = {};
    for (const ex of candidates) {
      const key = ex.difficulty || 'easy';
      if (!groups[key]) groups[key] = [];
      groups[key].push(ex);
    }

    let consolidatedCount = 0;

    for (const key in groups) {
      const group = groups[key];
      // Shuffle
      group.sort(() => Math.random() - 0.5);

      let i = 0;
      while (i < group.length) {
        const remaining = group.length - i;
        if (remaining === 0) break;

        // Random size 4 to 5
        let size = Math.floor(Math.random() * 2) + 4; // 4, 5
        if (size > remaining) size = remaining;

        const chunk = group.slice(i, i + size);
        i += size;

        if (chunk.length === 0) continue;

        const firstEx = chunk[0];

        // Create a completely new exercise to hold these questions
        const newExercise = this.exerciseRepository.create({
          title: `${firstEx.title} (Tổng hợp)`,
          description: 'Bài tập được tổng hợp từ các câu hỏi đơn lẻ.',
          difficulty: firstEx.difficulty,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const savedNewExercise =
          await this.exerciseRepository.save(newExercise);

        // Move questions from ALL sources to the new exercise
        let newOrder = 0;
        // let pointsToAdd = 0;

        for (const source of chunk) {
          if (!source.questions || source.questions.length === 0) continue;

          // We expect exactly 1 question per source
          const q = source.questions[0];

          // Use update to directly modify the DB row
          await this.questionRepository.update(q.id, {
            exerciseId: savedNewExercise.id,
            order: newOrder++,
          });

          // pointsToAdd += q.points;
        }

        // Update new exercise points - REMOVED since column is gone
        // savedNewExercise.points = pointsToAdd;

        // Prevent relation sync issues
        (savedNewExercise as any).questions = undefined;
        await this.exerciseRepository.save(savedNewExercise);

        const sourceIds = chunk.map((e) => e.id);

        // Delete legacy history for all old exercises
        await this.historyRepository.delete({
          exerciseId: In(sourceIds),
        });

        // Delete all old exercises
        await this.exerciseRepository.delete(sourceIds);

        consolidatedCount += chunk.length;
      }
    }

    if (consolidatedCount > 0) {
      console.log(`Consolidated ${consolidatedCount} exercises into groups.`);
    }
  }
}
