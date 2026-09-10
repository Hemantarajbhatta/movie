import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import * as movieApi from '../../api/movieApi';

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', genre: '', duration: '', 
    releaseDate: '', rating: '', poster: '', backdrop: '', status: 'now_showing'
  });

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const { data } = await movieApi.getMovies({ limit: 100 });
      setMovies(data.movies);
    } catch (err) {
      toast.error('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const openModal = (movie = null) => {
    setCurrentMovie(movie);
    if (movie) {
      setFormData({
        title: movie.title, description: movie.description,
        genre: movie.genre.join(', '), duration: movie.duration,
        releaseDate: movie.releaseDate.split('T')[0],
        rating: movie.rating || movie.imdbRating?.split('/')[0] || '',
        poster: movie.poster, backdrop: movie.backdrop,
        status: movie.status
      });
    } else {
      setFormData({
        title: '', description: '', genre: '', duration: '',
        releaseDate: '', rating: '', poster: '', backdrop: '', status: 'now_showing'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMovie(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentMovie) {
        await movieApi.updateMovie(currentMovie._id, formData);
        toast.success('Movie updated successfully');
      } else {
        await movieApi.createMovie(formData);
        toast.success('Movie added successfully');
      }
      closeModal();
      fetchMovies();
    } catch (err) {
      toast.error('Failed to save movie');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await movieApi.deleteMovie(id);
        toast.success('Movie deleted');
        fetchMovies();
      } catch (err) {
        toast.error('Failed to delete movie');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="manage-movies">
      <div className="admin-page-header">
        <h1>Manage Movies</h1>
        <button className="btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> Add Movie
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Poster</th>
              <th>Title</th>
              <th>Genre</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(movie => (
              <tr key={movie._id}>
                <td>
                  <img src={movie.poster} alt={movie.title} style={{width: '40px', borderRadius: '4px'}} />
                </td>
                <td style={{fontWeight: 500}}>{movie.title}</td>
                <td>{movie.genre.join(', ')}</td>
                <td>
                  <span style={{padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', backgroundColor: movie.status === 'now_showing' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: movie.status === 'now_showing' ? '#10b981' : '#f59e0b'}}>
                    {movie.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-outline" onClick={() => openModal(movie)}><Edit2 size={16} /></button>
                    <button className="btn-danger" onClick={() => handleDelete(movie._id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{currentMovie ? 'Edit Movie' : 'Add Movie'}</h3>
              <button className="close-btn" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" rows="3" value={formData.description} onChange={handleChange} required></textarea>
                </div>
                <div style={{display: 'flex', gap: '1rem'}}>
                  <div className="form-group" style={{flex: 1}}>
                    <label>Genre (comma separated)</label>
                    <input type="text" name="genre" value={formData.genre} onChange={handleChange} required />
                  </div>
                  <div className="form-group" style={{flex: 1}}>
                    <label>Duration (mins)</label>
                    <input type="number" name="duration" value={formData.duration} onChange={handleChange} required />
                  </div>
                </div>
                <div style={{display: 'flex', gap: '1rem'}}>
                  <div className="form-group" style={{flex: 1}}>
                    <label>Release Date</label>
                    <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} required />
                  </div>
                  <div className="form-group" style={{flex: 1}}>
                    <label>Rating (out of 10)</label>
                    <input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleChange} required />
                  </div>
                </div>
                <div style={{display: 'flex', gap: '1rem'}}>
                  <div className="form-group" style={{flex: 1}}>
                    <label>Poster URL (local path or http)</label>
                    <input type="text" name="poster" value={formData.poster} onChange={handleChange} required />
                  </div>
                  <div className="form-group" style={{flex: 1}}>
                    <label>Backdrop URL</label>
                    <input type="text" name="backdrop" value={formData.backdrop} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="now_showing">Now Showing</option>
                    <option value="coming_soon">Coming Soon</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">Save Movie</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMovies;
