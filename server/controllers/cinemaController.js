import asyncHandler from 'express-async-handler';
import Cinema from '../models/Cinema.js';

export const getCinemas = asyncHandler(async (req, res) => {
  const cinemas = await Cinema.find({ isActive: true }).sort({ name: 1 });
  res.json(cinemas);
});

export const getCinemaById = asyncHandler(async (req, res) => {
  const cinema = await Cinema.findById(req.params.id);
  if (cinema) res.json(cinema);
  else { res.status(404); throw new Error('Cinema not found'); }
});

export const createCinema = asyncHandler(async (req, res) => {
  const cinema = await Cinema.create(req.body);
  res.status(201).json(cinema);
});

export const updateCinema = asyncHandler(async (req, res) => {
  const cinema = await Cinema.findById(req.params.id);
  if (cinema) {
    Object.assign(cinema, req.body);
    const updated = await cinema.save();
    res.json(updated);
  } else { res.status(404); throw new Error('Cinema not found'); }
});

export const deleteCinema = asyncHandler(async (req, res) => {
  const cinema = await Cinema.findById(req.params.id);
  if (cinema) { await cinema.deleteOne(); res.json({ message: 'Cinema removed' }); }
  else { res.status(404); throw new Error('Cinema not found'); }
});
