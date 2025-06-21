import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  UserIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  ClockIcon,
  PhotoIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  CheckIcon,
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

// Keep all existing interfaces exactly as they are
interface Spotter {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  agency: string | null;
  profile_image_url: string | null;
  created_at: string;
  is_active: boolean;
  profile_complete: boolean;
  bank_name: string;
  bank_branch_code: string;
  account_number: string;
  account_name: string;
  account_type: string;
}

interface Agent {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  agency: string;
  agency_name: string;
  profile_image_url: string | null;
  created_at: string;
  is_active: boolean;
  profile_complete: boolean;
  bank_name: string | null;
  bank_branch_code: string | null;
  account_number: string | null;
  account_name: string | null;
  account_type: string | null;
}

interface LeadImage {
  image: string;
  description: string;
}

interface PropertyDetails {
  id: number;
  title: string;
  description: string;
  property_type: string;
  status: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  lot_size: number | null;
  year_built: number | null;
  listing_url: string | null;
  created_at: string;
  updated_at: string;
}

interface LeadNote {
  id: number;
  content: string;
  created_at: string;
  created_by: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

interface DetailedLead extends Lead {
  property_details: PropertyDetails | null;
  notes: LeadNote[];
  assigned_agency: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    address: string;
  };
}

interface Lead {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street_address: string;
  suburb: string;
  status: 'new' | 'assigned' | 'in_progress' | 'completed' | 'closed';
  is_accepted: boolean;
  notes_text: string;
  images: LeadImage[];
  spotter: Spotter;
  agent: Spotter | null;
  requested_agent: Spotter | null;
  agreed_commission_amount: number | null;
  spotter_commission_amount: number | null;
  created_at: string;
  updated_at: string;
  assigned_at: string | null;
  accepted_at: string | null;
  closed_at: string | null;
  property_details: any | null;
}

interface LeadsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Lead[];
}

