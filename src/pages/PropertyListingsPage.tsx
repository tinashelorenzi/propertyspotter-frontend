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
  const provinces = Array.from(new Set(properties.map(p => p.province))).sort();
  const suburbs = Array.from(new Set(properties.map(p => p.suburb))).sort();
  const propertyTypes = Array.from(new Set(properties.map(p => p.display_property_type))).sort();

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
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.suburb.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.agent_name.toLowerCase().includes(searchTerm.toLowerCase())
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
      month: 'short',
      day: 'numeric'
    });
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">{error}</div>
            <button
              onClick={fetchProperties}
              className="bg-[#225AE3] text-white px-6 py-2 rounded-lg hover:bg-[#1a4bc7] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Property Listings</h1>
          <p className="text-gray-600">Discover your perfect property in South Africa</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder="Search properties, suburbs, or agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#225AE3] focus:border-transparent"
              />
            </div>

            {/* Province Filter */}
            <div>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#225AE3] focus:border-transparent"
              >
                <option value="">All Provinces</option>
                {provinces.map(province => (
                  <option key={province} value={province}>
                    {province.charAt(0).toUpperCase() + province.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Suburb Filter */}
            <div>
              <select
                value={selectedSuburb}
                onChange={(e) => setSelectedSuburb(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#225AE3] focus:border-transparent"
              >
                <option value="">All Suburbs</option>
                {suburbs.map(suburb => (
                  <option key={suburb} value={suburb}>{suburb}</option>
                ))}
              </select>
            </div>

            {/* Property Type Filter */}
            <div>
              <select
                value={selectedPropertyType}
                onChange={(e) => setSelectedPropertyType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#225AE3] focus:border-transparent"
              >
                <option value="">All Types</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedProvince || selectedSuburb || selectedPropertyType) && (
            <div className="mt-4">
              <button
                onClick={clearFilters}
                className="text-[#225AE3] hover:text-[#1a4bc7] font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProperties.length} of {properties.length} properties
          </p>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-xl mb-4">No properties found</div>
            <p className="text-gray-400">Try adjusting your search criteria or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property) => (
              <Link
                key={property.id}
                to={`/property/${property.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
              >
                <div className="relative">
                  <img
                    src={property.primary_image_url}
                    alt={property.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x300?text=Property+Image';
                    }}
                  />
                  {property.is_featured && (
                    <div className="absolute top-2 left-2 bg-[#F59E0B] text-white px-2 py-1 rounded text-xs font-medium">
                      Featured
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                    {property.view_count} views
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#225AE3] transition-colors">
                    {property.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3">
                    {property.suburb}, {property.province.charAt(0).toUpperCase() + property.province.slice(1)}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{property.bedrooms} beds</span>
                      <span>{property.bathrooms} baths</span>
                      <span>{property.parking_spaces} parking</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {property.display_property_type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-[#225AE3]">
                      {formatPrice(property.listing_price)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(property.published_at)}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">Agent: {property.agent_name}</p>
                  </div>

                  {/* Property features */}
                  <div className="mt-3 flex items-center space-x-2">
                    {property.is_pet_friendly && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Pet Friendly</span>
                    )}
                    {property.has_pool && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Pool</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyListingsPage; 