import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

// Static Properties Data
const STATIC_PROPERTIES = [
  {
    id: 'prop1',
    title: 'Luxury 3BHK Apartment in South Delhi',
    listingType: 'BUY',
    propertyType: 'Flat/Apartment',
    category: '3BHK',
    price: 25000000,
    location: 'Greater Kailash, Delhi',
    bedrooms: 3,
    bathrooms: 3,
    area: 1850,
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    furnishedType: 'Fully Furnished',
    constructionStatus: 'Ready to move',
    amenities: ['Parking', 'Gym', 'Swimming Pool', 'Garden'],
  },
  {
    id: 'prop2',
    title: 'Modern 2BHK Fully Furnished Flat',
    listingType: 'RENT',
    propertyType: 'House/Flat',
    category: '2BHK',
    price: 35000,
    location: 'Gurgaon Sector 56',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    furnishedType: 'Fully Furnished',
    preferredTenant: 'Family',
    amenities: ['Power Backup', 'Gym', 'Parking'],
  },
  {
    id: 'prop3',
    title: 'Spacious 4BHK Villa with Garden',
    listingType: 'BUY',
    propertyType: 'Independent House/Villa',
    category: '4BHK',
    price: 45000000,
    location: 'DLF Phase 3, Gurgaon',
    bedrooms: 4,
    bathrooms: 4,
    area: 3200,
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'],
    furnishedType: 'Semi Furnished',
    constructionStatus: 'Ready to move',
    amenities: ['Garden', 'Parking', 'Club House', 'Security'],
  },
  {
    id: 'prop4',
    title: 'Premium PG for Girls in Noida',
    listingType: 'RENT',
    propertyType: 'PG',
    category: 'Single Room',
    price: 12000,
    location: 'Noida Sector 62',
    bedrooms: 1,
    bathrooms: 1,
    area: 150,
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'],
    preferredTenant: 'Girls',
    amenities: ['WiFi', 'Meals', 'Laundry', 'AC'],
  },
  {
    id: 'prop5',
    title: 'Commercial Office Space in CP',
    listingType: 'RENT',
    propertyType: 'Commercial',
    category: 'Office Space',
    price: 125000,
    location: 'Connaught Place, Delhi',
    bedrooms: 0,
    bathrooms: 2,
    area: 2500,
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
    furnishedType: 'Semi Furnished',
    preferredTenant: 'Company',
    amenities: ['Parking', 'Power Backup', 'Reception', 'Cafeteria'],
  },
  {
    id: 'prop6',
    title: 'Cozy 1BHK Apartment in Dwarka',
    listingType: 'RENT',
    propertyType: 'House/Flat',
    category: '1BHK',
    price: 18000,
    location: 'Dwarka, Delhi',
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    furnishedType: 'Semi Furnished',
    preferredTenant: 'Boys',
    amenities: ['Parking', 'Security', 'Lift'],
  },
  {
    id: 'prop7',
    title: 'Builder Floor 3+1 BHK',
    listingType: 'BUY',
    propertyType: 'Independent Builder Floor',
    category: '3+1 BHK',
    price: 18500000,
    location: 'Vasant Kunj, Delhi',
    bedrooms: 4,
    bathrooms: 3,
    area: 2100,
    images: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800'],
    furnishedType: 'Unfurnished',
    constructionStatus: 'Ready to move',
    amenities: ['Parking', 'Garden', 'Security'],
  },
  {
    id: 'prop8',
    title: 'Premium 5BHK Penthouse',
    listingType: 'BUY',
    propertyType: 'Flat/Apartment',
    category: '5BHK',
    price: 75000000,
    location: 'Golf Course Road, Gurgaon',
    bedrooms: 5,
    bathrooms: 5,
    area: 4500,
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
    furnishedType: 'Fully Furnished',
    constructionStatus: 'Ready to move',
    amenities: ['Private Pool', 'Gym', 'Parking', 'Security', 'Club House'],
  },
  {
    id: 'prop9',
    title: 'Studio Apartment near Metro',
    listingType: 'RENT',
    propertyType: 'House/Flat',
    category: '1RK/Studio Apartment',
    price: 15000,
    location: 'Punjabi Bagh, Delhi',
    bedrooms: 1,
    bathrooms: 1,
    area: 400,
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    furnishedType: 'Fully Furnished',
    preferredTenant: 'Boys & Girls',
    amenities: ['WiFi', 'AC', 'Parking'],
  },
  {
    id: 'prop10',
    title: 'Commercial Showroom',
    listingType: 'BUY',
    propertyType: 'Commercial',
    category: 'Showroom',
    price: 35000000,
    location: 'Nehru Place, Delhi',
    bedrooms: 0,
    bathrooms: 2,
    area: 1800,
    images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'],
    furnishedType: 'Unfurnished',
    constructionStatus: 'Ready to move',
    amenities: ['Parking', 'Power Backup', 'Security'],
  },
  {
    id: 'prop11',
    title: 'Farmhouse with Pool',
    listingType: 'BUY',
    propertyType: 'Farmhouse',
    category: '6BHK',
    price: 95000000,
    location: 'Chattarpur, Delhi',
    bedrooms: 6,
    bathrooms: 6,
    area: 8000,
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'],
    furnishedType: 'Semi Furnished',
    constructionStatus: 'Ready to move',
    amenities: ['Swimming Pool', 'Garden', 'Parking', 'Security'],
  },
  {
    id: 'prop12',
    title: 'PG for Boys - Double Sharing',
    listingType: 'RENT',
    propertyType: 'PG',
    category: 'Two Sharing',
    price: 8500,
    location: 'Laxmi Nagar, Delhi',
    bedrooms: 1,
    bathrooms: 1,
    area: 120,
    images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800'],
    preferredTenant: 'Boys',
    amenities: ['WiFi', 'Meals', 'AC', 'Laundry'],
  },
  {
    id: 'prop13',
    title: 'Plot for Sale in Noida',
    listingType: 'BUY',
    propertyType: 'Plot/Land',
    category: 'Plot',
    price: 12000000,
    location: 'Noida Sector 150',
    bedrooms: 0,
    bathrooms: 0,
    area: 2000,
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
    constructionStatus: 'Ready to move',
    amenities: ['Gated Community', 'Security'],
  },
  {
    id: 'prop14',
    title: '2BHK Under Construction',
    listingType: 'BUY',
    propertyType: 'Flat/Apartment',
    category: '2BHK',
    price: 8500000,
    location: 'Greater Noida West',
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
    furnishedType: 'Unfurnished',
    constructionStatus: 'Under Construction',
    amenities: ['Parking', 'Gym', 'Club House'],
  },
  {
    id: 'prop15',
    title: 'Warehouse for Rent',
    listingType: 'RENT',
    propertyType: 'Commercial',
    category: 'Godown/Warehouse',
    price: 200000,
    location: 'Kundli, Sonipat',
    bedrooms: 0,
    bathrooms: 1,
    area: 5000,
    images: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800'],
    furnishedType: 'Unfurnished',
    preferredTenant: 'Company',
    amenities: ['Parking', 'Security', 'Power Backup'],
  },
];

