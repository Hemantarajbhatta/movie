import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, Download, Ticket, Calendar, MapPin, Clock } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import './Auth.css';

const BookingSuccessPage = () => {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return <Navigate to="/" replace />;
  }

  const movieTitle = booking.movieId?.title || 'Movie';
  const cinemaName = booking.cinemaId?.name || 'Cinema';
  const showDate = booking.showDate ? new Date(booking.showDate).toDateString() : 'N/A';
  const showTime = booking.showTime || 'N/A';
  const seatList = booking.seats?.map(s => `${s.row}${s.number}`).join(', ') || 'N/A';

  const qrData = JSON.stringify({
    bookingId: booking.bookingId,
    movie: movieTitle,
    cinema: cinemaName,
    date: showDate,
    time: showTime,
    seats: seatList,
    total: booking.totalPrice
  });

  const handleDownload = () => {
    // Create a simple text ticket for download
    const ticketContent = `
╔══════════════════════════════════════╗
║         CINEMATIX E-TICKET          ║
╠══════════════════════════════════════╣
║                                      ║
║  Booking ID: ${booking.bookingId}
║  Movie: ${movieTitle}
║  Cinema: ${cinemaName}
║  Date: ${showDate}
║  Time: ${showTime}
║  Seats: ${seatList}
║  Total: Rs. ${booking.totalPrice}
║  Payment: ${booking.paymentMethod || 'N/A'}
║                                      ║
║  Status: CONFIRMED ✓                ║
║                                      ║
╚══════════════════════════════════════╝
    `.trim();
    
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket_${booking.bookingId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="auth-container" style={{ paddingTop: '100px' }}>
      <div className="auth-card" style={{ maxWidth: '520px', textAlign: 'center' }}>
        <CheckCircle size={72} color="#4ade80" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
        <p className="auth-subtitle">Your tickets have been booked successfully.</p>
        
        {/* Ticket Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1a1f2e, #14171f)', 
          padding: '1.5rem', 
          borderRadius: '16px', 
          margin: '1.5rem 0', 
          textAlign: 'left',
          border: '1px solid rgba(59,130,246,0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: '1rem', color: '#3b82f6', fontSize: '1.2rem' }}>{movieTitle}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={14} /> {cinemaName}
                </p>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={14} /> {showDate}
                </p>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={14} /> {showTime}
                </p>
                <p style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>
                  Seats: {seatList}
                </p>
              </div>
            </div>
            
            {/* QR Code */}
            <div style={{ 
              background: '#fff', 
              padding: '8px', 
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <QRCodeSVG value={qrData} size={100} level="M" />
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px dashed rgba(255,255,255,0.1)'
          }}>
            <div>
              <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Booking ID</span>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>{booking.bookingId}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Total Paid</span>
              <p style={{ color: '#4ade80', fontWeight: 700, fontSize: '1.1rem' }}>Rs. {booking.totalPrice}</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={handleDownload} className="auth-btn" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            <Download size={20} /> Download Ticket
          </button>
          <Link to="/bookings" className="auth-btn" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.5rem', background: 'var(--glass-bg)', color: 'white', border: '1px solid var(--glass-border)' }}>
            <Ticket size={20} /> My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
