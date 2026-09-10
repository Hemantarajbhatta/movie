/**
 * Seed script - Run with: node server/seed.js
 * Creates demo admin user, movies, cinemas, screens, and shows
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Movie from './models/Movie.js';
import Cinema from './models/Cinema.js';
import Screen from './models/Screen.js';
import Show from './models/Show.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cinematix';

const movies = [
  {
    title: 'Zootopia 2',
    description: 'Detectives Judy Hopps and Nick Wilde find themselves on the twisting trail of a mysterious reptile who turns the mammal metropolis of Zootopia upside down.',
    duration: 110,
    genre: ['Animation', 'Adventure', 'Comedy'],
    language: 'English',
    poster: 'https://image.tmdb.org/t/p/w500/lPsD10PP4rgUGiGR4CCXA6iY0QQ.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/lPsD10PP4rgUGiGR4CCXA6iY0QQ.jpg',
    trailer: 'https://www.youtube.com/watch?v=jWM0ct-OLsM',
    releaseDate: new Date('2025-11-26'),
    rating: 8.2,
    imdbRating: '7.7/10',
    status: 'now_showing',
    director: 'Byron Howard',
  },
  {
    title: 'Monsters, Inc.',
    description: 'Animated film that explores the world of Monstropolis, where monsters generate their city\'s power by scaring children at night.',
    duration: 92,
    genre: ['Animation', 'Comedy', 'Family'],
    language: 'English',
    poster: '/uploads/posters/mounster.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/8rs4aK0qCeb7EwHwPExzI2N4755.jpg',
    trailer: 'https://www.youtube.com/watch?v=8GzUpUSHFE',
    releaseDate: new Date('2001-11-02'),
    rating: 8.1,
    imdbRating: '8.1/10',
    status: 'now_showing',
    director: 'Pete Docter',
  },
  {
    title: 'Raya and the Last Dragon',
    description: 'In a realm called Kumandra, a re-imagined Earth inhabited by an ancient civilization, a warrior named Raya is determined to find the last dragon.',
    duration: 107,
    genre: ['Animation', 'Action', 'Adventure', 'Fantasy'],
    language: 'English',
    poster: '/uploads/posters/raya and the last dragon.webp',
    backdrop: 'https://image.tmdb.org/t/p/original/lPsD10PP4rgUGiGR4CCXA6iY0QQ.jpg',
    trailer: 'https://www.youtube.com/watch?v=1VIZ89FEjYI',
    releaseDate: new Date('2021-03-05'),
    rating: 7.3,
    imdbRating: '7.3/10',
    status: 'now_showing',
    director: 'Don Hall',
  },
  {
    title: 'The Good Dinosaur',
    description: 'In a world where dinosaurs and humans live side-by-side, a young dinosaur named Arlo sets out on a journey after being separated from his family.',
    duration: 93,
    genre: ['Animation', 'Adventure', 'Comedy', 'Family'],
    language: 'English',
    poster: 'https://image.tmdb.org/t/p/w500/jTswp6KyDYKtvC52GbHagrZbGvD.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/jTswp6KyDYKtvC52GbHagrZbGvD.jpg',
    trailer: 'https://www.youtube.com/watch?v=fGBM-EXZLV8',
    releaseDate: new Date('2015-11-25'),
    rating: 7.0,
    imdbRating: '7.0/10',
    status: 'now_showing',
    director: 'Peter Sohn',
  },
  {
    title: 'Coco',
    description: 'Despite his family\'s generations-old ban on music, Miguel dreams of becoming a celebrated musician like his idol Ernesto de la Cruz.',
    duration: 105,
    genre: ['Animation', 'Adventure', 'Family'],
    language: 'English',
    poster: '/uploads/posters/coco.webp',
    backdrop: 'https://image.tmdb.org/t/p/original/gGEsBPAijhVUFoiNptZNemGQk15.jpg',
    trailer: 'https://www.youtube.com/watch?v=Rvr68u6k5sI',
    releaseDate: new Date('2017-11-22'),
    rating: 8.4,
    imdbRating: '8.4/10',
    status: 'now_showing',
    director: 'Lee Unkrich',
  },
  {
    title: 'Tangled',
    description: 'The magically long-haired Rapunzel has spent her entire life in a tower, but now that a runaway thief has stumbled upon her, she is about to discover the world for the first time.',
    duration: 100,
    genre: ['Animation', 'Adventure', 'Comedy', 'Fantasy'],
    language: 'English',
    poster: '/uploads/posters/tangled.webp',
    backdrop: 'https://image.tmdb.org/t/p/original/ym7Kst6a4uodryxqbGO06WcIv0T.jpg',
    trailer: 'https://www.youtube.com/watch?v=ZaHWoDk6rMw',
    releaseDate: new Date('2010-11-24'),
    rating: 7.7,
    imdbRating: '7.7/10',
    status: 'now_showing',
    director: 'Nathan Greno',
  },
];

const cinemas = [
  { name: 'QFX Civil Mall', location: 'Sundhara, Kathmandu', city: 'Kathmandu', address: 'Civil Mall, Sundhara', amenities: ['3D', 'Dolby', 'Parking', 'Food Court'] },
  { name: 'QFX Labim Mall', location: 'Pulchowk, Lalitpur', city: 'Lalitpur', address: 'Labim Mall, Pulchowk', amenities: ['3D', 'Cafeteria', 'Parking'] },
  { name: 'Jai Nepal Cinema', location: 'New Baneshwor, Kathmandu', city: 'Kathmandu', address: 'New Baneshwor', amenities: ['Parking', 'Food Counter'] },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await Movie.deleteMany();
    await Cinema.deleteMany();
    await Screen.deleteMany();
    await Show.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Create admin
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@cinematix.com',
      password: 'admin123',
      role: 'admin',
      phone: '9800000000',
    });
    // Create demo user
    await User.create({
      name: 'Demo User',
      email: 'user@cinematix.com',
      password: 'user123',
      role: 'user',
      phone: '9800000001',
    });
    console.log('👤 Created users');

    // Create movies
    const createdMovies = await Movie.insertMany(movies);
    console.log(`🎬 Created ${createdMovies.length} movies`);

    // Create cinemas
    const createdCinemas = await Cinema.insertMany(cinemas);
    console.log(`🏛️  Created ${createdCinemas.length} cinemas`);

    // Create screens for each cinema
    const createdScreens = [];
    for (const cinema of createdCinemas) {
      for (let i = 1; i <= 2; i++) {
        const screen = new Screen({
          cinemaId: cinema._id,
          screenName: `Screen ${i}`,
          rows: 7,
          columns: 16,
          screenType: i === 1 ? 'Standard' : '3D',
        });
        await screen.save();
        createdScreens.push(screen);
      }
    }
    console.log(`🎪 Created ${createdScreens.length} screens`);

    // Create shows for next 7 days
    const times = ['10:00', '13:00', '16:00', '19:00', '21:30'];
    const showsData = [];
    const today = new Date();

    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(today.getDate() + day);
      date.setHours(0, 0, 0, 0);

      for (let m = 0; m < createdMovies.length; m++) {
        const cinema = createdCinemas[m % createdCinemas.length];
        const screen = createdScreens.find(s => s.cinemaId.toString() === cinema._id.toString());
        if (!screen) continue;

        for (let t = 0; t < 2; t++) {
          showsData.push({
            movieId: createdMovies[m]._id,
            cinemaId: cinema._id,
            screenId: screen._id,
            date,
            time: times[t],
            price: { standard: 350, premium: 500, vip: 800 },
          });
        }
      }
    }
    await Show.insertMany(showsData);
    console.log(`🎭 Created ${showsData.length} shows`);

    console.log('\n✅ Seed complete!');
    console.log('📧 Admin: admin@cinematix.com / admin123');
    console.log('📧 User: user@cinematix.com / user123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed();
