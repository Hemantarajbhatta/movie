import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as movieApi from '../api/movieApi';
import * as cinemaApi from '../api/cinemaApi';
import { Play, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './HomePage.css';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: movieData }, { data: showData }] = await Promise.all([
          movieApi.getMovies({ limit: 12 }),
          cinemaApi.getAllShows()
        ]);
        
        setMovies(movieData.movies);
        
        // Extract unique movies from shows to determine "trending"
        // Sort by createdAt so the most recently added shows appear first in trending
        const uniqueMoviesFromShows = [];
        const seenIds = new Set();
        
        const sortedShows = [...showData].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        sortedShows.forEach(show => {
          if (!show || !show.movieId) return; // Prevent crashes if movie was deleted but show remains
          
          const movieId = typeof show.movieId === 'string' ? show.movieId : show.movieId._id;
          const movieIdStr = String(movieId);

          if (!seenIds.has(movieIdStr)) {
            seenIds.add(movieIdStr);
            const fullMovie = movieData.movies.find(m => String(m._id) === movieIdStr) || show.movieId;
            if (fullMovie && fullMovie.title !== 'Monsters, Inc.' && fullMovie.title !== 'Monsters, INC.') {
              uniqueMoviesFromShows.push(fullMovie);
            }
          }
        });
        
        // If we don't have enough shows, pad with regular movies
        let finalTrending = [...uniqueMoviesFromShows];
        if (finalTrending.length < 6) {
          const padding = movieData.movies.filter(m => 
            m.title !== 'Monsters, Inc.' && 
            m.title !== 'Monsters, INC.' && 
            !seenIds.has(String(m._id))
          );
          finalTrending = [...finalTrending, ...padding];
        }
        
        setTrendingMovies(finalTrending.slice(0, 6));

      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-screen">Loading...</div>;

  const heroMovies = trendingMovies.length > 0 ? trendingMovies.slice(0, 4) : movies.slice(0, 4);

  return (
    <div className="moov-home-container">
      {/* Hero Section */}
      {heroMovies.length > 0 && (
        <section className="moov-hero">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            loop={true}
            className="hero-swiper"
          >
            {heroMovies.map((movie, index) => (
              <SwiperSlide key={`hero-${movie._id || index}`}>
                <div className="hero-slide-container">
                  <img 
                    src={movie.backdrop || movie.poster} 
                    alt={movie.title} 
                    className="hero-img" 
                  />
                  <div className="hero-gradient-overlay"></div>
                  
                  <div className="hero-content">
                    <h1 className="hero-title">{movie.title.toUpperCase() === 'MONSTERS, INC.' ? 'Monsters, INC.' : movie.title}</h1>
                    <p className="hero-desc">{movie.description || "Experience the magic of cinema with this amazing feature."}</p>
                    
                    <div className="hero-buttons">
                      <Link to={`/book/${movie._id}`} className="moov-btn moov-btn-primary">
                        <span>Watch Now</span>
                        <Play fill="currentColor" size={16} className="btn-icon" />
                      </Link>
                      <Link to={`/book/${movie._id}`} className="moov-btn moov-btn-secondary">
                        <span>Details</span>
                        <ChevronRight size={16} className="btn-icon" />
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}

      <div className="moov-main-content">
        
        {/* Trending Movies */}
        <section className="moov-section">
          <h2 className="section-title">Trending Movies</h2>
          <div className="poster-row">
            {trendingMovies.map((movie, idx) => (
              <Link to={`/book/${movie._id}`} key={`trend-${idx}`} className="poster-card">
                <img src={movie.poster} alt={movie.title} />
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default HomePage;
