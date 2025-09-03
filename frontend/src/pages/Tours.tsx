import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toursAPI } from '../services/api';
import { Tour } from '../types';
import { 
  MapPinIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  CalendarIcon,
  UserGroupIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Tours: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const response = await toursAPI.getAll();
      if (response.data.status === 'success') {
        setTours(response.data.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch tours');
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tour.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Available Tours</h1>
        <p className="text-gray-600">Discover amazing destinations and experiences</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search tours by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="full">Full</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Tours Grid */}
      {filteredTours.length === 0 ? (
        <div className="text-center py-12">
          <MapPinIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tours found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'No tours are currently available.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => (
            <div key={tour.tour_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tour.status)}`}>
                    {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
                  </span>
                  <div className="flex items-center text-yellow-400">
                    <StarIcon className="h-4 w-4" />
                    <span className="ml-1 text-sm text-gray-600">4.8</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {tour.title}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{tour.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{formatDate(tour.tour_date)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{tour.time} • {tour.duration}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm font-semibold text-green-600">${tour.price}</span>
                  </div>
                </div>

                {tour.guide && (
                  <div className="flex items-center text-gray-600 mb-4">
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">Guide: {tour.guide.name}</span>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Link
                    to={`/tours/${tour.tour_id}`}
                    className="flex-1 bg-primary-600 text-white text-center py-2 px-4 rounded-md hover:bg-primary-700 transition-colors text-sm font-medium"
                  >
                    View Details
                  </Link>
                  {tour.status === 'available' && (
                    <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm font-medium">
                      Book Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-primary-600">{tours.length}</div>
            <div className="text-sm text-gray-600">Total Tours</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {tours.filter(t => t.status === 'available').length}
            </div>
            <div className="text-sm text-gray-600">Available Now</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {tours.filter(t => t.guide).length}
            </div>
            <div className="text-sm text-gray-600">With Guides</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tours;
