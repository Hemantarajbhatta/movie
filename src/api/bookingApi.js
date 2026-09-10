import { mockBookings, saveData } from '../data/mockData';

export const createBooking = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newBooking = {
        _id: `b${Date.now()}`,
        bookingId: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
        ...data,
        createdAt: new Date().toISOString(),
        status: 'confirmed',
        ticketPdf: '/tickets/sample-ticket.pdf'
      };
      mockBookings.push(newBooking);
      saveData('cinematix_bookings', mockBookings);
      resolve({ data: newBooking });
    }, 800);
  });
};

export const getBookingHistory = async () => {
  return new Promise((resolve) => setTimeout(() => resolve({ data: mockBookings }), 400));
};

export const getBookingById = async (id) => {
  return new Promise((resolve) => setTimeout(() => resolve({ data: mockBookings.find(b => b._id === id) }), 300));
};

export const cancelBooking = async (id) => Promise.resolve({ data: { message: 'Cancelled' } });
export const getAllBookings = async (params) => Promise.resolve({ data: { bookings: mockBookings, total: mockBookings.length, page: 1 } });
export const getStats = async () => Promise.resolve({ data: {} });

export const initiatePayment = async (data) => {
  return new Promise(resolve => setTimeout(() => resolve({ data: { paymentRef: 'MOCK_REF_123' } }), 600));
};

export const verifyPayment = async (data) => {
  return new Promise(resolve => setTimeout(() => resolve({ data: { paymentId: 'MOCK_PAY_123' } }), 600));
};
