import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  genre: [{
    type: String,
    required: true,
  }],
  language: {
    type: String,
    default: 'English',
  },
  poster: {
    type: String,
    default: '',
  },
  backdrop: {
    type: String,
    default: '',
  },
  trailer: {
    type: String, // YouTube URL
    default: '',
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
  imdbRating: {
    type: String,
    default: 'N/A',
  },
  status: {
    type: String,
    enum: ['upcoming', 'now_showing', 'ended'],
    default: 'now_showing',
  },
  cast: [{
    name: String,
    role: String,
    image: String,
  }],
  director: {
    type: String,
    default: '',
  },
}, { timestamps: true });

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
