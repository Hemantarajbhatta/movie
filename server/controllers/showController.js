import asyncHandler from 'express-async-handler';
import Show from '../models/Show.js';
import Screen from '../models/Screen.js';

export const getShows = asyncHandler(async (req, res) => {
  const { movieId, cinemaId, date } = req.query;
  const query = { isActive: true };
  if (movieId) query.movieId = movieId;
  if (cinemaId) query.cinemaId = cinemaId;
  if (date) {
    const start = new Date(date); start.setHours(0, 0, 0, 0);
    const end = new Date(date); end.setHours(23, 59, 59, 999);
    query.date = { $gte: start, $lte: end };
  } else {
    query.date = { $gte: new Date() };
  }

  const shows = await Show.find(query)
    .populate('movieId', 'title poster duration')
    .populate('cinemaId', 'name location')
    .populate('screenId', 'screenName screenType')
    .sort({ date: 1, time: 1 });
  res.json(shows);
});

export const getShowById = asyncHandler(async (req, res) => {
  const show = await Show.findById(req.params.id)
    .populate('movieId')
    .populate('cinemaId')
    .populate('screenId');
  if (show) res.json(show);
  else { res.status(404); throw new Error('Show not found'); }
});

export const getShowSeats = asyncHandler(async (req, res) => {
  const show = await Show.findById(req.params.id).populate('screenId');
  if (!show) { res.status(404); throw new Error('Show not found'); }

  const screen = show.screenId;
  const seats = screen.seats.map(seat => ({
    row: seat.row,
    number: seat.number,
    type: seat.type,
    isBooked: show.bookedSeats.some(b => b.row === seat.row && b.number === seat.number),
    price: show.price[seat.type] || show.price.standard,
  }));
  res.json({ seats, show: { time: show.time, date: show.date, price: show.price } });
});

export const createShow = asyncHandler(async (req, res) => {
  const show = await Show.create(req.body);
  res.status(201).json(show);
});

export const updateShow = asyncHandler(async (req, res) => {
  const show = await Show.findById(req.params.id);
  if (show) {
    Object.assign(show, req.body);
    const updated = await show.save();
    res.json(updated);
  } else { res.status(404); throw new Error('Show not found'); }
});

export const deleteShow = asyncHandler(async (req, res) => {
  const show = await Show.findById(req.params.id);
  if (show) { await show.deleteOne(); res.json({ message: 'Show removed' }); }
  else { res.status(404); throw new Error('Show not found'); }
});
