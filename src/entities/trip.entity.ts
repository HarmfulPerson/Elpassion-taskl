import { UUIDVersion } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  UUID: string;

  @Column({
    nullable: false,
    default: '',
  })
  start_address: string;

  @Column({
    nullable: false,
    default: '',
  })
  destination_address: string;

  @Column({
    nullable: false,
    type: 'decimal',
  })
  price: number;

  @Column({
    nullable: false,
    type: 'timestamptz',
  })
  date: Date;

  @Column({
    nullable: false,
    type: 'decimal',
  })
  distance: number;
}
