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
import { propertyService } from '../services/propertyService';
import type { PropertyDraft, Agent } from '../services/propertyService';

interface UploadedImage {
  image_id: string;
  image_url: string;
  filename: string;
  size: number;
  is_primary: boolean;
  order: number;
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
  const [dragActive, setDragActive] = useState(false);

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

  // Options for dropdowns
  const provinceOptions = [
    { value: 'gauteng', label: 'Gauteng' },
    { value: 'western_cape', label: 'Western Cape' },
    { value: 'kwazulu_natal', label: 'KwaZulu-Natal' },
    { value: 'eastern_cape', label: 'Eastern Cape' },
    { value: 'free_state', label: 'Free State' },
    { value: 'mpumalanga', label: 'Mpumalanga' },
    { value: 'limpopo', label: 'Limpopo' },
    { value: 'north_west', label: 'North West' },
    { value: 'northern_cape', label: 'Northern Cape' },
  ];

  const propertyTypeOptions = [
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'duplex', label: 'Duplex' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'studio', label: 'Studio' },
    { value: 'other', label: 'Other' },
  ];

  // Helper function to get current user email
  const getCurrentUserEmail = () => {
    try {
      // First try to get from localStorage user data (like AgencyDashboard)
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        console.log('👤 User from localStorage:', user);
        return user.email || '';
      }
      
      // Fallback to token parsing (but with better error handling)
      const token = localStorage.getItem('token');
      if (!token) return '';
  
      let actualToken = token;
      if (token.startsWith('Bearer ')) {
        actualToken = token.substring(7);
      }
  
      const tokenParts = actualToken.split('.');
      if (tokenParts.length !== 3) return '';
  
      const payload = tokenParts[1];
      const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
      
      const decodedPayload = JSON.parse(atob(paddedPayload));
      return decodedPayload.email || decodedPayload.username || '';
    } catch (e) {
      console.warn('Could not get user email:', e);
      return '';
    }
  };

  // Auto-select current user as agent when agents are loaded
  useEffect(() => {
    if (agents.length > 0 && !formData.agent) {
      const currentUser = agents.find(agent => agent.email === getCurrentUserEmail());
      if (currentUser) {
        setFormData(prev => ({
          ...prev,
          agent: currentUser.id
        }));
      }
    }
  }, [agents]);

  // Initialize wizard when opened
  useEffect(() => {
    if (isOpen) {
      createDraft();
      fetchAgents();
    }
  }, [isOpen]);

  const createDraft = async () => {
    try {
      const newDraft = await propertyService.createDraft();
      setDraft(newDraft);
    } catch (error) {
      console.error('Error creating draft:', error);
      setToast({
        message: 'Failed to create draft. Please try again.',
        type: 'error',
        isVisible: true,
      });
    }
  };

  const fetchAgents = async () => {
    try {
      setIsLoadingAgents(true);
      const agentsData = await propertyService.getAgents();
      setAgents(agentsData);
    } catch (error) {
      console.error('Error fetching agents:', error);
      setToast({
        message: 'Failed to load agents. Please try again.',
        type: 'error',
        isVisible: true,
      });
    } finally {
      setIsLoadingAgents(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFiles = async (files: File[]) => {
    if (!draft) return;

    for (const file of files) {
      if (file.type.startsWith('image/')) {
        await uploadImage(file);
      }
    }
  };

  const uploadImage = async (file: File) => {
    if (!draft) return;

    try {
      setIsUploading(true);
      
      // Check image limit
      if (uploadedImages.length >= 200) {
        setToast({
          message: 'Maximum of 200 images allowed per property',
          type: 'error',
          isVisible: true,
        });
        return;
      }

      const isPrimary = uploadedImages.length === 0;
      const imageData = await propertyService.uploadImageToDraft(draft.id, file, isPrimary);
      
      const newImage: UploadedImage = {
        image_id: imageData.image_id,
        image_url: imageData.image_url,
        filename: imageData.filename,
        size: imageData.size,
        is_primary: imageData.is_primary,
        order: imageData.order,
      };

      setUploadedImages(prev => [...prev, newImage]);
    } catch (error) {
      console.error('Error uploading image:', error);
      setToast({
        message: 'Failed to upload image. Please try again.',
        type: 'error',
        isVisible: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (imageId: string) => {
    try {
      await propertyService.deleteImage(imageId);
      setUploadedImages(prev => prev.filter(img => img.image_id !== imageId));
    } catch (error) {
      console.error('Error deleting image:', error);
      setToast({
        message: 'Failed to delete image. Please try again.',
        type: 'error',
        isVisible: true,
      });
    }
  };

  const setPrimaryImage = async (imageId: string) => {
    if (!draft) return;

    try {
      await propertyService.setPrimaryImage(draft.id, imageId);
      setUploadedImages(prev => 
        prev.map(img => ({
          ...img,
          is_primary: img.image_id === imageId
        }))
      );
    } catch (error) {
      console.error('Error setting primary image:', error);
      setToast({
        message: 'Failed to set primary image. Please try again.',
        type: 'error',
        isVisible: true,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const nextStep = () => {
    if (currentStep < 3 && validateStep()) {
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
        return !!(formData.title && formData.description && formData.suburb && formData.street_address);
      case 3:
        return !!(formData.listing_price);
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!draft || !validateStep()) return;

    try {
      setIsSubmitting(true);
      
      const propertyData = {
        ...formData,
        listing_price: parseFloat(formData.listing_price.replace(/\s/g, '')).toString()
      };

      await propertyService.createProperty(propertyData, draft.id);
      
      setToast({
        message: 'Property listing created successfully!',
        type: 'success',
        isVisible: true,
      });

      onPropertyCreated();
      handleClose();
    } catch (error) {
      console.error('Error creating property:', error);
      setToast({
        message: 'Failed to create property listing. Please try again.',
        type: 'error',
        isVisible: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
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
    setToast({
      message: '',
      type: 'success',
      isVisible: false,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* 🔥 FIXED MODAL STRUCTURE */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        
        {/* Header - FIXED HEIGHT */}
        <div className="bg-gradient-to-r from-[#225AE3] to-[#F59E0B] px-8 py-6 text-white flex-shrink-0">
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

        {/* 🔥 SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          
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
                    : 'border-gray-300 hover:border-[#225AE3]'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="image-upload"
                  multiple
                  accept="image/*"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <CloudArrowUpIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Drop images here or click to browse
                </h3>
                <p className="text-gray-500">
                  Supports JPG, PNG, WebP up to 10MB each
                </p>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="animate-spin h-5 w-5 border-2 border-[#225AE3] border-t-transparent rounded-full mr-3"></div>
                    <span className="text-sm text-blue-800">Uploading images...</span>
                  </div>
                </div>
              )}

              {/* Uploaded Images Grid */}
              {uploadedImages.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Uploaded Images ({uploadedImages.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={image.image_id} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={image.image_url}
                            alt={image.filename}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Primary Badge */}
                        {image.is_primary && (
                          <div className="absolute top-2 left-2 bg-[#225AE3] text-white px-2 py-1 rounded-md text-xs font-medium">
                            <StarIcon className="h-3 w-3 inline mr-1" />
                            Primary
                          </div>
                        )}
                        
                        {/* Actions */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                          {!image.is_primary && (
                            <button
                              onClick={() => setPrimaryImage(image.image_id)}
                              className="p-1 bg-white rounded-full shadow-md hover:bg-gray-50"
                              title="Set as primary"
                            >
                              <StarIcon className="h-4 w-4 text-gray-600" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteImage(image.image_id)}
                            className="p-1 bg-white rounded-full shadow-md hover:bg-red-50"
                            title="Delete image"
                          >
                            <TrashIcon className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                        
                        {/* Filename */}
                        <div className="mt-2">
                          <p className="text-xs text-gray-600 truncate" title={image.filename}>
                            {image.filename}
                          </p>
                        </div>
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
                    required
                    placeholder="e.g., Beautiful 3-bedroom house in Sandton"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#225AE3] focus:border-transparent"
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
                    required
                    rows={4}
                    placeholder="Describe the property features, location benefits, and unique selling points..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#225AE3] focus:border-transparent"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label htmlFor="street_address" className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="street_address"
                    name="street_address"
                    value={formData.street_address}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 123 Oak Street"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#225AE3] focus:border-transparent"
                  />
                </div>

                {/* Suburb */}
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
                    required
                    placeholder="e.g., Sandton"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#225AE3] focus:border-transparent"
                  />
                </div>

                {/* Province */}
                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
                    Province *
                  </label>
                  <select
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#225AE3] focus:border-transparent"
                  >
                    {provinceOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Property Type */}
                <div>
                  <label htmlFor="property_type" className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type *
                  </label>
                  <select
                    id="property_type"
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#225AE3] focus:border-transparent"
                  >
                    {propertyTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Property Type */}
                {formData.property_type === 'other' && (
                  <div>
                    <label htmlFor="custom_property_type" className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Property Type *
                    </label>
                    <input
                      type="text"
                      id="custom_property_type"
                      name="custom_property_type"
                      value={formData.custom_property_type}
                      onChange={handleInputChange}
                      required={formData.property_type === 'other'}
                      placeholder="Specify the property type"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#225AE3] focus:border-transparent"
                    />
                  </div>
                )}

                {/* Bedrooms */}
                <div>
                  <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms *
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

                {/* Bathrooms */}
                <div>
                  <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms *
                  </label>
                  <input
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    min="0"
                    max="10"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#225AE3] focus:border-transparent"
                  />
                </div>

                {/* Parking Spaces */}
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
                      <span className="ml-2 text-gray-700">Swimming Pool</span>
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
                    <div className="animate-pulse">
                      <div className="h-12 bg-gray-200 rounded-lg"></div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <select
                        id="agent"
                        name="agent"
                        value={formData.agent}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#225AE3] focus:border-transparent"
                      >
                        <option value="">Select an agent</option>
                        {agents.map((agent) => (
                          <option key={agent.id} value={agent.id}>
                            {agent.first_name} {agent.last_name} ({agent.email})
                            {getCurrentUserEmail() === agent.email ? ' (You)' : ''}
                          </option>
                        ))}
                      </select>
                      
                      {/* Show info about auto-assignment */}
                      {formData.agent && agents.find(a => a.id === formData.agent)?.email === getCurrentUserEmail() && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-blue-800">
                                This property will be assigned to you as the primary agent.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Listing Price */}
                <div>
                  <label htmlFor="listing_price" className="block text-sm font-medium text-gray-700 mb-2">
                    Listing Price (ZAR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R</span>
                    <input
                      type="text"
                      id="listing_price"
                      name="listing_price"
                      value={formData.listing_price}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                        setFormData(prev => ({ ...prev, listing_price: formatted }));
                      }}
                      required
                      placeholder="1 500 000"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#225AE3] focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Enter the price without currency symbol</p>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Listing Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Title:</span> {formData.title || 'Not specified'}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Location:</span> {formData.suburb}, {provinceOptions.find(p => p.value === formData.province)?.label}
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
                  <div>
                    <span className="font-medium text-gray-700">Price:</span> R {formData.listing_price || 'Not specified'}
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

        {/* 🔥 FIXED FOOTER - ALWAYS VISIBLE */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            {/* Progress Indicators */}
            <div className="flex space-x-3">
              <div className={`w-3 h-3 rounded-full transition-colors ${currentStep >= 1 ? 'bg-[#225AE3]' : 'bg-gray-300'}`} />
              <div className={`w-3 h-3 rounded-full transition-colors ${currentStep >= 2 ? 'bg-[#225AE3]' : 'bg-gray-300'}`} />
              <div className={`w-3 h-3 rounded-full transition-colors ${currentStep >= 3 ? 'bg-[#225AE3]' : 'bg-gray-300'}`} />
            </div>

            {/* Navigation Buttons */}
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
                      ? 'bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!validateStep() || isSubmitting}
                  className={`inline-flex items-center px-8 py-3 font-bold rounded-lg transition-all ${
                    validateStep() && !isSubmitting
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
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

export default PropertyListingWizard; 