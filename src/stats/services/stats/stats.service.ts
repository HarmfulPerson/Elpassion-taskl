import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Trip } from 'entities';
import * as moment from 'moment-timezone';
@Injectable()
export class StatsService {
  constructor(@InjectRepository(Trip) private readonly tripRepository: Repository<Trip>) {}

  async getWeeklyStats() {
    const currentDate = moment();
    const minuteInMiliseconds = 60000;
    const offset = moment.parseZone(currentDate).utcOffset() * minuteInMiliseconds;
    const startOfTheWeek = new Date(currentDate.clone().startOf('isoWeek').valueOf() + offset);
    const endOfTheWeek = new Date(currentDate.clone().endOf('isoWeek').valueOf() + offset);

    const filteredTrips = await this.tripRepository.find({
      where: {
        date: Between(startOfTheWeek, endOfTheWeek),
      },
    });

    const totalPrice = filteredTrips.reduce((accumulator, object) => {
      return accumulator + +object.price;
    }, 0);
    const totalDistance = filteredTrips.reduce((accumulator, object) => {
      return accumulator + +object.distance;
    }, 0);

    return {
      total_price: `${totalPrice}PLN`,
      total_distance: `${totalDistance}KM`,
    };
  }

  parseDate(date: Date): string {
    return moment(date, 'MM/DD/YY').format('Do MMMM');
  }

  parsePrice(price: number): string {
    return `${price}PLN`;
  }

  returnMonthlyStats(stats: Array<any>): Array<any> {
    return stats.map((stat) => ({
      day: this.parseDate(stat.day),
      total_distance: `${stat.total_distance}KM`,
      avg_distance: `${stat.avg_distance}KM`,
      avg_price: this.parsePrice(stat.avg_price),
    }));
  }

  async getMonthlyStats() {
    const currentDate = moment();
    const minuteInMiliseconds = 60000;
    const offSetMonthStart =
      moment.parseZone(currentDate.clone().startOf('month').valueOf()).utcOffset() * minuteInMiliseconds;
    const offsetMonthEnd =
      moment.parseZone(currentDate.clone().endOf('month').valueOf()).utcOffset() * minuteInMiliseconds;
    const startOfTheMonth = new Date(currentDate.clone().startOf('month').valueOf() + offSetMonthStart);
    const endOfTheMonth = new Date(currentDate.clone().endOf('month').valueOf() + offsetMonthEnd);
    const stats = await this.tripRepository
      .createQueryBuilder()
      .select(
        `date_trunc('day', date) AS day, sum(distance) as total_distance, round(avg(distance)::numeric, 3) as avg_distance, round(avg(price)::numeric, 2) as avg_price`,
      )
      .where(`date BETWEEN '${startOfTheMonth.toISOString()}' AND '${endOfTheMonth.toISOString()}'`)
      .groupBy('day')
      .orderBy('day')
      .getRawMany();
    return this.returnMonthlyStats(stats);
  }
}
