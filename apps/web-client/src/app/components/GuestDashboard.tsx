import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { GetGuestReservationsData } from '@reservation-system/data-access';
import { ReservationStatus } from '@reservation-system/data-access';
import { MY_RESERVATIONS } from '../graphql/reservations.queries';
import { authService } from '../services/auth.service';
import { DEFAULT_VALUES, ReservationModal } from './ReservationModal';
import { formatArrivalTime, formatTimeToString } from '../tools/timer';

export const GuestDashboard = () => {
  const [isEditOpen, setEditOpen] = useState(false);
  const [editValues, setEditValues] = useState(DEFAULT_VALUES);

  const user = authService.getCurrentUser();
  const { data, loading, refetch } = useQuery<GetGuestReservationsData>(
    MY_RESERVATIONS,
    {
      variables: { guestId: user.id },
    },
  );

  const location = useLocation();

  useEffect(() => {
    refetch();
  }, [location.key]);

  const handleChange = (res: any) => {
    const arrivalDate = res.arrivalTime.slice(0, 10);
    const arrivalTime = formatTimeToString(res.arrivalTime);

    setEditValues({
      id: res.id,
      arrivalDate,
      arrivalTime,
      tableSize: res.tableSize,
      guestEmail: res.contactInfo.email,
      guestPhone: res.contactInfo.phone,
      isCancelled: false,
    });
    setEditOpen(true);
  };

  const handleClose = () => {
    refetch();
    setEditOpen(false);
    setEditValues(DEFAULT_VALUES);
  };

  if (loading) return <p>Loading Reservations...</p>;

  return (
    <div className="dashboard">
      <div className="table-wrapper">
        <table className="rsv-table">
          <thead>
            <tr>
              <th>Size</th>
              <th>Arrival Date</th>
              <th>Arrival Time</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...(data?.browseGuestReservations ?? [])]
              .sort(
                (a, b) =>
                  new Date(b.arrivalTime).getTime() -
                  new Date(a.arrivalTime).getTime(),
              )
              .map((res) => (
                <tr key={res.id} className="table-row">
                  <td className="table-size">
                    <span className="size-badge">{res.tableSize}</span>
                  </td>
                  <td className="arrival-time">
                    {res.arrivalTime.slice(0, 10)}
                  </td>
                  <td className="arrival-time">
                    {formatArrivalTime(res.arrivalTime)}
                  </td>
                  <td>
                    <span
                      className={`status-badge status-${res.status.toLowerCase()}`}
                    >
                      {res.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    {res.status ===
                      ReservationStatus.REQUESTED.toLocaleUpperCase() && (
                      <div className="action-wrapper">
                        <button
                          className="btn-action btn-cancel"
                          onClick={() => handleChange(res)}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <ReservationModal
        values={editValues}
        isOpen={isEditOpen}
        onClose={handleClose}
      />
    </div>
  );
};
