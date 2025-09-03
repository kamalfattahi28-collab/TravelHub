import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import { Tourist, Guide, Admin } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { 
  UsersIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'tourists' | 'guides' | 'admins'>('tourists');
  const [tourists, setTourists] = useState<Tourist[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [touristsResponse, guidesResponse, adminsResponse] = await Promise.all([
        usersAPI.getAllTourists(),
        usersAPI.getAllGuides(),
        usersAPI.getAllAdmins()
      ]);
      
      setTourists(touristsResponse.data);
      setGuides(guidesResponse.data);
      setAdmins(adminsResponse.data);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number, userType: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${userType}?`)) {
      return;
    }

    try {
      switch (userType) {
        case 'tourist':
          await usersAPI.deleteTourist(userId);
          setTourists(tourists.filter(t => t.tourist_id !== userId));
          break;
        case 'guide':
          await usersAPI.deleteGuide(userId);
          setGuides(guides.filter(g => g.guides_id !== userId));
          break;
        case 'admin':
          await usersAPI.deleteAdmin(userId);
          setAdmins(admins.filter(a => a.admin_id !== userId));
          break;
      }
      toast.success(`${userType.charAt(0).toUpperCase() + userType.slice(1)} deleted successfully`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || `Failed to delete ${userType}`;
      toast.error(typeof errorMessage === 'string' ? errorMessage : `Failed to delete ${userType}`);
    }
  };

  const getFilteredUsers = () => {
    if (activeTab === 'tourists') {
      return tourists.filter((user: Tourist) => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (activeTab === 'guides') {
      return guides.filter((user: Guide) => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      return admins.filter((user: Admin) => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'tourist':
        return 'bg-blue-100 text-blue-800';
      case 'guide':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-yellow-100 text-yellow-800';
      case 'super_admin':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const tabs = [
    { id: 'tourists', name: 'Tourists', icon: UsersIcon, count: tourists.length },
    { id: 'guides', name: 'Guides', icon: UserGroupIcon, count: guides.length },
    { id: 'admins', name: 'Admins', icon: ShieldCheckIcon, count: admins.length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">User Management</h1>
        <p className="text-gray-600">Manage tourists, guides, and administrators</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 w-full max-w-md"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ({getFilteredUsers().length})
            </h2>
            {user?.role === 'super_admin' && (
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add {activeTab.slice(0, -1)}
              </button>
            )}
          </div>
        </div>

        {getFilteredUsers().length === 0 ? (
          <div className="p-6 text-center">
            <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No {activeTab} found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria.' : `No ${activeTab} are registered yet.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  {activeTab === 'guides' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verified
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredUsers().map((userItem: Tourist | Guide | Admin) => (
                  <tr key={userItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {userItem.profile_picture ? (
                            <img
                              className="h-10 w-10 rounded-full"
                              src={userItem.profile_picture}
                              alt={userItem.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {userItem.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{userItem.name}</div>
                          <div className="text-sm text-gray-500">ID: {userItem.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{userItem.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(userItem.role)}`}>
                        {userItem.role.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    {activeTab === 'guides' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          (userItem as Guide).is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {(userItem as Guide).is_verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{userItem.gender || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-primary-600 hover:text-primary-900">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        {user?.role === 'super_admin' && (
                          <button
                            onClick={() => handleDeleteUser(userItem.id, activeTab.slice(0, -1))}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
