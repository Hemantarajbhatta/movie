import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import generateTicketPDF from '../utils/generateTicket.js';

// @desc Create booking (after payment)
// @route POST /api/bookings
export const createBooking = asyncHandler(async (req, res) => {
  const { showId, seats, paymentId, paymentMethod, totalPrice } = req.body;

  // Check for double booking - atomic operation
  const show = await Show.findById(showId);
  if (!show) { res.status(404); throw new Error('Show not found'); }

  for (const seat of seats) {
    const alreadyBooked = show.bookedSeats.some(b => b.row === seat.row && b.number === seat.number);
    if (alreadyBooked) {
      res.status(400);
      throw new Error(`Seat ${seat.row}${seat.number} is already booked. Please select another seat.`);
    }
  }

  // Add seats to show's booked list
  const seatDocs = seats.map(s => ({ row: s.row, number: s.number, userId: req.user._id }));
  show.bookedSeats.push(...seatDocs);
  await show.save();

  // Create booking
  const booking = await Booking.create({
    userId: req.user._id,
    showId,
    movieId: show.movieId,
    cinemaId: show.cinemaId,
    seats,
    totalPrice,
    paymentStatus: 'completed',
    bookingStatus: 'confirmed',
    paymentMethod: paymentMethod || 'simulated',
    paymentId: paymentId || `SIM-${Date.now()}`,
    showDate: show.date,
    showTime: show.time,
  });

  // Generate PDF ticket
  try {
    const populated = await Booking.findById(booking._id)
      .populate('movieId', 'title')
      .populate('cinemaId', 'name location')
      .populate('userId', 'name email');
    const pdfPath = await generateTicketPDF(populated);
    booking.ticketPdf = pdfPath;
    await booking.save();
  } catch (e) {
    console.error('PDF generation error:', e.message);
  }

  const result = await Booking.findById(booking._id)
    .populate('movieId', 'title poster duration')
    .populate('cinemaId', 'name location')
    .populate('showId', 'time date screenId');

  res.status(201).json(result);
});

// @desc Get user's booking history
// @route GET /api/bookings/history
export const getBookingHistory = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id })
    .populate('movieId', 'title poster')
    .populate('cinemaId', 'name location')
    .populate('showId', 'time date')
    .sort({ createdAt: -1 });
  res.json(bookings);
});

// @desc Get single booking
// @route GET /api/bookings/:id
export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('movieId')
    .populate('cinemaId')
    .populate('showId')
    .populate('userId', 'name email');

  if (!booking) { res.status(404); throw new Error('Booking not found'); }

  if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }

  res.json(booking);
});

// @desc Cancel booking
// @route PUT /api/bookings/:id/cancel
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) { res.status(404); throw new Error('Booking not found'); }

  if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }

  // Remove seats from show
  await Show.findByIdAndUpdate(booking.showId, {
    $pull: { bookedSeats: { userId: booking.userId } }
  });

  booking.bookingStatus = 'cancelled';
  booking.paymentStatus = 'refunded';
  await booking.save();
  res.json({ message: 'Booking cancelled', booking });
});

// @desc Get all bookings (admin)
// @route GET /api/bookings
export const getAllBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const total = await Booking.countDocuments();
  const bookings = await Booking.find()
    .populate('userId', 'name email')
    .populate('movieId', 'title')
    .populate('cinemaId', 'name')
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  res.json({ bookings, total, page: Number(page) });
});

// @desc Get revenue stats (admin)
// @route GET /api/bookings/stats
export const getStats = asyncHandler(async (req, res) => {
  const totalBookings = await Booking.countDocuments({ bookingStatus: 'confirmed' });
  const totalRevenue = await Booking.aggregate([
    { $match: { paymentStatus: 'completed' } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);

  const last7Days = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        paymentStatus: 'completed',
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
        revenue: { $sum: '$totalPrice' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const popularMovies = await Booking.aggregate([
    { $match: { bookingStatus: 'confirmed' } },
    { $group: { _id: '$movieId', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    { $lookup: { from: 'movies', localField: '_id', foreignField: '_id', as: 'movie' } },
    { $unwind: '$movie' },
    { $project: { title: '$movie.title', poster: '$movie.poster', count: 1 } }
  ]);

  res.json({
    totalBookings,
    totalRevenue: totalRevenue[0]?.total || 0,
    last7Days,
    popularMovies,
  });
});
