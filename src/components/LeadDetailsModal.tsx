import { format } from 'date-fns';

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

interface LeadDetailsModalProps {
  lead: Lead | null;
  onClose: () => void;
}

const LeadDetailsModal = ({ lead, onClose }: LeadDetailsModalProps) => {
  if (!lead) return null;

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Lead Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Status and Dates */}
          <div className="flex flex-wrap gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}>
              {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
            </span>
            <div className="text-sm text-gray-500">
              Created: {formatDate(lead.created_at)}
            </div>
            {lead.assigned_at && (
              <div className="text-sm text-gray-500">
                Assigned: {formatDate(lead.assigned_at)}
              </div>
            )}
            {lead.closed_at && (
              <div className="text-sm text-gray-500">
                Closed: {formatDate(lead.closed_at)}
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{lead.first_name} {lead.last_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{lead.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{lead.phone}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {lead.notes_text && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Notes</h3>
              <p className="text-gray-600">{lead.notes_text}</p>
            </div>
          )}

          {/* Images */}
          {lead.images && lead.images.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lead.images.map((image, index) => (
                  <div key={index} className="space-y-2">
                    <img
                      src={image.image}
                      alt={image.description || `Image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {image.description && (
                      <p className="text-sm text-gray-500">{image.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Commission Information */}
          {(lead.agreed_commission_amount || lead.spotter_commission_amount) && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Commission Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lead.agreed_commission_amount && (
                  <div>
                    <p className="text-sm text-gray-500">Agreed Commission</p>
                    <p className="font-medium">{import.meta.env.VITE_CURRENCY}{lead.agreed_commission_amount}</p>
                  </div>
                )}
                {lead.spotter_commission_amount && (
                  <div>
                    <p className="text-sm text-gray-500">Spotter Commission</p>
                    <p className="font-medium">{import.meta.env.VITE_CURRENCY}{lead.spotter_commission_amount}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Agent Information */}
          {lead.agent && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Assigned Agent</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{lead.agent.first_name} {lead.agent.last_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{lead.agent.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsModal; 