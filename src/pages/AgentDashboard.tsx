import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Agency {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string;
  license_valid_until: string | null;
}

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  agency: Agency;
}

const AgentDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [agency, setAgency] = useState<Agency | null>(null);
  const [activeTab, setActiveTab] = useState<'leads' | 'profile'>('leads');
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeLeads: 0,
    completedLeads: 0,
    pendingUpdates: 0,
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const agencyData = localStorage.getItem('agency');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    if (agencyData) {
      setAgency(JSON.parse(agencyData));
    }
    // TODO: Fetch agent stats from API
    // For now using mock data
    setStats({
      totalLeads: 12,
      activeLeads: 5,
      completedLeads: 4,
      pendingUpdates: 3,
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('agency');
    window.location.href = '/agency-login';
  };

  if (!user || !agency) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Agent Dashboard</h1>
              <span className="text-sm text-gray-500">({agency.name})</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-gray-500">Agent</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Agency Info Card */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Agency Information</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Agency Name</p>
                <p className="mt-1 text-sm text-gray-900">{agency.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1 text-sm text-gray-900">{agency.email}</p>
              </div>
              {agency.phone && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="mt-1 text-sm text-gray-900">{agency.phone}</p>
                </div>
              )}
              {agency.address && (
                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="mt-1 text-sm text-gray-900">{agency.address}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-[#225AE3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Leads</dt>
                    <dd className="text-lg font-semibold text-gray-900">{stats.totalLeads}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Leads</dt>
                    <dd className="text-lg font-semibold text-gray-900">{stats.activeLeads}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-[#225AE3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Completed Leads</dt>
                    <dd className="text-lg font-semibold text-gray-900">{stats.completedLeads}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Updates</dt>
                    <dd className="text-lg font-semibold text-gray-900">{stats.pendingUpdates}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('leads')}
              className={`${
                activeTab === 'leads'
                  ? 'border-[#225AE3] text-[#225AE3]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              My Leads
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`${
                activeTab === 'profile'
                  ? 'border-[#225AE3] text-[#225AE3]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Profile
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6 bg-white shadow rounded-lg">
          {activeTab === 'leads' ? (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">My Leads</h2>
                <button className="bg-[#225AE3] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#1a4bc4]">
                  Update Lead Status
                </button>
              </div>
              {/* Leads Table Placeholder */}
              <div className="text-center py-12 text-gray-500">
                No leads assigned yet
              </div>
            </div>
          ) : (
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <p className="mt-1 text-sm text-gray-900">{user.first_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <p className="mt-1 text-sm text-gray-900">{user.last_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <p className="mt-1 text-sm text-gray-900">{user.username}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard; 