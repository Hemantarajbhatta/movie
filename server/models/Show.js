import mongoose from 'mongoose';

const showSchema = new mongoose.Schema({
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
  screenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Screen',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String, // e.g. "14:30"
    required: true,
  },
  price: {
    standard: { type: Number, default: 350 },
    premium: { type: Number, default: 500 },
    vip: { type: Number, default: 800 },
  },
  bookedSeats: [{
    row: String,
    number: Number,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Show = mongoose.model('Show', showSchema);
export default Show;
