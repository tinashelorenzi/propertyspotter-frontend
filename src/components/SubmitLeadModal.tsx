import { useState } from 'react';
import Toast from './Toast';
import { 
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  DocumentTextIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface ImageFile {
  file: File;
  description: string;
}

interface SubmitLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

const SubmitLeadModal = ({ isOpen, onClose, onSubmitSuccess }: SubmitLeadModalProps) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    street_address: '',
    suburb: '',
    notes_text: '',
    preferred_agent: '',
  });
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => ({
        file,
        description: '',
      }));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const handleImageDescriptionChange = (index: number, description: string) => {
    setImages(prev => prev.map((img, i) => 
      i === index ? { ...img, description } : img
    ));
  };

  const handleImageRemove = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitFormData = new FormData();
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        submitFormData.append(key, value);
      });

      // Add images
      images.forEach((imageFile, index) => {
        submitFormData.append(`images`, imageFile.file);
        submitFormData.append(`image_descriptions`, imageFile.description);
      });

      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}api/leads/submit/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitFormData,
      });

      if (response.ok) {
        // Reset form
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          street_address: '',
          suburb: '',
          notes_text: '',
          preferred_agent: '',
        });
        setImages([]);
        setCurrentStep(1);
        onSubmitSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        setToast({
          message: errorData.message || 'Failed to submit lead. Please try again.',
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
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.first_name && formData.last_name && formData.phone;
      case 2:
        return formData.street_address && formData.suburb;
      case 3:
        return true; // Optional step
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-8 shadow-2xl min-h-fit">
        {/* Header */}
        <div className="relative p-8 pb-6">
          <div className="absolute -inset-2 bg-gradient-to-r from-[#225AE3]/10 to-[#F59E0B]/10 rounded-3xl blur opacity-50"></div>
          <div className="relative flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">
                Submit New <span className="bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">Lead</span>
              </h2>
              <p className="text-gray-600">Help someone find their perfect property and earn money!</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Step Indicator */}
        <div className="mt-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  step <= currentStep
                    ? 'bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white shadow-lg'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step < currentStep ? (
                    <CheckCircleIcon className="h-6 w-6" />
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-1 mx-2 rounded-full transition-colors duration-300 ${
                    step < currentStep ? 'bg-gradient-to-r from-[#225AE3] to-[#F59E0B]' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              {currentStep === 1 && "Contact Information"}
              {currentStep === 2 && "Property Details"}
              {currentStep === 3 && "Additional Info"}
            </p>
          </div>
        </div>
      </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="px-8 pb-8">
          {/* Step 1: Contact Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h3>
                <p className="text-gray-600">Who should agents contact about this property?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-bold text-gray-700 mb-3">
                    First Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300 shadow-sm"
                      placeholder="Enter first name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-bold text-gray-700 mb-3">
                    Last Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300 shadow-sm"
                      placeholder="Enter last name"
                    />
                  </div>
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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300 shadow-sm"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-3">
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300 shadow-sm"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Property Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPinIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Property Location</h3>
                <p className="text-gray-600">Where is this property located?</p>
              </div>

              <div>
                <label htmlFor="street_address" className="block text-sm font-bold text-gray-700 mb-3">
                  Street Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="street_address"
                    name="street_address"
                    value={formData.street_address}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300 shadow-sm"
                    placeholder="Enter street address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="suburb" className="block text-sm font-bold text-gray-700 mb-3">
                  Suburb *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="suburb"
                    name="suburb"
                    value={formData.suburb}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300 shadow-sm"
                    placeholder="Enter suburb"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="preferred_agent" className="block text-sm font-bold text-gray-700 mb-3">
                  Preferred Agent (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="preferred_agent"
                    name="preferred_agent"
                    value={formData.preferred_agent}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300 shadow-sm"
                    placeholder="Any specific agent in mind?"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Additional Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <DocumentTextIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Additional Details</h3>
                <p className="text-gray-600">Add notes and photos to help agents</p>
              </div>

              <div>
                <label htmlFor="notes_text" className="block text-sm font-bold text-gray-700 mb-3">
                  Notes & Comments
                </label>
                <div className="relative">
                  <div className="absolute top-4 left-4 pointer-events-none">
                    <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="notes_text"
                    name="notes_text"
                    rows={4}
                    value={formData.notes_text}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300 shadow-sm resize-none"
                    placeholder="Any additional information about the property or client..."
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Property Images
                </label>
                <div className="space-y-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <PhotoIcon className="h-5 w-5 text-[#225AE3] mr-2" />
                          <span className="text-sm font-medium text-gray-700">
                            {image.file.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleImageRemove(index)}
                          className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Add a description for this image..."
                        value={image.description}
                        onChange={(e) => handleImageDescriptionChange(index, e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 focus:border-[#225AE3] focus:ring-2 focus:ring-[#225AE3]/20 transition-all duration-300"
                      />
                    </div>
                  ))}
                  
                  <label className="relative block w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#225AE3] transition-colors cursor-pointer">
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <span className="text-lg font-medium text-gray-700">Add Property Images</span>
                    <p className="text-sm text-gray-500 mt-1">Click to upload photos of the property</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageAdd}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="flex space-x-3">
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid()}
                className="px-8 py-3 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Lead'
                )}
              </button>
            )}
          </div>
        </div>
      </form>
      </div>

      {/* Toast Notifications */}
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

export default SubmitLeadModal;