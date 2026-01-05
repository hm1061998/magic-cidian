import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { DictionaryReportsService } from './dictionary-reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportQueryDto } from './dto/report-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('dictionary-reports')
export class DictionaryReportsController {
  constructor(private readonly reportsService: DictionaryReportsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createReportDto: CreateReportDto, @Req() req) {
    return this.reportsService.create(req.user.id, createReportDto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async findMyReports(@Query() query: ReportQueryDto, @Req() req) {
    return this.reportsService.findMyReports(req.user.id, query);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getStats() {
    return this.reportsService.getStats();
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async findAll(@Query() query: ReportQueryDto) {
    return this.reportsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    return this.reportsService.update(id, updateReportDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async remove(@Param('id') id: string) {
    return this.reportsService.remove(id);
  }

  @Post('bulk-delete')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  bulkDelete(@Request() req, @Body('ids') ids: string[]) {
    return this.reportsService.bulkRemove(req.user.id, ids);
  }
}
