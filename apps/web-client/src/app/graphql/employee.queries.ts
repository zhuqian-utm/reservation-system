import { gql } from '@apollo/client';

export const GET_ALL_RESERVATIONS = gql`
  query GetReservations($date: String!) {
    browseReservations(date: $date) {
      id
      guestName
      tableSize
      arrivalTime
      status
      contactInfo {
        phone
        email
      }
    }
  }
`;

export const UPDATE_STATUS = gql`
  mutation UpdateStatus($input: UpdateReservationStatusInput!) {
    updateStatus(input: $input)
  }
`;
