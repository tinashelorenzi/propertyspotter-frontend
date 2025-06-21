import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface PropertyImage {
  id: number;
  image: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  order: number;
}

interface PropertyDetail {
  id: string;
  title: string;
  description: string;
  suburb: string;
  province: string;
  street_address: string;
  property_type: string;
  custom_property_type: string;
  display_property_type: string;
  bedrooms: number;
  bathrooms: number;
  parking_spaces: number;
  listing_price: string;
  is_pet_friendly: boolean;
  has_pool: boolean;
  is_active: boolean;
  is_featured: boolean;
  images: PropertyImage[];
  agent_name: string;
  agent_email: string;
  agent_phone: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  view_count: number;
}

interface PropertyDetailResponse {
  status: string;
  data: PropertyDetail;
  message: string;
}

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchPropertyDetails(id);
    }
  }, [id]);

  const fetchPropertyDetails = async (propertyId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}api/listings/properties/${propertyId}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch property details');
      }
      const data: PropertyDetailResponse = await response.json();
      setProperty(data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load property details. Please try again later.');
      console.error('Error fetching property details:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleContactEmail = () => {
    const subject = `Inquiry about ${property?.title}`;
    const body = `Hi PropertySpotter,\n\nI'm interested in the property: ${property?.title}\n\nPlease provide me with more information.\n\nBest regards,\n[Your Name]`;
    window.open(`mailto:info@propertyspotter.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleWhatsApp = () => {
    const message = `Hi PropertySpotter, I'm interested in the property: ${property?.title}. Please provide me with more information.`;
    window.open(`https://wa.me/27798557301?text=${encodeURIComponent(message)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#225AE3]"></div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">{error || 'Property not found'}</div>
            <Link
              to="/properties"
              className="bg-[#225AE3] text-white px-6 py-2 rounded-lg hover:bg-[#1a4bc7] transition-colors"
            >
              Back to Properties
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const primaryImage = property.images.find(img => img.is_primary) || property.images[0];
  const displayImages = property.images.length > 0 ? property.images : [
    {
      id: 0,
      image: '',
      image_url: 'https://via.placeholder.com/800x600?text=Property+Image',
      alt_text: 'Property Image',
      is_primary: true,
      order: 0
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="text-gray-700 hover:text-[#225AE3]">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <Link to="/properties" className="text-gray-700 hover:text-[#225AE3]">
                    Properties
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-500">{property.title || 'Property Details'}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="relative">
                <img
                  src={displayImages[selectedImageIndex]?.image_url || primaryImage?.image_url}
                  alt={displayImages[selectedImageIndex]?.alt_text || property.title || 'Property Image'}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/800x600?text=Property+Image';
                  }}
                />
                {property.is_featured && (
                  <div className="absolute top-4 left-4 bg-[#F59E0B] text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {property.view_count} views
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              {displayImages.length > 1 && (
                <div className="p-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {displayImages.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          index === selectedImageIndex ? 'border-[#225AE3]' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image.image_url}
                          alt={image.alt_text}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/80x80?text=Image';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.title || 'Property Details'}</h1>
              
              <div className="flex items-center justify-between mb-6">
                <div className="text-2xl font-bold text-[#225AE3]">
                  {formatPrice(property.listing_price)}
                </div>
                <div className="text-gray-500">
                  Listed on {formatDate(property.published_at)}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#225AE3]">{property.bedrooms}</div>
                  <div className="text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#225AE3]">{property.bathrooms}</div>
                  <div className="text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#225AE3]">{property.parking_spaces}</div>
                  <div className="text-gray-600">Parking</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-[#225AE3]">{property.display_property_type}</div>
                  <div className="text-gray-600">Type</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{property.description || 'No description available for this property.'}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Location</h3>
                <p className="text-gray-700">
                  {property.suburb || 'Location not specified'}, {property.province ? property.province.charAt(0).toUpperCase() + property.province.slice(1) : 'Province not specified'}
                </p>
              </div>

              {/* Property Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {property.is_pet_friendly && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      Pet Friendly
                    </span>
                  )}
                  {property.has_pool && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      Swimming Pool
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Interested in this property?</h3>
              
              <div className="space-y-4">
                <button
                  onClick={handleContactEmail}
                  className="w-full bg-[#225AE3] text-white py-3 px-4 rounded-lg hover:bg-[#1a4bc7] transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Send Email</span>
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  <span>WhatsApp</span>
                </button>

                <div className="text-center text-gray-600 text-sm">
                  <p>Or call us directly:</p>
                  <p className="font-semibold">+27 79 855 7301</p>
                </div>
              </div>
            </div>

            {/* Agent Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Agent</h3>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-[#225AE3] rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-semibold text-lg">
                    {property.agent_name ? property.agent_name.split(' ').map(n => n[0]).join('') : 'PS'}
                  </span>
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-1">{property.agent_name || 'PropertySpotter Agent'}</h4>
                <p className="text-gray-600 text-sm mb-3">PropertySpotter Agent</p>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p>{property.agent_email || 'info@propertyspotter.co.za'}</p>
                  <p>{property.agent_phone || '+27 79 855 7301'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage; 