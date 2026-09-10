import { mockUser, mockAdmin } from '../data/mockData';

// Check if logged-in user is admin based on stored data
const getCurrentMockUser = () => {
  const stored = localStorage.getItem('cinematix_user');
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed.role === 'admin') return mockAdmin;
  }
  return mockUser;
};

export const loginUser = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Admin login
      if (data.email === 'admin@cinematix.com' && data.password === 'admin123') {
        resolve({ data: mockAdmin });
      } else {
        // Normal user login
        resolve({ data: { ...mockUser, name: data.email.split('@')[0], email: data.email } });
      }
    }, 500);
  });
};

export const registerUser = async (data) => {
  return new Promise((resolve) => setTimeout(() => resolve({ data: { ...mockUser, name: data.name, email: data.email } }), 500));
};

export const getProfile = async () => {
  return new Promise((resolve) => setTimeout(() => resolve({ data: getCurrentMockUser() }), 300));
};

export const updateProfile = async (data) => {
  return new Promise((resolve) => setTimeout(() => resolve({ data: { ...getCurrentMockUser(), ...data } }), 500));
};

export const toggleWishlist = async (movieId) => {
  return new Promise((resolve) => setTimeout(() => resolve({ data: { wishlist: [movieId] } }), 300));
};

export const getUsers = async () => {
  return new Promise((resolve) => setTimeout(() => resolve({ data: [mockAdmin, mockUser] }), 300));
};

export const deleteUser = async (id) => {
  return new Promise((resolve) => setTimeout(() => resolve({ data: { message: 'Deleted' } }), 300));
};
