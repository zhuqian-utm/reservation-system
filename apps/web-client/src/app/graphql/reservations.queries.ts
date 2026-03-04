import { gql } from '@apollo/client';

export const CREATE_RESERVATION = gql`
  mutation CreateReservation($input: CreateReservationInput!) {
    createReservation(input: $input)
  }
`;

export const UPDATE_RESERVATION = gql`
  mutation UpdateReservation($input: UpdateReservationInput!) {
    updateReservation(input: $input)
  }
`;

export const UPDATE_RESERVATION_STATUS = gql`
  mutation UpdateStatus($input: UpdateReservationStatusInput!) {
    updateStatus(input: $input)
  }
`;

export const MY_RESERVATIONS = gql`
  query GetReservations($guestId: String!) {
    browseGuestReservations(guestId: $guestId) {
      id
      guestName
      arrivalTime
      tableSize
      status
      contactInfo {
        email
        phone
      }
    }
  }
`;