import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ReservationRepository } from '@reservation-system/data-access/server';
import { UserRole, ReservationStatus } from '@reservation-system/data-access';
import { Reservation } from './entities/reservation.entity';
import {
  CreateReservationInput,
  UpdateReservationInput,
  UpdateReservationStatusInput,
} from './dto/reservation.input';
import { v4 as uuidv4 } from 'uuid';

@Resolver(() => Reservation)
export class ReservationResolver {
  constructor(private readonly reservationRepo: ReservationRepository) {}

  /**
   * GUEST: Create a new reservation
   * Uses JwtAuthGuard to ensure the guest is logged in.
   */
  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async createReservation(
    @Args('input') input: CreateReservationInput,
    @Context() context,
  ) {
    const user = context.req.user; // Attached by JwtStrategy.validate()
    
    const newReservation = {
      id: uuidv4(),
      guestId: user.userId, // Matches the key in your JwtStrategy
      guestName: user.email.split('@')[0], // Fallback if fullName isn't in JWT
      contactInfo: {
        email: input.guestEmail,
        phone: input.guestPhone,
      },
      arrivalTime: input.arrivalTime,
      tableSize: input.tableSize,
      status: ReservationStatus.REQUESTED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.reservationRepo.save(newReservation);
    return true;
  }

  /**
   * GUEST: Update Reservation
   */
  @Mutation(() => Boolean)
  @Roles(UserRole.GUEST)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateReservation(@Args('input') input: UpdateReservationInput) {
    const reservation = await this.reservationRepo.findById(input.id);
    if (!reservation) throw new Error('Hilton Reservation not found');

    const updated = {
      ...reservation,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    await this.reservationRepo.save(updated);
    return true;
  }

  /**
   * GUEST: Browse MY reservations
   * RolesGuard ensures ONLY guests can access this data.
   */
  @Query(() => [Reservation]) 
  @Roles(UserRole.GUEST)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async browseGuestReservations(@Args('guestId') guestId: string) {
    return this.reservationRepo.findAllByGuestId(guestId);
  }

  /**
   * EMPLOYEE: Browse all reservations
   * RolesGuard ensures ONLY employees can access this data.
   */
  @Query(() => [Reservation]) 
  @Roles(UserRole.EMPLOYEE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async browseReservations(@Args('date') date: string) {
    return this.reservationRepo.findAllByDate(date);
  }

  /**
   * EMPLOYEE: Update status
   */
  @Mutation(() => Boolean)
  @Roles(UserRole.EMPLOYEE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateStatus(@Args('input') input: UpdateReservationStatusInput) {
    const reservation = await this.reservationRepo.findById(input.id);
    if (!reservation) throw new Error('Hilton Reservation not found');

    const updated = {
      ...reservation,
      status: input.status,
      updatedAt: new Date().toISOString(),
    };

    await this.reservationRepo.save(updated);
    return true;
  }
}