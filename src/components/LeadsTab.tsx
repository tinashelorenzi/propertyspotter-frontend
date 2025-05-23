import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import SubmitLeadModal from './SubmitLeadModal';
import LeadDetailsModal from './LeadDetailsModal';
import Toast from './Toast';

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
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#225AE3]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">My Leads</h2>
        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="btn-primary"
        >
          Submit New Lead
        </button>
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">No leads submitted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    {lead.first_name} {lead.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">{lead.email}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                  {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Phone:</span> {lead.phone}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Submitted:</span> {formatDate(lead.created_at)}
                </p>
                {lead.notes_text && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    <span className="font-medium">Notes:</span> {lead.notes_text}
                  </p>
                )}
                {lead.images && lead.images.length > 0 && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Images:</span> {lead.images.length}
                  </p>
                )}
                {lead.agreed_commission_amount && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Commission:</span> {import.meta.env.VITE_CURRENCY}{lead.agreed_commission_amount}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <SubmitLeadModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitSuccess={() => {
          fetchLeads();
          setToast({
            message: 'Lead submitted successfully!',
            type: 'success',
            isVisible: true,
          });
        }}
      />

      <LeadDetailsModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
      />

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

export default LeadsTab; 