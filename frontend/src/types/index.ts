export interface User {
  id: number;
  name: string;
  email: string;
  role: 'tourist' | 'guide' | 'admin' | 'super_admin';
  gender?: 'male' | 'female';
  profile_picture?: string;
  phone?: string;
  is_verified?: boolean;
}

export interface Tourist extends User {
  tourist_id: number;
  role: 'tourist';
}

export interface Guide extends User {
  guides_id: number;
  role: 'guide';
  is_verified: boolean;
}

export interface Admin extends User {
  admin_id: number;
  role: 'admin' | 'super_admin';
  phone: string;
}

export interface Tour {
  tour_id: number;
  guides_id?: number;
  title: string;
  location: string;
  price: number;
  duration: string;
  time: string;
  tour_date: string;
  status: 'available' | 'full' | 'cancelled';
  guide?: Guide;
}

export interface Booking {
  booking_id: number;
  tourist_id: number;
  tour_id: number;
  booking_date: string;
  status: string;
  tour?: Tour;
  tourist?: Tourist;
}

export interface Payment {
  payment_id: number;
  booking_id: number;
  amount: number;
  method: string;
  status: string;
  created_at: string;
  booking?: Booking;
}

export interface RatingComment {
  comment_id: number;
  tourist_id: number;
  guide_id?: number;
  tour_id?: number;
  rating: number;
  comment: string;
  created_at: string;
  tourist?: Tourist;
  guide?: Guide;
  tour?: Tour;
}

export interface Notification {
  notification_id: number;
  user_id: number;
  message: string;
  status: string;
  created_at: string;
}

export interface AuthResponse {
  message: string;
  token: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error' | 'fail';
  message?: string;
  data?: T;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  gender: 'male' | 'female';
  profile_picture?: string;
  phone?: string;
  role?: 'admin' | 'super_admin';
}
