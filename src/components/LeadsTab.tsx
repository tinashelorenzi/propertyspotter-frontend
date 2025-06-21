import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import SubmitLeadModal from './SubmitLeadModal';
import LeadDetailsModal from './LeadDetailsModal';
import Toast from './Toast';
import { 
  PlusIcon, 
  UserIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  CalendarIcon,
  DocumentTextIcon,
  PhotoIcon,
  CurrencyDollarIcon,
  EyeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

interface Lead {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  notes_text: string;
  images: Array<{
    image: string;
    description: string;
  }>;
  spotter: {
    id: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    phone: string;
    role: string;
  };
  agent: {
    id: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
  } | null;
  agreed_commission_amount: number | null;
  spotter_commission_amount: number | null;
  created_at: string;
  updated_at: string;
  assigned_at: string | null;
  closed_at: string | null;
}

interface LeadsTabProps {
  user: {
    id: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    phone: string;
    role: string;
  };
}

const LeadsTab = ({ user }: LeadsTabProps) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}api/leads/spotter/${user.id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLeads(data.results);
      } else {
        setToast({
          message: 'Failed to fetch leads. Please try again.',
          type: 'error',
          isVisible: true,
        });
      }
    } catch (error) {
      setToast({
        message: 'An error occurred. Please try again.',
        type: 'error',
        isVisible: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [user.id]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          border: 'border-blue-200',
          gradient: 'from-blue-50 to-blue-100'
        };
      case 'assigned':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-800',
          border: 'border-orange-200',
          gradient: 'from-orange-50 to-orange-100'
        };
      case 'closed':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-200',
          gradient: 'from-green-50 to-green-100'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-200',
          gradient: 'from-gray-50 to-gray-100'
        };
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const filteredLeads = leads.filter(lead => 
    filterStatus === 'all' || lead.status.toLowerCase() === filterStatus
  );

  const statusCounts = {
    all: leads.length,
    new: leads.filter(lead => lead.status.toLowerCase() === 'new').length,
    assigned: leads.filter(lead => lead.status.toLowerCase() === 'assigned').length,
    closed: leads.filter(lead => lead.status.toLowerCase() === 'closed').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#225AE3]/20 border-t-[#225AE3]"></div>
          <div className="absolute inset-0 rounded-full border-4 border-[#F59E0B]/20 border-t-[#F59E0B] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            Your <span className="bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">Leads</span>
          </h2>
          <p className="text-gray-600">Track and manage all your property lead submissions</p>
        </div>
        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Submit New Lead
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="relative">
        <div className="absolute -inset-2 bg-gradient-to-r from-[#225AE3]/10 to-[#F59E0B]/10 rounded-2xl blur opacity-50"></div>
        <div className="relative bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Leads', count: statusCounts.all },
              { key: 'new', label: 'New', count: statusCounts.new },
              { key: 'assigned', label: 'Assigned', count: statusCounts.assigned },
              { key: 'closed', label: 'Completed', count: statusCounts.closed },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setFilterStatus(filter.key)}
                className={`flex items-center px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  filterStatus === filter.key
                    ? 'bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filter.label}
                <span className={`ml-2 px-2 py-1 rounded-lg text-xs ${
                  filterStatus === filter.key 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leads Grid */}
      {filteredLeads.length === 0 ? (
        <div className="text-center py-16">
          <div className="relative max-w-md mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#225AE3]/20 to-[#F59E0B]/20 rounded-3xl blur opacity-75"></div>
            <div className="relative bg-white rounded-3xl p-8 shadow-xl">
              <UserIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No leads found</h3>
              <p className="text-gray-600 mb-6">
                {filterStatus === 'all' 
                  ? "You haven't submitted any leads yet. Start spotting properties to earn money!"
                  : `No ${filterStatus} leads found. Try a different filter or submit a new lead.`
                }
              </p>
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <PlusIcon className="h-5 h-5 mr-2" />
                Submit Your First Lead
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead, index) => {
            const statusStyle = getStatusColor(lead.status);
            return (
              <div
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className="group relative cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-[#225AE3]/20 to-[#F59E0B]/20 rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                  
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                        {lead.first_name.charAt(0)}{lead.last_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#225AE3] transition-colors">
                          {lead.first_name} {lead.last_name}
                        </h3>
                        <p className="text-sm text-gray-500">Lead #{lead.id}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600">
                      <EnvelopeIcon className="h-4 w-4 mr-3 text-[#225AE3]" />
                      <span className="text-sm truncate">{lead.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <PhoneIcon className="h-4 w-4 mr-3 text-[#225AE3]" />
                      <span className="text-sm">{lead.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-3 text-[#225AE3]" />
                      <span className="text-sm">{formatDate(lead.created_at)}</span>
                    </div>
                  </div>

                  {/* Lead Details */}
                  <div className="space-y-2 mb-4">
                    {lead.notes_text && (
                      <div className="flex items-start">
                        <DocumentTextIcon className="h-4 w-4 mr-2 text-[#225AE3] mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600 line-clamp-2">{lead.notes_text}</p>
                      </div>
                    )}
                    
                    {lead.images && lead.images.length > 0 && (
                      <div className="flex items-center">
                        <PhotoIcon className="h-4 w-4 mr-2 text-[#225AE3]" />
                        <span className="text-sm text-gray-600 font-medium">{lead.images.length} image{lead.images.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>

                  {/* Commission Info */}
                  {lead.agreed_commission_amount && (
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="h-4 w-4 mr-2 text-green-600" />
                          <span className="text-sm font-semibold text-gray-700">Commission</span>
                        </div>
                        <span className="text-lg font-bold text-green-600">
                          {import.meta.env.VITE_CURRENCY}{lead.agreed_commission_amount}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* View Details Button */}
                  <div className="pt-4 border-t border-gray-100 mt-4">
                    <div className="flex items-center justify-center text-[#225AE3] font-semibold text-sm group-hover:text-[#F59E0B] transition-colors">
                      <EyeIcon className="h-4 w-4 mr-2" />
                      View Details
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#225AE3]/5 to-[#F59E0B]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <SubmitLeadModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitSuccess={() => {
          fetchLeads();
          setToast({
            message: 'Lead submitted successfully! 🎉',
            type: 'success',
            isVisible: true,
          });
        }}
      />

      <LeadDetailsModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
      />

      {/* Toast Notifications */}
      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
        />
      )}

      {/* Custom Styles */}
      <style>{`
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

export default LeadsTab;