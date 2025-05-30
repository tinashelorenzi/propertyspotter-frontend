import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
  const [newNote, setNewNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [propertyChanges, setPropertyChanges] = useState<Partial<PropertyDetails>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [completeData, setCompleteData] = useState({ final_price: '', notes: '' });
  const [failData, setFailData] = useState({ reason: '', notes: '' });

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/agent-login';
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
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const handleMarkAsComplete = async () => {
    if (!detailedLead) return;
    
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_API;
      
      // Mark lead as complete
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

      // Send notification
      await sendNotification(
        detailedLead.id,
        'sale_complete',
        {
          '1': `${detailedLead.spotter.first_name} ${detailedLead.spotter.last_name}`,
          '2': `R${detailedLead.spotter_commission_amount}`
        }
      );
      
      // Refresh lead details
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
      
      // Mark lead as failed
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
      
      // Refresh lead details
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
        // Send notification for lead assignment
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

  const handleAddNote = async () => {
    if (!detailedLead || !newNote.trim()) return;
    
    setIsSubmittingNote(true);
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_API;
      await axios.post(
        `${backendUrl}api/leads/${detailedLead.id}/notes/`,
        { content: newNote.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Refresh lead details
      await fetchLeadDetails(detailedLead.id);
      setNewNote('');
    } catch (err) {
      console.error('Error adding note:', err);
      setActionError('Failed to add note. Please try again.');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handlePropertyChange = (field: keyof PropertyDetails, value: any) => {
    setPropertyChanges(prev => ({
      ...prev,
      [field]: value
    }));

    // If listing_url is being updated, send notification
    if (field === 'listing_url' && value && detailedLead) {
      sendNotification(
        detailedLead.id,
        'property_listed',
        {
          '1': `${detailedLead.spotter.first_name} ${detailedLead.spotter.last_name}`,
          '2': value,
          '3': `R${detailedLead.spotter_commission_amount}`
        }
      );
    }
  };

  const handleSaveChanges = async () => {
    if (!detailedLead || Object.keys(propertyChanges).length === 0) return;
    
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_API;
      await axios.patch(
        `${backendUrl}api/leads/${detailedLead.id}/property/`,
        {
          ...propertyChanges,
          agreed_commission_amount: detailedLead.agreed_commission_amount,
          notes: `Updated property details: ${Object.keys(propertyChanges).join(', ')}`
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Refresh lead details
      await fetchLeadDetails(detailedLead.id);
      // Clear changes after successful save
      setPropertyChanges({});
    } catch (err) {
      console.error('Error updating property details:', err);
      setActionError('Failed to update property details. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateCommission = async (commissionAmount: number) => {
    if (!detailedLead) return;
    
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_API;
      await axios.patch(
        `${backendUrl}api/leads/${detailedLead.id}/property/`,
        {
          agreed_commission_amount: commissionAmount,
          notes: `Updated commission amount to ${commissionAmount}`
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Refresh lead details
      await fetchLeadDetails(detailedLead.id);
    } catch (err) {
      console.error('Error updating commission:', err);
      setActionError('Failed to update commission. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
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
              <span className="text-sm text-gray-500">({user.agency_name})</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-gray-500">Real Estate Agent</p>
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

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
                  <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                  <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Accepted Leads</dt>
                    <dd className="text-lg font-semibold text-gray-900">{stats.acceptedLeads}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        </div>

        {/* Leads List */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                {activeTab === 'assigned' ? 'Assigned Leads' : 'Current Leads'}
              </h2>
              
              {/* Search Bar */}
              <div className="relative w-64">
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#225AE3] focus:border-[#225AE3] sm:text-sm"
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('assigned')}
                  className={`${
                    activeTab === 'assigned'
                      ? 'border-[#225AE3] text-[#225AE3]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Assigned Leads
                </button>
                <button
                  onClick={() => setActiveTab('current')}
                  className={`${
                    activeTab === 'current'
                      ? 'border-[#225AE3] text-[#225AE3]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Current Leads
                </button>
              </nav>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#225AE3] mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Loading leads...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">
                {error}
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {searchQuery 
                  ? 'No leads found matching your search'
                  : activeTab === 'assigned'
                    ? 'No leads assigned yet'
                    : 'No current leads'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lead
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Suburb
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Spotter
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLeads.map((lead) => (
                      <tr 
                        key={lead.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleLeadClick(lead)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {lead.first_name} {lead.last_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {lead.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                            {lead.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {lead.suburb || 'Not specified'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {lead.spotter.first_name} {lead.spotter.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {lead.spotter.email}
                          </div>
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
                                className="text-green-600 hover:text-green-800"
                              >
                                Accept
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleActionClick(lead, 'reject');
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                Deny
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-500">Accepted</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Lead Details
                </h3>
                <button
                  onClick={handleCloseLeadDetails}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {isLoadingDetails ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#225AE3] mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading lead details...</p>
                </div>
              ) : detailedLead ? (
                <div className="space-y-6">
                  {/* Contact Information */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {detailedLead.is_accepted ? (
                      <>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
                          <dl className="mt-2 space-y-2">
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Name</dt>
                              <dd className="mt-1 text-sm text-gray-900">
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
                              <dt className="text-sm font-medium text-gray-500">Street Address</dt>
                              <dd className="mt-1 text-sm text-gray-900">{detailedLead.street_address}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Suburb</dt>
                              <dd className="mt-1 text-sm text-gray-900">{detailedLead.suburb}</dd>
                            </div>
                          </dl>
                        </div>
                      </>
                    ) : (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Lead Information</h4>
                        <dl className="mt-2 space-y-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Suburb</dt>
                            <dd className="mt-1 text-sm text-gray-900">{detailedLead.suburb}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Spotter</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {detailedLead.spotter.first_name} {detailedLead.spotter.last_name}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Created</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {new Date(detailedLead.created_at).toLocaleDateString()}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Lead Status</h4>
                      <dl className="mt-2 space-y-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Status</dt>
                          <dd className="mt-1">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(detailedLead.status)}`}>
                              {detailedLead.status.replace('_', ' ')}
                            </span>
                          </dd>
                        </div>
                        {detailedLead.is_accepted && (
                          <>
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Accepted At</dt>
                              <dd className="mt-1 text-sm text-gray-900">
                                {detailedLead.accepted_at ? new Date(detailedLead.accepted_at).toLocaleDateString() : 'N/A'}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Assigned At</dt>
                              <dd className="mt-1 text-sm text-gray-900">
                                {detailedLead.assigned_at ? new Date(detailedLead.assigned_at).toLocaleDateString() : 'N/A'}
                              </dd>
                            </div>
                          </>
                        )}
                      </dl>
                    </div>

                    {detailedLead.notes_text && (
                      <div className="sm:col-span-2">
                        <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                        <p className="mt-2 text-sm text-gray-900">{detailedLead.notes_text}</p>
                      </div>
                    )}

                    {detailedLead.images && detailedLead.images.length > 0 && detailedLead.is_accepted && (
                      <div className="sm:col-span-2">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Images</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {detailedLead.images.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image.image}
                                alt={image.description || `Lead image ${index + 1}`}
                                className="w-full h-48 object-cover rounded-lg"
                              />
                              {image.description && (
                                <p className="mt-1 text-sm text-gray-500">{image.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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

      {/* Action Modal */}
      {showActionModal && selectedLead && actionType && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {actionType === 'accept' ? 'Accept Lead' : 'Reject Lead'}
                </h3>
                <button
                  onClick={() => {
                    setShowActionModal(false);
                    setActionNotes('');
                    setActionType(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Lead Information</h4>
                <div className="bg-gray-50 p-4 rounded-md">
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

              <div className="mb-6">
                <label htmlFor="action-notes" className="block text-sm font-medium text-gray-700 mb-2">
                  {actionType === 'accept' ? 'Acceptance' : 'Rejection'} Notes
                </label>
                <textarea
                  id="action-notes"
                  rows={3}
                  className="shadow-sm focus:ring-[#225AE3] focus:border-[#225AE3] block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder={`Add notes about why you're ${actionType === 'accept' ? 'accepting' : 'rejecting'} this lead...`}
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                />
              </div>

              {actionError && (
                <div className="mb-6 text-red-500 text-sm">
                  {actionError}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowActionModal(false);
                    setActionNotes('');
                    setActionType(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleLeadAction(selectedLead.id, actionType, actionNotes)}
                  disabled={isProcessing === selectedLead.id.toString()}
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                    actionType === 'accept'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isProcessing === selectedLead.id.toString()
                    ? `${actionType === 'accept' ? 'Accepting' : 'Rejecting'}...`
                    : actionType === 'accept'
                    ? 'Accept Lead'
                    : 'Reject Lead'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complete Modal */}
      {showCompleteModal && detailedLead && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Mark Lead as Complete
                </h3>
                <button
                  onClick={() => {
                    setShowCompleteModal(false);
                    setCompleteData({ final_price: '', notes: '' });
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Final Price</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={completeData.final_price}
                    onChange={(e) => setCompleteData(prev => ({ ...prev, final_price: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#225AE3] focus:border-[#225AE3] sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    rows={3}
                    value={completeData.notes}
                    onChange={(e) => setCompleteData(prev => ({ ...prev, notes: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#225AE3] focus:border-[#225AE3] sm:text-sm"
                    placeholder="Add notes about the completed sale..."
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCompleteModal(false);
                    setCompleteData({ final_price: '', notes: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMarkAsComplete}
                  disabled={isSaving || !completeData.final_price}
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Mark as Complete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fail Modal */}
      {showFailModal && detailedLead && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Mark Lead as Failed
                </h3>
                <button
                  onClick={() => {
                    setShowFailModal(false);
                    setFailData({ reason: '', notes: '' });
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason</label>
                  <input
                    type="text"
                    value={failData.reason}
                    onChange={(e) => setFailData(prev => ({ ...prev, reason: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#225AE3] focus:border-[#225AE3] sm:text-sm"
                    placeholder="Enter the reason for failure..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    rows={3}
                    value={failData.notes}
                    onChange={(e) => setFailData(prev => ({ ...prev, notes: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#225AE3] focus:border-[#225AE3] sm:text-sm"
                    placeholder="Add additional notes about the failure..."
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowFailModal(false);
                    setFailData({ reason: '', notes: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMarkAsFailed}
                  disabled={isSaving || !failData.reason}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Mark as Failed'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add error message display */}
      {actionError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <span className="block sm:inline">{actionError}</span>
          <button
            onClick={() => setActionError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard; 