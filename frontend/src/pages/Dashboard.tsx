import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toursAPI, bookingsAPI } from '../services/api';
import { Tour, Booking } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { 
  PlusIcon,
  MapIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [tours, setTours] = useState<Tour[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTour, setNewTour] = useState({
    title: '',
    location: '',
    price: '',
    duration: '',
    time: '',
    tour_date: '',
    status: 'available'
  });

  useEffect(() => {
    fetchTours();
    fetchBookings();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await toursAPI.getAll();
      if (response.data.status === 'success') {
        // Filter tours created by this guide
        const guideTours = (response.data.data || []).filter(
          (tour: Tour) => tour.guides_id === user?.id
        );
        setTours(guideTours);
      }
    } catch (error) {
      toast.error('Failed to fetch tours');
      console.error('Error fetching tours:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      // This would need to be implemented in the backend to get bookings for guide's tours
      // For now, we'll show a placeholder
      setBookings([]);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleCreateTour = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tourData = {
        ...newTour,
        price: parseFloat(newTour.price),
        guides_id: user?.id,
        status: 'available' as const
      };

      const response = await toursAPI.create(tourData);
      if (response.data.status === 'success') {
        toast.success('Tour created successfully!');
        setShowCreateModal(false);
        setNewTour({
          title: '',
          location: '',
          price: '',
          duration: '',
          time: '',
          tour_date: '',
          status: 'available'
        });
        fetchTours();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to create tour';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Failed to create tour');
    }
  };

  const handleDeleteTour = async (tourId: number) => {
    if (!window.confirm('Are you sure you want to delete this tour?')) {
      return;
    }

    try {
      await toursAPI.delete(tourId);
      toast.success('Tour deleted successfully');
      fetchTours();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to delete tour';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Failed to delete tour');
    }
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

  // Calculate stats
  const totalTours = tours.length;
  const activeTours = tours.filter(t => t.status === 'available').length;
  const totalRevenue = tours.reduce((sum, tour) => sum + tour.price, 0);
  const upcomingTours = tours.filter(t => new Date(t.tour_date) > new Date()).length;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Guide Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name || user?.email}! Manage your tours and bookings.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <MapIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tours</p>
              <p className="text-2xl font-semibold text-gray-900">{totalTours}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Tours</p>
              <p className="text-2xl font-semibold text-gray-900">{activeTours}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">${totalRevenue}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-semibold text-gray-900">{upcomingTours}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-8">
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create New Tour
        </button>
      </div>

      {/* Tours List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">My Tours</h2>
        </div>
        
        {tours.length === 0 ? (
          <div className="p-6 text-center">
            <MapIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tours yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first tour.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Tour
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {tours.map((tour) => (
              <div key={tour.tour_id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{tour.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tour.status)}`}>
                        {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapIcon className="h-4 w-4 mr-2" />
                        {tour.location}
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {formatDate(tour.tour_date)}
                      </div>
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                        ${tour.price}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/tours/${tour.tour_id}`}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </Link>
                    <button
                      className="p-2 text-gray-400 hover:text-blue-600"
                      onClick={() => {/* Handle edit */}}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-red-600"
                      onClick={() => handleDeleteTour(tour.tour_id)}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Tour Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Tour</h3>
            <form onSubmit={handleCreateTour} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tour Title
                </label>
                <input
                  type="text"
                  required
                  value={newTour.title}
                  onChange={(e) => setNewTour({...newTour, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter tour title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={newTour.location}
                  onChange={(e) => setNewTour({...newTour, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter location"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newTour.price}
                    onChange={(e) => setNewTour({...newTour, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    required
                    value={newTour.duration}
                    onChange={(e) => setNewTour({...newTour, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., 3 hours"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    required
                    value={newTour.time}
                    onChange={(e) => setNewTour({...newTour, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newTour.tour_date}
                    onChange={(e) => setNewTour({...newTour, tour_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
                >
                  Create Tour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
