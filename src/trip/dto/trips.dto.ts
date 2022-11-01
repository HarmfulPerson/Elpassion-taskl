import { IsEmail, IsNotEmpty, MinLength, IsInt, IsDateString } from 'class-validator';

export class CreateTripDTO {
  @IsNotEmpty()
  @MinLength(3)
  start_address: string;

  @IsNotEmpty()
  @MinLength(3)
  destination_address: string;

  @IsInt()
  @IsNotEmpty()
  price: number;

  @IsDateString()
  @IsNotEmpty()
  date: Date;
}
