import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as movieApi from '../api/movieApi';
import * as cinemaApi from '../api/cinemaApi';
import { useBooking } from '../context/BookingContext';
import { Play, Star, Clock, Calendar } from 'lucide-react';
import './MovieDetailPage.css';

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateBooking } = useBooking();
  
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Group shows by cinema
  const cinemasWithShows = shows.reduce((acc, show) => {
    const cinemaId = show.cinemaId._id;
    if (!acc[cinemaId]) {
      acc[cinemaId] = {
        cinema: show.cinemaId,
        shows: []
      };
    }
    acc[cinemaId].shows.push(show);
    return acc;
  }, {});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, showsRes] = await Promise.all([
          movieApi.getMovieById(id),
          cinemaApi.getShows({ movieId: id })
        ]);
        setMovie(movieRes.data);
        setShows(showsRes.data);
      } catch (error) {
        console.error("Error fetching movie details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleShowSelect = (show, cinema) => {
    updateBooking({
      movie,
      cinema,
      show,
    });
    // For now we'll route to the existing BookingPage which we'll refactor slightly to use Context
    navigate('/booking');
  };

  if (loading) return <div className="loading-screen">Loading details...</div>;
  if (!movie) return <div className="loading-screen">Movie not found</div>;

  return (
    <div className="movie-detail-page">
      {/* Hero Section */}
      <div className="detail-hero">
        <div className="hero-overlay"></div>
        <img 
          src={movie.backdrop} 
          alt={movie.title} 
          className="hero-bg" 
        />
        
        <div className="hero-content">
          <div className="hero-poster-wrapper">
            <img 
              src={movie.poster} 
              alt={movie.title} 
              className="hero-poster" 
            />
          </div>
          
          <div className="hero-info">
            <h1>{movie.title}</h1>
            <div className="meta-tags">
              <span className="tag">{movie.status.replace('_', ' ').toUpperCase()}</span>
              <span><Star size={16} color="#f59e0b" fill="#f59e0b"/> {movie.imdbRating}</span>
              <span><Clock size={16} /> {Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
              <span><Calendar size={16} /> {new Date(movie.releaseDate).getFullYear()}</span>
            </div>
            <div className="genres">
              {movie.genre.map(g => <span key={g} className="genre-pill">{g}</span>)}
            </div>
            <p className="description">{movie.description}</p>
          </div>
        </div>
      </div>

      {/* Showtimes Section */}
      <div className="showtimes-section">
        <h2>Select Cinema & Showtime</h2>
        
        {Object.values(cinemasWithShows).length === 0 ? (
          <div className="no-shows">No shows available currently. Check back later.</div>
        ) : (
          <div className="cinemas-list">
            {Object.values(cinemasWithShows).map(({ cinema, shows }) => (
              <div key={cinema._id} className="cinema-block">
                <div className="cinema-header">
                  <h3>{cinema.name}</h3>
                  <p>{cinema.location}</p>
                </div>
                
                <div className="shows-grid">
                  {shows.map(show => (
                    <button 
                      key={show._id} 
                      className="show-pill"
                      onClick={() => handleShowSelect(show, cinema)}
                    >
                      <div className="show-time">{show.time}</div>
                      <div className="show-type">{show.screenId.screenType}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;
