import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  MapIcon, 
  UserGroupIcon, 
  StarIcon, 
  ShieldCheckIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: MapIcon,
      title: 'Discover Amazing Tours',
      description: 'Explore beautiful destinations with our curated tour experiences.',
    },
    {
      icon: UserGroupIcon,
      title: 'Expert Local Guides',
      description: 'Get insights from verified local guides who know the best spots.',
    },
    {
      icon: StarIcon,
      title: 'Top Rated Experiences',
      description: 'Join thousands of satisfied travelers who rated our tours 5 stars.',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Safe & Secure',
      description: 'Your bookings and payments are protected with industry-standard security.',
    },
  ];

  const getWelcomeMessage = () => {
    if (!isAuthenticated) {
      return {
        title: 'Welcome to TravelHub',
        subtitle: 'Your gateway to amazing travel experiences',
        cta: 'Get Started',
        ctaLink: '/register'
      };
    }

    switch (user?.role) {
      case 'tourist':
        return {
          title: `Welcome back, ${user.name || 'Explorer'}!`,
          subtitle: 'Ready for your next adventure?',
          cta: 'Browse Tours',
          ctaLink: '/tours'
        };
      case 'guide':
        return {
          title: `Welcome, Guide ${user.name || user.email}!`,
          subtitle: 'Manage your tours and connect with travelers',
          cta: 'Go to Dashboard',
          ctaLink: '/dashboard'
        };
      case 'admin':
      case 'super_admin':
        return {
          title: `Welcome, Admin ${user.name || user.email}!`,
          subtitle: 'Manage the platform and ensure great experiences',
          cta: 'Admin Panel',
          ctaLink: '/admin'
        };
      default:
        return {
          title: 'Welcome to TravelHub',
          subtitle: 'Your gateway to amazing travel experiences',
          cta: 'Get Started',
          ctaLink: '/register'
        };
    }
  };

  const welcome = getWelcomeMessage();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {welcome.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              {welcome.subtitle}
            </p>
            <Link
              to={welcome.ctaLink}
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 transition-colors"
            >
              {welcome.cta}
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose TravelHub?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide exceptional travel experiences with a focus on quality, safety, and customer satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who have discovered amazing destinations with TravelHub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Create Account
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/tours"
                className="inline-flex items-center px-8 py-4 border border-primary-600 text-lg font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 transition-colors"
              >
                Browse Tours
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-100">Tours Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-primary-100">Happy Travelers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-primary-100">Expert Guides</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
