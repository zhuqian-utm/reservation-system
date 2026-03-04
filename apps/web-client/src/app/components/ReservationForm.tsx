import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { CREATE_RESERVATION } from '../graphql/reservations.queries';
import { getNextTime } from '../tools/timer';

export interface IFormInput {
  arrivalDate: string;
  arrivalTime: string;
  tableSize: number;
  guestEmail: string;
  guestPhone: string;
}

export const ReservationForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>();

  // Apollo Mutation Hook
  const [createReservation, { loading, error }] =
    useMutation(CREATE_RESERVATION);

  const onSubmit = async (data: IFormInput) => {
    try {
      const combinedDateTime = new Date(
        `${data.arrivalDate}T${data.arrivalTime}`,
      ).toISOString();

      const { arrivalDate, ...restOfData } = data;

      await createReservation({
        variables: {
          input: {
            ...restOfData,
            arrivalTime: combinedDateTime, // Use the merged string
            tableSize: Number(data.tableSize), // Ensure it's an Int
            guestPhone: data.guestPhone || '', // Handle optional phone as empty string
          },
        },
      });

      alert('Reservation Requested Successfully!');
      reset();
    } catch (e) {
      console.error('Mutation error:', e);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const nowTime = getNextTime();

  return (
    <div className="reservation-container">
      <h2>Book a Table at Hilton</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-row">
          {/* Date Picker */}
          <div className="form-group">
            <label className="label-gold">Arrival Date</label>
            <input
              type="date"
              className="input-luxury"
              defaultValue={today}
              min={today}
              {...register('arrivalDate', { required: 'Date is required' })}
            />
            {errors.arrivalDate && (
              <span className="error-text">{errors.arrivalDate.message}</span>
            )}
          </div>

          {/* Time Picker */}
          <div className="form-group">
            <label className="label-gold">Arrival Time</label>
            <input
              type="time"
              className="input-luxury"
              defaultValue={nowTime}
              {...register('arrivalTime', { required: 'Time is required' })}
            />
            {errors.arrivalTime && (
              <span className="error-text">{errors.arrivalTime.message}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="label-gold">Table Size</label>
          <div className="select-wrapper">
            <select
              className="input-luxury select-number"
              {...register('tableSize', {
                required: true,
                valueAsNumber: true,
                value: 2,
              })}
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <span className="select-label">Guests</span>
          </div>
        </div>

        <div className="form-row">
          {/* Email Field */}
          <div className="form-group flex-2">
            <label className="label-gold">Contact Email</label>
            <input
              type="email"
              // placeholder="e.g. conrad@hilton.com"
              className="input-luxury"
              {...register('guestEmail', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Please enter a valid email',
                },
              })}
            />
            {errors.guestEmail && (
              <span className="error-text">{errors.guestEmail.message}</span>
            )}
          </div>

          {/* Phone Field */}
          <div className="form-group flex-1">
            <label className="label-gold">Contact Phone</label>
            <input
              type="tel"
              placeholder=""
              className="input-luxury"
              {...register('guestPhone')}
            />
            {errors.guestPhone && (
              <span className="error-text">{errors.guestPhone.message}</span>
            )}
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Request Reservation'}
        </button>

        {error && <p className="error">Error: {error.message}</p>}
      </form>
    </div>
  );
};
