const loadData = (key, defaultData) => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error(`Error loading ${key} from localStorage`, e);
  }
  localStorage.setItem(key, JSON.stringify(defaultData));
  return defaultData;
};

export const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// ─── Mock Users ───
export const mockAdmin = {
  _id: 'u_admin', name: 'Admin', email: 'admin@cinematix.com', phone: '9800000000', role: 'admin', token: 'mock-jwt-admin-token'
};

export const mockUser = {
  _id: 'u1', name: 'Demo User', email: 'user@cinematix.com', phone: '9800000001', role: 'user', token: 'mock-jwt-token'
};

// ─── Default Data ───
const defaultMovies = [
  { _id: 'm1', title: 'The Good Dinosaur', description: 'An epic journey into the world of dinosaurs...', poster: '/posters/dinosaur.avif', backdrop: '/posters/dinosaur.avif', duration: 93, genre: ['Animation', 'Adventure'], releaseDate: '2015-11-25', rating: 7.0, status: 'now_showing' },
  { _id: 'm2', title: 'Aladdin', description: 'A kind-hearted street urchin and a power-hungry Grand Vizier...', poster: '/posters/aladin.webp', backdrop: '/posters/aladin.webp', duration: 128, genre: ['Animation', 'Fantasy'], releaseDate: '2019-05-24', rating: 6.9, status: 'now_showing' },
  { _id: 'm3', title: 'Raya and the Last Dragon', description: 'Long ago, in Kumandra, humans and dragons lived together in harmony.', poster: '/posters/raya and the last dragon.webp', backdrop: '/posters/raya and the last dragon.webp', duration: 107, genre: ['Animation', 'Adventure'], releaseDate: '2021-03-05', rating: 7.3, status: 'now_showing' },
  { _id: 'm4', title: 'Luca', description: 'On the Italian Riviera, an unlikely friendship grows.', poster: '/posters/luca.webp', backdrop: '/posters/luca.webp', duration: 95, genre: ['Animation', 'Comedy'], releaseDate: '2021-06-18', rating: 7.5, status: 'now_showing' },
  { _id: 'm5', title: 'Tangled', description: 'Rapunzel discovers the world for the first time.', poster: '/posters/tangled.webp', backdrop: '/posters/tangled.webp', duration: 100, genre: ['Animation', 'Comedy'], releaseDate: '2010-11-24', rating: 7.7, status: 'now_showing' },
  { _id: 'm6', title: 'Coco', description: 'Miguel dreams of becoming a celebrated musician.', poster: '/posters/coco.webp', backdrop: '/posters/coco.webp', duration: 105, genre: ['Animation', 'Family'], releaseDate: '2017-11-22', rating: 8.4, status: 'now_showing' },
  { _id: 'm7', title: 'Monsters, Inc.', description: 'Animated film that explores the world of Monstropolis.', poster: '/mounster.jpg', backdrop: '/mounster.jpg', duration: 92, genre: ['Animation', 'Comedy'], releaseDate: '2001-11-02', rating: 8.1, status: 'now_showing' }
];

const defaultCinemas = [
  { _id: 'c1', name: 'QFX Civil Mall', location: 'Sundhara, Kathmandu', city: 'Kathmandu', address: 'Civil Mall, Sundhara', amenities: ['3D', 'Dolby', 'Parking'] },
  { _id: 'c2', name: 'QFX Labim Mall', location: 'Pulchowk, Lalitpur', city: 'Lalitpur', address: 'Labim Mall, Pulchowk', amenities: ['3D', 'Cafeteria'] },
  { _id: 'c3', name: 'Jai Nepal Cinema', location: 'New Baneshwor', city: 'Kathmandu', address: 'New Baneshwor', amenities: ['Parking'] }
];

const defaultScreens = [
  { _id: 'scr1', cinemaId: 'c1', screenName: 'Screen 1', screenType: '3D', rows: 7, columns: 16 },
  { _id: 'scr2', cinemaId: 'c1', screenName: 'Screen 2', screenType: 'Standard', rows: 7, columns: 16 },
  { _id: 'scr3', cinemaId: 'c2', screenName: 'Audi 1', screenType: 'Standard', rows: 7, columns: 16 },
  { _id: 'scr4', cinemaId: 'c2', screenName: 'Audi 2', screenType: '3D', rows: 7, columns: 16 }
];

const defaultShows = [
  { _id: 's1', movieId: defaultMovies[0], cinemaId: defaultCinemas[0], screenId: defaultScreens[0], date: new Date().toISOString(), time: '11:45 AM', price: { standard: 350, premium: 500, vip: 800 } },
  { _id: 's2', movieId: defaultMovies[5], cinemaId: defaultCinemas[0], screenId: defaultScreens[1], date: new Date().toISOString(), time: '02:00 PM', price: { standard: 350, premium: 500, vip: 800 } }
];

const defaultSeats = Array.from({ length: 7 * 16 }).map((_, i) => {
  const rowNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const rowIdx = Math.floor(i / 16);
  const row = rowNames[rowIdx];
  const number = (i % 16) + 1;
  let type = 'standard';
  let price = 350;

  if (row === 'A' || row === 'B') { type = 'vip'; price = 800; }
  else if (row === 'C' || row === 'D') { type = 'premium'; price = 500; }

  return { row, number, type, price, isBooked: Math.random() > 0.8 };
});

// ─── Exported Persistent Data ───
export const mockMovies = loadData('cinematix_movies', defaultMovies);
export const mockCinemas = loadData('cinematix_cinemas', defaultCinemas);
export const mockScreens = loadData('cinematix_screens', defaultScreens);
export const mockShows = loadData('cinematix_shows', defaultShows);
export const mockSeats = loadData('cinematix_seats', defaultSeats);
export const mockBookings = loadData('cinematix_bookings', []);
export const mockPromos = loadData('cinematix_promos', [{ code: 'QFX10', discount: 10, expiry: '2026-12-31' }]);
