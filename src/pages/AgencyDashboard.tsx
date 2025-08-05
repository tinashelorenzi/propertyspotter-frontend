import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BuildingOfficeIcon,
  DocumentDuplicateIcon,
  UserGroupIcon,
  ChartBarIcon,
  UserIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  UserPlusIcon,
  EnvelopeIcon,
  PhoneIcon,
  ClockIcon,
  HomeIcon,
  PlusIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import PropertyManagement from '../components/PropertyManagement';

// Keep all existing interfaces
interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  agency: Agency | null;
}

interface Agency {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string;
  license_valid_until: string | null;
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
  images: any[];
  spotter: any;
  agent: any | null;
  requested_agent: any | null;
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

// New interface for pending invitations
interface PendingInvitation {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  created_at: string;
  expires_at: string;
  is_used: boolean;
}

interface PendingInvitationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PendingInvitation[];
}
interface PropertyListing {
  id: string;
  title: string;
  suburb: string;
  province: string;
  street_address: string;
  property_type: string;
  display_property_type: string;
  bedrooms: number;
  bathrooms: number;
  parking_spaces: number;
  listing_price: string;
  listing_status: string;
  status_display: string;
  is_active: boolean;
  primary_image_url: string | null;
  agent_name: string;
  submitted_by_name: string;
  created_at: string;
  submitted_at: string | null;
  approved_at: string | null;
}

interface PropertyListingsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PropertyListing[];
}

