import { mockMovies, saveData } from '../data/mockData';

let _idCounter = 100;

export const getMovies = async (params) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...mockMovies];
      if (params?.limit) {
        filtered = filtered.slice(0, params.limit);
      }
      resolve({ data: { movies: filtered, total: filtered.length, page: 1, pages: 1 } });
    }, 300);
  });
};

export const getMovieById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const movie = mockMovies.find(m => m._id === id);
      if (movie) resolve({ data: movie });
      else reject({ response: { status: 404, data: { message: 'Not found' } } });
    }, 300);
  });
};

export const createMovie = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMovie = {
        _id: 'm' + Date.now(),
        ...data,
        genre: Array.isArray(data.genre) ? data.genre : (data.genre || '').split(',').map(g => g.trim()).filter(Boolean),
        duration: Number(data.duration) || 0,
        rating: Number(data.rating) || 0,
      };
      mockMovies.push(newMovie);
      saveData('cinematix_movies', mockMovies);
      resolve({ data: newMovie });
    }, 400);
  });
};

export const updateMovie = async (id, data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const idx = mockMovies.findIndex(m => m._id === id);
      if (idx === -1) return reject({ response: { status: 404, data: { message: 'Not found' } } });
      
      const updated = {
        ...mockMovies[idx],
        ...data,
        genre: Array.isArray(data.genre) ? data.genre : (data.genre || '').split(',').map(g => g.trim()).filter(Boolean),
        duration: Number(data.duration) || mockMovies[idx].duration,
        rating: Number(data.rating) || mockMovies[idx].rating,
      };
      mockMovies[idx] = updated;
      saveData('cinematix_movies', mockMovies);
      resolve({ data: updated });
    }, 400);
  });
};

export const deleteMovie = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = mockMovies.findIndex(m => m._id === id);
      if (idx !== -1) {
        mockMovies.splice(idx, 1);
        saveData('cinematix_movies', mockMovies);
      }
      resolve({ data: { message: 'Deleted' } });
    }, 300);
  });
};

export const uploadPoster = async (formData) => Promise.resolve({ data: { url: '/poster_generic.jpg' } });
