import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingsAPI, paymentsAPI } from '../services/api';
import { Booking, Payment } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { 
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  UserGroupIcon,
  CreditCardIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const MyBookings: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getMyBookings();
      if (response.data.status === 'success') {
        setBookings(response.data.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch bookings');
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingsAPI.delete(bookingId);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to cancel booking';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Failed to cancel booking');
    }
  };

  const handleMakePayment = async (bookingId: number, amount: number) => {
    try {
      const paymentData = {
        booking_id: bookingId,
        amount: amount,
        method: 'credit_card',
        status: 'pending'
      };

      const response = await paymentsAPI.create(paymentData);
      if (response.data.status === 'success') {
        toast.success('Payment initiated successfully');
        // In a real app, you would redirect to a payment gateway
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to process payment';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Failed to process payment');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (statusFilter === 'all') return true;
    return booking.status === statusFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return '✅';
      case 'pending':
        return '⏳';
      case 'cancelled':
        return '❌';
      case 'completed':
        return '✅';
      default:
        return '📋';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Bookings</h1>
        <p className="text-gray-600">Manage your tour bookings and payments</p>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="all">All Bookings</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {statusFilter !== 'all' 
              ? 'No bookings match your current filter.'
              : 'You haven\'t made any bookings yet.'}
          </p>
          {statusFilter === 'all' && (
            <div className="mt-6">
              <Link
                to="/tours"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Browse Tours
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <div key={booking.booking_id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)} {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Booking #{booking.booking_id}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {booking.tour?.title || 'Tour Title'}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ${booking.tour?.price || 0}
                    </div>
                    <div className="text-sm text-gray-500">per person</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-5 w-5 mr-3" />
                    <div>
                      <div className="text-sm font-medium">Location</div>
                      <div className="text-sm">{booking.tour?.location || 'N/A'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-5 w-5 mr-3" />
                    <div>
                      <div className="text-sm font-medium">Tour Date</div>
                      <div className="text-sm">{booking.tour ? formatDate(booking.tour.tour_date) : 'N/A'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-5 w-5 mr-3" />
                    <div>
                      <div className="text-sm font-medium">Time & Duration</div>
                      <div className="text-sm">
                        {booking.tour ? `${booking.tour.time} • ${booking.tour.duration}` : 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  {booking.tour?.guide && (
                    <div className="flex items-center text-gray-600">
                      <UserGroupIcon className="h-5 w-5 mr-3" />
                      <div>
                        <div className="text-sm font-medium">Guide</div>
                        <div className="text-sm">{booking.tour.guide.name}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Booked on {formatDate(booking.booking_date)}
                  </div>
                  
                  <div className="flex space-x-3">
                    {booking.tour && (
                      <Link
                        to={`/tours/${booking.tour.tour_id}`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View Tour
                      </Link>
                    )}
                    
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => handleMakePayment(booking.booking_id, booking.tour?.price || 0)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      >
                        <CreditCardIcon className="h-4 w-4 mr-2" />
                        Make Payment
                      </button>
                    )}
                    
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => handleCancelBooking(booking.booking_id)}
                        className="inline-flex items-center px-3 py-2 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                      >
                        <TrashIcon className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {bookings.length > 0 && (
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-600">{bookings.length}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {bookings.filter(b => b.status === 'confirmed').length}
              </div>
              <div className="text-sm text-gray-600">Confirmed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {bookings.filter(b => b.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {bookings.filter(b => b.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