// Filter options based on property types
const FILTERS_CONFIG: any = {
  'Flat/Apartment': {
    categories: ['1BHK', '2BHK', '3+1 BHK', '3BHK', '4+1 BHK', '4BHK', '5+1 BHK', '5BHK', '6BHK', 'Studio Apartment'],
  },
  'Independent House/Villa': {
    categories: ['1BHK', '2BHK', '3BHK', '4BHK', '5BHK', '6BHK', '7BHK', '8BHK', '9BHK'],
  },
  'Independent Builder Floor': {
    categories: ['1BHK', '2BHK', '3+1 BHK', '3BHK', '4+1 BHK', '4BHK', '5+1 BHK', '5BHK', '6BHK'],
  },
  'Plot/Land': {
    categories: ['Plot'],
  },
  'Farmhouse': {
    categories: ['2BHK', '3BHK', '4BHK', '5BHK', '6BHK', '7BHK', '8BHK', '9BHK'],
  },
  'Commercial': {
    categories: ['Co-Working', 'Godown/Warehouse', 'Hotel/Resorts', 'Industrial Building', 'Office Space', 'Other Business', 'Plot', 'Showroom'],
  },
  'House/Flat': {
    categories: ['1BHK', '1RK/Studio Apartment', '2BHK', '2RK', '3BHK', '3RK', '4+ BHK', '4BHK', 'Annexy'],
  },
  'PG': {
    categories: ['Five Sharing', 'Four Sharing', 'Single Room', 'Three Sharing', 'Two Sharing'],
  },
};

const BUY_TYPES = ['Flat/Apartment', 'Independent House/Villa', 'Independent Builder Floor', 'Plot/Land', 'Farmhouse', 'Commercial'];
const RENT_TYPES = ['House/Flat', 'PG', 'Commercial'];

const FURNISHED_TYPES = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];
const CONSTRUCTION_STATUS = ['Ready to move', 'Under Construction'];
const PREFERRED_TENANTS = ['All', 'Boys', 'Girls', 'Family', 'Company', 'Boys & Girls', 'Family & Boys', 'Family & Girls'];

