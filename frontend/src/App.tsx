import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Tours from './pages/Tours';
import TourDetail from './pages/TourDetail';
import MyBookings from './pages/MyBookings';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import TourManagement from './pages/TourManagement';
import PaymentManagement from './pages/PaymentManagement';
import NotificationManagement from './pages/NotificationManagement';
import LoadingSpinner from './components/LoadingSpinner';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} 
          />
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:id" element={<TourDetail />} />
          
          {/* Tourist routes */}
          <Route 
            path="/my-bookings" 
            element={
              <ProtectedRoute allowedRoles={['tourist']}>
                <MyBookings />
              </ProtectedRoute>
            } 
          />
          
          {/* Guide routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['guide']}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <UserManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/tours" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <TourManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/payments" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <PaymentManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/notifications" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <NotificationManagement />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Toaster position="top-right" />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
