import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toursAPI, bookingsAPI, ratingsAPI } from '../services/api';
import { Tour, RatingComment } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { 
  MapPinIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  CalendarIcon,
  UserGroupIcon,
  StarIcon,
  ArrowLeftIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const TourDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [tour, setTour] = useState<Tour | null>(null);
  const [ratings, setRatings] = useState<RatingComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTourDetails();
      fetchRatings();
    }
  }, [id]);

  const fetchTourDetails = async () => {
    try {
      setLoading(true);
      const response = await toursAPI.getById(parseInt(id!));
      if (response.data.status === 'success') {
        setTour(response.data.data!);
      }
    } catch (error) {
      toast.error('Failed to fetch tour details');
      console.error('Error fetching tour:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRatings = async () => {
    try {
      const response = await ratingsAPI.getAll(parseInt(id!));
      if (response.data.status === 'success') {
        setRatings(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const handleBookTour = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book a tour');
      navigate('/login');
      return;
    }

    if (user?.role !== 'tourist') {
      toast.error('Only tourists can book tours');
      return;
    }

    try {
      setBookingLoading(true);
      const bookingData = {
        tourist_id: user.id,
        tour_id: parseInt(id!),
        booking_date: new Date().toISOString(),
        status: 'pending'
      };

      const response = await bookingsAPI.create(bookingData);
      if (response.data.status === 'success') {
        toast.success('Tour booked successfully!');
        setShowBookingModal(false);
        navigate('/my-bookings');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to book tour';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Failed to book tour');
    } finally {
      setBookingLoading(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'full':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const averageRating = ratings.length > 0 
    ? (ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length).toFixed(1)
    : '0.0';

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!tour) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Tour not found</h1>
          <button
            onClick={() => navigate('/tours')}
            className="mt-4 text-primary-600 hover:text-primary-500"
          >
            ← Back to Tours
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/tours')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Tours
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Tour Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tour.status)}`}>
                    {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
                  </span>
                  <div className="flex items-center text-yellow-400">
                    <StarIcon className="h-4 w-4" />
                    <span className="ml-1 text-sm text-gray-600">{averageRating} ({ratings.length} reviews)</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{tour.title}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  <span className="text-lg">{tour.location}</span>
                </div>
              </div>
              <button
                onClick={toggleFavorite}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                {isFavorited ? (
                  <HeartSolidIcon className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Tour Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="h-5 w-5 mr-3" />
                <div>
                  <div className="text-sm font-medium">Date</div>
                  <div className="text-sm">{formatDate(tour.tour_date)}</div>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600">
                <ClockIcon className="h-5 w-5 mr-3" />
                <div>
                  <div className="text-sm font-medium">Time & Duration</div>
                  <div className="text-sm">{tour.time} • {tour.duration}</div>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600">
                <CurrencyDollarIcon className="h-5 w-5 mr-3" />
                <div>
                  <div className="text-sm font-medium">Price</div>
                  <div className="text-lg font-semibold text-green-600">${tour.price}</div>
                </div>
              </div>
              
              {tour.guide && (
                <div className="flex items-center text-gray-600">
                  <UserGroupIcon className="h-5 w-5 mr-3" />
                  <div>
                    <div className="text-sm font-medium">Guide</div>
                    <div className="text-sm">{tour.guide.name}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About this tour</h3>
              <p className="text-gray-600">
                Experience the beauty of {tour.location} with this amazing {tour.duration} tour. 
                Our expert guide will take you through the most beautiful and interesting places, 
                sharing local knowledge and ensuring you have an unforgettable experience.
              </p>
            </div>

            {/* Book Button */}
            <div className="flex space-x-4">
              {tour.status === 'available' ? (
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-md hover:bg-primary-700 transition-colors font-medium"
                >
                  Book This Tour
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 bg-gray-400 text-white py-3 px-6 rounded-md cursor-not-allowed font-medium"
                >
                  {tour.status === 'full' ? 'Tour is Full' : 'Tour Cancelled'}
                </button>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Reviews & Ratings</h3>
            {ratings.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first to review this tour!</p>
            ) : (
              <div className="space-y-4">
                {ratings.map((rating) => (
                  <div key={rating.comment_id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${i < rating.rating ? 'fill-current' : ''}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {rating.tourist?.name || 'Anonymous'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(rating.created_at)}
                      </span>
                    </div>
                    {rating.comment && (
                      <p className="text-gray-600 text-sm">{rating.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tour Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Price per person</span>
                <span className="font-semibold">${tour.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-semibold">{tour.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="font-semibold">{formatDate(tour.tour_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time</span>
                <span className="font-semibold">{tour.time}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${tour.price}</span>
              </div>
            </div>

            {tour.status === 'available' && (
              <button
                onClick={() => setShowBookingModal(true)}
                className="w-full mt-4 bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 transition-colors font-medium"
              >
                Book Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Booking</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to book "{tour.title}" for ${tour.price}?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBookTour}
                disabled={bookingLoading}
                className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {bookingLoading ? 'Booking...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourDetail;
