import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toursAPI, usersAPI, paymentsAPI, notificationsAPI } from '../services/api';
import { Tour, Tourist, Guide, Admin, Payment, Notification } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { 
  UsersIcon,
  MapIcon,
  CurrencyDollarIcon,
  BellIcon,
  ChartBarIcon,
  EyeIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTours: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalNotifications: 0
  });
  const [recentTours, setRecentTours] = useState<Tour[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch tours
      const toursResponse = await toursAPI.getAll();
      const tours = toursResponse.data.status === 'success' ? toursResponse.data.data || [] : [];
      setRecentTours(tours.slice(0, 5));
      
      // Fetch users (tourists and guides)
      const [touristsResponse, guidesResponse] = await Promise.all([
        usersAPI.getAllTourists(),
        usersAPI.getAllGuides()
      ]);
      const totalUsers = touristsResponse.data.length + guidesResponse.data.length;
      
      // Fetch payments
      const paymentsResponse = await paymentsAPI.getAll();
      const payments = paymentsResponse.data.status === 'success' ? paymentsResponse.data.data || [] : [];
      setRecentPayments(payments.slice(0, 5));
      const totalRevenue = payments.reduce((sum: number, payment: Payment) => sum + payment.amount, 0);
      
      // Fetch notifications
      const notificationsResponse = await notificationsAPI.getAll();
      const notifications = notificationsResponse.data.status === 'success' ? notificationsResponse.data.data || [] : [];
      setRecentNotifications(notifications.slice(0, 5));
      
      setStats({
        totalTours: tours.length,
        totalUsers,
        totalRevenue,
        totalNotifications: notifications.length
      });
      
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name || user?.email}! Here's an overview of your platform.</p>
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
              <p className="text-2xl font-semibold text-gray-900">{stats.totalTours}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UsersIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
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
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BellIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Notifications</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalNotifications}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/users"
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <UsersIcon className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Manage Users</h3>
                <p className="text-sm text-gray-600">Tourists, Guides & Admins</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/tours"
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <MapIcon className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Manage Tours</h3>
                <p className="text-sm text-gray-600">View & edit all tours</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/payments"
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">View Payments</h3>
                <p className="text-sm text-gray-600">Payment history & status</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/notifications"
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <BellIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Notifications</h3>
                <p className="text-sm text-gray-600">Send & manage notifications</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tours */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Tours</h2>
              <Link
                to="/admin/tours"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentTours.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No tours found
              </div>
            ) : (
              recentTours.map((tour) => (
                <div key={tour.tour_id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{tour.title}</h3>
                      <p className="text-sm text-gray-600">{tour.location}</p>
                      <p className="text-xs text-gray-500">{formatDate(tour.tour_date)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-green-600">${tour.price}</span>
                      <Link
                        to={`/tours/${tour.tour_id}`}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
              <Link
                to="/admin/payments"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentPayments.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No payments found
              </div>
            ) : (
              recentPayments.map((payment) => (
                <div key={payment.payment_id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        Payment #{payment.payment_id}
                      </h3>
                      <p className="text-sm text-gray-600">{payment.method}</p>
                      <p className="text-xs text-gray-500">{formatDate(payment.created_at)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-green-600">
                        {formatCurrency(payment.amount)}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="mt-8 bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
            <Link
              to="/admin/notifications"
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              View all
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {recentNotifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No notifications found
            </div>
          ) : (
            recentNotifications.map((notification) => (
              <div key={notification.notification_id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {notification.message}
                    </h3>
                    <p className="text-xs text-gray-500">{formatDate(notification.created_at)}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    notification.status === 'sent' ? 'bg-green-100 text-green-800' :
                    notification.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {notification.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
