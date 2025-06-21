import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface Property {
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
  is_pet_friendly: boolean;
  has_pool: boolean;
  is_featured: boolean;
  primary_image_url: string;
  agent_name: string;
  published_at: string;
  view_count: number;
}

interface PropertyListingsResponse {
  status: string;
  results: Property[];
  message: string;
}

const PropertyListingsPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedSuburb, setSelectedSuburb] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('');

  // Get unique values for filters
  const provinces = Array.from(new Set(properties.map(p => p.province).filter(Boolean))).sort();
  const suburbs = Array.from(new Set(properties.map(p => p.suburb).filter(Boolean))).sort();
  const propertyTypes = Array.from(new Set(properties.map(p => p.display_property_type).filter(Boolean))).sort();

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, selectedProvince, selectedSuburb, selectedPropertyType]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}api/listings/properties/`);
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      const data: PropertyListingsResponse = await response.json();
      setProperties(data.results);
      setError(null);
    } catch (err) {
      setError('Failed to load properties. Please try again later.');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = properties;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(property =>
        (property.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (property.suburb || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (property.agent_name || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Province filter
    if (selectedProvince) {
      filtered = filtered.filter(property => property.province === selectedProvince);
    }

    // Suburb filter
    if (selectedSuburb) {
      filtered = filtered.filter(property => property.suburb === selectedSuburb);
    }

    // Property type filter
    if (selectedPropertyType) {
      filtered = filtered.filter(property => property.display_property_type === selectedPropertyType);
    }

    setFilteredProperties(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedProvince('');
    setSelectedSuburb('');
    setSelectedPropertyType('');
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
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
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
            <p className="mt-6 text-gray-600 font-medium">Discovering amazing properties...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
                <p className="text-gray-600 mb-8">{error}</p>
                <button
                  onClick={fetchProperties}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white font-bold rounded-2xl shadow-lg transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      
      {/* Hero Header */}
      <section className="relative pt-32 pb-16">
        {/* Floating Elements */}
        <div className="absolute top-40 left-10 w-20 h-20 bg-gradient-to-r from-[#225AE3]/30 to-[#F59E0B]/30 rounded-full blur-xl animate-bounce-slow"></div>
        <div className="absolute top-60 right-20 w-16 h-16 bg-gradient-to-r from-[#F59E0B]/40 to-[#225AE3]/40 rounded-full blur-lg animate-pulse-slow"></div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-[#225AE3]/20 shadow-lg mb-8 animate-fade-in-up">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
            <span className="text-sm font-medium text-gray-700">
              {filteredProperties.length} properties available
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 animate-fade-in-up delay-100">
            <span className="block bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">
              Discover
            </span>
            <span className="block text-gray-900">
              Your Dream Property
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Explore our curated collection of exceptional properties across South Africa. 
            From cozy family homes to luxury estates, find your perfect match.
          </p>
        </div>
      </section>

      {/* Advanced Filters */}
      <section className="relative pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#225AE3]/10 to-[#F59E0B]/10 rounded-3xl blur opacity-50"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              
              {/* Search Bar */}
              <div className="mb-8">
                <div className="relative max-w-2xl mx-auto">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search properties, suburbs, or agents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300 text-lg shadow-lg"
                  />
                </div>
              </div>

              {/* Filter Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* Province Filter */}
                <div className="relative">
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="w-full px-6 py-4 bg-white rounded-2xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300 shadow-lg appearance-none cursor-pointer font-medium"
                  >
                    <option value="">All Provinces</option>
                    {provinces.map(province => (
                      <option key={province} value={province}>
                        {province.charAt(0).toUpperCase() + province.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Suburb Filter */}
                <div className="relative">
                  <select
                    value={selectedSuburb}
                    onChange={(e) => setSelectedSuburb(e.target.value)}
                    className="w-full px-6 py-4 bg-white rounded-2xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300 shadow-lg appearance-none cursor-pointer font-medium"
                  >
                    <option value="">All Suburbs</option>
                    {suburbs.map(suburb => (
                      <option key={suburb} value={suburb}>{suburb}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Property Type Filter */}
                <div className="relative">
                  <select
                    value={selectedPropertyType}
                    onChange={(e) => setSelectedPropertyType(e.target.value)}
                    className="w-full px-6 py-4 bg-white rounded-2xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300 shadow-lg appearance-none cursor-pointer font-medium"
                  >
                    <option value="">All Types</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {(searchTerm || selectedProvince || selectedSuburb || selectedPropertyType) && (
                <div className="text-center">
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-6 py-3 text-[#225AE3] hover:text-[#F59E0B] font-semibold transition-all duration-300 hover:scale-105"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4">
          {/* Results Counter */}
          <div className="mb-8 text-center">
            <p className="text-lg text-gray-600">
              Showing <span className="font-bold text-[#225AE3]">{filteredProperties.length}</span> of <span className="font-bold text-gray-900">{properties.length}</span> properties
            </p>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="text-center py-20">
              <div className="relative max-w-md mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#225AE3]/20 to-[#F59E0B]/20 rounded-3xl blur opacity-75"></div>
                <div className="relative bg-white rounded-3xl p-12 shadow-xl">
                  <div className="text-6xl mb-6">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No properties found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search criteria or explore different filters</p>
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProperties.map((property, index) => (
                <Link
                  key={property.id}
                  to={`/property/${property.id}`}
                  className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden rounded-t-3xl">
                    <img
                      src={property.primary_image_url}
                      alt={property.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/400x300/225AE3/FFFFFF?text=Property+Image';
                      }}
                    />
                    
                    {/* Overlay Elements */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Featured Badge */}
                    {property.is_featured && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-[#F59E0B] to-[#F59E0B]/80 text-white text-sm font-bold rounded-full shadow-lg animate-pulse">
                        ⭐ Featured
                      </div>
                    )}
                    
                    {/* View Count */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-sm rounded-full">
                      {property.view_count || 0} views
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Title */}
                    <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-[#225AE3] transition-colors duration-300">
                      {property.title || 'Property Listing'}
                    </h3>
                    
                    {/* Location */}
                    <div className="flex items-center text-gray-600 mb-4">
                      <svg className="w-4 h-4 mr-2 text-[#225AE3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm font-medium">
                        {property.suburb || 'Unknown'}, {property.province ? property.province.charAt(0).toUpperCase() + property.province.slice(1) : 'Unknown'}
                      </span>
                    </div>

                    {/* Property Details */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-[#225AE3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4" />
                          </svg>
                          <span className="font-medium">{property.bedrooms || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-[#225AE3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                          </svg>
                          <span className="font-medium">{property.bathrooms || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-[#225AE3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="font-medium">{property.parking_spaces || 0}</span>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-[#F59E0B] bg-[#F59E0B]/10 px-3 py-1 rounded-full">
                        {property.display_property_type || 'Property'}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-black bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">
                        {formatPrice(property.listing_price)}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        {formatDate(property.published_at)}
                      </div>
                    </div>

                    {/* Agent */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                          {property.agent_name ? property.agent_name.charAt(0) : 'A'}
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                          Agent: {property.agent_name || 'Unknown'}
                        </span>
                      </div>
                    </div>

                    {/* Property Features */}
                    {(property.is_pet_friendly || property.has_pool) && (
                      <div className="mt-4 flex items-center space-x-2">
                        {property.is_pet_friendly && (
                          <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                            🐕 Pet Friendly
                          </span>
                        )}
                        {property.has_pool && (
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                            🏊 Pool
                          </span>
                        )}
                      </div>
                    )}

                    {/* Hover Effect Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#225AE3]/5 to-[#F59E0B]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </div>
                </Link>
              ))}
            </div>
          )}
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
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
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
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
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
      `}</style>
    </div>
  );
};

export default PropertyListingsPage;