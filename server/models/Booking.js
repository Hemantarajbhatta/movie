import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  showId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  cinemaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true,
  },
  seats: [{
    row: { type: String, required: true },
    number: { type: Number, required: true },
    type: { type: String, enum: ['standard', 'premium', 'vip'], default: 'standard' },
    price: { type: Number, required: true },
  }],
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['khalti', 'esewa', 'stripe', 'simulated'],
    default: 'simulated',
  },
  paymentId: {
    type: String,
    default: '',
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled', 'pending'],
    default: 'pending',
  },
  bookingId: {
    type: String,
    unique: true,
  },
  ticketPdf: {
    type: String, // path to generated PDF
    default: '',
  },
  showDate: Date,
  showTime: String,
  expiresAt: Date, // for temporary reservations
}, { timestamps: true });

// Auto-generate booking ID
bookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    this.bookingId = 'CX' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
