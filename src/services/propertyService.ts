// Create this new file: src/services/propertyService.ts

const API_BASE = import.meta.env.VITE_BACKEND_API;

interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
  results?: T[];
}

interface PropertyDraft {
  id: string;
  session_id: string;
  created_by: string;
  created_at: string;
  images: any[];
  image_count: number;
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

class PropertyService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  private getAuthHeadersForUpload() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
    };
  }

  // ============ DRAFT MANAGEMENT ============
  
  async createDraft(sessionId?: string): Promise<PropertyDraft> {
    const response = await fetch(`${API_BASE}api/listings/agency-admin/drafts/create/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        session_id: sessionId || `wizard_${Date.now()}`
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create draft');
    }

    const data: ApiResponse<PropertyDraft> = await response.json();
    return data.data!;
  }

  async getDrafts(): Promise<PropertyDraft[]> {
    const response = await fetch(`${API_BASE}api/listings/agency-admin/drafts/`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch drafts');
    }

    const data: ApiResponse<PropertyDraft> = await response.json();
    return data.results || [];
  }

  async deleteDraft(draftId: string): Promise<void> {
    const response = await fetch(`${API_BASE}api/listings/agency-admin/drafts/${draftId}/`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete draft');
    }
  }

  // ============ IMAGE MANAGEMENT ============

  async uploadImageToDraft(draftId: string, file: File, isPrimary: boolean = false): Promise<any> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('alt_text', file.name);
    formData.append('is_primary', isPrimary.toString());

    const response = await fetch(`${API_BASE}api/listings/agency-admin/drafts/${draftId}/images/upload/`, {
      method: 'POST',
      headers: this.getAuthHeadersForUpload(),
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload image');
    }

    const data = await response.json();
    return data.data;
  }

  async deleteImage(imageId: string): Promise<void> {
    const response = await fetch(`${API_BASE}api/listings/agency-admin/drafts/images/delete/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ image_id: imageId }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
  }

  async setPrimaryImage(draftId: string, imageId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE}api/listings/agency-admin/drafts/${draftId}/images/${imageId}/set-primary/`,
      {
        method: 'POST',
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to set primary image');
    }
  }

  async reorderDraftImages(draftId: string, imageOrder: string[]): Promise<void> {
    const response = await fetch(`${API_BASE}api/listings/agency-admin/drafts/${draftId}/images/reorder/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ image_order: imageOrder }),
    });

    if (!response.ok) {
      throw new Error('Failed to reorder images');
    }
  }

  // ============ PROPERTY LISTING MANAGEMENT ============

  async getProperties(): Promise<PropertyListing[]> {
    const response = await fetch(`${API_BASE}api/listings/agency-admin/properties/`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }

    const data: ApiResponse<PropertyListing> = await response.json();
    return data.results || [];
  }

  async getProperty(propertyId: string): Promise<PropertyListing> {
    const response = await fetch(`${API_BASE}api/listings/agency-admin/properties/${propertyId}/`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch property');
    }

    const data: ApiResponse<PropertyListing> = await response.json();
    return data.data!;
  }

  async createProperty(propertyData: any, draftId?: string): Promise<PropertyListing> {
    const response = await fetch(`${API_BASE}api/listings/agency-admin/properties/create/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        ...propertyData,
        draft_id: draftId
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create property');
    }

    const data: ApiResponse<PropertyListing> = await response.json();
    return data.data!;
  }

  async updateProperty(propertyId: string, propertyData: any): Promise<PropertyListing> {
    const response = await fetch(`${API_BASE}api/listings/agency-admin/properties/${propertyId}/update/`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(propertyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update property');
    }

    const data = await response.json();
    return data.data;
  }

  async deleteProperty(propertyId: string): Promise<void> {
    const response = await fetch(`${API_BASE}api/listings/agency-admin/properties/${propertyId}/delete/`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete property');
    }
  }

  async submitPropertyForApproval(propertyId: string): Promise<void> {
    const response = await fetch(`${API_BASE}api/listings/agency-admin/properties/${propertyId}/submit/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit property for approval');
    }
  }

  // ============ UTILITY ============

  async getAgents(): Promise<Agent[]> {
    try {
      console.log('🔍 Fetching agents using localStorage agency...');
      
      const token = localStorage.getItem('token');
      const agencyData = localStorage.getItem('agency');
      
      if (!agencyData) {
        throw new Error('No agency data found in localStorage');
      }
      
      const agency = JSON.parse(agencyData);
      console.log('🏢 Agency from localStorage:', agency);
      
      if (!agency.id) {
        throw new Error('Agency ID not found');
      }
  
      const backendUrl = import.meta.env.VITE_BACKEND_API;
      
      // Use the same approach as AgencyDashboard
      const response = await fetch(`${backendUrl}api/users/agencies/${agency.id}/agents/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch agents: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('✅ Agents response:', data);
      
      return data.results || [];
    } catch (error) {
      console.error('❌ Error fetching agents:', error);
      throw error;
    }
  }
}

export const propertyService = new PropertyService();
export type { PropertyDraft, PropertyListing, Agent };