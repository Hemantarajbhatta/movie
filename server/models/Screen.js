import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  row: { type: String, required: true },
  number: { type: Number, required: true },
  type: {
    type: String,
    enum: ['standard', 'premium', 'vip'],
    default: 'standard',
  },
});

const screenSchema = new mongoose.Schema({
  cinemaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true,
  },
  screenName: {
    type: String,
    required: true,
  },
  rows: {
    type: Number,
    required: true,
    default: 7,
  },
  columns: {
    type: Number,
    required: true,
    default: 16,
  },
  totalSeats: {
    type: Number,
  },
  seats: [seatSchema],
  screenType: {
    type: String,
    enum: ['Standard', '3D', 'IMAX', '4DX'],
    default: 'Standard',
  },
}, { timestamps: true });

// Auto-generate seats before save
screenSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('rows') || this.isModified('columns')) {
    const rowLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.seats = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 1; c <= this.columns; c++) {
        let type = 'standard';
        if (r < 2) type = 'vip';
        else if (r < 4) type = 'premium';
        this.seats.push({ row: rowLetters[r], number: c, type });
      }
    }
    this.totalSeats = this.rows * this.columns;
  }
  next();
});

const Screen = mongoose.model('Screen', screenSchema);
export default Screen;
