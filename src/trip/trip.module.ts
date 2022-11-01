import { Module } from '@nestjs/common';
import { TripController } from './controllers/trip/trip.controller';
import { TripService } from './services/trip/trip.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from 'entities';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [TypeOrmModule.forFeature([Trip]), HttpModule],
  controllers: [TripController],
  providers: [TripService],
})
export class TripModule {}
