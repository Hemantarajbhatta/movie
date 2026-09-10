import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Menu, Settings2, Ticket, Search, Heart, User,
  ChevronRight, ChevronLeft, Calendar, Play, X, Clock
} from 'lucide-react';
import * as movieApi from '../api/movieApi';
import { useBooking } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';
import './BookingPage.css';

function BookingPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setBookingData } = useBooking();
  const navigate = useNavigate();

  // States for booking
  const [selectedDate, setSelectedDate] = useState('18');
  const [selectedTime, setSelectedTime] = useState('11:45 AM');
  const [selectedSeats, setSelectedSeats] = useState([
    { id: 'B8', row: 'B', num: 8, price: 15 },
    { id: 'B9', row: 'B', num: 9, price: 15 },
    { id: 'B10', row: 'B', num: 10, price: 15 }
  ]);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const { data } = await movieApi.getMovieById(id);
        setMovie(data);
      } catch (err) {
        console.error("Movie not found");
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  const dates = [
    { day: 'Mon', num: '18' },
    { day: 'Tue', num: '19' },
    { day: 'Wed', num: '20' },
    { day: 'Thu', num: '21' },
    { day: 'Fri', num: '22' },
    { day: 'Sat', num: '23' },
    { day: 'Sun', num: '24' },
  ];

  const times = ['11:45 AM', '1:20 PM', '4:45 PM', '10:20 PM'];
  const rows = ['G', 'F', 'E', 'D', 'C', 'B', 'A'];
  
  // Randomly pre-book some seats for the visual effect
  const bookedSeats = ['G5', 'F12', 'E8', 'E9', 'D10', 'D11', 'B2', 'B3', 'A15', 'A16', 'C7', 'C8'];

  const handleSeatClick = (row, num) => {
    const seatId = `${row}${num}`;
    if (bookedSeats.includes(seatId)) return;

    const price = 15;
    const isSelected = selectedSeats.some(s => s.id === seatId);
    
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, { id: seatId, row, num, price }]);
    }
  };

  const removeSeat = (seatId) => {
    setSelectedSeats(selectedSeats.filter(s => s.id !== seatId));
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const handleBuy = () => {
    setBookingData({
      movie: movie,
      cinema: { _id: 'c1', name: 'QFX Civil Mall' },
      show: { _id: 's1', date: new Date().toISOString(), time: selectedTime },
      seats: selectedSeats.map(s => ({ row: s.row, number: s.num, type: 'standard', price: s.price })),
      totalPrice: totalPrice
    });
    navigate('/payment');
  };

  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!movie) return <div className="loading-screen">Movie not found</div>;

  return (
    <div className="zootopia-booking-container">
      <div className="booking-inner-wrapper">
        
        {/* Top Navbar */}
        <header className="zootopia-header">
          <div className="header-left">
            <button className="icon-box"><Menu size={20} /></button>
            <button className="icon-box"><Settings2 size={20} /></button>
            <div className="filter-pill">New <ChevronRight size={14} className="rotate-down" /></div>
            <div className="filter-pill outline">From $10 <X size={14} className="ml-icon" /></div>
            <div className="filter-pill outline">{movie.title.substring(0,10)} <X size={14} className="ml-icon" /></div>
          </div>
          
          <div className="header-center">
            <Link to="/" className="logo">Cinematix</Link>
          </div>
          
          <div className="header-right">
            <button className="icon-box"><Ticket size={20} /></button>
            <button className="icon-box"><Search size={20} /></button>
            <button className="icon-box"><Heart size={20} /></button>
            <button className="user-profile-btn">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=32&h=32&q=80" alt="User" />
              <ChevronRight size={14} className="rotate-down" />
            </button>
          </div>
        </header>

        <main className="zootopia-main">
          {/* Left Panel */}
          <div className="zootopia-left-panel">
            
            {/* Date Selector */}
            <div className="date-carousel">
              <button className="calendar-btn"><Calendar size={20} /></button>
              <div className="dates-list">
                {dates.map((date) => (
                  <button 
                    key={date.num} 
                    className={`date-box ${selectedDate === date.num ? 'active' : ''}`}
                    onClick={() => setSelectedDate(date.num)}
                  >
                    <span className="day-name">{date.day}</span>
                    <span className="day-num">{date.num}</span>
                  </button>
                ))}
              </div>
              <div className="carousel-nav">
                <button className="nav-arrow"><ChevronRight size={16} className="rotate-up" /></button>
                <button className="nav-arrow"><ChevronRight size={16} className="rotate-down" /></button>
              </div>
            </div>

            {/* Movie Info */}
            <div className="movie-details-block">
              <div className="poster-wrapper">
                <img src={movie.poster} alt={movie.title} className="main-poster" />
                <button className="poster-play-btn"><Play size={24} fill="currentColor" /></button>
              </div>
              <div className="movie-info-text">
                <h1>{movie.title}</h1>
                <div className="movie-meta">{new Date(movie.releaseDate).getFullYear()} · {Math.floor(movie.duration / 60)}h {movie.duration % 60}min</div>
                <p className="movie-desc">{movie.description}</p>
                <div className="movie-ratings">
                  <div className="rating-box">
                    <span className="r-label">IMDb</span>
                    <span className="r-val">{movie.imdbRating}</span>
                  </div>
                  <div className="rating-box">
                    <span className="r-label">Letterboxd</span>
                    <span className="r-val">3.8/5</span>
                  </div>
                  <div className="rating-box">
                    <span className="r-label">Critic Score</span>
                    <span className="r-val">91%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Selector */}
            <div className="time-selector-block">
              <div className="section-label">
                <Clock size={16} /> Selected Time
              </div>
              <div className="times-row">
                {times.map((time) => (
                  <button 
                    key={time} 
                    className={`time-pill ${selectedTime === time ? 'active' : ''}`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time.split(' ')[0]} <span>{time.split(' ')[1]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Tickets */}
            <div className="tickets-block">
              <div className="section-label">
                <Ticket size={16} /> Selected Tickets
              </div>
              
              <div className="tickets-grid">
                {selectedSeats.length === 0 ? (
                  <div className="empty-tickets">No seats selected</div>
                ) : (
                  selectedSeats.map(seat => (
                    <div key={seat.id} className="ticket-card">
                      <div className="t-seat">
                        <strong>{seat.row}</strong> row <strong>{seat.num.toString().padStart(2, '0')}</strong> seat
                      </div>
                      <div className="t-price">$ {seat.price}</div>
                      <button className="t-remove" onClick={() => removeSeat(seat.id)}>
                        <X size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="booking-footer">
                <div className="total-display">
                  Total - <span>${totalPrice}</span>
                </div>
                <button className="buy-action-btn" disabled={selectedSeats.length === 0} onClick={handleBuy}>
                  Buy
                </button>
              </div>
            </div>

          </div>

          {/* Right Panel (Seat Map) */}
          <div className="zootopia-right-panel">
            <div className="screen-wrapper">
              <div className="screen-curve"></div>
              <div className="screen-text">S C R E E N</div>
            </div>

            <div className="seat-grid-container">
              {rows.map(row => (
                <div key={row} className="grid-row">
                  <span className="r-indicator">{row}</span>
                  <div className="grid-seats">
                    {[...Array(16)].map((_, i) => {
                      const num = i + 1;
                      const seatId = `${row}${num}`;
                      const isBooked = bookedSeats.includes(seatId);
                      const isSelected = selectedSeats.some(s => s.id === seatId);
                      
                      let sClass = 's-btn';
                      if (isBooked) sClass += ' booked';
                      else if (isSelected) sClass += ' selected';
                      else sClass += ' available';

                      return (
                        <button 
                          key={num} 
                          className={sClass}
                          onClick={() => handleSeatClick(row, num)}
                          disabled={isBooked}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                  <span className="r-indicator">{row}</span>
                </div>
              ))}
            </div>

            <div className="seat-legend-block">
              <div className="l-item">
                <div className="l-box selected"></div>
                <span>Selected</span>
              </div>
              <div className="l-item">
                <div className="l-box available"></div>
                <span>Available</span>
              </div>
              <div className="l-item">
                <div className="l-box booked"></div>
                <span>Booked</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default BookingPage;
