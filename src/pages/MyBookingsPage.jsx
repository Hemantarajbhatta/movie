import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as bookingApi from '../api/bookingApi';
import { Download, Calendar, MapPin, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './MyBookings.css';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await bookingApi.getBookingHistory();
        setBookings(data);
      } catch (error) {
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleDownload = (pdfUrl) => {
    if (pdfUrl) {
      window.open(`http://localhost:5000${pdfUrl}`, '_blank');
    } else {
      toast.error('Ticket PDF not available yet');
    }
  };

  if (loading) return <div className="loading-screen">Loading bookings...</div>;

  return (
    <div className="my-bookings-page">
      <div className="bookings-container">
        <h1 className="page-title">My Bookings</h1>
        
        {bookings.length === 0 ? (
          <div className="no-bookings">
            <p>You haven't booked any movies yet.</p>
            <Link to="/movies" className="browse-btn">Browse Movies</Link>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-poster">
                  <img 
                    src={booking.movieId?.poster} 
                    alt={booking.movieId?.title} 
                  />
                </div>
                <div className="booking-info">
                  <div className="booking-header">
                    <h2>{booking.movieId?.title}</h2>
                    <span className={`status-badge ${booking.status || 'confirmed'}`}>
                      {booking.status || 'confirmed'}
                    </span>
                  </div>
                  
                  <div className="booking-details">
                    <p><MapPin size={16} /> {booking.cinemaId?.name}, {booking.cinemaId?.location}</p>
                    <p><Calendar size={16} /> {new Date(booking.showDate).toLocaleDateString()}</p>
                    <p><Clock size={16} /> {booking.showTime}</p>
                  </div>
                  
                  <div className="booking-seats">
                    <strong>Seats:</strong> {booking.seats.map(s => `${s.row}${s.number}`).join(', ')}
                  </div>
                  
                  <div className="booking-footer">
                    <div className="booking-price">
                      Total: <span>Rs. {booking.totalPrice}</span>
                    </div>
                    {(booking.status === 'confirmed' || !booking.status) && (
                      <button 
                        onClick={() => handleDownload(booking.ticketPdf)} 
                        className="download-btn"
                      >
                        <Download size={16} /> Download Ticket
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
