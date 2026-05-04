import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Mail, Phone, Calendar, Eye, Trash2, X, CheckCircle, ChevronLeft, ChevronRight, Download, Filter, Search } from 'lucide-react';
import { toast } from 'sonner';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'responded';
  createdAt: string;
  updatedAt?: string;
}

export default function AdminContacts() {
  // Static contacts data - more for pagination
  const staticContacts: Contact[] = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91 9876543210',
      subject: 'Property Inquiry',
      message: 'I am interested in buying a 3 BHK apartment in Mumbai. Can you help me find suitable options?',
      status: 'new',
      createdAt: '2026-02-10T14:30:00Z'
    },
    {
      id: '2',
      name: 'Meera Singh',
      email: 'meera.singh@email.com',
      phone: '+91 9876543211',
      subject: 'Rental Information',
      message: 'What is the process for renting a property through your platform?',
      status: 'read',
      createdAt: '2026-02-09T11:20:00Z'
    },
    {
      id: '3',
      name: 'Arjun Patel',
      email: 'arjun.patel@email.com',
      phone: '+91 9876543212',
      subject: 'Commercial Property',
      message: 'Looking for commercial office space in Bangalore. Please provide available options.',
      status: 'responded',
      createdAt: '2026-02-08T09:45:00Z'
    },
    {
      id: '4',
      name: 'Kavita Sharma',
      email: 'kavita.sharma@email.com',
      phone: '+91 9876543213',
      subject: 'PG Accommodation',
      message: 'Need PG accommodation near Koramangala for a working professional.',
      status: 'new',
      createdAt: '2026-02-07T16:10:00Z'
    },
    {
      id: '5',
      name: 'Suresh Reddy',
      email: 'suresh.reddy@email.com',
      phone: '+91 9876543214',
      subject: 'Property Valuation',
      message: 'I want to know the current market value of my property. Can you help?',
      status: 'read',
      createdAt: '2026-02-06T13:30:00Z'
    },
    {
      id: '6',
      name: 'Neha Gupta',
      email: 'neha.gupta@email.com',
      phone: '+91 9876543215',
      subject: 'Property Documentation',
      message: 'What documents are required for property registration?',
      status: 'new',
      createdAt: '2026-02-05T10:15:00Z'
    },
    {
      id: '7',
      name: 'Sanjay Mishra',
      email: 'sanjay.mishra@email.com',
      phone: '+91 9876543216',
      subject: 'Home Loan Assistance',
      message: 'Do you provide home loan assistance services?',
      status: 'responded',
      createdAt: '2026-02-04T14:40:00Z'
    }
  ];

  const [contacts, setContacts] = useState<Contact[]>(staticContacts);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(staticContacts);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Search and date filters
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    let filtered = contacts;

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter(c => new Date(c.createdAt) >= new Date(dateFrom));
    }
    if (dateTo) {
      filtered = filtered.filter(c => new Date(c.createdAt) <= new Date(dateTo + 'T23:59:59'));
    }

    // Sorting
    filtered = [...filtered].sort((a, b) => {
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

    setFilteredContacts(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [filterStatus, contacts, searchQuery, dateFrom, dateTo, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContacts = filteredContacts.slice(startIndex, endIndex);

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    
    // Mark as read if it's new
    if (contact.status === 'new') {
      const updatedContacts = contacts.map(c => 
        c.id === contact.id ? { ...c, status: 'read' as const } : c
      );
      setContacts(updatedContacts);
    }
  };

  const handleUpdateStatus = (id: string, status: string) => {
    const updatedContacts = contacts.map(c => 
      c.id === id ? { ...c, status: status as Contact['status'] } : c
    );
    setContacts(updatedContacts);
    toast.success('Contact status updated successfully!');
    setSelectedContact(null);
  };

  const handleDelete = (id: string) => {
    const updatedContacts = contacts.filter(c => c.id !== id);
    setContacts(updatedContacts);
    toast.success('Contact deleted successfully!');
    setDeleteId(null);
    setSelectedContact(null);
  };

  const handleExportCSV = () => {
    // Prepare CSV headers
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Subject', 'Status', 'Message', 'Date'];
    
    // Prepare CSV rows
    const rows = filteredContacts.map(c => [
      c.id,
      `"${c.name}"`,
      c.email,
      c.phone,
      `"${c.subject}"`,
      c.status,
      `"${c.message.replace(/"/g, '""')}"`, // Escape quotes in message
      new Date(c.createdAt).toLocaleDateString()
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
    link.setAttribute('download', `contacts_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV exported successfully!');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setDateFrom('');
    setDateTo('');
    setSortBy('date-desc');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-orange-100 text-orange-700';
      case 'read':
        return 'bg-blue-100 text-blue-700';
      case 'responded':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#002b5b]">Contact Messages</h1>
            <p className="text-gray-600 mt-1">Manage customer inquiries and messages</p>
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
              placeholder="Search contacts..."
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
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                >
                  <option value="all">All Messages</option>
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="responded">Responded</option>
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

        {/* Contacts Table */}
        {currentContacts.length > 0 ? (
          <>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Subject</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {currentContacts.map((contact) => (
                      <tr key={contact.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-[#002b5b]">{contact.name}</p>
                            <p className="text-sm text-gray-600">{contact.email}</p>
                            <p className="text-sm text-gray-600">{contact.phone}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">{contact.subject}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(contact.status)}`}>
                            {contact.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600">{new Date(contact.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewContact(contact)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded transition"
                              title="View"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => setDeleteId(contact.id)}
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
                {currentContacts.map((contact) => (
                  <div key={contact.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-[#002b5b] mb-1">{contact.name}</h3>
                        <p className="text-sm text-[#f97316] font-semibold mb-1">{contact.subject}</p>
                        <p className="text-sm text-gray-600">{contact.email}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(contact.status)}`}>
                        {contact.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{new Date(contact.createdAt).toLocaleDateString()}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewContact(contact)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm flex items-center justify-center gap-2"
                      >
                        <Eye size={16} />
                        View
                      </button>
                      <button
                        onClick={() => setDeleteId(contact.id)}
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
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredContacts.length)} of {filteredContacts.length} contacts
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
            <p className="text-gray-500 text-lg">No contact messages found</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-[#002b5b] mb-4">Delete Contact</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this contact message? This action cannot be undone.
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

      {/* Contact Details Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#002b5b]">Contact Details</h3>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex justify-between items-center">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(selectedContact.status)}`}>
                  {selectedContact.status}
                </span>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={16} />
                  <span>{new Date(selectedContact.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Name:</span>
                    <p className="font-semibold">{selectedContact.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Email:</span>
                    <p className="font-semibold">{selectedContact.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Phone:</span>
                    <p className="font-semibold">{selectedContact.phone}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Subject:</span>
                    <p className="font-semibold text-[#f97316]">{selectedContact.subject}</p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Message</h4>
                <p className="text-gray-700 whitespace-pre-line">{selectedContact.message}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                {selectedContact.status !== 'responded' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedContact.id, 'responded')}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                  >
                    <CheckCircle size={20} />
                    Mark as Responded
                  </button>
                )}
                <button
                  onClick={() => setDeleteId(selectedContact.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
                >
                  <Trash2 size={20} />
                  Delete
                </button>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
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
