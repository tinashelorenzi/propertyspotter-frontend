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
    if (!price) return 'Price on request';
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return 'Price on request';
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
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
      <div className="min-h-screen bg-white overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E9EEFB]/40 via-white to-[#F59E0B]/10"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#225AE3]/20 to-transparent rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-bl from-[#F59E0B]/20 to-transparent rounded-full blur-3xl animate-float-slower"></div>
        </div>

        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh] pt-24">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#225AE3]/20 border-t-[#225AE3] mx-auto"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#F59E0B]/20 border-t-[#F59E0B] animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-white overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E9EEFB]/40 via-white to-[#F59E0B]/10"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#225AE3]/20 to-transparent rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-bl from-[#F59E0B]/20 to-transparent rounded-full blur-3xl animate-float-slower"></div>
        </div>

        <Navbar />
        <div className="pt-32 pb-20">
          <div className="max-w-2xl mx-auto text-center px-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl blur opacity-25"></div>
              <div className="relative bg-white rounded-3xl p-12 shadow-xl">
                <div className="text-6xl mb-6">🏠</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Property Not Found</h2>
                <p className="text-gray-600 mb-8">{error || 'The property you\'re looking for doesn\'t exist or has been removed.'}</p>
                <Link
                  to="/properties"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white font-bold rounded-2xl shadow-lg transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Properties
                </Link>
              </div>
            </div>
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
      image_url: 'https://via.placeholder.com/800x600/225AE3/FFFFFF?text=Property+Image',
      alt_text: 'Property Image',
      is_primary: true,
      order: 0
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E9EEFB]/40 via-white to-[#F59E0B]/10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#225AE3]/20 to-transparent rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-bl from-[#F59E0B]/20 to-transparent rounded-full blur-3xl animate-float-slower"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-gradient-to-tr from-[#225AE3]/15 to-transparent rounded-full blur-3xl animate-float-reverse"></div>
      </div>

      <Navbar />
      
      {/* Breadcrumb */}
      <section className="relative pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm mb-6">
            <Link to="/" className="text-gray-500 hover:text-[#225AE3] transition-colors duration-200">
              Home
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link to="/properties" className="text-gray-500 hover:text-[#225AE3] transition-colors duration-200">
              Properties
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">{property.title || 'Property Details'}</span>
          </nav>

          {/* Property Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 animate-fade-in-up">
                  {property.title || 'Property Listing'}
                </h1>
                <div className="flex items-center text-gray-600 mb-4 animate-fade-in-up delay-100">
                  <svg className="w-5 h-5 mr-2 text-[#225AE3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-lg">
                    {property.street_address ? `${property.street_address}, ` : ''}{property.suburb || 'Unknown'}, {property.province ? property.province.charAt(0).toUpperCase() + property.province.slice(1) : 'Unknown'}
                  </span>
                </div>
              </div>
              
              <div className="text-right animate-fade-in-up delay-200">
                <div className="text-4xl font-black bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent mb-2">
                  {formatPrice(property.listing_price)}
                </div>
                <div className="flex items-center justify-end space-x-4 text-sm text-gray-600">
                  <span>{property.view_count || 0} views</span>
                  <span>•</span>
                  <span>Listed {formatDate(property.published_at)}</span>
                </div>
              </div>
            </div>

            {/* Features Badges */}
            <div className="flex flex-wrap items-center gap-3 animate-fade-in-up delay-300">
              {property.is_featured && (
                <span className="bg-gradient-to-r from-[#F59E0B] to-[#F59E0B]/80 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  ⭐ Featured Property
                </span>
              )}
              <span className="bg-[#225AE3]/10 text-[#225AE3] px-4 py-2 rounded-full text-sm font-semibold">
                {property.display_property_type || 'Property'}
              </span>
              {property.is_pet_friendly && (
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                  🐕 Pet Friendly
                </span>
              )}
              {property.has_pool && (
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                  🏊 Pool
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="relative animate-fade-in-up delay-400">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#225AE3]/10 to-[#F59E0B]/10 rounded-3xl blur opacity-50"></div>
                <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden">
                  {/* Main Image */}
                  <div className="relative h-96 md:h-[500px] overflow-hidden rounded-t-3xl">
                    <img
                      src={displayImages[selectedImageIndex]?.image_url || primaryImage?.image_url}
                      alt={displayImages[selectedImageIndex]?.alt_text || property.title || 'Property Image'}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/800x600/225AE3/FFFFFF?text=Property+Image';
                      }}
                    />
                    
                    {/* Navigation Arrows */}
                    {displayImages.length > 1 && (
                      <>
                        <button
                          onClick={() => setSelectedImageIndex(prev => prev === 0 ? displayImages.length - 1 : prev - 1)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-300 group"
                        >
                          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setSelectedImageIndex(prev => prev === displayImages.length - 1 ? 0 : prev + 1)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-300 group"
                        >
                          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    {displayImages.length > 1 && (
                      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                        {selectedImageIndex + 1} / {displayImages.length}
                      </div>
                    )}
                  </div>
                  
                  {/* Thumbnail Gallery */}
                  {displayImages.length > 1 && (
                    <div className="p-6">
                      <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
                        {displayImages.map((image, index) => (
                          <button
                            key={image.id}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`flex-shrink-0 relative w-20 h-20 rounded-xl overflow-hidden border-3 transition-all duration-300 ${
                              index === selectedImageIndex 
                                ? 'border-[#225AE3] ring-2 ring-[#225AE3]/30 scale-110' 
                                : 'border-gray-200 hover:border-[#F59E0B] hover:scale-105'
                            }`}
                          >
                            <img
                              src={image.image_url}
                              alt={image.alt_text}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/80x80/225AE3/FFFFFF?text=Image';
                              }}
                            />
                            {index === selectedImageIndex && (
                              <div className="absolute inset-0 bg-[#225AE3]/20 flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Property Details */}
              <div className="relative animate-fade-in-up delay-500">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#225AE3]/10 to-[#F59E0B]/10 rounded-3xl blur opacity-50"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-xl">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Property Details</h2>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="text-center p-4 bg-gradient-to-br from-[#225AE3]/5 to-[#225AE3]/10 rounded-2xl">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-xl flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4" />
                        </svg>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{property.bedrooms || 0}</div>
                      <div className="text-sm text-gray-600 font-medium">Bedrooms</div>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-[#F59E0B]/5 to-[#F59E0B]/10 rounded-2xl">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#F59E0B] to-[#225AE3] rounded-xl flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{property.bathrooms || 0}</div>
                      <div className="text-sm text-gray-600 font-medium">Bathrooms</div>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-[#225AE3]/5 to-[#225AE3]/10 rounded-2xl">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-xl flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{property.parking_spaces || 0}</div>
                      <div className="text-sm text-gray-600 font-medium">Parking</div>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-[#F59E0B]/5 to-[#F59E0B]/10 rounded-2xl">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#F59E0B] to-[#225AE3] rounded-xl flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{property.view_count || 0}</div>
                      <div className="text-sm text-gray-600 font-medium">Views</div>
                    </div>
                  </div>

                  {/* Description */}
                  {property.description && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
                      <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {property.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Contact & Agent */}
            <div className="space-y-8">
              {/* Contact Card */}
              <div className="relative animate-fade-in-up delay-600">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#225AE3]/10 to-[#F59E0B]/10 rounded-3xl blur opacity-50"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Interested in this property?</h3>
                  
                  <div className="space-y-4">
                    <button
                      onClick={handleContactEmail}
                      className="w-full bg-gradient-to-r from-[#225AE3] to-[#225AE3]/90 text-white py-4 px-6 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-3"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>Send Email Inquiry</span>
                    </button>

                    <button
                      onClick={handleWhatsApp}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-3"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      <span>WhatsApp Chat</span>
                    </button>

                    <div className="text-center py-4 px-6 bg-gradient-to-r from-[#F59E0B]/10 to-[#225AE3]/10 rounded-2xl">
                      <p className="text-gray-700 font-medium mb-2">Or call us directly:</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">
                        +27 79 855 7301
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agent Information */}
              <div className="relative animate-fade-in-up delay-700">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#225AE3]/10 to-[#F59E0B]/10 rounded-3xl blur opacity-50"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Property Agent</h3>
                  
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <span className="text-white font-bold text-2xl">
                        {property.agent_name 
                          ? property.agent_name.split(' ').map(n => n[0]).join('').slice(0, 2) 
                          : 'PS'
                        }
                      </span>
                    </div>
                    
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {property.agent_name || 'PropertySpotter Agent'}
                    </h4>
                    <p className="text-[#225AE3] font-semibold mb-6">PropertySpotter Agent</p>
                    
                    <div className="space-y-3 text-gray-600">
                      <div className="flex items-center justify-center space-x-3">
                        <svg className="w-5 h-5 text-[#225AE3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">{property.agent_email || 'info@propertyspotter.co.za'}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-3">
                        <svg className="w-5 h-5 text-[#225AE3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="font-medium">{property.agent_phone || '+27 79 855 7301'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Info Summary */}
              <div className="relative animate-fade-in-up delay-800">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#225AE3]/10 to-[#F59E0B]/10 rounded-3xl blur opacity-50"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Property Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Property Type</span>
                      <span className="text-gray-900 font-semibold">{property.display_property_type || 'Property'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Province</span>
                      <span className="text-gray-900 font-semibold">
                        {property.province ? property.province.charAt(0).toUpperCase() + property.province.slice(1) : 'Unknown'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Suburb</span>
                      <span className="text-gray-900 font-semibold">{property.suburb || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Status</span>
                      <span className="text-green-600 font-semibold">
                        {property.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">Listed Date</span>
                      <span className="text-gray-900 font-semibold">{formatDate(property.published_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Animations Styles */}
      <style>{`
        @keyframes gradient-move {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(30px) rotate(-180deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(90deg); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0px); }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 10s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float-reverse 8s ease-in-out infinite;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-600 {
          animation-delay: 0.6s;
        }
        .delay-700 {
          animation-delay: 0.7s;
        }
        .delay-800 {
          animation-delay: 0.8s;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default PropertyDetailPage;