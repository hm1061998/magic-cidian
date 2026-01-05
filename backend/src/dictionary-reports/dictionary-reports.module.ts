import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictionaryReportsService } from './dictionary-reports.service';
import { DictionaryReportsController } from './dictionary-reports.controller';
import { DictionaryReportEntity } from './entities/dictionary-report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DictionaryReportEntity])],
  controllers: [DictionaryReportsController],
  providers: [DictionaryReportsService],
  exports: [DictionaryReportsService],
})
export class DictionaryReportsModule {}
