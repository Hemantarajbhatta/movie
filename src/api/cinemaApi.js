import { mockCinemas, mockShows, mockSeats, mockScreens, mockMovies, saveData } from '../data/mockData';

let _idCounter = 200;

// ─── Cinemas ───
export const getCinemas = async () => Promise.resolve({ data: mockCinemas });

export const getCinemaById = async (id) => Promise.resolve({ data: mockCinemas.find(c => c._id === id) });

export const createCinema = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCinema = {
        _id: 'c' + (++_idCounter),
        ...data,
        amenities: Array.isArray(data.amenities) ? data.amenities : (data.amenities || '').split(',').map(a => a.trim()).filter(Boolean),
      };
      mockCinemas.push(newCinema);
      saveData('cinematix_cinemas', mockCinemas);
      resolve({ data: newCinema });
    }, 400);
  });
};

export const updateCinema = async (id, data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = mockCinemas.findIndex(c => c._id === id);
      if (idx !== -1) {
        mockCinemas[idx] = {
          ...mockCinemas[idx],
          ...data,
          amenities: Array.isArray(data.amenities) ? data.amenities : (data.amenities || '').split(',').map(a => a.trim()).filter(Boolean),
        };
      }
      saveData('cinematix_cinemas', mockCinemas);
      resolve({ data: mockCinemas[idx] });
    }, 400);
  });
};

export const deleteCinema = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = mockCinemas.findIndex(c => c._id === id);
      if (idx !== -1) {
        mockCinemas.splice(idx, 1);
        saveData('cinematix_cinemas', mockCinemas);
      }
      resolve({ data: { message: 'Deleted' } });
    }, 300);
  });
};

// ─── Screens ───
export const getScreensByCinema = async (cinemaId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: mockScreens.filter(s => s.cinemaId === cinemaId) });
    }, 200);
  });
};

export const createScreen = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newScreen = { _id: 'scr' + (++_idCounter), ...data };
      mockScreens.push(newScreen);
      resolve({ data: newScreen });
    }, 300);
  });
};

export const deleteScreen = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = mockScreens.findIndex(s => s._id === id);
      if (idx !== -1) mockScreens.splice(idx, 1);
      resolve({ data: { message: 'Deleted' } });
    }, 300);
  });
};

// ─── Shows ───
export const getShows = async (params) => {
  return new Promise(resolve => {
    setTimeout(() => {
      let filtered = [...mockShows];
      if (params?.movieId) {
        filtered = filtered.filter(s => s.movieId._id === params.movieId);
      }
      resolve({ data: filtered });
    }, 300);
  });
};

export const getAllShows = async () => {
  return new Promise(resolve => {
    setTimeout(() => resolve({ data: [...mockShows] }), 300);
  });
};

export const getShowById = async (id) => Promise.resolve({ data: mockShows.find(s => s._id === id) });

export const getShowSeats = async (id) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const show = mockShows.find(s => s._id === id);
      resolve({
        data: {
          seats: mockSeats,
          show: { time: show?.time, date: show?.date, price: show?.price }
        }
      });
    }, 300);
  });
};

export const createShow = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const movie = mockMovies.find(m => m._id === data.movieId);
      const cinema = mockCinemas.find(c => c._id === data.cinemaId);
      const screen = mockScreens.find(s => s._id === data.screenId);
      const newShow = {
        _id: 's' + Date.now(),
        movieId: movie || { _id: data.movieId, title: 'Unknown' },
        cinemaId: cinema || { _id: data.cinemaId, name: 'Unknown' },
        screenId: screen ? { _id: screen._id, screenName: screen.screenName, screenType: screen.screenType } : { _id: data.screenId, screenName: 'Unknown', screenType: 'Standard' },
        date: data.date,
        time: data.time,
        price: {
          standard: Number(data.priceStandard) || 350,
          premium: Number(data.pricePremium) || 500,
          vip: Number(data.priceVip) || 800,
        }
      };
      mockShows.push(newShow);
      saveData('cinematix_shows', mockShows);
      resolve({ data: newShow });
    }, 400);
  });
};

export const updateShow = async (id, data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = mockShows.findIndex(s => s._id === id);
      if (idx !== -1) {
        const movie = mockMovies.find(m => m._id === data.movieId);
        const cinema = mockCinemas.find(c => c._id === data.cinemaId);
        const screen = mockScreens.find(s => s._id === data.screenId);
        mockShows[idx] = {
          ...mockShows[idx],
          movieId: movie || mockShows[idx].movieId,
          cinemaId: cinema || mockShows[idx].cinemaId,
          screenId: screen ? { _id: screen._id, screenName: screen.screenName, screenType: screen.screenType } : mockShows[idx].screenId,
          date: data.date || mockShows[idx].date,
          time: data.time || mockShows[idx].time,
          price: {
            standard: Number(data.priceStandard) || mockShows[idx].price.standard,
            premium: Number(data.pricePremium) || mockShows[idx].price.premium,
            vip: Number(data.priceVip) || mockShows[idx].price.vip,
          }
        };
        saveData('cinematix_shows', mockShows);
      }
      resolve({ data: mockShows[idx] });
    }, 400);
  });
};

export const deleteShow = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = mockShows.findIndex(s => s._id === id);
      if (idx !== -1) {
        mockShows.splice(idx, 1);
        saveData('cinematix_shows', mockShows);
      }
      resolve({ data: { message: 'Deleted' } });
    }, 300);
  });
};
