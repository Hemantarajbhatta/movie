import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import * as bookingApi from '../api/bookingApi';
import { toast } from 'react-hot-toast';
import { CreditCard, CheckCircle, Tag, Wallet, Smartphone } from 'lucide-react';
import './PaymentPage.css';

const PROMO_CODES = {
  'QFX10': { discount: 10, label: '10% off' },
  'CINE20': { discount: 20, label: '20% off' },
  'FIRST50': { discount: 50, label: '50% off (First time)' },
};

const PaymentPage = () => {
  const { bookingData, clearBooking } = useBooking();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('esewa');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  
  if (!bookingData.show || bookingData.seats.length === 0) {
    navigate('/movies');
    return null;
  }

  const subtotal = bookingData.totalPrice;
  const convenienceFee = Math.round(subtotal * 0.02);
  const discount = appliedPromo ? Math.round(subtotal * appliedPromo.discount / 100) : 0;
  const grandTotal = subtotal + convenienceFee - discount;

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedPromo({ code, ...PROMO_CODES[code] });
      toast.success(`Promo "${code}" applied! ${PROMO_CODES[code].label}`);
    } else {
      toast.error('Invalid promo code');
      setAppliedPromo(null);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    toast.success('Promo removed');
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const { data: initData } = await bookingApi.initiatePayment({
        amount: grandTotal,
        bookingData,
        method: selectedMethod
      });

      const { data: verifyData } = await bookingApi.verifyPayment({
        paymentRef: initData.paymentRef
      });

      const { data: bookingResult } = await bookingApi.createBooking({
        showId: bookingData.show._id,
        seats: bookingData.seats.map(s => ({ row: s.row, number: s.number, type: s.type, price: s.price })),
        paymentId: verifyData.paymentId,
        paymentMethod: selectedMethod,
        totalPrice: grandTotal,
        subtotal: subtotal,
        discount: discount,
        promoCode: appliedPromo?.code || null,
        movieId: bookingData.movie,
        cinemaId: bookingData.cinema,
        showDate: bookingData.show.date,
        showTime: bookingData.show.time
      });

      toast.success('Payment successful!');
      clearBooking();
      navigate('/success', { state: { booking: bookingResult } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1 className="page-title">Checkout</h1>
        
        <div className="payment-content">
          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-card">
              <div className="summary-movie">
                <img src={bookingData.movie.poster} alt={bookingData.movie.title} />
                <div>
                  <h3>{bookingData.movie.title}</h3>
                  <p>{bookingData.cinema.name}</p>
                </div>
              </div>
              
              <div className="summary-details">
                <div className="detail-row">
                  <span>Showtime</span>
                  <span>{new Date(bookingData.show.date).toDateString()} | {bookingData.show.time}</span>
                </div>
                <div className="detail-row">
                  <span>Seats ({bookingData.seats.length})</span>
                  <span>{bookingData.seats.map(s => `${s.row}${s.number}`).join(', ')}</span>
                </div>
                <div className="detail-row">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal}</span>
                </div>
                <div className="detail-row">
                  <span>Convenience Fee (2%)</span>
                  <span>Rs. {convenienceFee}</span>
                </div>
                {appliedPromo && (
                  <div className="detail-row promo-row">
                    <span>Discount ({appliedPromo.label})</span>
                    <span className="discount-amount">- Rs. {discount}</span>
                  </div>
                )}
              </div>
              
              <div className="summary-total">
                <span>Total Amount</span>
                <span className="total-price">Rs. {grandTotal}</span>
              </div>
            </div>

            {/* Promo Code Section */}
            <div className="promo-section">
              <h3><Tag size={18} /> Promo Code</h3>
              {appliedPromo ? (
                <div className="promo-applied">
                  <span className="promo-badge">{appliedPromo.code} — {appliedPromo.label}</span>
                  <button onClick={removePromo} className="promo-remove">Remove</button>
                </div>
              ) : (
                <div className="promo-input-row">
                  <input
                    type="text"
                    placeholder="Enter promo code (e.g. QFX10)"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyPromo()}
                  />
                  <button onClick={applyPromo} className="promo-apply-btn">Apply</button>
                </div>
              )}
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="payment-methods">
            <h2>Payment Method</h2>
            
            <div className="payment-options">
              <label className={`payment-option ${selectedMethod === 'esewa' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="esewa" checked={selectedMethod === 'esewa'} onChange={() => setSelectedMethod('esewa')} />
                <div className="option-content">
                  <div className="option-icon esewa-icon">e</div>
                  <div className="option-text">
                    <span className="option-name">eSewa</span>
                    <span className="option-desc">Pay with eSewa wallet</span>
                  </div>
                  {selectedMethod === 'esewa' && <CheckCircle className="check-icon" size={20} />}
                </div>
              </label>

              <label className={`payment-option ${selectedMethod === 'khalti' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="khalti" checked={selectedMethod === 'khalti'} onChange={() => setSelectedMethod('khalti')} />
                <div className="option-content">
                  <div className="option-icon khalti-icon">K</div>
                  <div className="option-text">
                    <span className="option-name">Khalti</span>
                    <span className="option-desc">Pay with Khalti wallet</span>
                  </div>
                  {selectedMethod === 'khalti' && <CheckCircle className="check-icon" size={20} />}
                </div>
              </label>
              
              <label className={`payment-option ${selectedMethod === 'card' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="card" checked={selectedMethod === 'card'} onChange={() => setSelectedMethod('card')} />
                <div className="option-content">
                  <CreditCard size={24} />
                  <div className="option-text">
                    <span className="option-name">Credit/Debit Card</span>
                    <span className="option-desc">Visa, Mastercard</span>
                  </div>
                  {selectedMethod === 'card' && <CheckCircle className="check-icon" size={20} />}
                </div>
              </label>
            </div>
            
            <button 
              className="pay-btn" 
              onClick={handlePayment} 
              disabled={loading}
            >
              {loading ? 'Processing...' : `Pay Rs. ${grandTotal}`}
            </button>
            <p className="payment-note">Note: This is a demo. No real money will be deducted.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
