import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Toast from '../components/Toast';
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  PhotoIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  MapPinIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

// Keep all the existing interfaces exactly as they are
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
  // Keep all existing state variables exactly as they are
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
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Keep all existing useEffect hooks exactly as they are
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

  // Keep all existing handler functions exactly as they are
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
      setAssignmentNotes('');
    } catch (err) {
      console.error('Error assigning lead:', err);
      setError('Failed to assign lead. Please try again.');
    }
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
      setToast({
        show: true,
        message: 'Agent invitation sent successfully!',
        type: 'success'
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
  const filteredAgents = agents.filter(agent =>
    agent.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            {/* Logo & Agency Info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-2xl shadow-lg">
                <BuildingOfficeIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">
                  {agency?.name || 'Agency Dashboard'}
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {user?.first_name} {user?.last_name}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
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
                  <p className="text-sm font-medium text-gray-600">Total Agents</p>
                  <p className="text-3xl font-black text-gray-900">{stats.totalAgents}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <UserGroupIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#F59E0B] to-[#225AE3] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Agents</p>
                  <p className="text-3xl font-black text-gray-900">{stats.activeAgents}</p>
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
                  onClick={() => setActiveTab('leads')}
                  className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                    activeTab === 'leads'
                      ? 'bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  <DocumentDuplicateIcon className="h-5 w-5 mr-2" />
                  Leads Management
                </button>
                <button
                  onClick={() => setActiveTab('agents')}
                  className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                    activeTab === 'agents'
                      ? 'bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  Agents Management
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="p-8">
              {activeTab === 'leads' && (
                <div>
                  {/* Leads Header */}
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-3xl font-black text-gray-900 mb-2">
                        Lead Management
                      </h2>
                      <p className="text-gray-600">
                        Manage and assign leads to your agents
                      </p>
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
                  ) : leads.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <DocumentDuplicateIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Leads Found</h3>
                      <p className="text-gray-600">No leads have been submitted yet.</p>
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
                                Agent
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
                            {leads.map((lead) => (
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
                                    className="inline-flex items-center px-3 py-1 bg-[#225AE3] hover:bg-[#1a4bc4] text-white rounded-lg transition-colors"
                                  >
                                    {lead.agent ? 'Reassign' : 'Assign'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'agents' && (
                <div>
                  {/* Agents Header */}
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-3xl font-black text-gray-900 mb-2">
                        Agent Management
                      </h2>
                      <p className="text-gray-600">
                        Manage your team of agents and their access
                      </p>
                    </div>
                    <button
                      onClick={() => setShowInviteModal(true)}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <UserPlusIcon className="h-5 w-5 mr-2" />
                      Invite Agent
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search agents by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300"
                    />
                  </div>

                  {/* Agents Content */}
                  {isLoadingAgents ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#225AE3]/20 border-t-[#225AE3]"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-[#F59E0B]/20 border-t-[#F59E0B] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                      </div>
                    </div>
                  ) : agentsError ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Agents</h3>
                      <p className="text-gray-600">{agentsError}</p>
                    </div>
                  ) : filteredAgents.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <UserGroupIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {searchQuery ? 'No agents match your search' : 'No Agents Found'}
                      </h3>
                      <p className="text-gray-600">
                        {searchQuery ? 'Try adjusting your search terms.' : 'Invite your first agent to get started.'}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Agent
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Contact
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Joined
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAgents.map((agent) => (
                              <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                      <div className="h-10 w-10 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-full flex items-center justify-center text-white font-bold">
                                        {agent.first_name.charAt(0)}{agent.last_name.charAt(0)}
                                      </div>
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-bold text-gray-900">
                                        {agent.first_name} {agent.last_name}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        @{agent.username}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{agent.email}</div>
                                  <div className="text-sm text-gray-500">{agent.phone}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${
                                    agent.is_active 
                                      ? 'bg-green-100 text-green-800 border-green-200' 
                                      : 'bg-red-100 text-red-800 border-red-200'
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
                                      className="inline-flex items-center px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {isDeactivating === agent.id ? 'Deactivating...' : 'Deactivate'}
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleReactivateAgent(agent.id)}
                                      disabled={isReactivating === agent.id}
                                      className="inline-flex items-center px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lead Details Modal */}
      {selectedLead && !showAssignModal && (
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
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Address</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {selectedLead.street_address}, {selectedLead.suburb}
                      </dd>
                    </div>
                  </div>
                </div>

                {/* Lead Status & Assignment */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <ChartBarIcon className="h-5 w-5 mr-2 text-[#225AE3]" />
                    Status & Assignment
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(selectedLead.status)}`}>
                          {selectedLead.status.charAt(0).toUpperCase() + selectedLead.status.slice(1).replace('_', ' ')}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Assigned Agent</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {selectedLead.agent ? `${selectedLead.agent.first_name} ${selectedLead.agent.last_name}` : 'Not assigned'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Created</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(selectedLead.created_at).toLocaleDateString()}
                      </dd>
                    </div>
                    {selectedLead.assigned_at && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Assigned</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {new Date(selectedLead.assigned_at).toLocaleDateString()}
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
                        {selectedLead.spotter.first_name} {selectedLead.spotter.last_name}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedLead.spotter.email}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedLead.spotter.phone}</dd>
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
                        {selectedLead.agreed_commission_amount ? `R${selectedLead.agreed_commission_amount}` : 'Not set'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Spotter Commission</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {selectedLead.spotter_commission_amount ? `R${selectedLead.spotter_commission_amount}` : 'Not set'}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedLead.notes_text && (
                <div className="mt-8 bg-gray-50 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Notes</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedLead.notes_text}</p>
                </div>
              )}

              {/* Images */}
              {selectedLead.images && selectedLead.images.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <PhotoIcon className="h-5 w-5 mr-2 text-[#225AE3]" />
                    Property Images
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedLead.images.map((image, index) => (
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

              {/* Modal Footer */}
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={handleCloseLeadDetails}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowAssignModal(true);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {selectedLead.agent ? 'Reassign Lead' : 'Assign Lead'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Lead Modal */}
      {showAssignModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">
                    {selectedLead.agent ? 'Reassign Lead' : 'Assign Lead'}
                  </h3>
                  <p className="text-gray-600">
                    Select an agent for {selectedLead.first_name} {selectedLead.last_name}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedAgent(null);
                    setAssignmentNotes('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {/* Agent Selection */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-700 mb-3">Select Agent</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {agents.filter(agent => agent.is_active).map((agent) => (
                    <div
                      key={agent.id}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedAgent?.id === agent.id
                          ? 'bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white shadow-lg'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                      }`}
                      onClick={() => setSelectedAgent(agent)}
                    >
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 ${
                          selectedAgent?.id === agent.id
                            ? 'bg-white/20 text-white'
                            : 'bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white'
                        }`}>
                          {agent.first_name.charAt(0)}{agent.last_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold">
                            {agent.first_name} {agent.last_name}
                          </div>
                          <div className={`text-sm ${
                            selectedAgent?.id === agent.id ? 'text-white/80' : 'text-gray-500'
                          }`}>
                            {agent.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assignment Notes */}
              <div className="mb-6">
                <label htmlFor="assignmentNotes" className="block text-sm font-bold text-gray-700 mb-3">
                  Assignment Notes (Optional)
                </label>
                <textarea
                  id="assignmentNotes"
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300"
                  placeholder="Add any special instructions or notes for this assignment..."
                />
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedAgent(null);
                    setAssignmentNotes('');
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (selectedAgent) {
                      handleAssignLead(selectedLead.id, selectedAgent.id);
                    }
                  }}
                  disabled={!selectedAgent}
                  className="px-6 py-3 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">
                    Invite New Agent
                  </h3>
                  <p className="text-gray-600">
                    Send an invitation to join your agency
                  </p>
                </div>
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
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {/* Error Message */}
              {inviteError && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
                    <p className="text-sm text-red-700">{inviteError}</p>
                  </div>
                </div>
              )}

              {/* Invite Form */}
              <form onSubmit={handleInviteAgent} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-bold text-gray-700 mb-3">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      required
                      value={inviteForm.first_name}
                      onChange={(e) => setInviteForm({ ...inviteForm, first_name: e.target.value })}
                      className="w-full px-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-bold text-gray-700 mb-3">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      required
                      value={inviteForm.last_name}
                      onChange={(e) => setInviteForm({ ...inviteForm, last_name: e.target.value })}
                      className="w-full px-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-3">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      required
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-3">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={inviteForm.phone}
                      onChange={(e) => setInviteForm({ ...inviteForm, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                {/* Form Footer */}
                <div className="flex justify-end space-x-4 pt-4">
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
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isInviting}
                    className="px-6 py-3 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {isInviting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Sending Invitation...
                      </div>
                    ) : (
                      'Send Invitation'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {deactivateError && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {deactivateError}
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
        />
      )}
    </div>
  );
};

export default AgencyDashboard;