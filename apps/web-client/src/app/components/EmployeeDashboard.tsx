import React, { useMemo, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GetReservationsData } from '@reservation-system/data-access';
import {
  GET_ALL_RESERVATIONS,
  UPDATE_STATUS,
} from '../graphql/employee.queries';
import { ReservationStatus } from '@reservation-system/data-access';

export const EmployeeDashboard = () => {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState(
    new Date().toISOString().split('T')[0],
  ); // Default to today
  const [sizeFilter, setSizeFilter] = useState('ALL');

  const today = new Date().toISOString().split('T')[0];
  const { data, loading, refetch } = useQuery<GetReservationsData>(
    GET_ALL_RESERVATIONS,
    {
      variables: { date: today },
    },
  );

  const [updateStatus] = useMutation(UPDATE_STATUS);

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateStatus({
      variables: { input: { id, status: newStatus.toLocaleUpperCase() } },
    });
    refetch(); // Refresh the list after update
  };

  // Logic to filter the data before rendering
  const filteredReservations = useMemo(() => {
    if (!data?.browseReservations) return [];

    return data.browseReservations.filter((res) => {
      // 1. Status Filter
      const matchesStatus =
        statusFilter === 'ALL' || res.status === statusFilter;

      // 2. Date Filter (Comparing YYYY-MM-DD strings)
      const resDate = new Date(res.arrivalTime).toISOString().split('T')[0];
      const matchesDate = !dateFilter || resDate === dateFilter;

      // 3. Size Filter
      const matchesSize =
        sizeFilter === 'ALL' || res.tableSize === Number(sizeFilter);

      return matchesStatus && matchesDate && matchesSize;
    });
  }, [data, statusFilter, dateFilter, sizeFilter]);

  if (loading) return <p>Loading Hilton Reservations...</p>;

  return (
    <div className="dashboard">
      <div className="filter-bar">
        <div className="filter-group">
          <label className="filter-label">Arrival Date</label>
          <input
            type="date"
            className="filter-input"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value={ReservationStatus.REQUESTED}>Requested</option>
            <option value={ReservationStatus.APPROVED}>Approved</option>
            <option value={ReservationStatus.COMPLETED}>Completed</option>
            <option value={ReservationStatus.CANCELLED}>Cancelled</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Table Size</label>
          <select
            className="filter-select"
            value={sizeFilter}
            onChange={(e) => setSizeFilter(e.target.value)}
          >
            <option value="ALL">Any Size</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} Guests
              </option>
            ))}
          </select>
        </div>

        <button
          className="btn-reset"
          onClick={() => {
            setStatusFilter('ALL');
            setSizeFilter('ALL');
            setDateFilter(new Date().toISOString().split('T')[0]);
          }}
        >
          Reset
        </button>
      </div>

      <div className="table-wrapper">
        <table className="hilton-table">
          <thead>
            <tr>
              <th>Guest Details</th>
              <th>Size</th>
              <th>Arrival Date</th>
              <th>Arrival Time</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations?.map((res) => (
              <tr key={res.id} className="table-row">
                <td className="guest-info">
                  <span className="guest-name">{res.guestName}</span>
                  <span className="guest-email">{res.contactInfo.email}</span>
                </td>
                <td className="table-size">
                  <span className="size-badge">{res.tableSize}</span>
                </td>
                <td className="arrival-time">{res.arrivalTime.slice(0, 10)}</td>
                <td className="arrival-time">
                  {new Date(res.arrivalTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
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
                    <div className="action-group">
                      <button
                        className="btn-action btn-approve"
                        onClick={() =>
                          handleStatusChange(res.id, ReservationStatus.APPROVED)
                        }
                      >
                        Approve
                      </button>
                      <button
                        className="btn-action btn-complete"
                        onClick={() =>
                          handleStatusChange(
                            res.id,
                            ReservationStatus.COMPLETED,
                          )
                        }
                      >
                        Complete
                      </button>
                      <button
                        className="btn-action btn-cancel"
                        onClick={() =>
                          handleStatusChange(
                            res.id,
                            ReservationStatus.CANCELLED,
                          )
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
