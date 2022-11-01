import { Controller } from '@nestjs/common';
import { TripService } from 'trip/services/trip/trip.service';
import { CreateTripDTO } from 'trip/dto/trips.dto';
import { Body, Post, UsePipes, ValidationPipe } from '@nestjs/common';
@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post('')
  @UsePipes(ValidationPipe)
  createTrip(@Body() createTripDto: CreateTripDTO) {
    return this.tripService.createTrip(createTripDto);
  }
}