// Toast Component
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`}>
      {message}
    </div>
  );
};

const AgencyDashboard = () => {
  // Existing state variables
  const [user, setUser] = useState<User | null>(null);
  const [agency, setAgency] = useState<Agency | null>(null);
  const [activeTab, setActiveTab] = useState<'leads' | 'agents' | 'properties'>('leads');
  const [agentSubTab, setAgentSubTab] = useState<'active' | 'pending'>('active');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAgents, setIsLoadingAgents] = useState(true);
  const [isLoadingPendingInvitations, setIsLoadingPendingInvitations] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agentsError, setAgentsError] = useState<string | null>(null);
  const [pendingInvitationsError, setPendingInvitationsError] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [properties, setProperties] = useState<PropertyListing[]>([]);
const [isLoadingProperties, setIsLoadingProperties] = useState(true);
const [propertiesError, setPropertiesError] = useState<string | null>(null);
const [showPropertyWizard, setShowPropertyWizard] = useState(false);
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeLeads: 0,
    totalAgents: 0,
    activeAgents: 0,
    pendingInvitations: 0,
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
  const [isResending, setIsResending] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Initialize user and agency data
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

  // Fetch properties function
  const fetchProperties = async () => {
    try {
      setIsLoadingProperties(true);
      setPropertiesError(null);
      
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}api/listings/agency-admin/properties/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data: PropertyListingsResponse = await response.json();
        setProperties(data.results);
      } else {
        const errorData = await response.json();
        setPropertiesError(errorData.message || 'Failed to fetch properties');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setPropertiesError('An error occurred while fetching properties');
    } finally {
      setIsLoadingProperties(false);
    }
  };

  // Fetch leads
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

    const fetchPendingInvitations = async () => {
      if (!agency) return;
      
      setIsLoadingPendingInvitations(true);
      setPendingInvitationsError(null);
      
      try {
        const token = localStorage.getItem('token');
        const backendUrl = import.meta.env.VITE_BACKEND_API;
        const response = await axios.get<PendingInvitationsResponse>(
          `${backendUrl}api/users/agencies/${agency.id}/pending-invitations/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        setPendingInvitations(response.data.results);
        
        setStats(prev => ({
          ...prev,
          pendingInvitations: response.data.count,
        }));
      } catch (err) {
        console.error('Error fetching pending invitations:', err);
        setPendingInvitationsError('Failed to fetch pending invitations. Please try again.');
      } finally {
        setIsLoadingPendingInvitations(false);
      }
    };

    if (agency) {
      fetchLeads();
      fetchAgents();
      fetchPendingInvitations();
      fetchProperties();
    }
  }, [agency]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('agency');
    window.location.href = '/agency-login';
  };

  // Handle lead assignment
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
      
      setToast({
        show: true,
        message: 'Lead assigned successfully!',
        type: 'success'
      });
    } catch (err) {
      console.error('Error assigning lead:', err);
      setToast({
        show: true,
        message: 'Failed to assign lead. Please try again.',
        type: 'error'
      });
    }
  };

  // Handle closing modals
  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setSelectedLead(null);
    setSelectedAgent(null);
    setAssignmentNotes('');
  };

  const handleCloseLeadDetails = () => {
    setSelectedLead(null);
  };

  // Get status colors
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

  // Handle invite agent
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

      // Refresh agents list and pending invitations
      const [agentsResponse, pendingResponse] = await Promise.all([
        axios.get<AgentsResponse>(
          `${backendUrl}api/users/agencies/${agency.id}/agents/`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get<PendingInvitationsResponse>(
          `${backendUrl}api/users/agencies/${agency.id}/pending-invitations/`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      ]);

      setAgents(agentsResponse.data.results);
      setPendingInvitations(pendingResponse.data.results);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalAgents: agentsResponse.data.count,
        activeAgents: agentsResponse.data.results.filter(agent => agent.is_active).length,
        pendingInvitations: pendingResponse.data.count,
      }));

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

  // Handle deactivate agent
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

  // Handle reactivate agent
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

  // Handle resend invitation
  const handleResendInvitation = async (invitationId: string) => {
    if (!agency) return;
    
    setIsResending(invitationId);

    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_API;
      await axios.post(
        `${backendUrl}api/users/resend-invitation/`,
        { invitation_id: invitationId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setToast({
        show: true,
        message: 'Invitation resent successfully!',
        type: 'success'
      });
    } catch (err) {
      console.error('Error resending invitation:', err);
      setToast({
        show: true,
        message: 'Failed to resend invitation. Please try again.',
        type: 'error'
      });
    } finally {
      setIsResending(null);
    }
  };

  // Filter agents and invitations based on search query
  const filteredAgents = agents.filter(agent =>
    agent.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPendingInvitations = pendingInvitations.filter(invitation =>
    invitation.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invitation.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invitation.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if invitation is expired
  const isInvitationExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

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
                  Manage your leads and team
                </p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-xl text-white font-bold">
                  {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors"
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

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Invitations</p>
                  <p className="text-3xl font-black text-gray-900">{stats.pendingInvitations}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <ClockIcon className="h-6 w-6 text-yellow-600" />
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
      Agent Management
    </button>
    
    {/* NEW PROPERTIES TAB */}
    <button
      onClick={() => setActiveTab('properties')}
      className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
        activeTab === 'properties'
          ? 'bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white shadow-lg'
          : 'text-gray-600 hover:text-gray-900 hover:bg-white'
      }`}
    >
      <HomeIcon className="h-5 w-5 mr-2" />
      Property Listings
      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
        activeTab === 'properties' 
          ? 'bg-white/20 text-white' 
          : 'bg-gray-200 text-gray-600'
      }`}>
        {properties.length}
      </span>
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
                                onClick={() => setSelectedLead(lead)}
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
                        Manage your team of agents and pending invitations
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

                  {/* Agent Sub-tabs */}
                  <div className="mb-6">
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                      <button
                        onClick={() => setAgentSubTab('active')}
                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          agentSubTab === 'active'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <UserGroupIcon className="h-4 w-4 mr-2" />
                        Active Agents ({stats.activeAgents})
                      </button>
                      <button
                        onClick={() => setAgentSubTab('pending')}
                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          agentSubTab === 'pending'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <ClockIcon className="h-4 w-4 mr-2" />
                        Pending Invitations ({stats.pendingInvitations})
                      </button>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder={`Search ${agentSubTab === 'active' ? 'agents' : 'invitations'} by name or email...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300"
                    />
                  </div>

                  {/* Active Agents Tab */}
                  {agentSubTab === 'active' && (
                    <>
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
                            {searchQuery ? 'No agents match your search' : 'No Active Agents'}
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
                    </>
                  )}

                  {/* Pending Invitations Tab */}
                  {agentSubTab === 'pending' && (
                    <>
                      {isLoadingPendingInvitations ? (
                        <div className="flex items-center justify-center py-16">
                          <div className="relative">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#225AE3]/20 border-t-[#225AE3]"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-[#F59E0B]/20 border-t-[#F59E0B] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                          </div>
                        </div>
                      ) : pendingInvitationsError ? (
                        <div className="text-center py-16">
                          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Pending Invitations</h3>
                          <p className="text-gray-600">{pendingInvitationsError}</p>
                        </div>
                      ) : filteredPendingInvitations.length === 0 ? (
                        <div className="text-center py-16">
                          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <ClockIcon className="h-8 w-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {searchQuery ? 'No pending invitations match your search' : 'No Pending Invitations'}
                          </h3>
                          <p className="text-gray-600">
                            {searchQuery ? 'Try adjusting your search terms.' : 'All agent invitations have been completed.'}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Invited Agent
                                  </th>
                                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Contact
                                  </th>
                                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Status
                                  </th>
                                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Sent
                                  </th>
                                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Expires
                                  </th>
                                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {filteredPendingInvitations.map((invitation) => (
                                  <tr key={invitation.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                          <div className="h-10 w-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {invitation.first_name.charAt(0)}{invitation.last_name.charAt(0)}
                                          </div>
                                        </div>
                                        <div className="ml-4">
                                          <div className="text-sm font-bold text-gray-900">
                                            {invitation.first_name} {invitation.last_name}
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            Pending invitation
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900">{invitation.email}</div>
                                      <div className="text-sm text-gray-500">{invitation.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${
                                        isInvitationExpired(invitation.expires_at)
                                          ? 'bg-red-100 text-red-800 border-red-200'
                                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                      }`}>
                                        {isInvitationExpired(invitation.expires_at) ? 'Expired' : 'Pending'}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {new Date(invitation.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {new Date(invitation.expires_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                      <button
                                        onClick={() => handleResendInvitation(invitation.id)}
                                        disabled={isResending === invitation.id || isInvitationExpired(invitation.expires_at)}
                                        className="inline-flex items-center px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        {isResending === invitation.id ? (
                                          <>
                                            <ArrowPathIcon className="h-4 w-4 mr-1 animate-spin" />
                                            Resending...
                                          </>
                                        ) : (
                                          <>
                                            <ArrowPathIcon className="h-4 w-4 mr-1" />
                                            Resend
                                          </>
                                        )}
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {activeTab === 'properties' && (
                <PropertyManagement onShowWizard={() => setShowPropertyWizard(true)} />
              )}
            </div>
          </div>
        </div>
      </main>

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

              {/* Form */}
              <form onSubmit={handleInviteAgent} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
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