import { Controller, Get } from '@nestjs/common';
import { StatsService } from 'stats/services/stats/stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('weekly')
  getWeekly() {
    return this.statsService.getWeeklyStats();
  }

  @Get('monthly')
  getMonthly() {
    return this.statsService.getMonthlyStats();
  }
}
