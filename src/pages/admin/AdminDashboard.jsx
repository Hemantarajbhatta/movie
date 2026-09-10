import React, { useState, useEffect } from 'react';
import { Film, MonitorPlay, CalendarDays, Ticket } from 'lucide-react';
import * as movieApi from '../../api/movieApi';
import * as cinemaApi from '../../api/cinemaApi';
import * as bookingApi from '../../api/bookingApi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    movies: 0,
    cinemas: 0,
    shows: 0,
    bookings: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [moviesRes, cinemasRes, showsRes, bookingsRes] = await Promise.all([
          movieApi.getMovies({ limit: 100 }),
          cinemaApi.getCinemas(),
          cinemaApi.getAllShows(),
          bookingApi.getAllBookings()
        ]);

        setStats({
          movies: moviesRes.data.movies.length,
          cinemas: cinemasRes.data.length,
          shows: showsRes.data.length,
          bookings: bookingsRes.data.bookings.length
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1>Dashboard Overview</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Film size={28} /></div>
          <div className="stat-info">
            <h3>Total Movies</h3>
            <div className="stat-value">{stats.movies}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{color: '#8b5cf6', backgroundColor: 'rgba(139, 92, 246, 0.1)'}}>
            <MonitorPlay size={28} />
          </div>
          <div className="stat-info">
            <h3>Cinemas & Halls</h3>
            <div className="stat-value">{stats.cinemas}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)'}}>
            <CalendarDays size={28} />
          </div>
          <div className="stat-info">
            <h3>Active Shows</h3>
            <div className="stat-value">{stats.shows}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)'}}>
            <Ticket size={28} />
          </div>
          <div className="stat-info">
            <h3>Total Bookings</h3>
            <div className="stat-value">{stats.bookings}</div>
          </div>
        </div>
      </div>
      
      <div className="admin-table-container" style={{padding: '2rem', textAlign: 'center', color: '#9ca3af'}}>
        <h2>Welcome to Cinematix Admin</h2>
        <p style={{marginTop: '1rem'}}>Select an option from the sidebar to manage content.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
