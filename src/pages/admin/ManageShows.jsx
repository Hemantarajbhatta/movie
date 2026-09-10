import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import * as cinemaApi from '../../api/cinemaApi';
import * as movieApi from '../../api/movieApi';

const ManageShows = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentShow, setCurrentShow] = useState(null);
  
  const [formData, setFormData] = useState({
    movieId: '', cinemaId: '', screenId: '', 
    date: '', time: '', 
    priceStandard: 350, pricePremium: 500, priceVip: 800
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [showsRes, moviesRes, cinemasRes] = await Promise.all([
        cinemaApi.getAllShows(),
        movieApi.getMovies({ limit: 100 }),
        cinemaApi.getCinemas()
      ]);
      setShows(showsRes.data);
      setMovies(moviesRes.data.movies);
      setCinemas(cinemasRes.data);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch screens when a cinema is selected
  useEffect(() => {
    const fetchScreens = async () => {
      if (formData.cinemaId) {
        try {
          const { data } = await cinemaApi.getScreensByCinema(formData.cinemaId);
          setScreens(data);
          // If editing and screen matches, keep it, else auto-select first screen or reset
          if (currentShow && currentShow.cinemaId._id === formData.cinemaId) {
            setFormData(prev => ({ ...prev, screenId: currentShow.screenId._id }));
          } else if (data.length > 0) {
            setFormData(prev => ({ ...prev, screenId: data[0]._id }));
          } else {
            setFormData(prev => ({ ...prev, screenId: '' }));
          }
        } catch (err) {
          console.error('Failed to load screens');
        }
      } else {
        setScreens([]);
      }
    };
    fetchScreens();
  }, [formData.cinemaId, currentShow]);

  const openModal = (show = null) => {
    setCurrentShow(show);
    if (show) {
      setFormData({
        movieId: show.movieId._id,
        cinemaId: show.cinemaId._id,
        screenId: show.screenId._id,
        date: show.date.split('T')[0],
        time: show.time,
        priceStandard: show.price.standard,
        pricePremium: show.price.premium,
        priceVip: show.price.vip
      });
    } else {
      setFormData({
        movieId: movies.length > 0 ? movies[0]._id : '',
        cinemaId: cinemas.length > 0 ? cinemas[0]._id : '',
        screenId: '',
        date: new Date().toISOString().split('T')[0],
        time: '12:00 PM',
        priceStandard: 350, pricePremium: 500, priceVip: 800
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentShow(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.movieId || !formData.cinemaId || !formData.screenId) {
      toast.error('Please select a movie, cinema, and screen');
      return;
    }
    
    try {
      if (currentShow) {
        await cinemaApi.updateShow(currentShow._id, formData);
        toast.success('Show updated successfully');
      } else {
        await cinemaApi.createShow(formData);
        toast.success('Show added successfully');
      }
      closeModal();
      fetchData(); // refresh list
    } catch (err) {
      toast.error('Failed to save show');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this show?')) {
      try {
        await cinemaApi.deleteShow(id);
        toast.success('Show deleted');
        fetchData();
      } catch (err) {
        toast.error('Failed to delete show');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="manage-shows">
      <div className="admin-page-header">
        <h1>Manage Shows</h1>
        <button className="btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> Add Show
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Movie</th>
              <th>Cinema</th>
              <th>Screen</th>
              <th>Date & Time</th>
              <th>Base Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shows.map(show => (
              <tr key={show._id}>
                <td style={{fontWeight: 500}}>{show.movieId.title}</td>
                <td>{show.cinemaId.name}</td>
                <td>{show.screenId.screenName}</td>
                <td>
                  <div>{new Date(show.date).toLocaleDateString()}</div>
                  <div style={{color: '#fff'}}>{show.time}</div>
                </td>
                <td>Rs. {show.price.standard}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-outline" onClick={() => openModal(show)}><Edit2 size={16} /></button>
                    <button className="btn-danger" onClick={() => handleDelete(show._id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {shows.length === 0 && (
              <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No shows found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{currentShow ? 'Edit Show' : 'Add Show'}</h3>
              <button className="close-btn" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Movie</label>
                  <select name="movieId" value={formData.movieId} onChange={handleChange} required>
                    <option value="" disabled>Select a movie</option>
                    {movies.map(m => (
                      <option key={m._id} value={m._id}>{m.title}</option>
                    ))}
                  </select>
                </div>
                
                <div style={{display: 'flex', gap: '1rem'}}>
                  <div className="form-group" style={{flex: 1}}>
                    <label>Cinema</label>
                    <select name="cinemaId" value={formData.cinemaId} onChange={handleChange} required>
                      <option value="" disabled>Select a cinema</option>
                      {cinemas.map(c => (
                        <option key={c._id} value={c._id}>{c.name} - {c.city}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{flex: 1}}>
                    <label>Screen</label>
                    <select name="screenId" value={formData.screenId} onChange={handleChange} required disabled={!formData.cinemaId || screens.length === 0}>
                      {screens.length === 0 ? <option value="">No screens available</option> : null}
                      {screens.map(s => (
                        <option key={s._id} value={s._id}>{s.screenName} ({s.screenType})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{display: 'flex', gap: '1rem'}}>
                  <div className="form-group" style={{flex: 1}}>
                    <label>Show Date</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                  </div>
                  <div className="form-group" style={{flex: 1}}>
                    <label>Show Time (e.g. 11:45 AM)</label>
                    <input type="text" name="time" value={formData.time} onChange={handleChange} required />
                  </div>
                </div>

                <label style={{display: 'block', marginBottom: '0.5rem', color: '#9ca3af', fontSize: '0.9rem', marginTop: '1rem'}}>Pricing (NPR)</label>
                <div style={{display: 'flex', gap: '1rem'}}>
                  <div className="form-group" style={{flex: 1}}>
                    <label>Standard</label>
                    <input type="number" name="priceStandard" value={formData.priceStandard} onChange={handleChange} required />
                  </div>
                  <div className="form-group" style={{flex: 1}}>
                    <label>Premium</label>
                    <input type="number" name="pricePremium" value={formData.pricePremium} onChange={handleChange} required />
                  </div>
                  <div className="form-group" style={{flex: 1}}>
                    <label>VIP</label>
                    <input type="number" name="priceVip" value={formData.priceVip} onChange={handleChange} required />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">Save Show</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageShows;
