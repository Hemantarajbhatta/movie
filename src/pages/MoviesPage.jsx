import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as movieApi from '../api/movieApi';
import { Star, Search, Filter } from 'lucide-react';
import './MoviesPage.css';

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  
  const genres = ['All', 'Action', 'Animation', 'Comedy', 'Adventure', 'Sci-Fi'];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await movieApi.getMovies({});
        setMovies(data.movies);
      } catch (error) {
        console.error("Failed to fetch movies", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || movie.genre.includes(filter);
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="loading-screen">Loading Movies...</div>;

  return (
    <div className="movies-page-container">
      <div className="movies-header">
        <h1>Explore Movies</h1>
        
        <div className="movies-controls">
          <div className="search-bar">
            <Search size={20} color="#8b95a5" />
            <input 
              type="text" 
              placeholder="Search movies..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="genre-filters">
            <Filter size={20} color="#8b95a5" style={{ marginRight: '0.5rem' }} />
            {genres.map(g => (
              <button 
                key={g} 
                className={`filter-btn ${filter === g ? 'active' : ''}`}
                onClick={() => setFilter(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="movies-grid-full">
        {filteredMovies.length === 0 ? (
          <div className="no-results">No movies found matching your criteria.</div>
        ) : (
          filteredMovies.map(movie => (
            <Link to={`/movies/${movie._id}`} key={movie._id} className="movie-card-link">
              <div className="movie-card">
                <div className="card-image-wrapper">
                  <img 
                    src={movie.poster} 
                    alt={movie.title} 
                  />
                  <div className="card-overlay">
                    <button className="book-btn-small">Book Now</button>
                  </div>
                  <div className="rating-badge">
                    <Star fill="#f59e0b" color="#f59e0b" size={12} /> {movie.imdbRating || movie.rating}
                  </div>
                </div>
                <div className="card-info">
                  <h3>{movie.title}</h3>
                  <p>{movie.genre.join(', ')}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default MoviesPage;
