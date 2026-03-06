import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { CREATE_RESERVATION } from '../graphql/reservations.queries';
import { getAvailableDate, getAvailableTime } from '../tools/timer';

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
    getValues,
    formState: { errors },
  } = useForm<IFormInput>({ mode: 'onChange' });

  // Apollo Mutation Hook
  const [createReservation, { loading, error }] =
    useMutation(CREATE_RESERVATION);

  const onSubmit = async (data: IFormInput) => {
    try {
      const combinedDateTime = new Date(
        `${data.arrivalDate}T${data.arrivalTime}:00.000Z`,
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

  const defaultArrivalDate = getAvailableDate();
  const defaultArrivalTime = getAvailableTime();

  return (
    <div className="reservation-container">
      <h2>Book a Table</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-row">
          {/* Date Picker */}
          <div className="form-group">
            <label className="label-gold">Arrival Date</label>
            <input
              type="date"
              className="input-luxury"
              defaultValue={defaultArrivalDate}
              min={defaultArrivalDate}
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
              defaultValue={defaultArrivalTime}
              {...register('arrivalTime', {
                required: 'Time is required',
                validate: (value) => {
                  if (!value) return 'Time is required';

                  // Comparison works for "HH:mm" strings
                  const isTooEarly = value < '10:00';
                  const isTooLate = value > '19:00';

                  if (isTooEarly || isTooLate) {
                    return 'Please select a time between 10:00 AM and 7:00 PM';
                  }

                  // Not Earlier Than Now
                  const selectedDateTime = new Date(
                    `${getValues('arrivalDate')}T${value}:00`,
                  );
                  const now = new Date();
                  if (selectedDateTime < now) {
                    return 'Arrival time cannot be in the past';
                  }

                  return true;
                },
              })}
              min="10:00"
              max="19:00"
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
