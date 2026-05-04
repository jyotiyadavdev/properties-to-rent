import { Link } from 'react-router';
import AdminLayout from '../../components/AdminLayout';
import { Building2, MessageSquare, TrendingUp, Eye, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { adminGetDashboard } from '../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      console.log('🔍 Fetching dashboard data...');
      
      const result = await adminGetDashboard();
      console.log('📦 Dashboard response:', result);
      
      if (result.success) {
        console.log('✅ Dashboard data loaded successfully:', result.data);
        setStats(result.data);
      } else {
        console.error('❌ Dashboard error:', result.error);
        alert(`Dashboard error: ${result.error}`);
      }
    } catch (error: any) {
      console.error('❌ Failed to load dashboard:', error);
      alert(`Failed to load dashboard: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f97316] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className="p-6 lg:p-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Failed to load dashboard data</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Chart data - Property Type Distribution
  const propertyTypeData = Object.entries(stats?.propertyTypeCount || {}).map(([name, value]) => ({
    name,
    value: value as number,
    color: name === 'Flat/Apartment' ? '#3b82f6' :
           name === 'Villa' ? '#10b981' :
           name === 'PG' ? '#f59e0b' :
           name === 'Commercial' ? '#8b5cf6' :
           '#ec4899'
  }));

  // Chart data - Rent vs Buy Comparison
  const listingTypeData = [
    { 
      name: 'Rent', 
      properties: stats?.listingTypeStats?.rent?.properties || 0, 
      inquiries: stats?.listingTypeStats?.rent?.inquiries || 0 
    },
    { 
      name: 'Buy', 
      properties: stats?.listingTypeStats?.buy?.properties || 0, 
      inquiries: stats?.listingTypeStats?.buy?.inquiries || 0 
    }
  ];

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
            <h1 className="text-3xl font-bold text-[#002b5b]">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's an overview of your real estate business.</p>
          </div>
          <Link
            to="/admin/properties/add"
            className="bg-[#f97316] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#ea580c] transition flex items-center gap-2"
          >
            <Plus size={20} />
            Add Property
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="text-blue-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-blue-600">{stats?.totalProperties || 0}</span>
            </div>
            <h3 className="text-gray-600 font-semibold">Total Properties</h3>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-green-600">{stats?.activeProperties || 0}</span>
            </div>
            <h3 className="text-gray-600 font-semibold">Active Properties</h3>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="text-purple-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-purple-600">{stats?.totalInquiries || 0}</span>
            </div>
            <h3 className="text-gray-600 font-semibold">Total Inquiries</h3>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="text-orange-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-orange-600">{stats?.newInquiries || 0}</span>
            </div>
            <h3 className="text-gray-600 font-semibold">New Inquiries</h3>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Property Type Pie Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#002b5b]">Property Type Distribution</h2>
              <p className="text-sm text-gray-600 mt-1">Overview of property types in your portfolio</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {propertyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-4 justify-center">
              {propertyTypeData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Listing Type Bar Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#002b5b]">Rent vs Buy Comparison</h2>
              <p className="text-sm text-gray-600 mt-1">Properties and inquiries by listing type</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={listingTypeData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #ddd',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="properties" 
                  fill="#3b82f6" 
                  radius={[8, 8, 0, 0]}
                  animationBegin={0}
                  animationDuration={800}
                />
                <Bar 
                  dataKey="inquiries" 
                  fill="#f97316" 
                  radius={[8, 8, 0, 0]}
                  animationBegin={200}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Properties */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#002b5b]">Recent Properties</h2>
            </div>

            {stats?.recentProperties && stats.recentProperties.length > 0 ? (
              <>
                <div className="space-y-4">
                  {stats.recentProperties.slice(0, 3).map((property: any) => (
                    <div key={property.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-[#f97316] transition">
                      <img
                        src={property.thumbnailImage || property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200'}
                        alt={property.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#002b5b] truncate">{property.title}</h3>
                        <p className="text-sm text-gray-600">{property.location}, {property.city}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm font-bold text-[#f97316]">
                            {formatPrice(property.price)}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            property.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {property.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/admin/properties"
                  className="mt-4 block text-center py-2 px-4 border-2 border-[#f97316] text-[#f97316] rounded-lg font-semibold hover:bg-[#f97316] hover:text-white transition"
                >
                  View All Properties
                </Link>
              </>
            ) : (
              <p className="text-gray-500 text-center py-8">No properties yet</p>
            )}
          </div>

          {/* Recent Inquiries */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#002b5b]">Recent Inquiries</h2>
            </div>

            {stats?.recentInquiries && stats.recentInquiries.length > 0 ? (
              <>
                <div className="space-y-4">
                  {stats.recentInquiries.slice(0, 3).map((inquiry: any) => (
                    <div key={inquiry.id} className="p-4 border border-gray-200 rounded-lg hover:border-[#f97316] transition">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[#002b5b] truncate">{inquiry.name}</h3>
                          <p className="text-sm text-gray-600 truncate">{inquiry.propertyTitle}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-500">
                              {new Date(inquiry.createdAt).toLocaleDateString()}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              inquiry.status === 'new' ? 'bg-orange-100 text-orange-700' :
                              inquiry.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {inquiry.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/admin/inquiries"
                  className="mt-4 block text-center py-2 px-4 border-2 border-[#f97316] text-[#f97316] rounded-lg font-semibold hover:bg-[#f97316] hover:text-white transition"
                >
                  View All Inquiries
                </Link>
              </>
            ) : (
              <p className="text-gray-500 text-center py-8">No inquiries yet</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}