import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Edit, Trash2, Eye, Search, Building2, ChevronLeft, ChevronRight, Download, Filter, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProperties() {
  // Static properties data - more properties for pagination
  const staticProperties = [
    {
      id: '1',
      title: '3 BHK Luxury Apartment in Bandra West',
      propertyType: 'Flat/Apartment',
      listingType: 'RENT',
      location: 'Bandra West',
      city: 'Mumbai',
      price: 85000,
      status: 'active',
      thumbnailImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200',
      views: 234,
      bhk: '3 BHK',
      description: 'Spacious luxury apartment with modern amenities',
      createdAt: '2026-01-15T10:30:00Z'
    },
    {
      id: '2',
      title: 'Modern Villa with Swimming Pool',
      propertyType: 'Villa',
      listingType: 'BUY',
      location: 'Whitefield',
      city: 'Bangalore',
      price: 15000000,
      status: 'active',
      thumbnailImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=200',
      views: 189,
      bhk: '4 BHK',
      description: 'Beautiful villa with private swimming pool',
      createdAt: '2026-01-20T14:20:00Z'
    },
    {
      id: '3',
      title: 'Commercial Office Space in Connaught Place',
      propertyType: 'Commercial',
      listingType: 'RENT',
      location: 'Connaught Place',
      city: 'Delhi',
      price: 250000,
      status: 'active',
      thumbnailImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200',
      views: 156,
      bhk: 'N/A',
      description: 'Prime commercial space in heart of Delhi',
      createdAt: '2026-01-25T09:15:00Z'
    },
    {
      id: '4',
      title: '2 BHK Apartment Near Metro Station',
      propertyType: 'Flat/Apartment',
      listingType: 'RENT',
      location: 'Andheri East',
      city: 'Mumbai',
      price: 35000,
      status: 'inactive',
      thumbnailImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200',
      views: 98,
      bhk: '2 BHK',
      description: 'Convenient location near metro station',
      createdAt: '2026-01-28T16:45:00Z'
    },
    {
      id: '5',
      title: 'Spacious PG for Working Professionals',
      propertyType: 'PG',
      listingType: 'RENT',
      location: 'Koramangala',
      city: 'Bangalore',
      price: 12000,
      status: 'active',
      thumbnailImage: 'https://images.unsplash.com/photo-1502672260066-6bc35f0af07e?w=200',
      views: 145,
      bhk: 'Single/Double',
      description: 'Fully furnished PG with all amenities',
      createdAt: '2026-02-01T11:30:00Z'
    },
    {
      id: '6',
      title: 'Luxury Penthouse with Terrace Garden',
      propertyType: 'Flat/Apartment',
      listingType: 'BUY',
      location: 'Bandra West',
      city: 'Mumbai',
      price: 25000000,
      status: 'active',
      thumbnailImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200',
      views: 312,
      bhk: '5 BHK',
      description: 'Ultra-luxury penthouse with rooftop garden',
      createdAt: '2026-02-03T13:00:00Z'
    },
    {
      id: '7',
      title: '1 BHK Studio Apartment',
      propertyType: 'Flat/Apartment',
      listingType: 'RENT',
      location: 'HSR Layout',
      city: 'Bangalore',
      price: 18000,
      status: 'active',
      thumbnailImage: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=200',
      views: 87,
      bhk: '1 BHK',
      description: 'Compact studio perfect for singles',
      createdAt: '2026-02-05T10:00:00Z'
    },
    {
      id: '8',
      title: 'Independent House with Garden',
      propertyType: 'Villa',
      listingType: 'BUY',
      location: 'Sector 50',
      city: 'Gurgaon',
      price: 18000000,
      status: 'active',
      thumbnailImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200',
      views: 201,
      bhk: '4 BHK',
      description: 'Independent house with spacious garden',
      createdAt: '2026-02-07T15:20:00Z'
    },
    {
      id: '9',
      title: 'Commercial Shop in Mall',
      propertyType: 'Commercial',
      listingType: 'BUY',
      location: 'Saket',
      city: 'Delhi',
      price: 8500000,
      status: 'active',
      thumbnailImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200',
      views: 134,
      bhk: 'N/A',
      description: 'Premium retail space in popular mall',
      createdAt: '2026-02-09T09:45:00Z'
    },
    {
      id: '10',
      title: '3 BHK Sea Facing Apartment',
      propertyType: 'Flat/Apartment',
      listingType: 'BUY',
      location: 'Marine Drive',
      city: 'Mumbai',
      price: 22000000,
      status: 'active',
      thumbnailImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200',
      views: 278,
      bhk: '3 BHK',
      description: 'Stunning sea view from all rooms',
      createdAt: '2026-02-10T14:30:00Z'
    }
  ];

  const [properties, setProperties] = useState(staticProperties);
  const [filteredProperties, setFilteredProperties] = useState(staticProperties);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewProperty, setViewProperty] = useState<any>(null);
  
  // Filter states
  const [filterPropertyType, setFilterPropertyType] = useState('');
  const [filterListingType, setFilterListingType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // Filter properties based on all filters
    let filtered = properties;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((p: any) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Property type filter
    if (filterPropertyType) {
      filtered = filtered.filter((p: any) => p.propertyType === filterPropertyType);
    }

    // Listing type filter
    if (filterListingType) {
      filtered = filtered.filter((p: any) => p.listingType === filterListingType);
    }

    // Status filter
    if (filterStatus) {
      filtered = filtered.filter((p: any) => p.status === filterStatus);
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter((p: any) => new Date(p.createdAt) >= new Date(dateFrom));
    }
    if (dateTo) {
      filtered = filtered.filter((p: any) => new Date(p.createdAt) <= new Date(dateTo + 'T23:59:59'));
    }

    // Sorting
    filtered = [...filtered].sort((a: any, b: any) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price-desc':
          return b.price - a.price;
        case 'price-asc':
          return a.price - b.price;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    setFilteredProperties(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchQuery, properties, filterPropertyType, filterListingType, filterStatus, dateFrom, dateTo, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

  const handleDelete = (id: string) => {
    const updatedProperties = properties.filter(p => p.id !== id);
    setProperties(updatedProperties);
    toast.success('Property deleted successfully');
    setDeleteId(null);
  };

  const handleExportCSV = () => {
    // Prepare CSV headers
    const headers = ['ID', 'Title', 'Property Type', 'Listing Type', 'City', 'Price', 'Status', 'Views', 'Created Date'];
    
    // Prepare CSV rows
    const rows = filteredProperties.map((p: any) => [
      p.id,
      `"${p.title}"`,
      p.propertyType,
      p.listingType,
      p.city,
      p.price,
      p.status,
      p.views,
      new Date(p.createdAt).toLocaleDateString()
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `properties_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV exported successfully!');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterPropertyType('');
    setFilterListingType('');
    setFilterStatus('');
    setDateFrom('');
    setDateTo('');
    setSortBy('date-desc');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#002b5b]">Properties</h1>
            <p className="text-gray-600 mt-1">Manage all your property listings</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
            >
              <Download size={20} />
              Export CSV
            </button>
            <Link
              to="/admin/properties/add"
              className="bg-[#f97316] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#ea580c] transition flex items-center gap-2"
            >
              <Plus size={20} />
              Add Property
            </Link>
          </div>
        </div>

        {/* Search & Filter Toggle */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search properties..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center gap-2"
          >
            <Filter size={20} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Property Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type</label>
                <select
                  value={filterPropertyType}
                  onChange={(e) => setFilterPropertyType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                >
                  <option value="">All Types</option>
                  <option value="Flat/Apartment">Flat/Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="PG">PG</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              {/* Listing Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Listing Type</label>
                <select
                  value={filterListingType}
                  onChange={(e) => setFilterListingType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                >
                  <option value="">All Listings</option>
                  <option value="BUY">Buy</option>
                  <option value="RENT">Rent</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">From Date</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Calendar size={18} />
                  </div>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                  />
                </div>
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">To Date</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Calendar size={18} />
                  </div>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="title-asc">Title: A to Z</option>
                  <option value="title-desc">Title: Z to A</option>
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleClearFilters}
                className="px-6 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {currentProperties.length > 0 ? (
          <>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Property</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {currentProperties.map((property: any) => (
                      <tr key={property.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={property.thumbnailImage || property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100'}
                              alt={property.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-semibold text-[#002b5b]">{property.title}</p>
                              <p className="text-sm text-gray-600">{property.propertyType}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            property.listingType === 'BUY' 
                              ? 'bg-orange-100 text-orange-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {property.listingType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[#f97316]">{formatPrice(property.price)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-700">{property.city}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            property.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {property.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setViewProperty(property)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded transition"
                              title="View"
                            >
                              <Eye size={18} />
                            </button>
                            <Link
                              to={`/admin/properties/edit/${property.id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </Link>
                            <button
                              onClick={() => setDeleteId(property.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y">
                {currentProperties.map((property: any) => (
                  <div key={property.id} className="p-4">
                    <div className="flex gap-3 mb-3">
                      <img
                        src={property.thumbnailImage || property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100'}
                        alt={property.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#002b5b] mb-1">{property.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{property.propertyType}</p>
                        <p className="font-semibold text-[#f97316]">{formatPrice(property.price)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          property.listingType === 'BUY' 
                            ? 'bg-orange-100 text-orange-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {property.listingType}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          property.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {property.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewProperty(property)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded"
                        >
                          <Eye size={18} />
                        </button>
                        <Link
                          to={`/admin/properties/edit/${property.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => setDeleteId(property.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredProperties.length)} of {filteredProperties.length} properties
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === page
                            ? 'bg-[#f97316] text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">No properties found</p>
            <Link
              to="/admin/properties/add"
              className="inline-block bg-[#f97316] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#ea580c] transition"
            >
              Add Your First Property
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-[#002b5b] mb-4">Delete Property</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this property? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Property Modal */}
      {viewProperty && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#002b5b]">Property Details</h3>
              <button
                onClick={() => setViewProperty(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Property Image */}
              <img
                src={viewProperty.thumbnailImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'}
                alt={viewProperty.title}
                className="w-full h-64 object-cover rounded-lg"
              />

              {/* Property Info */}
              <div>
                <h4 className="text-2xl font-bold text-[#002b5b] mb-2">{viewProperty.title}</h4>
                <p className="text-gray-600 mb-4">{viewProperty.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                  <div>
                    <span className="text-sm text-gray-600">Property Type:</span>
                    <p className="font-semibold">{viewProperty.propertyType}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Listing Type:</span>
                    <p className="font-semibold">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        viewProperty.listingType === 'BUY' 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {viewProperty.listingType}
                      </span>
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">BHK:</span>
                    <p className="font-semibold">{viewProperty.bhk}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Location:</span>
                    <p className="font-semibold">{viewProperty.location}, {viewProperty.city}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Price:</span>
                    <p className="font-semibold text-[#f97316] text-lg">{formatPrice(viewProperty.price)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status:</span>
                    <p className="font-semibold">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        viewProperty.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {viewProperty.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Views:</span>
                    <p className="font-semibold flex items-center gap-1">
                      <Eye size={16} />
                      {viewProperty.views}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Link
                  to={`/admin/properties/edit/${viewProperty.id}`}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-center"
                >
                  Edit Property
                </Link>
                <button
                  onClick={() => setViewProperty(null)}
                  className="flex-1 border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}