import React, { useState, useEffect } from 'react';
import { 
  HomeIcon,
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import PropertyListingWizard from './PropertyListingWizard';
import Toast from './Toast';
import { propertyService } from '../services/propertyService';
import type { PropertyListing, PropertyDraft } from '../services/propertyService';

interface PropertyManagementProps {
  onShowWizard: () => void;
}

const PropertyManagement: React.FC<PropertyManagementProps> = ({ onShowWizard }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'drafts' | 'pending' | 'approved' | 'rejected'>('all');
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [drafts, setDrafts] = useState<PropertyDraft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);

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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [propertiesData, draftsData] = await Promise.all([
        propertyService.getProperties(),
        propertyService.getDrafts()
      ]);
      
      setProperties(propertiesData);
      setDrafts(draftsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setToast({
        message: 'Failed to load property data',
        type: 'error',
        isVisible: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitForApproval = async (propertyId: string) => {
    try {
      await propertyService.submitPropertyForApproval(propertyId);
      setToast({
        message: 'Property submitted for approval successfully',
        type: 'success',
        isVisible: true,
      });
      fetchData(); // Refresh data
    } catch (error: any) {
      setToast({
        message: error.message || 'Failed to submit property',
        type: 'error',
        isVisible: true,
      });
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      await propertyService.deleteProperty(propertyId);
      setToast({
        message: 'Property deleted successfully',
        type: 'success',
        isVisible: true,
      });
      fetchData(); // Refresh data
    } catch (error: any) {
      setToast({
        message: error.message || 'Failed to delete property',
        type: 'error',
        isVisible: true,
      });
    }
  };

  const getFilteredProperties = () => {
    let filtered = properties;

    // Filter by status
    switch (activeTab) {
      case 'drafts':
        filtered = properties.filter(p => p.listing_status === 'draft');
        break;
      case 'pending':
        filtered = properties.filter(p => p.listing_status === 'pending');
        break;
      case 'approved':
        filtered = properties.filter(p => p.listing_status === 'approved');
        break;
      case 'rejected':
        filtered = properties.filter(p => p.listing_status === 'rejected');
        break;
      default:
        // 'all' - no filtering
        break;
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.suburb.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.street_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.agent_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTabCount = (tab: string) => {
    switch (tab) {
      case 'drafts':
        return properties.filter(p => p.listing_status === 'draft').length;
      case 'pending':
        return properties.filter(p => p.listing_status === 'pending').length;
      case 'approved':
        return properties.filter(p => p.listing_status === 'approved').length;
      case 'rejected':
        return properties.filter(p => p.listing_status === 'rejected').length;
      default:
        return properties.length;
    }
  };

  const filteredProperties = getFilteredProperties();

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            Property Listings
          </h2>
          <p className="text-gray-600">
            Create and manage property listings for your agency
          </p>
        </div>
        <button
          onClick={() => setShowWizard(true)}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create New Listing
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total</p>
              <p className="text-2xl font-black text-blue-900">{properties.length}</p>
            </div>
            <HomeIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-2xl font-black text-gray-900">
                {properties.filter(p => p.listing_status === 'draft').length}
              </p>
            </div>
            <ClockIcon className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-black text-yellow-900">
                {properties.filter(p => p.listing_status === 'pending').length}
              </p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Approved</p>
              <p className="text-2xl font-black text-green-900">
                {properties.filter(p => p.listing_status === 'approved').length}
              </p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Rejected</p>
              <p className="text-2xl font-black text-red-900">
                {properties.filter(p => p.listing_status === 'rejected').length}
              </p>
            </div>
            <XCircleIcon className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#225AE3] focus:border-transparent"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { key: 'all', label: 'All', icon: HomeIcon },
              { key: 'drafts', label: 'Drafts', icon: ClockIcon },
              { key: 'pending', label: 'Pending', icon: ExclamationTriangleIcon },
              { key: 'approved', label: 'Approved', icon: CheckCircleIcon },
              { key: 'rejected', label: 'Rejected', icon: XCircleIcon },
            ].map(tab => {
              const count = getTabCount(tab.key);
              const Icon = tab.icon;
              
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'bg-[#225AE3] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {tab.label}
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.key 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Properties List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {filteredProperties.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HomeIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'all' ? 'No Properties Yet' : `No ${activeTab} Properties`}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'all' 
                ? 'Start by creating your first property listing' 
                : `You don't have any ${activeTab} properties at the moment`
              }
            </p>
            {activeTab === 'all' && (
              <button
                onClick={() => setShowWizard(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Your First Listing
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {property.primary_image_url ? (
                            <img 
                              className="h-12 w-12 rounded-lg object-cover" 
                              src={property.primary_image_url} 
                              alt={property.title}
                            />
                          ) : (
                            <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <HomeIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {property.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {property.bedrooms} bed • {property.bathrooms} bath • {property.parking_spaces} parking
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{property.suburb}</div>
                      <div className="text-sm text-gray-500 capitalize">
                        {property.province.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        R {parseFloat(property.listing_price).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{property.agent_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.listing_status)}`}>
                        {property.status_display}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        {property.submitted_at 
                          ? new Date(property.submitted_at).toLocaleDateString()
                          : new Date(property.created_at).toLocaleDateString()
                        }
                      </div>
                      <div className="text-xs">
                        {property.approved_at 
                          ? `Approved ${new Date(property.approved_at).toLocaleDateString()}`
                          : property.submitted_at 
                          ? 'Awaiting approval'
                          : 'Draft'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedProperty(property);
                            setShowPropertyModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        
                        {(property.listing_status === 'draft' || property.listing_status === 'rejected') && (
                          <>
                            <button
                              onClick={() => {/* TODO: Edit functionality */}}
                              className="text-indigo-600 hover:text-indigo-900 transition-colors p-1 rounded"
                              title="Edit Property"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => handleSubmitForApproval(property.id)}
                              className="text-green-600 hover:text-green-900 transition-colors p-1 rounded"
                              title="Submit for Approval"
                            >
                              <PaperAirplaneIcon className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => handleDeleteProperty(property.id)}
                              className="text-red-600 hover:text-red-900 transition-colors p-1 rounded"
                              title="Delete Property"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Property Listing Wizard */}
      <PropertyListingWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onPropertyCreated={fetchData}
      />

      {/* Property Detail Modal */}
      {showPropertyModal && selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => {
            setShowPropertyModal(false);
            setSelectedProperty(null);
          }}
          onUpdate={fetchData}
        />
      )}

      {/* Toast */}
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

// Property Detail Modal Component
const PropertyDetailModal: React.FC<{
  property: PropertyListing;
  onClose: () => void;
  onUpdate: () => void;
}> = ({ property, onClose, onUpdate }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#225AE3] to-[#F59E0B] px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{property.title}</h2>
              <p className="text-blue-100 mt-1">{property.status_display}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-150px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Property Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Location:</span>
                    <p className="text-gray-900">{property.street_address}, {property.suburb}, {property.province.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Type:</span>
                    <p className="text-gray-900">{property.display_property_type}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Bedrooms:</span>
                      <p className="text-gray-900">{property.bedrooms}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Bathrooms:</span>
                      <p className="text-gray-900">{property.bathrooms}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Parking:</span>
                      <p className="text-gray-900">{property.parking_spaces}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Price:</span>
                    <p className="text-xl font-bold text-green-600">R {parseFloat(property.listing_price).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent & Status</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Assigned Agent:</span>
                    <p className="text-gray-900">{property.agent_name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(property.listing_status)}`}>
                      {property.status_display}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Created:</span>
                    <p className="text-gray-900">{new Date(property.created_at).toLocaleDateString()}</p>
                  </div>
                  {property.submitted_at && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Submitted:</span>
                      <p className="text-gray-900">{new Date(property.submitted_at).toLocaleDateString()}</p>
                    </div>
                  )}
                  {property.approved_at && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Approved:</span>
                      <p className="text-gray-900">{new Date(property.approved_at).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Primary Image */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Image</h3>
              {property.primary_image_url ? (
                <img 
                  src={property.primary_image_url} 
                  alt={property.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <HomeIcon className="h-12 w-12 mx-auto mb-2" />
                    <p>No image available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {(property.listing_status === 'draft' || property.listing_status === 'rejected') && (
              <button
                onClick={() => {/* TODO: Edit functionality */}}
                className="px-6 py-3 bg-[#225AE3] text-white font-medium rounded-lg hover:bg-[#225AE3]/90 transition-colors"
              >
                Edit Property
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyManagement;