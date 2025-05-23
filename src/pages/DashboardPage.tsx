import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

interface UserData {
  username: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
}

interface Update {
  id: number;
  title: string;
  message: string;
  update_type: string;
  recipient: string;
  related_lead: string | null;
  related_commission: string | null;
  delivery_status: string;
  whatsapp_message_id: string | null;
  delivery_attempts: number;
  last_attempt_at: string;
  created_at: string;
  updated_at: string;
  delivered_at: string | null;
  read_at: string | null;
}

interface UpdatesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Update[];
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>({
    username: '',
    email: '',
    role: '',
    firstName: '',
    lastName: '',
    isActive: false,
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'profile'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [updatesLoading, setUpdatesLoading] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<Update | null>(null);
  const [updatesPagination, setUpdatesPagination] = useState({
    next: null as string | null,
    previous: null as string | null,
    count: 0,
  });

  useEffect(() => {
    const loadUserData = () => {
      console.log('Starting to load user data...');
      
      const token = localStorage.getItem('authToken');
      console.log('Auth Token:', token);
      
      if (!token) {
        console.log('No auth token found, redirecting to login');
        navigate('/login');
        return;
      }

      const username = localStorage.getItem('username');
      const email = localStorage.getItem('userEmail');
      const role = localStorage.getItem('userRole');
      const firstName = localStorage.getItem('firstName');
      const lastName = localStorage.getItem('lastName');
      const isActive = localStorage.getItem('isActive') === 'true';

      console.log('User Data from localStorage:', {
        username,
        email,
        role,
        firstName,
        lastName,
        isActive
      });

      if (!username || !email || !role) {
        console.log('Missing required user data, redirecting to login');
        navigate('/login');
        return;
      }

      setUserData({
        username,
        email,
        role,
        firstName: firstName || '',
        lastName: lastName || '',
        isActive: isActive || false,
      });
      setIsLoading(false);
    };

    loadUserData();
  }, [navigate]);

  const fetchUpdates = async (url?: string) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    setUpdatesLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        url || `${import.meta.env.VITE_BACKEND_API}api/updates/user/${userId}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data: UpdatesResponse = await response.json();
        setUpdates(data.results);
        setUpdatesPagination({
          next: data.next,
          previous: data.previous,
          count: data.count,
        });
      }
    } catch (error) {
      console.error('Error fetching updates:', error);
    } finally {
      setUpdatesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchUpdates();
    }
  }, [activeTab]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getUpdateIcon = (updateType: string) => {
    switch (updateType) {
      case 'LEAD_STATUS':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'COMMISSION':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('isActive');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#225AE3]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-[#225AE3]">PropertySpotter</h1>
              <span className="px-2 py-1 text-xs font-semibold bg-[#225AE3]/10 text-[#225AE3] rounded-full">
                {userData.role}
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-[#225AE3]/10 flex items-center justify-center">
                  <span className="text-[#225AE3] font-semibold">
                    {userData.firstName?.[0] || userData.username[0]}
                  </span>
                </div>
                <span className="text-gray-700 font-medium">
                  {userData.firstName || userData.username}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-[#225AE3] transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === 'overview'
                ? 'bg-[#225AE3] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === 'leads'
                ? 'bg-[#225AE3] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Leads</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === 'profile'
                ? 'bg-[#225AE3] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Profile</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-[#225AE3] to-[#225AE3]/80 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-80">Total Leads</p>
                      <h3 className="text-3xl font-bold mt-1">0</h3>
                    </div>
                    <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-80">Active Leads</p>
                      <h3 className="text-3xl font-bold mt-1">0</h3>
                    </div>
                    <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-80">Pending Leads</p>
                      <h3 className="text-3xl font-bold mt-1">0</h3>
                    </div>
                    <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
                {updatesLoading ? (
                  <div className="bg-gray-50 rounded-xl p-6 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#225AE3]"></div>
                  </div>
                ) : updates.length > 0 ? (
                  <div className="space-y-4">
                    {updates.map((update) => (
                      <button
                        key={update.id}
                        onClick={() => setSelectedUpdate(update)}
                        className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 text-left"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#225AE3]/10 flex items-center justify-center text-[#225AE3]">
                            {getUpdateIcon(update.update_type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{update.title}</p>
                            <p className="text-sm text-gray-500 mt-1">{update.message}</p>
                            <p className="text-xs text-gray-400 mt-2">
                              {formatDate(update.created_at)}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                    {(updatesPagination.next || updatesPagination.previous) && (
                      <div className="flex justify-between items-center mt-4">
                        <button
                          onClick={() => updatesPagination.previous && fetchUpdates(updatesPagination.previous)}
                          disabled={!updatesPagination.previous}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <span className="text-sm text-gray-500">
                          Showing {updates.length} of {updatesPagination.count}
                        </span>
                        <button
                          onClick={() => updatesPagination.next && fetchUpdates(updatesPagination.next)}
                          disabled={!updatesPagination.next}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="mt-4 text-gray-500">No recent activity to show</p>
                  </div>
                )}
              </div>

              {/* Update Details Modal */}
              {selectedUpdate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-[#225AE3]/10 flex items-center justify-center text-[#225AE3]">
                          {getUpdateIcon(selectedUpdate.update_type)}
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">{selectedUpdate.title}</h3>
                      </div>
                      <button
                        onClick={() => setSelectedUpdate(null)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-gray-600 mb-4">{selectedUpdate.message}</p>
                    <div className="text-sm text-gray-400">
                      <p>Created: {formatDate(selectedUpdate.created_at)}</p>
                      {selectedUpdate.updated_at !== selectedUpdate.created_at && (
                        <p>Updated: {formatDate(selectedUpdate.updated_at)}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Your Leads</h2>
                <button className="btn-primary flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>New Lead</span>
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="mt-4 text-gray-500">No leads found</p>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center space-x-6 mb-8">
                <div className="h-24 w-24 rounded-full bg-[#225AE3]/10 flex items-center justify-center">
                  <span className="text-3xl text-[#225AE3] font-semibold">
                    {userData.firstName?.[0] || userData.username[0]}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {userData.firstName} {userData.lastName}
                  </h2>
                  <p className="text-gray-600">{userData.email}</p>
                  <span className="inline-block mt-2 px-3 py-1 text-sm font-medium bg-[#225AE3]/10 text-[#225AE3] rounded-full">
                    {userData.role}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Account Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Username</label>
                      <p className="mt-1 text-gray-800">{userData.username}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Email</label>
                      <p className="mt-1 text-gray-800">{userData.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Role</label>
                      <p className="mt-1 text-gray-800">{userData.role}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Status</label>
                      <p className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          userData.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {userData.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 