import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trip } from 'entities';
import { Observable } from 'rxjs';
import { CreateTripDTO } from 'trip/dto/trips.dto';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios/dist';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip) private readonly tripRepository: Repository<Trip>,
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getAddressCords(address: string): Promise<Promise<string>> {
    const result = await this.httpService.axiosRef.get(
      `https://positionstack.com/geo_api.php?query=${encodeURI(address)}`,
    );

    if (!result.data.data.length) {
      throw new HttpException('Cannot get lan lot of given address.', 400);
    }

    return `${result.data.data[0].latitude},${result.data.data[0].longitude}`;
  }

  async getDistanceBetween2Points(startAddressLonLat: string, destinationAddressLonLat: string): Promise<string> {
    const result = await this.httpService.axiosRef.get(
      `https://api.tomtom.com/routing/1/calculateRoute/${startAddressLonLat}:${destinationAddressLonLat}/json?key=${this.configService.get<string>(
        'TOMTOM_APIKEY',
      )}`,
    );
    if (!result) {
      throw new HttpException('Cannot calculate distance between points.', 400);
    }

    return result.data.routes[0].summary.lengthInMeters;
  }

  async calculateDistance(start_address: string, destination_address: string): Promise<string> {
    const startAddressLonLat = await this.getAddressCords(start_address);
    const destinationAddressLonLat = await this.getAddressCords(destination_address);

    return this.getDistanceBetween2Points(startAddressLonLat, destinationAddressLonLat);
  }

  async createTrip(createTripDto: CreateTripDTO) {
    const distance = await this.calculateDistance(createTripDto.start_address, createTripDto.destination_address);
    const newTrip = this.tripRepository.create({ ...createTripDto, distance: +distance / 1000 });
    return this.tripRepository.save(newTrip);
  }
}
