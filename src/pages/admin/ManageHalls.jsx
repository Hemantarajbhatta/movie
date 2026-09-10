import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import * as cinemaApi from '../../api/cinemaApi';

const ManageHalls = () => {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCinema, setCurrentCinema] = useState(null);
  const [formData, setFormData] = useState({
    name: '', location: '', city: '', address: '', amenities: ''
  });

  const fetchCinemas = async () => {
    setLoading(true);
    try {
      const { data } = await cinemaApi.getCinemas();
      setCinemas(data);
    } catch (err) {
      toast.error('Failed to load cinemas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCinemas();
  }, []);

  const openModal = (cinema = null) => {
    setCurrentCinema(cinema);
    if (cinema) {
      setFormData({
        name: cinema.name, location: cinema.location,
        city: cinema.city, address: cinema.address,
        amenities: (cinema.amenities || []).join(', ')
      });
    } else {
      setFormData({ name: '', location: '', city: '', address: '', amenities: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCinema(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentCinema) {
        await cinemaApi.updateCinema(currentCinema._id, formData);
        toast.success('Cinema updated successfully');
      } else {
        await cinemaApi.createCinema(formData);
        toast.success('Cinema added successfully');
      }
      closeModal();
      fetchCinemas();
    } catch (err) {
      toast.error('Failed to save cinema');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this cinema? All its screens and shows will also be affected.')) {
      try {
        await cinemaApi.deleteCinema(id);
        toast.success('Cinema deleted');
        fetchCinemas();
      } catch (err) {
        toast.error('Failed to delete cinema');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="manage-halls">
      <div className="admin-page-header">
        <h1>Manage Halls & Cinemas</h1>
        <button className="btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> Add Cinema
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Location</th>
              <th>Amenities</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cinemas.map(cinema => (
              <tr key={cinema._id}>
                <td style={{fontWeight: 500}}>{cinema.name}</td>
                <td>{cinema.city}</td>
                <td>{cinema.location}</td>
                <td>{(cinema.amenities || []).join(', ')}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-outline" onClick={() => openModal(cinema)}><Edit2 size={16} /></button>
                    <button className="btn-danger" onClick={() => handleDelete(cinema._id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {cinemas.length === 0 && (
              <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No cinemas found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{currentCinema ? 'Edit Cinema' : 'Add Cinema'}</h3>
              <button className="close-btn" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Cinema Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div style={{display: 'flex', gap: '1rem'}}>
                  <div className="form-group" style={{flex: 1}}>
                    <label>City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} required />
                  </div>
                  <div className="form-group" style={{flex: 1}}>
                    <label>Location Area</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Full Address</label>
                  <textarea name="address" rows="2" value={formData.address} onChange={handleChange} required></textarea>
                </div>
                <div className="form-group">
                  <label>Amenities (comma separated)</label>
                  <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} placeholder="e.g. 3D, Dolby, Parking" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">Save Cinema</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageHalls;
