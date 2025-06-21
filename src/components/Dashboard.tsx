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
  CurrencyDollarIcon,
  ArrowRightIcon,
  EyeIcon,
  CalendarIcon
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
const ACCENT_ORANGE = '#F59E0B';

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
      setSaveToast({ message: 'No changes to save.', type: 'success', isVisible: true });
      setSaving(false);
      return;
    }
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}api/users/profile/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(fieldsToUpdate),
      });
      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setOriginalProfile(updatedProfile);
        setPassword('');
        setConfirmPassword('');
        setSaveToast({ message: 'Profile updated successfully!', type: 'success', isVisible: true });
      } else {
        setSaveToast({ message: 'Failed to update profile.', type: 'error', isVisible: true });
      }
    } catch (err) {
      setSaveToast({ message: 'An error occurred while updating profile.', type: 'error', isVisible: true });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#225AE3]/20 border-t-[#225AE3]"></div>
          <div className="absolute inset-0 rounded-full border-4 border-[#F59E0B]/20 border-t-[#F59E0B] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#225AE3] text-white px-4 py-2 rounded-lg hover:bg-[#1a4bc7] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="first_name" className="block text-sm font-bold text-gray-700 mb-3">First Name</label>
          <input
            type="text"
            id="first_name"
            value={profile?.first_name || ''}
            onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
            className="w-full px-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300 shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="last_name" className="block text-sm font-bold text-gray-700 mb-3">Last Name</label>
          <input
            type="text"
            id="last_name"
            value={profile?.last_name || ''}
            onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
            className="w-full px-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300 shadow-sm"
          />
        </div>
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-3">Phone</label>
        <input
          type="tel"
          id="phone"
          value={profile?.phone || ''}
          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          className="w-full px-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300 shadow-sm"
        />
      </div>
      
      {/* Banking Information */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Banking Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="bank_name" className="block text-sm font-bold text-gray-700 mb-3">Bank Name</label>
            <input
              type="text"
              id="bank_name"
              value={profile?.bank_name || ''}
              onChange={(e) => setProfile({ ...profile, bank_name: e.target.value })}
              className="w-full px-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="bank_branch_code" className="block text-sm font-bold text-gray-700 mb-3">Branch Code</label>
            <input
              type="text"
              id="bank_branch_code"
              value={profile?.bank_branch_code || ''}
              onChange={(e) => setProfile({ ...profile, bank_branch_code: e.target.value })}
              className="w-full px-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="account_number" className="block text-sm font-bold text-gray-700 mb-3">Account Number</label>
            <input
              type="text"
              id="account_number"
              value={profile?.account_number || ''}
              onChange={(e) => setProfile({ ...profile, account_number: e.target.value })}
              className="w-full px-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="account_name" className="block text-sm font-bold text-gray-700 mb-3">Account Name</label>
            <input
              type="text"
              id="account_name"
              value={profile?.account_name || ''}
              onChange={(e) => setProfile({ ...profile, account_name: e.target.value })}
              className="w-full px-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Password Change */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-3">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="confirm_password" className="block text-sm font-bold text-gray-700 mb-3">Confirm Password</label>
            <input
              type="password"
              id="confirm_password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          {saving ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              Saving...
            </div>
          ) : (
            'Save Changes'
          )}
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
    if (hasMore) {
      fetchUpdates(currentPage + 1);
    }
  };

  const formatUpdateDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E9EEFB]/40 via-white to-[#F59E0B]/10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#225AE3]/20 to-transparent rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-bl from-[#F59E0B]/20 to-transparent rounded-full blur-3xl animate-float-slower"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-gradient-to-tr from-[#225AE3]/15 to-transparent rounded-full blur-3xl animate-float-reverse"></div>
      </div>

      {/* Header */}
      <header className="relative border-b border-gray-200/50 backdrop-blur-sm bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">
                  {user.first_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">
                  Welcome back, <span className="bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">{user.first_name || user.username}</span>!
                </h1>
                <p className="text-gray-600">Ready to spot some properties and earn money?</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <ArrowRightIcon className="h-4 w-4 mr-2 rotate-180" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#225AE3]/20 to-[#F59E0B]/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Total Leads</h3>
                  <p className="mt-2 text-3xl font-black text-gray-900">{stats.totalLeads}</p>
                  <p className="text-sm text-gray-600 mt-1">All time submissions</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-[#225AE3] to-[#225AE3]/80 rounded-xl flex items-center justify-center">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-blue-400/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">New Leads</h3>
                  <p className="mt-2 text-3xl font-black text-blue-600">{stats.newLeads}</p>
                  <p className="text-sm text-gray-600 mt-1">Awaiting assignment</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <UserPlusIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#F59E0B]/20 to-yellow-400/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Assigned</h3>
                  <p className="mt-2 text-3xl font-black text-[#F59E0B]">{stats.assignedLeads}</p>
                  <p className="text-sm text-gray-600 mt-1">With agents now</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-[#F59E0B] to-yellow-500 rounded-xl flex items-center justify-center">
                  <UserGroupIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-400/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Completed</h3>
                  <p className="mt-2 text-3xl font-black text-green-600">{stats.closedLeads}</p>
                  <p className="text-sm text-gray-600 mt-1">Earning money!</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <CheckCircleIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-[#225AE3]/10 via-[#F59E0B]/10 to-[#225AE3]/10 rounded-3xl blur opacity-50"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`py-6 px-1 border-b-4 font-bold text-sm flex items-center transition-all duration-300 ${
                    activeTab === 'dashboard'
                      ? 'border-[#225AE3] text-[#225AE3] bg-[#225AE3]/5'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <HomeIcon className="h-5 w-5 mr-2" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('leads')}
                  className={`py-6 px-1 border-b-4 font-bold text-sm flex items-center transition-all duration-300 ${
                    activeTab === 'leads'
                      ? 'border-[#225AE3] text-[#225AE3] bg-[#225AE3]/5'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  Leads
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-6 px-1 border-b-4 font-bold text-sm flex items-center transition-all duration-300 ${
                    activeTab === 'profile'
                      ? 'border-[#225AE3] text-[#225AE3] bg-[#225AE3]/5'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <UserIcon className="h-5 w-5 mr-2" />
                  Profile
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  {/* Header Section */}
                  <div className="text-center mb-8">
                    <h2 className="text-4xl font-black text-gray-900 mb-4">
                      Your Property <span className="bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">Journey</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                      Stay informed about your leads, track progress, and seize every earning opportunity. 
                      Every update brings you closer to your next reward!
                    </p>
                  </div>

                  {/* Recent Updates */}
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#225AE3]/20 border-t-[#225AE3]"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-[#F59E0B]/20 border-t-[#F59E0B] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                      </div>
                    </div>
                  ) : recentUpdates.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="relative max-w-md mx-auto">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#225AE3]/20 to-[#F59E0B]/20 rounded-3xl blur opacity-75"></div>
                        <div className="relative bg-white rounded-3xl p-8 shadow-xl">
                          <BellIcon className="mx-auto h-16 w-16 text-[#225AE3] mb-4" />
                          <h3 className="text-2xl font-bold text-[#225AE3] mb-2">All Caught Up!</h3>
                          <p className="text-gray-600">No new updates right now. Keep spotting properties to see updates here!</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Updates</h3>
                      {recentUpdates.map((update) => (
                        <button
                          key={update.id}
                          onClick={() => setSelectedUpdate(update)}
                          className={`w-full text-left rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex items-center border-l-4 transform hover:-translate-y-1 ${
                            update.update_type === 'COMMISSION' 
                              ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100'
                              : update.update_type === 'ASSIGNMENT'
                              ? 'border-[#F59E0B] bg-gradient-to-r from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100'
                              : 'border-[#225AE3] bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100'
                          }`}
                        >
                          <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                            update.update_type === 'COMMISSION' 
                              ? 'bg-green-500'
                              : update.update_type === 'ASSIGNMENT'
                              ? 'bg-[#F59E0B]'
                              : 'bg-[#225AE3]'
                          }`}>
                            {update.update_type === 'COMMISSION' ? (
                              <CurrencyDollarIcon className="h-6 w-6 text-white" />
                            ) : update.update_type === 'ASSIGNMENT' ? (
                              <UserGroupIcon className="h-6 w-6 text-white" />
                            ) : (
                              <BellIcon className="h-6 w-6 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-lg font-bold text-gray-900 truncate">{update.title}</h4>
                              <span className="flex items-center text-sm text-gray-500 ml-4">
                                <CalendarIcon className="h-4 w-4 mr-1" />
                                {formatUpdateDate(update.created_at)}
                              </span>
                            </div>
                            <p className="text-gray-700 mt-1 line-clamp-2">{update.message}</p>
                          </div>
                          <ArrowRightIcon className="h-5 w-5 text-gray-400 ml-4" />
                        </button>
                      ))}
                      
                      {hasMore && (
                        <div className="text-center pt-6">
                          <button
                            onClick={loadMoreUpdates}
                            className="inline-flex items-center px-6 py-3 border border-[#225AE3] text-[#225AE3] rounded-xl hover:bg-[#225AE3] hover:text-white transition-colors duration-300 font-semibold"
                          >
                            <EyeIcon className="h-5 w-5 mr-2" />
                            Load More Updates
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'leads' && user && (
                <LeadsTab user={user} />
              )}

              {activeTab === 'profile' && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-3xl font-black text-gray-900 mb-2">
                      Your <span className="bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">Profile</span>
                    </h2>
                    <p className="text-gray-600">Manage your account settings and payment information</p>
                  </div>
                  <ProfileTab />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Update Details Modal */}
      {selectedUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                    selectedUpdate.update_type === 'COMMISSION' 
                      ? 'bg-green-500'
                      : selectedUpdate.update_type === 'ASSIGNMENT'
                      ? 'bg-[#F59E0B]'
                      : 'bg-[#225AE3]'
                  }`}>
                    {selectedUpdate.update_type === 'COMMISSION' ? (
                      <CurrencyDollarIcon className="h-6 w-6 text-white" />
                    ) : selectedUpdate.update_type === 'ASSIGNMENT' ? (
                      <UserGroupIcon className="h-6 w-6 text-white" />
                    ) : (
                      <BellIcon className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedUpdate.title}</h3>
                    <p className="text-gray-500">{formatUpdateDate(selectedUpdate.created_at)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUpdate(null)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed">{selectedUpdate.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
        />
      )}

      {/* Custom Animations Styles */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(30px) rotate(-180deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(90deg); }
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 10s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float-reverse 8s ease-in-out infinite;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;