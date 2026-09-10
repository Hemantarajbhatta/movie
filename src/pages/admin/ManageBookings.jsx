import React, { useState, useEffect } from 'react';
import { Eye, DollarSign, Ticket, TrendingUp } from 'lucide-react';
import * as bookingApi from '../../api/bookingApi';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await bookingApi.getAllBookings();
        setBookings(data.bookings || []);
      } catch (err) {
        console.error('Failed to load bookings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const totalTickets = bookings.reduce((sum, b) => sum + (b.seats?.length || 0), 0);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="manage-bookings">
      <div className="admin-page-header">
        <h1>Bookings & Sales</h1>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)' }}>
            <Ticket size={28} />
          </div>
          <div className="stat-info">
            <h3>Total Bookings</h3>
            <div className="stat-value">{bookings.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)' }}>
            <DollarSign size={28} />
          </div>
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <div className="stat-value">Rs. {totalRevenue.toLocaleString()}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)' }}>
            <TrendingUp size={28} />
          </div>
          <div className="stat-info">
            <h3>Tickets Sold</h3>
            <div className="stat-value">{totalTickets}</div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="admin-table-container">
        {bookings.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
            <Ticket size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <h3>No Bookings Yet</h3>
            <p style={{ marginTop: '0.5rem' }}>Bookings will appear here once users start booking tickets.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Movie</th>
                <th>Cinema</th>
                <th>Show</th>
                <th>Seats</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id}>
                  <td style={{ fontWeight: 600, color: '#3b82f6', fontSize: '0.85rem' }}>{booking.bookingId}</td>
                  <td style={{ fontWeight: 500 }}>{booking.movieId?.title || 'N/A'}</td>
                  <td style={{ color: '#9ca3af' }}>{booking.cinemaId?.name || 'N/A'}</td>
                  <td style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                    {booking.showDate ? new Date(booking.showDate).toLocaleDateString() : 'N/A'}<br />
                    {booking.showTime || ''}
                  </td>
                  <td>{booking.seats?.map(s => `${s.row}${s.number}`).join(', ') || 'N/A'}</td>
                  <td>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      backgroundColor: booking.paymentMethod === 'esewa' ? 'rgba(96,187,70,0.15)' : booking.paymentMethod === 'khalti' ? 'rgba(123,63,181,0.15)' : 'rgba(59,130,246,0.15)',
                      color: booking.paymentMethod === 'esewa' ? '#60bb46' : booking.paymentMethod === 'khalti' ? '#7b3fb5' : '#3b82f6',
                    }}>
                      {booking.paymentMethod || 'N/A'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>Rs. {booking.totalPrice}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: 'rgba(16,185,129,0.15)',
                      color: '#10b981',
                    }}>
                      {booking.status?.toUpperCase() || 'CONFIRMED'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageBookings;
