// Create this new file: src/hooks/usePropertyWizard.ts

import { useState, useCallback } from 'react';
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

export const usePropertyWizard = () => {
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

  const createDraft = useCallback(async () => {
    try {
      const newDraft = await propertyService.createDraft();
      setDraft(newDraft);
      return newDraft;
    } catch (error) {
      console.error('Error creating draft:', error);
      throw error;
    }
  }, []);

  const fetchAgents = useCallback(async () => {
    try {
      setIsLoadingAgents(true);
      const agentsData = await propertyService.getAgents();
      setAgents(agentsData);
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw error;
    } finally {
      setIsLoadingAgents(false);
    }
  }, []);

  const uploadImage = useCallback(async (file: File) => {
    if (!draft) throw new Error('No draft available');

    try {
      setIsUploading(true);
      
      // Check image limit
      if (uploadedImages.length >= 200) {
        throw new Error('Maximum of 200 images allowed per property');
      }

      const isPrimary = uploadedImages.length === 0;
      const imageData = await propertyService.uploadImageToDraft(draft.id, file, isPrimary);
      
      const newImage: UploadedImage = {
        image_id: imageData.image_id,
        image_url: imageData.image_url,
        filename: imageData.filename,
        size: imageData.size,
        is_primary: imageData.is_primary,
        order: imageData.order
      };
      
      setUploadedImages(prev => [...prev, newImage]);
      return newImage;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [draft, uploadedImages.length]);

  const deleteImage = useCallback(async (imageId: string) => {
    try {
      await propertyService.deleteImage(imageId);
      setUploadedImages(prev => prev.filter(img => img.image_id !== imageId));
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }, []);

  const setPrimaryImage = useCallback(async (imageId: string) => {
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
      throw error;
    }
  }, [draft]);

  const updateFormData = useCallback((updates: Partial<PropertyFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const validateStep = useCallback(() => {
    switch (currentStep) {
      case 1:
        return uploadedImages.length > 0;
      case 2:
        return !!(formData.title && formData.description && formData.suburb && formData.street_address);
      case 3:
        return !!(formData.agent && formData.listing_price);
      default:
        return true;
    }
  }, [currentStep, uploadedImages.length, formData]);

  const nextStep = useCallback(() => {
    if (currentStep < 3 && validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const createPropertyListing = useCallback(async () => {
    if (!draft || !validateStep()) return;

    try {
      setIsSubmitting(true);
      
      const propertyData = {
        ...formData,
        listing_price: parseFloat(formData.listing_price).toString()
      };

      await propertyService.createProperty(propertyData, draft.id);
      return true;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [draft, formData, validateStep]);

  const resetWizard = useCallback(() => {
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
  }, []);

  return {
    // State
    currentStep,
    draft,
    uploadedImages,
    agents,
    formData,
    isUploading,
    isLoadingAgents,
    isSubmitting,

    // Actions
    createDraft,
    fetchAgents,
    uploadImage,
    deleteImage,
    setPrimaryImage,
    updateFormData,
    nextStep,
    prevStep,
    createPropertyListing,
    resetWizard,
    validateStep,
    
    // Setters (for direct access when needed)
    setCurrentStep,
    setUploadedImages,
  };
};

export type { PropertyFormData, UploadedImage };