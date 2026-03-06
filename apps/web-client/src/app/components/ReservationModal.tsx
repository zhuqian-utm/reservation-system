import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { UPDATE_RESERVATION } from '../graphql/reservations.queries';
import { IFormInput } from './ReservationForm';
import { ReservationStatus } from '@reservation-system/data-access';

export const DEFAULT_VALUES = {
  id: '',
  arrivalDate: '',
  arrivalTime: '',
  tableSize: 1,
  guestEmail: '',
  guestPhone: '',
  isCancelled: false,
};

interface IEditFormInput extends IFormInput {
  id: string;
  isCancelled: boolean;
}

interface ReservationModalProps {
  values: IEditFormInput;
  isOpen: boolean;
  onClose: () => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  values,
  isOpen,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<IEditFormInput>({
    defaultValues: { ...DEFAULT_VALUES },
    mode: 'onChange',
  });

  // 1. Sync form when Modal opens or User changes
  useEffect(() => {
    if (isOpen) {
      reset({ ...values });
    }
  }, [isOpen, values]);

  const [updateReservation, { loading }] = useMutation(UPDATE_RESERVATION);

  const onSubmit = async (data: IEditFormInput) => {
    try {
      const combinedDateTime = new Date(
        `${data.arrivalDate}T${data.arrivalTime}`,
      ).toISOString();
      const { arrivalDate, ...restOfData } = data;

      await updateReservation({
        variables: {
          input: {
            id: data.id,
            arrivalTime: combinedDateTime,
            tableSize: Number(data.tableSize),
            guestEmail: data.guestEmail,
            guestPhone: data.guestPhone,
            status: data.isCancelled
              ? ReservationStatus.CANCELLED.toLocaleUpperCase()
              : ReservationStatus.REQUESTED.toLocaleUpperCase(),
          },
        },
      });

      onClose(); // Close modal on success
    } catch (e) {
      console.error('Mutation error:', e);
    }
  };

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-x" onClick={onClose}>
          &times;
        </button>

        <h2 className="modal-title">Edit Reservation</h2>
        <form onSubmit={handleSubmit(onSubmit)} style={{ paddingTop: 8 }}>
          <div className="form-row">
            {/* Date Picker */}
            <div className="form-group">
              <label className="label-gold">Arrival Date</label>
              <input
                type="date"
                className="input-luxury"
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
                  valueAsNumber: true, // Automatically converts "4" to 4
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

          {/* Email Field */}
          <div className="form-group">
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

          <div className="form-group">
            <label className="cancel-label-wrapper">
              <span className="label-gold">Cancel Reservation</span>

              <div className="checkbox-container">
                <input
                  type="checkbox"
                  className="hidden-checkbox"
                  {...register('isCancelled')}
                />
                <div className="custom-indicator">
                  <span className="indicator-x">✕</span>
                </div>
              </div>
            </label>
          </div>

          <button type="submit" disabled={loading} className="btn-gold-fill">
            {loading ? 'Submitting...' : 'Confirm'}
          </button>
        </form>
      </div>
    </div>
  );
};
