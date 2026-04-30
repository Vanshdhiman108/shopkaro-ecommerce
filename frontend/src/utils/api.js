import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser  = (data) => API.post('/auth/register', data);
export const loginUser     = (data) => API.post('/auth/login', data);
export const getMe         = ()     => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/update-profile', data);

// Products
export const getProducts   = (params) => API.get('/products', { params });
export const getProduct    = (id)     => API.get(`/products/${id}`);
export const createProduct = (data)   => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id)     => API.delete(`/products/${id}`);
export const addReview     = (id, data) => API.post(`/products/${id}/review`, data);

// Cart
export const getCart          = ()     => API.get('/cart');
export const addToCart        = (data) => API.post('/cart/add', data);
export const updateCartItem   = (data) => API.put('/cart/update', data);
export const removeFromCart   = (id)   => API.delete(`/cart/remove/${id}`);
export const clearCart        = ()     => API.delete('/cart/clear');

// Orders
export const createOrder      = (data) => API.post('/orders', data);
export const getMyOrders      = ()     => API.get('/orders/my-orders');
export const getOrderById     = (id)   => API.get(`/orders/${id}`);
export const updateOrderToPaid = (id, data) => API.put(`/orders/${id}/pay`, data);

// Payment
export const createRazorpayOrder  = (data) => API.post('/payment/razorpay/create-order', data);
export const verifyRazorpayPayment = (data) => API.post('/payment/razorpay/verify', data);
export const createStripeIntent    = (data) => API.post('/payment/stripe/create-intent', data);

// Admin
export const getDashboardStats = ()   => API.get('/admin/dashboard');
export const getAllUsers        = ()   => API.get('/admin/users');
export const deleteUser        = (id) => API.delete(`/admin/users/${id}`);
export const getAllOrders       = ()   => API.get('/orders');
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}/status`, data);

export default API;