export default function ListingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>({});
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters state
  const [listingType, setListingType] = useState(searchParams.get('listingType') || 'BUY');
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') || '');
  const [categories, setCategories] = useState<string[]>(searchParams.get('categories') ? searchParams.get('categories')!.split(',') : []);
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [furnishedTypes, setFurnishedTypes] = useState<string[]>(searchParams.get('furnishedTypes') ? searchParams.get('furnishedTypes')!.split(',') : []);
  const [constructionStatuses, setConstructionStatuses] = useState<string[]>(searchParams.get('constructionStatuses') ? searchParams.get('constructionStatuses')!.split(',') : []);
  const [preferredTenants, setPreferredTenants] = useState<string[]>(searchParams.get('preferredTenants') ? searchParams.get('preferredTenants')!.split(',') : []);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadProperties();
  }, [searchParams, currentPage]);

  const loadProperties = async () => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter static properties based on criteria
    let filtered = STATIC_PROPERTIES.filter(prop => {
      // Listing Type filter
      if (listingType && prop.listingType !== listingType) return false;
      
      // Property Type filter
      if (propertyType && prop.propertyType !== propertyType) return false;
      
      // Category filter
      if (categories.length > 0 && !categories.includes(prop.category)) return false;
      
      // Location filter (case-insensitive partial match)
      if (location && !prop.location.toLowerCase().includes(location.toLowerCase())) return false;
      
      // Price range filter
      if (minPrice && prop.price < parseInt(minPrice)) return false;
      if (maxPrice && prop.price > parseInt(maxPrice)) return false;
      
      // Furnished Type filter
      if (furnishedTypes.length > 0 && !furnishedTypes.includes(prop.furnishedType)) return false;
      
      // Construction Status filter
      if (constructionStatuses.length > 0 && !constructionStatuses.includes(prop.constructionStatus)) return false;
      
      // Preferred Tenant filter
      if (preferredTenants.length > 0 && !preferredTenants.includes(prop.preferredTenant)) return false;
      
      return true;
    });
    
    // Pagination
    const limit = 12;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (currentPage - 1) * limit;
    const end = start + limit;
    const paginatedProperties = filtered.slice(start, end);
    
    setProperties(paginatedProperties);
    setPagination({
      total,
      currentPage,
      totalPages,
      limit
    });
    setLoading(false);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    const params = new URLSearchParams();
    
    if (listingType) params.append('listingType', listingType);
    if (propertyType) params.append('propertyType', propertyType);
    if (categories.length > 0) params.append('categories', categories.join(','));
    if (location) params.append('location', location);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (furnishedTypes.length > 0) params.append('furnishedTypes', furnishedTypes.join(','));
    if (constructionStatuses.length > 0) params.append('constructionStatuses', constructionStatuses.join(','));
    if (preferredTenants.length > 0) params.append('preferredTenants', preferredTenants.join(','));
    
    navigate(`/properties?${params.toString()}`);
  };

  const clearFilters = () => {
    setListingType('BUY');
    setPropertyType('');
    setCategories([]);
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setFurnishedTypes([]);
    setConstructionStatuses([]);
    setPreferredTenants([]);
    setCurrentPage(1);
    navigate('/properties');
  };

  const propertyTypes = listingType === 'BUY' ? BUY_TYPES : RENT_TYPES;
  const categoryOptions = propertyType ? FILTERS_CONFIG[propertyType]?.categories || [] : [];
  const showPreferredTenant = listingType === 'RENT';

  // Handler functions for multi-select checkboxes
  const toggleCategory = (cat: string) => {
    setCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleFurnishedType = (type: string) => {
    setFurnishedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleConstructionStatus = (status: string) => {
    setConstructionStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const togglePreferredTenant = (tenant: string) => {
    setPreferredTenants(prev =>
      prev.includes(tenant) ? prev.filter(t => t !== tenant) : [...prev, tenant]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Search Banner */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-[#002b5b] to-[#003d7a]">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Find Your Perfect Property</h1>
          
          {/* Quick Search */}
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-4">
              <select
                value={listingType}
                onChange={(e) => {
                  setListingType(e.target.value);
                  setPropertyType('');
                  setCategories([]);
                }}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
              >
                <option value="BUY">Buy</option>
                <option value="RENT">Rent</option>
              </select>

              <select
                value={propertyType}
                onChange={(e) => {
                  setPropertyType(e.target.value);
                  setCategories([]);
                }}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
              >
                <option value="">All Property Types</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
              />

              <button
                onClick={handleSearch}
                className="bg-[#f97316] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#ea580c] transition flex items-center justify-center gap-2"
              >
                <Search size={20} />
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full bg-white px-4 py-3 rounded-lg shadow flex items-center justify-center gap-2 font-semibold text-[#002b5b]"
              >
                <SlidersHorizontal size={20} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            {/* Filters Sidebar */}
            <aside className={`lg:block ${showFilters ? 'block' : 'hidden'} w-full lg:w-80 flex-shrink-0`}>
              <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#002b5b]">Filters</h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[#f97316] hover:underline font-semibold"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Category */}
                  {categoryOptions.length > 0 && (
                    <div>
                      <h3 className="font-bold text-[#002b5b] mb-3">Category</h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {categoryOptions.map((cat: string) => (
                          <label key={cat} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name="category"
                              value={cat}
                              checked={categories.includes(cat)}
                              onChange={() => toggleCategory(cat)}
                              className="w-4 h-4 text-[#f97316] focus:ring-[#f97316]"
                            />
                            <span className="text-gray-700">{cat}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price Range */}
                  <div>
                    <h3 className="font-bold text-[#002b5b] mb-3">Price Range</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="Min"
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                      />
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Max"
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                      />
                    </div>
                  </div>

                  {/* Furnished Type */}
                  <div>
                    <h3 className="font-bold text-[#002b5b] mb-3">Furnished Type</h3>
                    <div className="space-y-2">
                      {FURNISHED_TYPES.map((type) => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="furnished"
                            value={type}
                            checked={furnishedTypes.includes(type)}
                            onChange={() => toggleFurnishedType(type)}
                            className="w-4 h-4 text-[#f97316] focus:ring-[#f97316]"
                          />
                          <span className="text-gray-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Construction Status */}
                  <div>
                    <h3 className="font-bold text-[#002b5b] mb-3">Construction Status</h3>
                    <div className="space-y-2">
                      {CONSTRUCTION_STATUS.map((status) => (
                        <label key={status} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="construction"
                            value={status}
                            checked={constructionStatuses.includes(status)}
                            onChange={() => toggleConstructionStatus(status)}
                            className="w-4 h-4 text-[#f97316] focus:ring-[#f97316]"
                          />
                          <span className="text-gray-700">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Preferred Tenant (for RENT only) */}
                  {showPreferredTenant && (
                    <div>
                      <h3 className="font-bold text-[#002b5b] mb-3">Preferred Tenant</h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {PREFERRED_TENANTS.map((tenant) => (
                          <label key={tenant} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name="tenant"
                              value={tenant}
                              checked={preferredTenants.includes(tenant)}
                              onChange={() => togglePreferredTenant(tenant)}
                              className="w-4 h-4 text-[#f97316] focus:ring-[#f97316]"
                            />
                            <span className="text-gray-700">{tenant}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleSearch}
                    className="w-full bg-[#f97316] text-white py-3 rounded-lg font-semibold hover:bg-[#ea580c] transition"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </aside>

            {/* Properties Grid */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="bg-white p-4 rounded-lg shadow mb-6 flex items-center justify-between">
                <p className="text-gray-700">
                  <span className="font-bold text-[#002b5b]">{pagination.total || 0}</span> properties found
                </p>
              </div>

              {/* Properties */}
              {loading ? (
                <div className="text-center py-20">
                  <div className="inline-block w-16 h-16 border-4 border-[#f97316] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : properties.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {properties.map((property: any) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-12">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        Previous
                      </button>
                      
                      {/* First page */}
                      {currentPage > 3 && (
                        <>
                          <button
                            onClick={() => setCurrentPage(1)}
                            className="px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition"
                          >
                            1
                          </button>
                          {currentPage > 4 && (
                            <span className="px-2 text-gray-500">...</span>
                          )}
                        </>
                      )}
                      
                      {/* Page numbers around current */}
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                        .filter(page => {
                          return page === currentPage || 
                                 page === currentPage - 1 || 
                                 page === currentPage + 1 ||
                                 page === currentPage - 2 ||
                                 page === currentPage + 2;
                        })
                        .map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${
                              currentPage === page
                                ? 'bg-[#f97316] text-white shadow-md'
                                : 'bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      
                      {/* Last page */}
                      {currentPage < pagination.totalPages - 2 && (
                        <>
                          {currentPage < pagination.totalPages - 3 && (
                            <span className="px-2 text-gray-500">...</span>
                          )}
                          <button
                            onClick={() => setCurrentPage(pagination.totalPages)}
                            className="px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition"
                          >
                            {pagination.totalPages}
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === pagination.totalPages}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white p-12 rounded-lg shadow text-center">
                  <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-[#f97316] font-semibold hover:underline"
                  >
                    Clear filters and try again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}