const AgentDashboard = () => {
  // Keep all existing state variables exactly as they are
  const [user, setUser] = useState<Agent | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeLeads: 0,
    acceptedLeads: 0,
    completedLeads: 0,
  });
  const [activeTab, setActiveTab] = useState<'assigned' | 'current'>('assigned');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);
  const [detailedLead, setDetailedLead] = useState<DetailedLead | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [completeData, setCompleteData] = useState({
    final_price: '',
    notes: ''
  });
  const [failData, setFailData] = useState({
    reason: '',
    notes: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  // Keep all existing useEffect hooks exactly as they are
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchLeads = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        const backendUrl = import.meta.env.VITE_BACKEND_API;
        const response = await axios.get<LeadsResponse>(
          `${backendUrl}api/leads/agent/${user.id}/?show_all=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        setLeads(response.data.results);
        
        // Update stats based on leads data
        setStats({
          totalLeads: response.data.count,
          activeLeads: response.data.results.filter(lead => 
            lead.status === 'new' || lead.status === 'assigned' || lead.status === 'in_progress'
          ).length,
          acceptedLeads: response.data.results.filter(lead => lead.is_accepted).length,
          completedLeads: response.data.results.filter(lead => lead.status === 'completed').length,
        });
      } catch (err) {
        console.error('Error fetching leads:', err);
        setError('Failed to fetch leads. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchLeads();
    }
  }, [user]);

  // Keep all existing handler functions exactly as they are
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/agency-login';
  };

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    fetchLeadDetails(lead.id);
  };

  const handleCloseLeadDetails = () => {
    setSelectedLead(null);
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const sendNotification = async (leadId: number, templateName: string, variables: Record<string, string>) => {
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_API;
      await axios.post(
        `${backendUrl}api/leads/${leadId}/notify/`,
        {
          template_name: templateName,
          variables: variables
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error('Error sending notification:', err);
      setActionError('Failed to send notification. Please try again.');
    }
  };

  const handleLeadAction = async (leadId: number, action: 'accept' | 'reject', notes: string) => {
    if (!user) return;
    
    setIsProcessing(leadId.toString());
    setActionError(null);
    
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_API;
      await axios.patch(
        `${backendUrl}api/leads/${leadId}/accept/`,
        {
          action,
          notes: notes.trim() || undefined
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (action === 'accept') {
        const lead = leads.find(l => l.id === leadId);
        if (lead) {
          await sendNotification(
            leadId,
            'lead_assigned',
            {
              '1': `${lead.spotter.first_name} ${lead.spotter.last_name}`,
              '2': `${user.first_name} ${user.last_name}`
            }
          );
        }
      }

      // Refresh leads after action
      const response = await axios.get<LeadsResponse>(
        `${backendUrl}api/leads/agent/${user.id}/?show_all=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setLeads(response.data.results);
      
      // Update stats
      setStats({
        totalLeads: response.data.count,
        activeLeads: response.data.results.filter(lead => 
          lead.status === 'new' || lead.status === 'assigned' || lead.status === 'in_progress'
        ).length,
        acceptedLeads: response.data.results.filter(lead => lead.is_accepted).length,
        completedLeads: response.data.results.filter(lead => lead.status === 'completed').length,
      });

      // Close modals and reset state
      setShowActionModal(false);
      setSelectedLead(null);
      setActionNotes('');
      setActionType(null);
    } catch (err) {
      console.error('Error processing lead action:', err);
      setActionError(`Failed to ${action} lead. Please try again.`);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleActionClick = (lead: Lead, action: 'accept' | 'reject') => {
    setSelectedLead(lead);
    setActionType(action);
    setActionNotes('');
    setShowActionModal(true);
  };

  const fetchLeadDetails = async (leadId: number) => {
    setIsLoadingDetails(true);
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_API;
      const response = await axios.get(
        `${backendUrl}api/leads/${leadId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDetailedLead(response.data.lead);
    } catch (err) {
      console.error('Error fetching lead details:', err);
      setActionError('Failed to fetch lead details. Please try again.');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleMarkAsComplete = async () => {
    if (!detailedLead) return;
    
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_API;
      
      await axios.patch(
        `${backendUrl}api/leads/${detailedLead.id}/complete/`,
        {
          final_price: parseFloat(completeData.final_price),
          notes: completeData.notes
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await sendNotification(
        detailedLead.id,
        'sale_complete',
        {
          '1': `${detailedLead.spotter.first_name} ${detailedLead.spotter.last_name}`,
          '2': `R${detailedLead.spotter_commission_amount}`
        }
      );
      
      await fetchLeadDetails(detailedLead.id);
      setShowCompleteModal(false);
      setCompleteData({ final_price: '', notes: '' });
    } catch (err) {
      console.error('Error marking lead as complete:', err);
      setActionError('Failed to mark lead as complete. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkAsFailed = async () => {
    if (!detailedLead) return;
    
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_API;
      
      await axios.patch(
        `${backendUrl}api/leads/${detailedLead.id}/fail/`,
        {
          reason: failData.reason,
          notes: failData.notes
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      await fetchLeadDetails(detailedLead.id);
      setShowFailModal(false);
      setFailData({ reason: '', notes: '' });
    } catch (err) {
      console.error('Error marking lead as failed:', err);
      setActionError('Failed to mark lead as failed. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Filter leads based on active tab and search query
  const filteredLeads = leads.filter(lead => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      lead.first_name.toLowerCase().includes(searchLower) ||
      lead.last_name.toLowerCase().includes(searchLower) ||
      lead.email.toLowerCase().includes(searchLower) ||
      lead.phone.toLowerCase().includes(searchLower) ||
      lead.spotter.first_name.toLowerCase().includes(searchLower) ||
      lead.spotter.last_name.toLowerCase().includes(searchLower);

    if (activeTab === 'assigned') {
      return !lead.is_accepted && matchesSearch;
    } else {
      return lead.is_accepted && matchesSearch;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E9EEFB]/30 via-white to-[#F59E0B]/10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#225AE3]/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#F59E0B]/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo & Agent Info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-2xl shadow-lg">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">
                  Agent Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {user?.first_name} {user?.last_name}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-xl px-4 py-2">
                <BuildingOfficeIcon className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.agency_name || 'Agency'}
                </span>
              </div>
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors duration-300"
              >
                <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Leads</p>
                  <p className="text-3xl font-black text-gray-900">{stats.totalLeads}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <DocumentDuplicateIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#F59E0B] to-[#225AE3] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Leads</p>
                  <p className="text-3xl font-black text-gray-900">{stats.activeLeads}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <ClockIcon className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Accepted</p>
                  <p className="text-3xl font-black text-gray-900">{stats.acceptedLeads}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#F59E0B] to-[#225AE3] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-3xl font-black text-gray-900">{stats.completedLeads}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <ChartBarIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#225AE3]/10 to-[#F59E0B]/10 rounded-3xl blur opacity-50"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 bg-gray-50/50">
              <nav className="flex px-8 py-6 space-x-8">
                <button
                  onClick={() => setActiveTab('assigned')}
                  className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                    activeTab === 'assigned'
                      ? 'bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  <ClockIcon className="h-5 w-5 mr-2" />
                  Assigned Leads
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    activeTab === 'assigned' 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {leads.filter(lead => !lead.is_accepted).length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('current')}
                  className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                    activeTab === 'current'
                      ? 'bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  My Leads
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    activeTab === 'current' 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {leads.filter(lead => lead.is_accepted).length}
                  </span>
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Header & Search */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">
                    {activeTab === 'assigned' ? 'Assigned Leads' : 'My Leads'}
                  </h2>
                  <p className="text-gray-600">
                    {activeTab === 'assigned' 
                      ? 'Review and accept new lead assignments'
                      : 'Manage your accepted leads and track progress'
                    }
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-80 pl-12 pr-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Leads Content */}
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#225AE3]/20 border-t-[#225AE3]"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-[#F59E0B]/20 border-t-[#F59E0B] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Leads</h3>
                  <p className="text-gray-600">{error}</p>
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <DocumentDuplicateIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchQuery ? 'No leads match your search' : 
                     activeTab === 'assigned' ? 'No new assignments' : 'No accepted leads'}
                  </h3>
                  <p className="text-gray-600">
                    {searchQuery ? 'Try adjusting your search terms.' :
                     activeTab === 'assigned' ? 'Check back later for new lead assignments.' : 
                     'Accept some leads to get started.'}
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Lead
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Spotter
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredLeads.map((lead) => (
                          <tr 
                            key={lead.id} 
                            className="hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => handleLeadClick(lead)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-full flex items-center justify-center text-white font-bold">
                                    {lead.first_name.charAt(0)}{lead.last_name.charAt(0)}
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-bold text-gray-900">
                                    {lead.first_name} {lead.last_name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    ID: {lead.id}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{lead.email}</div>
                              <div className="text-sm text-gray-500">{lead.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(lead.status)}`}>
                                {lead.status.charAt(0).toUpperCase() + lead.status.slice(1).replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {lead.spotter.first_name} {lead.spotter.last_name}
                              </div>
                              <div className="text-sm text-gray-500">{lead.spotter.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(lead.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {!lead.is_accepted ? (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleActionClick(lead, 'accept');
                                    }}
                                    className="inline-flex items-center px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                                  >
                                    <HandThumbUpIcon className="h-4 w-4 mr-1" />
                                    Accept
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleActionClick(lead, 'reject');
                                    }}
                                    className="inline-flex items-center px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                  >
                                    <HandThumbDownIcon className="h-4 w-4 mr-1" />
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-lg font-semibold">
                                  <CheckIcon className="h-4 w-4 mr-1" />
                                  Accepted
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full my-8 shadow-2xl">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-3xl font-black text-gray-900 mb-2">
                    Lead Details
                  </h3>
                  <p className="text-gray-600">
                    Complete information for {selectedLead.first_name} {selectedLead.last_name}
                  </p>
                </div>
                <button
                  onClick={handleCloseLeadDetails}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {isLoadingDetails ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#225AE3] mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading lead details...</p>
                </div>
              ) : detailedLead ? (
                <div className="space-y-8">
                  {/* Lead Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Information */}
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <UserIcon className="h-5 w-5 mr-2 text-[#225AE3]" />
                        Contact Information
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                          <dd className="mt-1 text-sm font-semibold text-gray-900">
                            {detailedLead.first_name} {detailedLead.last_name}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Email</dt>
                          <dd className="mt-1 text-sm text-gray-900">{detailedLead.email}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Phone</dt>
                          <dd className="mt-1 text-sm text-gray-900">{detailedLead.phone}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Address</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {detailedLead.street_address}, {detailedLead.suburb}
                          </dd>
                        </div>
                      </div>
                    </div>

                    {/* Lead Status & Timeline */}
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <ChartBarIcon className="h-5 w-5 mr-2 text-[#225AE3]" />
                        Status & Timeline
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Status</dt>
                          <dd className="mt-1">
                            <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(detailedLead.status)}`}>
                              {detailedLead.status.charAt(0).toUpperCase() + detailedLead.status.slice(1).replace('_', ' ')}
                            </span>
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Created</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {new Date(detailedLead.created_at).toLocaleDateString()}
                          </dd>
                        </div>
                        {detailedLead.assigned_at && (
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Assigned</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {new Date(detailedLead.assigned_at).toLocaleDateString()}
                            </dd>
                          </div>
                        )}
                        {detailedLead.is_accepted && detailedLead.accepted_at && (
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Accepted</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {new Date(detailedLead.accepted_at).toLocaleDateString()}
                            </dd>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Spotter Information */}
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <EyeIcon className="h-5 w-5 mr-2 text-[#225AE3]" />
                        Spotter Information
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Spotter Name</dt>
                          <dd className="mt-1 text-sm font-semibold text-gray-900">
                            {detailedLead.spotter.first_name} {detailedLead.spotter.last_name}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Email</dt>
                          <dd className="mt-1 text-sm text-gray-900">{detailedLead.spotter.email}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Phone</dt>
                          <dd className="mt-1 text-sm text-gray-900">{detailedLead.spotter.phone}</dd>
                        </div>
                      </div>
                    </div>

                    {/* Commission Information */}
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <BanknotesIcon className="h-5 w-5 mr-2 text-[#225AE3]" />
                        Commission Information
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Agreed Commission</dt>
                          <dd className="mt-1 text-sm font-semibold text-gray-900">
                            {detailedLead.agreed_commission_amount ? `R${detailedLead.agreed_commission_amount}` : 'Not set'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Spotter Commission</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {detailedLead.spotter_commission_amount ? `R${detailedLead.spotter_commission_amount}` : 'Not set'}
                          </dd>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {detailedLead.notes_text && (
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Notes</h4>
                      <p className="text-gray-700 leading-relaxed">{detailedLead.notes_text}</p>
                    </div>
                  )}

                  {/* Images */}
                  {detailedLead.images && detailedLead.images.length > 0 && detailedLead.is_accepted && (
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <PhotoIcon className="h-5 w-5 mr-2 text-[#225AE3]" />
                        Property Images
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {detailedLead.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.image}
                              alt={image.description || `Property image ${index + 1}`}
                              className="w-full h-48 object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-shadow"
                            />
                            {image.description && (
                              <div className="mt-2 p-2 bg-gray-100 rounded-lg">
                                <p className="text-sm text-gray-700">{image.description}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
                    {!detailedLead.is_accepted ? (
                      <>
                        <button
                          onClick={() => handleActionClick(detailedLead, 'accept')}
                          className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <HandThumbUpIcon className="h-5 w-5 mr-2" />
                          Accept Lead
                        </button>
                        <button
                          onClick={() => handleActionClick(detailedLead, 'reject')}
                          className="inline-flex items-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <HandThumbDownIcon className="h-5 w-5 mr-2" />
                          Reject Lead
                        </button>
                      </>
                    ) : detailedLead.status === 'completed' ? (
                      <div className="flex items-center px-6 py-3 bg-green-100 text-green-800 rounded-xl font-bold">
                        <CheckIcon className="h-5 w-5 mr-2" />
                        Lead Completed
                      </div>
                    ) : detailedLead.status === 'closed' ? (
                      <div className="flex items-center px-6 py-3 bg-gray-100 text-gray-800 rounded-xl font-bold">
                        <XCircleIcon className="h-5 w-5 mr-2" />
                        Lead Closed
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => setShowCompleteModal(true)}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <CheckIcon className="h-5 w-5 mr-2" />
                          Mark as Complete
                        </button>
                        <button
                          onClick={() => setShowFailModal(true)}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <XCircleIcon className="h-5 w-5 mr-2" />
                          Mark as Failed
                        </button>
                      </>
                    )}
                    <button
                      onClick={handleCloseLeadDetails}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-red-500">
                  Failed to load lead details
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Modal (Accept/Reject) */}
      {showActionModal && selectedLead && actionType && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">
                    {actionType === 'accept' ? 'Accept Lead' : 'Reject Lead'}
                  </h3>
                  <p className="text-gray-600">
                    {actionType === 'accept' ? 
                      'Confirm your acceptance of this lead assignment' : 
                      'Please provide a reason for rejecting this lead'
                    }
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowActionModal(false);
                    setActionNotes('');
                    setActionType(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {/* Lead Information */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="text-sm font-bold text-gray-700 mb-2">Lead Information</h4>
                <div className="space-y-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Name:</span> {selectedLead.first_name} {selectedLead.last_name}
                  </p>
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Email:</span> {selectedLead.email}
                  </p>
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Phone:</span> {selectedLead.phone}
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label htmlFor="action-notes" className="block text-sm font-bold text-gray-700 mb-3">
                  {actionType === 'accept' ? 'Acceptance' : 'Rejection'} Notes
                </label>
                <textarea
                  id="action-notes"
                  rows={3}
                  className="w-full px-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300"
                  placeholder={`Add notes about why you're ${actionType === 'accept' ? 'accepting' : 'rejecting'} this lead...`}
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                />
              </div>

              {/* Error */}
              {actionError && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
                    <p className="text-sm text-red-700">{actionError}</p>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowActionModal(false);
                    setActionNotes('');
                    setActionType(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleLeadAction(selectedLead.id, actionType, actionNotes)}
                  disabled={isProcessing === selectedLead.id.toString()}
                  className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${
                    actionType === 'accept'
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                      : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                  }`}
                >
                  {isProcessing === selectedLead.id.toString() ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      {actionType === 'accept' ? 'Accepting...' : 'Rejecting...'}
                    </div>
                  ) : (
                    actionType === 'accept' ? 'Accept Lead' : 'Reject Lead'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complete Modal */}
      {showCompleteModal && detailedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">
                    Mark Lead as Complete
                  </h3>
                  <p className="text-gray-600">
                    Congratulations! Please provide final sale details.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowCompleteModal(false);
                    setCompleteData({ final_price: '', notes: '' });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="final_price" className="block text-sm font-bold text-gray-700 mb-3">
                    Final Sale Price (R)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="final_price"
                      value={completeData.final_price}
                      onChange={(e) => setCompleteData({ ...completeData, final_price: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300"
                      placeholder="Enter final sale price"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="complete_notes" className="block text-sm font-bold text-gray-700 mb-3">
                    Completion Notes
                  </label>
                  <textarea
                    id="complete_notes"
                    rows={3}
                    value={completeData.notes}
                    onChange={(e) => setCompleteData({ ...completeData, notes: e.target.value })}
                    className="w-full px-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300"
                    placeholder="Add any additional notes about the completion..."
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowCompleteModal(false);
                    setCompleteData({ final_price: '', notes: '' });
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMarkAsComplete}
                  disabled={isSaving || !completeData.final_price}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isSaving ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    'Mark as Complete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fail Modal */}
      {showFailModal && detailedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">
                    Mark Lead as Failed
                  </h3>
                  <p className="text-gray-600">
                    Please provide details about why this lead couldn't be completed.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowFailModal(false);
                    setFailData({ reason: '', notes: '' });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="fail_reason" className="block text-sm font-bold text-gray-700 mb-3">
                    Failure Reason
                  </label>
                  <input
                    type="text"
                    id="fail_reason"
                    value={failData.reason}
                    onChange={(e) => setFailData({ ...failData, reason: e.target.value })}
                    className="w-full px-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300"
                    placeholder="Enter the main reason for failure"
                  />
                </div>

                <div>
                  <label htmlFor="fail_notes" className="block text-sm font-bold text-gray-700 mb-3">
                    Additional Notes
                  </label>
                  <textarea
                    id="fail_notes"
                    rows={3}
                    value={failData.notes}
                    onChange={(e) => setFailData({ ...failData, notes: e.target.value })}
                    className="w-full px-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300"
                    placeholder="Add additional notes about the failure..."
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowFailModal(false);
                    setFailData({ reason: '', notes: '' });
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMarkAsFailed}
                  disabled={isSaving || !failData.reason}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isSaving ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    'Mark as Failed'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {actionError && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
          {actionError}
          <button
            onClick={() => setActionError(null)}
            className="ml-4 text-white hover:text-gray-200"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;