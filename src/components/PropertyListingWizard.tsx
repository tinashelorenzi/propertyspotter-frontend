import React, { useState, useEffect, useCallback } from 'react';
import { 
  XMarkIcon, 
  PhotoIcon, 
  TrashIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import Toast from './Toast';

interface Agent {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  is_active: boolean;
}

interface UploadedImage {
  image_id: string;
  image_url: string;
  filename: string;
  size: number;
  is_primary: boolean;
  order: number;
}

interface PropertyDraft {
  id: string;
  session_id: string;
  created_by: string;
  created_at: string;
  images: UploadedImage[];
  image_count: number;
}

interface PropertyFormData {
  title: string;
  description: string;
  suburb: string;
  province: string;
  street_address: string;
  property_type: string;
  custom_property_type: string;
  bedrooms: number;
  bathrooms: number;
  parking_spaces: number;
  listing_price: string;
  is_pet_friendly: boolean;
  has_pool: boolean;
  agent: string;
}

interface PropertyListingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onPropertyCreated: () => void;
}

const PropertyListingWizard: React.FC<PropertyListingWizardProps> = ({
  isOpen,
  onClose,
  onPropertyCreated
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [draft, setDraft] = useState<PropertyDraft | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    suburb: '',
    province: 'gauteng',
    street_address: '',
    property_type: 'house',
    custom_property_type: '',
    bedrooms: 1,
    bathrooms: 1,
    parking_spaces: 0,
    listing_price: '',
    is_pet_friendly: false,
    has_pool: false,
    agent: ''
  });

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  const [dragActive, setDragActive] = useState(false);

  // Province options
  const provinceOptions = [
    { value: 'gauteng', label: 'Gauteng' },
    { value: 'western_cape', label: 'Western Cape' },
    { value: 'eastern_cape', label: 'Eastern Cape' },
    { value: 'kwazulu_natal', label: 'KwaZulu-Natal' },
    { value: 'free_state', label: 'Free State' },
    { value: 'mpumalanga', label: 'Mpumalanga' },
    { value: 'limpopo', label: 'Limpopo' },
    { value: 'north_west', label: 'North West' },
    { value: 'northern_cape', label: 'Northern Cape' },
  ];

  // Property type options
  const propertyTypeOptions = [
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'duplex', label: 'Duplex' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'studio', label: 'Studio' },
    { value: 'cottage', label: 'Cottage' },
    { value: 'farm', label: 'Farm' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'other', label: 'Other' },
  ];

  // Create draft when wizard opens
  useEffect(() => {
    if (isOpen && !draft) {
      createDraft();
      fetchAgents();
    }
  }, [isOpen]);

  const createDraft = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}api/listings/agency-admin/drafts/create/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: `wizard_${Date.now()}`
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDraft(data.data);
      } else {
        setToast({
          message: 'Failed to create draft. Please try again.',
          type: 'error',
          isVisible: true,
        });
      }
    } catch (error) {
      console.error('Error creating draft:', error);
      setToast({
        message: 'An error occurred while creating draft.',
        type: 'error',
        isVisible: true,
      });
    }
  };

  const fetchAgents = async () => {
    try {
      setIsLoadingAgents(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}api/listings/agency-admin/agents/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAgents(data.results);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setIsLoadingAgents(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [draft]);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleFiles = async (files: File[]) => {
    if (!draft) return;

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setToast({
          message: `${file.name} is not an image file`,
          type: 'error',
          isVisible: true,
        });
        continue;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setToast({
          message: `${file.name} is too large (max 10MB)`,
          type: 'error',
          isVisible: true,
        });
        continue;
      }

      // Check image limit (200)
      if (uploadedImages.length >= 200) {
        setToast({
          message: 'Maximum of 200 images allowed per property',
          type: 'error',
          isVisible: true,
        });
        break;
      }

      await uploadImage(file);
    }
  };

  const uploadImage = async (file: File) => {
    if (!draft) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('alt_text', file.name);
      formData.append('is_primary', uploadedImages.length === 0 ? 'true' : 'false');

      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}api/listings/agency-admin/drafts/${draft.id}/images/upload/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        const newImage: UploadedImage = {
          image_id: data.data.image_id,
          image_url: data.data.image_url,
          filename: data.data.filename,
          size: data.data.size,
          is_primary: data.data.is_primary,
          order: data.data.order
        };
        
        setUploadedImages(prev => [...prev, newImage]);
        
        setToast({
          message: `${file.name} uploaded successfully`,
          type: 'success',
          isVisible: true,
        });
      } else {
        const errorData = await response.json();
        setToast({
          message: errorData.message || `Failed to upload ${file.name}`,
          type: 'error',
          isVisible: true,
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setToast({
        message: `Error uploading ${file.name}`,
        type: 'error',
        isVisible: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (imageId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}api/listings/agency-admin/drafts/images/delete/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image_id: imageId }),
        }
      );

      if (response.ok) {
        setUploadedImages(prev => prev.filter(img => img.image_id !== imageId));
        setToast({
          message: 'Image deleted successfully',
          type: 'success',
          isVisible: true,
        });
      } else {
        setToast({
          message: 'Failed to delete image',
          type: 'error',
          isVisible: true,
        });
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      setToast({
        message: 'Error deleting image',
        type: 'error',
        isVisible: true,
      });
    }
  };

  const setPrimaryImage = async (imageId: string) => {
    if (!draft) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}api/listings/agency-admin/drafts/${draft.id}/images/${imageId}/set-primary/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setUploadedImages(prev => 
          prev.map(img => ({
            ...img,
            is_primary: img.image_id === imageId
          }))
        );
        setToast({
          message: 'Primary image updated successfully',
          type: 'success',
          isVisible: true,
        });
      } else {
        setToast({
          message: 'Failed to set primary image',
          type: 'error',
          isVisible: true,
        });
      }
    } catch (error) {
      console.error('Error setting primary image:', error);
      setToast({
        message: 'Error setting primary image',
        type: 'error',
        isVisible: true,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return uploadedImages.length > 0;
      case 2:
        return formData.title && formData.description && formData.suburb && formData.street_address;
      case 3:
        return formData.agent && formData.listing_price;
      default:
        return true;
    }
  };

  const createPropertyListing = async () => {
    if (!draft || !validateStep()) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}api/listings/agency-admin/properties/create/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            draft_id: draft.id,
            listing_price: parseFloat(formData.listing_price).toString()
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setToast({
          message: 'Property listing created successfully!',
          type: 'success',
          isVisible: true,
        });
        
        // Reset form and close wizard
        setTimeout(() => {
          onPropertyCreated();
          handleClose();
        }, 1500);
      } else {
        const errorData = await response.json();
        setToast({
          message: errorData.message || 'Failed to create property listing',
          type: 'error',
          isVisible: true,
        });
      }
    } catch (error) {
      console.error('Error creating property:', error);
      setToast({
        message: 'An error occurred while creating the property',
        type: 'error',
        isVisible: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset all state
    setCurrentStep(1);
    setDraft(null);
    setUploadedImages([]);
    setFormData({
      title: '',
      description: '',
      suburb: '',
      province: 'gauteng',
      street_address: '',
      property_type: 'house',
      custom_property_type: '',
      bedrooms: 1,
      bathrooms: 1,
      parking_spaces: 0,
      listing_price: '',
      is_pet_friendly: false,
      has_pool: false,
      agent: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#225AE3] to-[#F59E0B] px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Create Property Listing</h2>
              <p className="text-blue-100 mt-1">Step {currentStep} of 3</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm font-medium">{Math.round((currentStep / 3) * 100)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          
          {/* Step 1: Image Upload */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Property Images</h3>
                <p className="text-gray-600">Upload high-quality images of the property. You can upload up to 200 images.</p>
              </div>

              {/* Drag & Drop Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  dragActive 
                    ? 'border-[#225AE3] bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Drag and drop images here, or{' '}
                      <span className="text-[#225AE3] hover:text-[#225AE3]/80">click to browse</span>
                    </span>
                  </label>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileInput}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB each • Max 200 images
                </p>
                
                {isUploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#225AE3] border-t-transparent"></div>
                  </div>
                )}
              </div>

              {/* Uploaded Images Grid */}
              {uploadedImages.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Uploaded Images ({uploadedImages.length}/200)
                    </h4>
                    <p className="text-sm text-gray-500">Click on an image to set as primary</p>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {uploadedImages.map((image) => (
                      <div key={image.image_id} className="relative group">
                        <div 
                          className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                            image.is_primary 
                              ? 'ring-4 ring-[#225AE3] ring-offset-2' 
                              : 'hover:ring-2 hover:ring-gray-300'
                          }`}
                          onClick={() => setPrimaryImage(image.image_id)}
                        >
                          <img
                            src={image.image_url}
                            alt={image.filename}
                            className="w-full h-24 object-cover"
                          />
                          
                          {image.is_primary && (
                            <div className="absolute top-2 left-2">
                              <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                            </div>
                          )}
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteImage(image.image_id);
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <p className="mt-2 text-xs text-gray-500 truncate">
                          {image.filename}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Property Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Property Details</h3>
                <p className="text-gray-600">Provide detailed information about the property.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Beautiful 3BR House in Sandton"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#225AE3] focus:border-transparent"
                    required
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe the property features, location benefits, and key selling points..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#225AE3] focus:border-transparent"
                    required
                  />
                </div>

                {/* Location Fields */}
                <div>
                  <label htmlFor="street_address" className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="street_address"
                    name="street_address"
                    value={formData.street_address}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#225AE3] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="suburb" className="block text-sm font-medium text-gray-700 mb-2">
                    Suburb *
                  </label>
                  <input
                    type="text"
                    id="suburb"
                    name="suburb"
                    value={formData.suburb}
                    onChange={handleInputChange}
                    placeholder="Sandton"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#225AE3] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
                    Province *
                  </label>
                  <select
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#225AE3] focus:border-transparent"
                    required
                  >
                    {provinceOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="property_type" className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type *
                  </label>
                  <select
                    id="property_type"
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#225AE3] focus:border-transparent"
                    required
                  >
                    {propertyTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Property Type (if Other is selected) */}
                {formData.property_type === 'other' && (
                  <div>
                    <label htmlFor="custom_property_type" className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Property Type
                    </label>
                    <input
                      type="text"
                      id="custom_property_type"
                      name="custom_property_type"
                      value={formData.custom_property_type}
                      onChange={handleInputChange}
                      placeholder="Specify property type"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#225AE3] focus:border-transparent"
                    />
                  </div>
                )}

                {/* Property Specifications */}
                <div>
                  <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    min="0"
                    max="20"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#225AE3] focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    min="0"
                    max="10"
                    step="0.5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#225AE3] focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="parking_spaces" className="block text-sm font-medium text-gray-700 mb-2">
                    Parking Spaces
                  </label>
                  <input
                    type="number"
                    id="parking_spaces"
                    name="parking_spaces"
                    value={formData.parking_spaces}
                    onChange={handleInputChange}
                    min="0"
                    max="10"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#225AE3] focus:border-transparent"
                  />
                </div>

                {/* Features */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Features</label>
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_pet_friendly"
                        checked={formData.is_pet_friendly}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-[#225AE3] focus:ring-[#225AE3]"
                      />
                      <span className="ml-2 text-sm text-gray-700">Pet Friendly</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="has_pool"
                        checked={formData.has_pool}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-[#225AE3] focus:ring-[#225AE3]"
                      />
                      <span className="ml-2 text-sm text-gray-700">Swimming Pool</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Agent Assignment & Price */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Agent Assignment & Pricing</h3>
                <p className="text-gray-600">Assign an agent and set the listing price.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Agent Assignment */}
                <div>
                  <label htmlFor="agent" className="block text-sm font-medium text-gray-700 mb-2">
                    Assign to Agent *
                  </label>
                  {isLoadingAgents ? (
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#225AE3] border-t-transparent mr-2"></div>
                      Loading agents...
                    </div>
                  ) : (
                    <select
                      id="agent"
                      name="agent"
                      value={formData.agent}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#225AE3] focus:border-transparent"
                      required
                    >
                      <option value="">Select an agent</option>
                      {agents.map(agent => (
                        <option key={agent.id} value={agent.id}>
                          {agent.first_name} {agent.last_name} ({agent.email})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Listing Price */}
                <div>
                  <label htmlFor="listing_price" className="block text-sm font-medium text-gray-700 mb-2">
                    Listing Price (ZAR) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">R</span>
                    </div>
                    <input
                      type="number"
                      id="listing_price"
                      name="listing_price"
                      value={formData.listing_price}
                      onChange={handleInputChange}
                      placeholder="2500000"
                      min="0"
                      step="1000"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#225AE3] focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Property Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Title:</span> {formData.title || 'Not set'}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Location:</span> {formData.suburb || 'Not set'}, {provinceOptions.find(p => p.value === formData.province)?.label}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Type:</span> {propertyTypeOptions.find(p => p.value === formData.property_type)?.label}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Size:</span> {formData.bedrooms} bed, {formData.bathrooms} bath
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Images:</span> {uploadedImages.length} uploaded
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Agent:</span> {agents.find(a => a.id === formData.agent)?.first_name} {agents.find(a => a.id === formData.agent)?.last_name || 'Not assigned'}
                  </div>
                </div>
              </div>

              {/* Submission Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <ExclamationTriangleIcon className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">Ready for Submission</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      This property listing will be created as a draft and can be submitted for approval when ready.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              <div className={`w-3 h-3 rounded-full ${currentStep >= 1 ? 'bg-[#225AE3]' : 'bg-gray-300'}`} />
              <div className={`w-3 h-3 rounded-full ${currentStep >= 2 ? 'bg-[#225AE3]' : 'bg-gray-300'}`} />
              <div className={`w-3 h-3 rounded-full ${currentStep >= 3 ? 'bg-[#225AE3]' : 'bg-gray-300'}`} />
            </div>

            <div className="flex space-x-4">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Previous
                </button>
              )}
              
              {currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  disabled={!validateStep()}
                  className={`inline-flex items-center px-6 py-3 font-medium rounded-lg transition-all ${
                    validateStep()
                      ? 'bg-[#225AE3] text-white hover:bg-[#225AE3]/90'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={createPropertyListing}
                  disabled={!validateStep() || isSubmitting}
                  className={`inline-flex items-center px-6 py-3 font-medium rounded-lg transition-all ${
                    validateStep() && !isSubmitting
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="h-4 w-4 mr-2" />
                      Create Listing
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Component */}
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

export default PropertyListingWizard;