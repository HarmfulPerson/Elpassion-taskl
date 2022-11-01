import { Module } from '@nestjs/common';
import { StatsController } from './controllers/stats/stats.controller';
import { StatsService } from './services/stats/stats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from 'entities';
@Module({
  imports: [TypeOrmModule.forFeature([Trip])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
