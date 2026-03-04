import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  Min,
  IsOptional,
  IsEnum,
  IsString,
} from 'class-validator';
import { ReservationStatus } from '@reservation-system/data-access';

@InputType()
export class CreateReservationInput {
  @Field()
  @IsNotEmpty()
  arrivalTime: string;

  @Field(() => Int)
  @Min(1)
  tableSize: number;

  @Field()
  @IsEmail()
  guestEmail: string;

  @Field({ nullable: true })
  @IsOptional()
  guestPhone: string;
}

@InputType()
export class UpdateReservationInput {
  @Field()
  @IsString()
  id: string;

  @Field()
  @IsNotEmpty()
  arrivalTime: string;

  @Field(() => Int)
  @Min(1)
  tableSize: number;

  @Field()
  @IsEmail()
  guestEmail: string;

  @Field({ nullable: true })
  @IsOptional()
  guestPhone: string;

  @Field(() => ReservationStatus)
  @IsEnum(ReservationStatus)
  status: ReservationStatus;
}

@InputType()
export class UpdateReservationStatusInput {
  @Field()
  @IsString()
  id: string;

  @Field(() => ReservationStatus)
  @IsEnum(ReservationStatus)
  status: ReservationStatus;
}
