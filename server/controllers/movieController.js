import asyncHandler from 'express-async-handler';
import Movie from '../models/Movie.js';

// @desc Get all movies
// @route GET /api/movies
export const getMovies = asyncHandler(async (req, res) => {
  const { status, genre, search, page = 1, limit = 12 } = req.query;
  const query = {};

  if (status) query.status = status;
  if (genre) query.genre = { $in: [genre] };
  if (search) query.title = { $regex: search, $options: 'i' };

  const count = await Movie.countDocuments(query);
  const movies = await Movie.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  res.json({ movies, total: count, page: Number(page), pages: Math.ceil(count / limit) });
});

// @desc Get single movie
// @route GET /api/movies/:id
export const getMovieById = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (movie) res.json(movie);
  else { res.status(404); throw new Error('Movie not found'); }
});

// @desc Create movie
// @route POST /api/movies
export const createMovie = asyncHandler(async (req, res) => {
  const { title, description, duration, genre, language, poster, backdrop, trailer, releaseDate, rating, imdbRating, status, cast, director } = req.body;

  const movie = await Movie.create({
    title, description, duration,
    genre: Array.isArray(genre) ? genre : genre.split(',').map(g => g.trim()),
    language, poster, backdrop, trailer, releaseDate, rating, imdbRating, status, cast, director
  });
  res.status(201).json(movie);
});

// @desc Update movie
// @route PUT /api/movies/:id
export const updateMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (movie) {
    Object.assign(movie, req.body);
    if (req.body.genre && !Array.isArray(req.body.genre)) {
      movie.genre = req.body.genre.split(',').map(g => g.trim());
    }
    const updated = await movie.save();
    res.json(updated);
  } else { res.status(404); throw new Error('Movie not found'); }
});

// @desc Delete movie
// @route DELETE /api/movies/:id
export const deleteMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (movie) { await movie.deleteOne(); res.json({ message: 'Movie removed' }); }
  else { res.status(404); throw new Error('Movie not found'); }
});

// @desc Upload movie poster
// @route POST /api/movies/upload
export const uploadPoster = asyncHandler(async (req, res) => {
  if (!req.file) { res.status(400); throw new Error('No file uploaded'); }
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});
