import axios, { AxiosResponse } from 'axios';
import { 
  AuthResponse, 
  Tourist, 
  Guide, 
  Admin, 
  Tour, 
  Booking, 
  Payment, 
  RatingComment, 
  Notification,
  LoginCredentials,
  RegisterData,
  ApiResponse
} from '../types';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Tourist login
  loginTourist: (credentials: LoginCredentials): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/tourists/login', credentials),

  // Tourist register
  registerTourist: (data: RegisterData): Promise<AxiosResponse<Tourist>> =>
    api.post('/tourists', data),

  // Guide login
  loginGuide: (credentials: LoginCredentials): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/guides/login', credentials),

  // Guide register
  registerGuide: (data: RegisterData): Promise<AxiosResponse<Guide>> =>
    api.post('/guides', data),

  // Admin login
  loginAdmin: (credentials: LoginCredentials): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/admins/login', credentials),

  // Admin register
  createAdmin: (data: RegisterData): Promise<AxiosResponse<Admin>> =>
    api.post('/admins', data),
};

// Tours API
export const toursAPI = {
  getAll: (): Promise<AxiosResponse<ApiResponse<Tour[]>>> =>
    api.get('/tours'),

  getById: (id: number): Promise<AxiosResponse<ApiResponse<Tour>>> =>
    api.get(`/tours/${id}`),

  create: (data: Partial<Tour>): Promise<AxiosResponse<ApiResponse<Tour>>> =>
    api.post('/tours', data),

  update: (id: number, data: Partial<Tour>): Promise<AxiosResponse<ApiResponse<Tour>>> =>
    api.put(`/tours/${id}`, data),

  delete: (id: number): Promise<AxiosResponse<ApiResponse<void>>> =>
    api.delete(`/tours/${id}`),
};

// Bookings API
export const bookingsAPI = {
  create: (data: Partial<Booking>): Promise<AxiosResponse<ApiResponse<Booking>>> =>
    api.post('/booking', data),

  getMyBookings: (): Promise<AxiosResponse<ApiResponse<Booking[]>>> =>
    api.get('/booking'),

  update: (id: number, data: Partial<Booking>): Promise<AxiosResponse<ApiResponse<Booking>>> =>
    api.put(`/booking/${id}`, data),

  delete: (id: number): Promise<AxiosResponse<ApiResponse<void>>> =>
    api.delete(`/booking/${id}`),
};

// Payments API
export const paymentsAPI = {
  create: (data: Partial<Payment>): Promise<AxiosResponse<ApiResponse<Payment>>> =>
    api.post('/payments', data),

  getAll: (): Promise<AxiosResponse<ApiResponse<Payment[]>>> =>
    api.get('/payments'),

  update: (id: number, data: Partial<Payment>): Promise<AxiosResponse<ApiResponse<Payment>>> =>
    api.put(`/payments/${id}`, data),

  delete: (id: number): Promise<AxiosResponse<ApiResponse<void>>> =>
    api.delete(`/payments/${id}`),
};

// Ratings & Comments API
export const ratingsAPI = {
  create: (data: Partial<RatingComment>): Promise<AxiosResponse<ApiResponse<RatingComment>>> =>
    api.post('/ratings_comments', data),

  getAll: (tourId?: number, guideId?: number): Promise<AxiosResponse<ApiResponse<RatingComment[]>>> => {
    const params = new URLSearchParams();
    if (tourId) params.append('tour_id', tourId.toString());
    if (guideId) params.append('guide_id', guideId.toString());
    return api.get(`/ratings_comments?${params.toString()}`);
  },

  delete: (id: number): Promise<AxiosResponse<ApiResponse<void>>> =>
    api.delete(`/ratings_comments/${id}`),
};

// Notifications API
export const notificationsAPI = {
  create: (data: Partial<Notification>): Promise<AxiosResponse<ApiResponse<Notification>>> =>
    api.post('/notifications', data),

  getAll: (): Promise<AxiosResponse<ApiResponse<Notification[]>>> =>
    api.get('/notifications'),

  update: (id: number, data: Partial<Notification>): Promise<AxiosResponse<ApiResponse<Notification>>> =>
    api.put(`/notifications/${id}`, data),

  delete: (id: number): Promise<AxiosResponse<ApiResponse<void>>> =>
    api.delete(`/notifications/${id}`),
};

// Users Management API (Admin only)
export const usersAPI = {
  // Tourists
  getAllTourists: (): Promise<AxiosResponse<Tourist[]>> =>
    api.get('/tourists'),

  getTouristById: (id: number): Promise<AxiosResponse<Tourist>> =>
    api.get(`/tourists/${id}`),

  updateTourist: (id: number, data: Partial<Tourist>): Promise<AxiosResponse<Tourist>> =>
    api.put(`/tourists/${id}`, data),

  deleteTourist: (id: number): Promise<AxiosResponse<void>> =>
    api.delete(`/tourists/${id}`),

  // Guides
  getAllGuides: (): Promise<AxiosResponse<Guide[]>> =>
    api.get('/guides'),

  getGuideById: (id: number): Promise<AxiosResponse<Guide>> =>
    api.get(`/guides/${id}`),

  updateGuide: (id: number, data: Partial<Guide>): Promise<AxiosResponse<Guide>> =>
    api.put(`/guides/${id}`, data),

  deleteGuide: (id: number): Promise<AxiosResponse<void>> =>
    api.delete(`/guides/${id}`),

  // Admins
  createAdmin: (data: RegisterData): Promise<AxiosResponse<Admin>> =>
    api.post('/admins', data),

  getAllAdmins: (): Promise<AxiosResponse<Admin[]>> =>
    api.get('/admins'),

  getAdminById: (id: number): Promise<AxiosResponse<Admin>> =>
    api.get(`/admins/${id}`),

  updateAdmin: (id: number, data: Partial<Admin>): Promise<AxiosResponse<Admin>> =>
    api.put(`/admins/${id}`, data),

  deleteAdmin: (id: number): Promise<AxiosResponse<void>> =>
    api.delete(`/admins/${id}`),
};

// Password Reset API
export const passwordResetAPI = {
  requestReset: (email: string): Promise<AxiosResponse<{ reset_token: string; expires_at: string }>> =>
    api.post('/password_resets', { email }),

  verifyToken: (token: string): Promise<AxiosResponse<{ email: string }>> =>
    api.get(`/password_resets/${token}`),

  deleteToken: (token: string): Promise<AxiosResponse<void>> =>
    api.delete(`/password_resets/${token}`),
};

export default api;
