import { ObjectType, Field, Int, ID, registerEnumType } from '@nestjs/graphql';
import { ReservationStatus } from '@reservation-system/data-access';

registerEnumType(ReservationStatus, {
  name: 'ReservationStatus', 
  description: 'The current state of a Hilton restaurant booking',
});

@ObjectType()
export class ContactInfo {
  @Field()
  email: string;

  @Field()
  phone: string;
}

@ObjectType()
export class Reservation {
  @Field(() => ID)
  id: string;

  @Field()
  guestId: string;

  @Field()
  guestName: string;

  @Field(() => ContactInfo)
  contactInfo: ContactInfo;

  @Field()
  arrivalTime: string;

  @Field(() => Int)
  tableSize: number;

  @Field(() => ReservationStatus)
  status: ReservationStatus;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}
