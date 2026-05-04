import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Search, Mail, Phone, Calendar, Eye, MapPin, Home, IndianRupee, ChevronLeft, ChevronRight, Trash2, Download, Filter } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminInquiries() {
  // Static inquiries data
  const staticInquiries = [
    {
      id: '1',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@email.com',
      phone: '+91 9876543210',
      propertyTitle: '3 BHK Luxury Apartment in Bandra West',
      propertyId: '1',
      propertyLocation: 'Bandra West, Mumbai',
      propertyPrice: 8500000,
      message: 'I am interested in this property. Can we schedule a visit?',
      status: 'new',
      createdAt: '2026-02-10T10:30:00Z'
    },
    {
      id: '2',
      name: 'Priya Patel',
      email: 'priya.patel@email.com',
      phone: '+91 9876543211',
      propertyTitle: 'Modern Villa with Swimming Pool',
      propertyId: '2',
      propertyLocation: 'Whitefield, Bangalore',
      propertyPrice: 15000000,
      message: 'Looking for more details about the amenities and furnishing.',
      status: 'contacted',
      createdAt: '2026-02-09T14:20:00Z'
    },
    {
      id: '3',
      name: 'Amit Kumar',
      email: 'amit.kumar@email.com',
      phone: '+91 9876543212',
      propertyTitle: 'Commercial Office Space in Connaught Place',
      propertyId: '3',
      propertyLocation: 'Connaught Place, Delhi',
      propertyPrice: 12000000,
      message: 'Interested in purchasing. Please share payment plans.',
      status: 'new',
      createdAt: '2026-02-09T09:15:00Z'
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      email: 'sneha.reddy@email.com',
      phone: '+91 9876543213',
      propertyTitle: '2 BHK Apartment Near Metro Station',
      propertyId: '4',
      propertyLocation: 'Andheri East, Mumbai',
      propertyPrice: 4500000,
      message: 'When can I visit the property?',
      status: 'closed',
      createdAt: '2026-02-08T16:45:00Z'
    },
    {
      id: '5',
      name: 'Vikram Singh',
      email: 'vikram.singh@email.com',
      phone: '+91 9876543214',
      propertyTitle: 'Penthouse with Sea View',
      propertyId: '6',
      propertyLocation: 'Bandra West, Mumbai',
      propertyPrice: 25000000,
      message: 'Is the property available for immediate possession?',
      status: 'contacted',
      createdAt: '2026-02-08T11:30:00Z'
    },
    {
      id: '6',
      name: 'Anjali Mehta',
      email: 'anjali.mehta@email.com',
      phone: '+91 9876543215',
      propertyTitle: 'Spacious PG for Working Professionals',
      propertyId: '5',
      propertyLocation: 'Koramangala, Bangalore',
      propertyPrice: 12000,
      message: 'What are the food options and rules?',
      status: 'new',
      createdAt: '2026-02-07T13:00:00Z'
    },
    {
      id: '7',
      name: 'Rohan Verma',
      email: 'rohan.verma@email.com',
      phone: '+91 9876543216',
      propertyTitle: '1 BHK Studio Apartment',
      propertyId: '7',
      propertyLocation: 'HSR Layout, Bangalore',
      propertyPrice: 18000,
      message: 'What is the security deposit amount?',
      status: 'new',
      createdAt: '2026-02-06T10:00:00Z'
    },
    {
      id: '8',
      name: 'Deepika Nair',
      email: 'deepika.nair@email.com',
      phone: '+91 9876543217',
      propertyTitle: 'Independent House with Garden',
      propertyId: '8',
      propertyLocation: 'Sector 50, Gurgaon',
      propertyPrice: 18000000,
      message: 'Can I get a virtual tour of this property?',
      status: 'contacted',
      createdAt: '2026-02-05T15:20:00Z'
    }
  ];

  const [inquiries, setInquiries] = useState(staticInquiries);
  const [filteredInquiries, setFilteredInquiries] = useState(staticInquiries);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Date filters
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // Filter inquiries
    let filtered = inquiries;

    if (statusFilter) {
      filtered = filtered.filter((i: any) => i.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter((i: any) =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter((i: any) => new Date(i.createdAt) >= new Date(dateFrom));
    }
    if (dateTo) {
      filtered = filtered.filter((i: any) => new Date(i.createdAt) <= new Date(dateTo + 'T23:59:59'));
    }

    // Sorting
    filtered = [...filtered].sort((a: any, b: any) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    setFilteredInquiries(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [statusFilter, searchQuery, inquiries, dateFrom, dateTo, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInquiries = filteredInquiries.slice(startIndex, endIndex);

  const handleStatusUpdate = (id: string, status: string) => {
    const updatedInquiries = inquiries.map(i => 
      i.id === id ? { ...i, status: status as any } : i
    );
    setInquiries(updatedInquiries);
    toast.success('Inquiry status updated');
    setSelectedInquiry(null);
  };

  const handleDelete = (id: string) => {
    const updatedInquiries = inquiries.filter(i => i.id !== id);
    setInquiries(updatedInquiries);
    toast.success('Inquiry deleted successfully');
    setDeleteId(null);
    setSelectedInquiry(null);
  };

  const handleExportCSV = () => {
    // Prepare CSV headers
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Property', 'Status', 'Message', 'Date'];
    
    // Prepare CSV rows
    const rows = filteredInquiries.map((i: any) => [
      i.id,
      `"${i.name}"`,
      i.email,
      i.phone,
      `"${i.propertyTitle}"`,
      i.status,
      `"${i.message.replace(/"/g, '""')}"`, // Escape quotes in message
      new Date(i.createdAt).toLocaleDateString()
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
    link.setAttribute('download', `inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV exported successfully!');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setDateFrom('');
    setDateTo('');
    setSortBy('date-desc');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-orange-100 text-orange-700';
      case 'contacted':
        return 'bg-blue-100 text-blue-700';
      case 'closed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
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
            <h1 className="text-3xl font-bold text-[#002b5b]">Inquiries</h1>
            <p className="text-gray-600 mt-1">Manage customer inquiries</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
          >
            <Download size={20} />
            Export CSV
          </button>
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
              placeholder="Search inquiries..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                >
                  <option value="">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
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
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
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

        {/* Inquiries Table */}
        {currentInquiries.length > 0 ? (
          <>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Property</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {currentInquiries.map((inquiry: any) => (
                      <tr key={inquiry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-[#002b5b]">{inquiry.name}</p>
                            <p className="text-sm text-gray-600">{inquiry.email}</p>
                            <p className="text-sm text-gray-600">{inquiry.phone}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900 mb-1">{inquiry.propertyTitle}</p>
                          <p className="text-sm text-gray-600">{inquiry.propertyLocation}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(inquiry.status)}`}>
                            {inquiry.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedInquiry(inquiry)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded transition"
                              title="View"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => setDeleteId(inquiry.id)}
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
                {currentInquiries.map((inquiry: any) => (
                  <div key={inquiry.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-[#002b5b] mb-1">{inquiry.name}</h3>
                        <p className="text-sm text-gray-600">{inquiry.email}</p>
                        <p className="text-sm text-gray-600">{inquiry.phone}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">{inquiry.propertyTitle}</p>
                    <p className="text-xs text-gray-500 mb-3">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedInquiry(inquiry)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm flex items-center justify-center gap-2"
                      >
                        <Eye size={16} />
                        View
                      </button>
                      <button
                        onClick={() => setDeleteId(inquiry.id)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm flex items-center justify-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredInquiries.length)} of {filteredInquiries.length} inquiries
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
            <p className="text-gray-500 text-lg">No inquiries found</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-[#002b5b] mb-4">Delete Inquiry</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this inquiry? This action cannot be undone.
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

      {/* Inquiry Details Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#002b5b]">Inquiry Details</h3>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-[#002b5b] mb-3">Customer Information</h4>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <p className="font-semibold">{selectedInquiry.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-semibold">{selectedInquiry.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <p className="font-semibold">{selectedInquiry.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ml-2 ${getStatusColor(selectedInquiry.status)}`}>
                      {selectedInquiry.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Property Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-[#002b5b] mb-3">Property Information</h4>
                <p className="font-semibold mb-2">{selectedInquiry.propertyTitle}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{selectedInquiry.propertyLocation}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IndianRupee size={14} />
                    <span className="font-semibold text-[#f97316]">{formatPrice(selectedInquiry.propertyPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-[#002b5b] mb-3">Message</h4>
                <p className="text-gray-700">{selectedInquiry.message}</p>
              </div>

              {/* Date */}
              <div className="text-sm text-gray-600">
                <Calendar size={14} className="inline mr-2" />
                Received on: {new Date(selectedInquiry.createdAt).toLocaleString()}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                {selectedInquiry.status !== 'closed' && (
                  <>
                    {selectedInquiry.status === 'new' && (
                      <button
                        onClick={() => handleStatusUpdate(selectedInquiry.id, 'contacted')}
                        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                      >
                        Mark as Contacted
                      </button>
                    )}
                    <button
                      onClick={() => handleStatusUpdate(selectedInquiry.id, 'closed')}
                      className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                      Mark as Closed
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedInquiry(null)}
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
