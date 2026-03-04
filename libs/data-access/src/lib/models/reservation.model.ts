export enum ReservationStatus {
  REQUESTED = 'Requested',
  APPROVED = 'Approved',
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed',
}

export interface IReservation {
  id: string; // Unique ID
  guestId: string; // Relation to the User ID (GUEST)
  guestName: string; // Redundant but fast for "Browse All" view

  // Contact Info (Requirement: Phone & Email)
  contactInfo: {
    phone: string;
    email: string;
  };

  arrivalTime: string; // ISO 8601 String (e.g., 2026-03-05T19:00:00Z)
  tableSize: number; // Capacity requirement
  status: ReservationStatus;

  specialRequests?: string; // Professional touch
  createdAt: string;
  updatedAt: string;
}

export interface GetReservationsData {
  browseReservations: IReservation[];
}

export interface GetGuestReservationsData {
  browseGuestReservations: IReservation[];
}
