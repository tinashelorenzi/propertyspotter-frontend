import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LeadsTab from './LeadsTab';
import Toast from './Toast';
import { 
  HomeIcon, 
  UserGroupIcon, 
  UserIcon,
  BellIcon,
  XMarkIcon,
  ClockIcon,
  ChartBarIcon,
  UserPlusIcon,
  CheckCircleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface Update {
  id: number;
  title: string;
  message: string;
  update_type: string;
  created_at: string;
  read_at: string | null;
  related_lead: any | null;
}

const PRIMARY_BLUE = '#225AE3';
const ACCENT_ORANGE = '#FFA726';

const ProfileTab = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [originalProfile, setOriginalProfile] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveToast, setSaveToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({ message: '', type: 'success', isVisible: false });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${import.meta.env.VITE_BACKEND_API}api/users/profile/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setOriginalProfile(data);
        } else {
          setError('Failed to load profile.');
        }
      } catch (err) {
        setError('An error occurred while loading profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (password && password !== confirmPassword) {
      setSaveToast({ message: 'Passwords do not match.', type: 'error', isVisible: true });
      return;
    }
    setSaving(true);
    const fieldsToUpdate: any = {};
    // Only include fields that have changed
    [
      'first_name',
      'last_name',
      'phone',
      'bank_name',
      'bank_branch_code',
      'account_number',
      'account_name',
      'account_type',
    ].forEach((key) => {
      if (profile[key] !== originalProfile[key]) {
        fieldsToUpdate[key] = profile[key];
      }
    });
    if (password) {
      fieldsToUpdate.password = password;
    }
    if (Object.keys(fieldsToUpdate).length === 0) {
      setSaveToast({ message: 'No changes to save.', type: 'error', isVisible: true });
      setSaving(false);
      return;
    }
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}api/users/profile/update/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fieldsToUpdate),
      });
      if (response.ok) {
        setSaveToast({ message: 'Profile updated successfully!', type: 'success', isVisible: true });
        const updated = { ...originalProfile, ...fieldsToUpdate };
        setProfile(updated);
        setOriginalProfile(updated);
        setPassword('');
        setConfirmPassword('');
      } else {
        const err = await response.json();
        setSaveToast({ message: err.message || 'Failed to update profile.', type: 'error', isVisible: true });
      }
    } catch (err) {
      setSaveToast({ message: 'An error occurred while saving.', type: 'error', isVisible: true });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#225AE3]"></div>
      </div>
    );
  }
  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }
  if (!profile) return null;

  return (
    <form className="max-w-xl mx-auto bg-white rounded-xl shadow p-8 space-y-6" onSubmit={e => { e.preventDefault(); handleSave(); }}>
      <h2 className="text-2xl font-bold text-[#225AE3] mb-4">Profile Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={profile.email}
            readOnly
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 shadow-sm focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={profile.username}
            readOnly
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 shadow-sm focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            value={profile.first_name}
            onChange={e => setProfile({ ...profile, first_name: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#225AE3] focus:border-[#225AE3]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            value={profile.last_name}
            onChange={e => setProfile({ ...profile, last_name: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#225AE3] focus:border-[#225AE3]"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={profile.phone}
            onChange={e => setProfile({ ...profile, phone: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#225AE3] focus:border-[#225AE3]"
          />
        </div>
      </div>
      {/* Banking Details */}
      <div className="pt-6">
        <h3 className="text-lg font-semibold text-[#225AE3] mb-2">Banking Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Bank Name</label>
            <input
              type="text"
              value={profile.bank_name || ''}
              onChange={e => setProfile({ ...profile, bank_name: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#225AE3] focus:border-[#225AE3]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bank Branch Code</label>
            <input
              type="text"
              value={profile.bank_branch_code || ''}
              onChange={e => setProfile({ ...profile, bank_branch_code: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#225AE3] focus:border-[#225AE3]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Number</label>
            <input
              type="text"
              value={profile.account_number || ''}
              onChange={e => setProfile({ ...profile, account_number: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#225AE3] focus:border-[#225AE3]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Name</label>
            <input
              type="text"
              value={profile.account_name || ''}
              onChange={e => setProfile({ ...profile, account_name: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#225AE3] focus:border-[#225AE3]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Account Type</label>
            <input
              type="text"
              value={profile.account_type || ''}
              onChange={e => setProfile({ ...profile, account_type: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#225AE3] focus:border-[#225AE3]"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#225AE3] focus:border-[#225AE3]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#225AE3] focus:border-[#225AE3]"
          />
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-[#225AE3] text-white rounded-lg font-semibold shadow hover:bg-[#1a4bc4] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center"
        >
          {saving && <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>}
          Save Changes
        </button>
      </div>
      {saveToast.isVisible && (
        <Toast
          message={saveToast.message}
          type={saveToast.type}
          onClose={() => setSaveToast(prev => ({ ...prev, isVisible: false }))}
        />
      )}
    </form>
  );
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    assignedLeads: 0,
    closedLeads: 0,
  });
  const [recentUpdates, setRecentUpdates] = useState<Update[]>([]);
  const [selectedUpdate, setSelectedUpdate] = useState<Update | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchUpdates = async (page = 1) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}api/updates/user/${user?.id}/?page=${page}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRecentUpdates(prev => page === 1 ? data.results : [...prev, ...data.results]);
        setHasMore(!!data.next);
        setCurrentPage(page);
      } else {
        setToast({
          message: 'Failed to fetch updates.',
          type: 'error',
          isVisible: true,
        });
      }
    } catch (error) {
      setToast({
        message: 'An error occurred while fetching updates.',
        type: 'error',
        isVisible: true,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const [leadsResponse, updatesResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_API}api/leads/spotter/${user?.id}/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
          fetch(`${import.meta.env.VITE_BACKEND_API}api/updates/user/${user?.id}/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })
        ]);

        if (leadsResponse.ok) {
          const leadsData = await leadsResponse.json();
          const leads = leadsData.results;
          
          setStats({
            totalLeads: leads.length,
            newLeads: leads.filter((lead: any) => lead.status === 'new').length,
            assignedLeads: leads.filter((lead: any) => lead.status === 'assigned').length,
            closedLeads: leads.filter((lead: any) => lead.status === 'closed').length,
          });
        }

        if (updatesResponse.ok) {
          const updatesData = await updatesResponse.json();
          setRecentUpdates(updatesData.results);
          setHasMore(!!updatesData.next);
        }
      } catch (error) {
        setToast({
          message: 'An error occurred while fetching data.',
          type: 'error',
          isVisible: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const loadMoreUpdates = () => {
    fetchUpdates(currentPage + 1);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FF] to-[#F9FAFB]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 font-medium">
                Welcome, {user?.first_name} {user?.last_name}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Leads</h3>
                <p className="mt-2 text-3xl font-bold text-gray-800">{stats.totalLeads}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-[#225AE3]" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">New Leads</h3>
                <p className="mt-2 text-3xl font-bold text-[#225AE3]">{stats.newLeads}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <UserPlusIcon className="h-6 w-6 text-[#225AE3]" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Assigned Leads</h3>
                <p className="mt-2 text-3xl font-bold text-yellow-600">{stats.assignedLeads}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Closed Leads</h3>
                <p className="mt-2 text-3xl font-bold text-green-600">{stats.closedLeads}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === 'dashboard'
                    ? 'border-[#225AE3] text-[#225AE3]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <HomeIcon className="h-5 w-5 mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('leads')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === 'leads'
                    ? 'border-[#225AE3] text-[#225AE3]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <UserGroupIcon className="h-5 w-5 mr-2" />
                Leads
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === 'profile'
                    ? 'border-[#225AE3] text-[#225AE3]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <UserIcon className="h-5 w-5 mr-2" />
                Profile
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Professional Headline and Subheading */}
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: PRIMARY_BLUE }}>
                    Stay Informed. Seize Every Opportunity.
                  </h2>
                  <p className="text-gray-700 text-lg mt-2">
                    Track your latest updates, lead progress, and earning opportunities.<br />
                    Every update brings you closer to your next reward!
                  </p>
                </div>
                {/* Updates List */}
                <div className="space-y-4">
                  {recentUpdates.length === 0 ? (
                    <div className="text-center py-12 bg-[#F5F7FF] rounded-lg border border-[#225AE3]/10">
                      <BellIcon className="mx-auto h-12 w-12 text-[#225AE3]" />
                      <h3 className="mt-2 text-lg font-semibold text-[#225AE3]">No updates</h3>
                      <p className="mt-1 text-base text-gray-500">You're all caught up!</p>
                    </div>
                  ) : (
                    recentUpdates.map((update) => (
                      <button
                        key={update.id}
                        onClick={() => setSelectedUpdate(update)}
                        className={`w-full text-left rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-5 flex items-center border-l-4 ${
                          update.update_type === 'COMMISSION' ? 'border-[#FFA726] bg-[#FFF8F1]' : 'border-[#225AE3] bg-white'
                        }`}
                      >
                        <div className="flex-shrink-0 mr-4">
                          {update.update_type === 'COMMISSION' ? (
                            <CurrencyDollarIcon className="h-8 w-8 text-[#FFA726]" />
                          ) : (
                            <BellIcon className="h-8 w-8 text-[#225AE3]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`font-bold text-lg ${update.update_type === 'COMMISSION' ? 'text-[#FFA726]' : 'text-[#225AE3]'}`}>{update.title}</span>
                            <span className="text-xs text-gray-400 ml-2">{new Date(update.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="mt-1 text-gray-700 text-base line-clamp-2">{update.message}</div>
                          {update.update_type === 'COMMISSION' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#FFA726]/20 text-[#FFA726] mt-2">
                              <CurrencyDollarIcon className="h-4 w-4 mr-1" /> Commission Earned
                            </span>
                          )}
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <div className={`w-3 h-3 rounded-full ${update.read_at ? 'bg-gray-300' : 'bg-[#225AE3]'}`}></div>
                        </div>
                      </button>
                    ))
                  )}
                  {hasMore && (
                    <button
                      onClick={loadMoreUpdates}
                      className="w-full text-center text-sm text-[#225AE3] hover:text-blue-800 py-3 bg-[#F5F7FF] rounded-lg hover:bg-blue-50 transition-colors duration-150 font-semibold mt-2"
                    >
                      Load More Updates
                    </button>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'leads' && <LeadsTab user={user} />}
            {activeTab === 'profile' && (
              <ProfileTab />
            )}
          </div>
        </div>
      </main>

      {/* Update Modal */}
      {selectedUpdate && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-[#225AE3]">{selectedUpdate.title}</h3>
              <button
                onClick={() => setSelectedUpdate(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 text-base">{selectedUpdate.message}</p>
              <div className="flex items-center text-sm text-gray-500">
                <ClockIcon className="h-4 w-4 mr-1" />
                {new Date(selectedUpdate.created_at).toLocaleString()}
              </div>
              {selectedUpdate.update_type === 'COMMISSION' && (
                <div className="flex items-center mt-2">
                  <CurrencyDollarIcon className="h-5 w-5 text-[#FFA726] mr-2" />
                  <span className="text-[#FFA726] font-semibold">Congratulations! You've earned a commission on your lead.</span>
                </div>
              )}
              {selectedUpdate.related_lead && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">Related Lead</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {selectedUpdate.related_lead.first_name} {selectedUpdate.related_lead.last_name}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
        />
      )}
    </div>
  );
};

export default Dashboard; 