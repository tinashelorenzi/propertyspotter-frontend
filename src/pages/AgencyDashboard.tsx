import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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

interface Spotter {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  agency: Agency | null;
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

interface LeadImage {
  image: string;
  description: string;
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
  closed_at: string | null;
  property_details: any | null;
}

interface LeadsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Lead[];
}

interface Agent {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  profile_image_url: string | null;
  created_at: string;
  is_active: boolean;
  profile_complete: boolean;
  last_login: string | null;
}

interface AgentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Agent[];
}

const AgencyDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [agency, setAgency] = useState<Agency | null>(null);
  const [activeTab, setActiveTab] = useState<'leads' | 'agents'>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAgents, setIsLoadingAgents] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agentsError, setAgentsError] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeLeads: 0,
    totalAgents: 0,
    activeAgents: 0,
  });
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone: ''
  });
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [isDeactivating, setIsDeactivating] = useState<string | null>(null);
  const [deactivateError, setDeactivateError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isReactivating, setIsReactivating] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const agencyData = localStorage.getItem('agency');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    if (agencyData) {
      setAgency(JSON.parse(agencyData));
    }
  }, []);

  useEffect(() => {
    const fetchLeads = async () => {
      if (!agency) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        const backendUrl = import.meta.env.VITE_BACKEND_API;
        const response = await axios.get<LeadsResponse>(
          `${backendUrl}api/leads/agency/${agency.id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        setLeads(response.data.results);
        
        // Update stats based on leads data
        setStats(prev => ({
          ...prev,
          totalLeads: response.data.count,
          activeLeads: response.data.results.filter(lead => 
            lead.status === 'new' || lead.status === 'assigned' || lead.status === 'in_progress'
          ).length,
        }));
      } catch (err) {
        console.error('Error fetching leads:', err);
        setError('Failed to fetch leads. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAgents = async () => {
      if (!agency) return;
      
      setIsLoadingAgents(true);
      setAgentsError(null);
      
      try {
        const token = localStorage.getItem('token');
        const backendUrl = import.meta.env.VITE_BACKEND_API;
        const response = await axios.get<AgentsResponse>(
          `${backendUrl}api/users/agencies/${agency.id}/agents/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        setAgents(response.data.results);
        
        // Update stats based on agents data
        setStats(prev => ({
          ...prev,
          totalAgents: response.data.count,
          activeAgents: response.data.results.filter(agent => agent.is_active).length,
        }));
      } catch (err) {
        console.error('Error fetching agents:', err);
        setAgentsError('Failed to fetch agents. Please try again.');
      } finally {
        setIsLoadingAgents(false);
      }
    };

    if (agency) {
      fetchLeads();
      fetchAgents();
    }
  }, [agency]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('agency');
    window.location.href = '/agency-login';
  };

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const handleCloseLeadDetails = () => {
    setSelectedLead(null);
  };

  const handleAssignLead = async (leadId: number, agentId: string) => {
    if (!agency) return;
    
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_API;
      await axios.patch(
        `${backendUrl}api/leads/${leadId}/assign/`,
        {
          agent_id: agentId,
          notes: assignmentNotes.trim() || undefined
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Refresh leads after assignment
      const response = await axios.get<LeadsResponse>(
        `${backendUrl}api/leads/agency/${agency.id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setLeads(response.data.results);
      setShowAssignModal(false);
      setSelectedAgent(null);
      setSelectedLead(null);
      setAssignmentNotes(''); // Reset notes after successful assignment
    } catch (err) {
      console.error('Error assigning lead:', err);
      setError('Failed to assign lead. Please try again.');
    }
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

  const handleInviteAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agency) return;

    setIsInviting(true);
    setInviteError(null);

    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_API;
      await axios.post(
        `${backendUrl}api/users/invite-agent/`,
        inviteForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh agents list
      const response = await axios.get<AgentsResponse>(
        `${backendUrl}api/users/agencies/${agency.id}/agents/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAgents(response.data.results);
      setShowInviteModal(false);
      setInviteForm({
        email: '',
        first_name: '',
        last_name: '',
        phone: ''
      });
    } catch (err) {
      console.error('Error inviting agent:', err);
      setInviteError('Failed to invite agent. Please try again.');
    } finally {
      setIsInviting(false);
    }
  };

  const handleDeactivateAgent = async (agentId: string) => {
    if (!agency) return;
    
    setIsDeactivating(agentId);
    setDeactivateError(null);

    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_API;
      await axios.patch(
        `${backendUrl}api/users/${agentId}/deactivate/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh agents list
      const response = await axios.get<AgentsResponse>(
        `${backendUrl}api/users/agencies/${agency.id}/agents/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAgents(response.data.results);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        activeAgents: response.data.results.filter(agent => agent.is_active).length,
      }));
    } catch (err) {
      console.error('Error deactivating agent:', err);
      setDeactivateError('Failed to deactivate agent. Please try again.');
    } finally {
      setIsDeactivating(null);
    }
  };

  const handleReactivateAgent = async (agentId: string) => {
    if (!agency) return;
    
    setIsReactivating(agentId);
    setDeactivateError(null);

    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_API;
      await axios.patch(
        `${backendUrl}api/users/${agentId}/reactivate/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh agents list
      const response = await axios.get<AgentsResponse>(
        `${backendUrl}api/users/agencies/${agency.id}/agents/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAgents(response.data.results);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        activeAgents: response.data.results.filter(agent => agent.is_active).length,
      }));
    } catch (err) {
      console.error('Error reactivating agent:', err);
      setDeactivateError('Failed to reactivate agent. Please try again.');
    } finally {
      setIsReactivating(null);
    }
  };

  // Filter agents based on search query
  const filteredAgents = agents.filter(agent => {
    const searchLower = searchQuery.toLowerCase();
    return (
      agent.first_name.toLowerCase().includes(searchLower) ||
      agent.last_name.toLowerCase().includes(searchLower) ||
      agent.email.toLowerCase().includes(searchLower) ||
      agent.phone.toLowerCase().includes(searchLower)
    );
  });

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
              <h1 className="text-xl font-semibold text-gray-900">Agency Dashboard</h1>
              <span className="text-sm text-gray-500">({agency.name})</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-gray-500">Agency Administrator</p>
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
              {agency.license_valid_until && (
                <div>
                  <p className="text-sm font-medium text-gray-500">License Valid Until</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(agency.license_valid_until).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Leads Stats */}
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

          {/* Agents Stats */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-[#225AE3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Agents</dt>
                    <dd className="text-lg font-semibold text-gray-900">{stats.totalAgents}</dd>
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Agents</dt>
                    <dd className="text-lg font-semibold text-gray-900">{stats.activeAgents}</dd>
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
              Leads
            </button>
            <button
              onClick={() => setActiveTab('agents')}
              className={`${
                activeTab === 'agents'
                  ? 'border-[#225AE3] text-[#225AE3]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Manage Agents
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6 bg-white shadow rounded-lg">
          {activeTab === 'leads' ? (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">Assigned Leads</h2>
                <button className="bg-[#225AE3] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#1a4bc4]">
                  Assign New Lead
                </button>
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
              ) : leads.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No leads assigned yet
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
                          Assigned Agent
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {leads.map((lead) => (
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
                              {lead.suburb}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {lead.agent ? `${lead.agent.first_name} ${lead.agent.last_name}` : 'Unassigned'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(lead.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLead(lead);
                                setShowAssignModal(true);
                              }}
                              className="text-[#225AE3] hover:text-[#1a4bc4]"
                            >
                              {lead.agent ? 'Reassign' : 'Assign'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">Agency Agents</h2>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="bg-[#225AE3] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#1a4bc4]"
                >
                  Add New Agent
                </button>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#225AE3] focus:border-[#225AE3] sm:text-sm"
                    placeholder="Search agents..."
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
              
              {isLoadingAgents ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#225AE3] mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading agents...</p>
                </div>
              ) : agentsError ? (
                <div className="text-center py-12 text-red-500">
                  {agentsError}
                </div>
              ) : filteredAgents.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {searchQuery ? 'No agents found matching your search' : 'No agents added yet'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Agent
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAgents.map((agent) => (
                        <tr key={agent.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {agent.first_name} {agent.last_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {agent.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{agent.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              agent.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {agent.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(agent.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {agent.is_active ? (
                              <button
                                onClick={() => handleDeactivateAgent(agent.id)}
                                disabled={isDeactivating === agent.id}
                                className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isDeactivating === agent.id ? 'Deactivating...' : 'Deactivate'}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleReactivateAgent(agent.id)}
                                disabled={isReactivating === agent.id}
                                className="text-green-600 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isReactivating === agent.id ? 'Reactivating...' : 'Reactivate'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lead Details Modal */}
      {selectedLead && !showAssignModal && (
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

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
                  <dl className="mt-2 space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {selectedLead.first_name} {selectedLead.last_name}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedLead.email}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedLead.phone}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Lead Information</h4>
                  <dl className="mt-2 space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedLead.status)}`}>
                          {selectedLead.status.replace('_', ' ')}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Created</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(selectedLead.created_at).toLocaleDateString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Spotter</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {selectedLead.spotter.first_name} {selectedLead.spotter.last_name}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Suburb</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {selectedLead.suburb}
                      </dd>
                    </div>
                  </dl>
                </div>

                {selectedLead.notes_text && (
                  <div className="sm:col-span-2">
                    <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                    <p className="mt-2 text-sm text-gray-900">{selectedLead.notes_text}</p>
                  </div>
                )}

                {selectedLead.images && selectedLead.images.length > 0 && (
                  <div className="sm:col-span-2">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Images</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedLead.images.map((image, index) => (
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

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={handleCloseLeadDetails}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Lead Modal */}
      {showAssignModal && selectedLead && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedLead.agent ? 'Reassign Lead' : 'Assign Lead'}
                </h3>
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedAgent(null);
                    setAssignmentNotes(''); // Reset notes when closing modal
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Select Agent</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className={`p-3 rounded-lg cursor-pointer ${
                        selectedAgent?.id === agent.id
                          ? 'bg-[#225AE3] text-white'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedAgent(agent)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {agent.first_name} {agent.last_name}
                          </p>
                          <p className={`text-sm ${selectedAgent?.id === agent.id ? 'text-white' : 'text-gray-500'}`}>
                            {agent.email}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          agent.is_active
                            ? selectedAgent?.id === agent.id
                              ? 'bg-white text-[#225AE3]'
                              : 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {agent.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="assignment-notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Notes (Optional)
                </label>
                <textarea
                  id="assignment-notes"
                  rows={3}
                  className="shadow-sm focus:ring-[#225AE3] focus:border-[#225AE3] block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Add any notes about this assignment..."
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedAgent(null);
                    setAssignmentNotes(''); // Reset notes when canceling
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (selectedAgent && selectedLead) {
                      handleAssignLead(selectedLead.id, selectedAgent.id);
                    }
                  }}
                  disabled={!selectedAgent}
                  className="px-4 py-2 bg-[#225AE3] text-white rounded-md text-sm font-medium hover:bg-[#1a4bc4] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedLead.agent ? 'Reassign' : 'Assign'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Agent Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Invite New Agent
                </h3>
                <button
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteForm({
                      email: '',
                      first_name: '',
                      last_name: '',
                      phone: ''
                    });
                    setInviteError(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleInviteAgent}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#225AE3] focus:border-[#225AE3] sm:text-sm"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#225AE3] focus:border-[#225AE3] sm:text-sm"
                        value={inviteForm.first_name}
                        onChange={(e) => setInviteForm(prev => ({ ...prev, first_name: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="last_name"
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#225AE3] focus:border-[#225AE3] sm:text-sm"
                        value={inviteForm.last_name}
                        onChange={(e) => setInviteForm(prev => ({ ...prev, last_name: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#225AE3] focus:border-[#225AE3] sm:text-sm"
                      value={inviteForm.phone}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>

                  {inviteError && (
                    <div className="text-red-500 text-sm">
                      {inviteError}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowInviteModal(false);
                      setInviteForm({
                        email: '',
                        first_name: '',
                        last_name: '',
                        phone: ''
                      });
                      setInviteError(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isInviting}
                    className="px-4 py-2 bg-[#225AE3] text-white rounded-md text-sm font-medium hover:bg-[#1a4bc4] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isInviting ? 'Sending Invitation...' : 'Send Invitation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add error message display */}
      {deactivateError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <span className="block sm:inline">{deactivateError}</span>
          <button
            onClick={() => setDeactivateError(null)}
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

export default AgencyDashboard; 