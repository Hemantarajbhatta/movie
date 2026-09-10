import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState({
    movie: null,
    cinema: null,
    show: null,
    seats: [],
    totalPrice: 0
  });

  const updateBooking = (newData) => {
    setBookingData(prev => ({ ...prev, ...newData }));
  };

  const clearBooking = () => {
    setBookingData({
      movie: null,
      cinema: null,
      show: null,
      seats: [],
      totalPrice: 0
    });
  };

  return (
    <BookingContext.Provider value={{ bookingData, updateBooking, clearBooking }}>
      {children}
    </BookingContext.Provider>
  );
};
