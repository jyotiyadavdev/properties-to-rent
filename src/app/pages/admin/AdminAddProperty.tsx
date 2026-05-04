import { useState } from 'react';
import { useNavigate } from 'react-router';
import AdminLayout from '../../components/AdminLayout';
import { adminCreateProperty, uploadPropertyImage } from '../../utils/api';
import { ArrowLeft, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router';

const BUY_TYPES = ['Flat/Apartment', 'Independent House/Villa', 'Independent Builder Floor', 'Plot/Land', 'Farmhouse', 'Commercial'];
const RENT_TYPES = ['House/Flat', 'PG', 'Commercial'];
const FURNISHED_TYPES = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];
const CONSTRUCTION_STATUS = ['Ready to move', 'Under Construction'];
const PREFERRED_TENANTS = ['All', 'Boys', 'Girls', 'Family', 'Company', 'Boys & Girls', 'Family & Boys', 'Family & Girls'];

const CATEGORIES: any = {
  'Flat/Apartment': ['1BHK', '2BHK', '3+1 BHK', '3BHK', '4+1 BHK', '4BHK', '5+1 BHK', '5BHK', '6BHK', 'Studio Apartment'],
  'Independent House/Villa': ['1BHK', '2BHK', '3BHK', '4BHK', '5BHK', '6BHK', '7BHK', '8BHK', '9BHK'],
  'Independent Builder Floor': ['1BHK', '2BHK', '3+1 BHK', '3BHK', '4+1 BHK', '4BHK', '5+1 BHK', '5BHK', '6BHK'],
  'Plot/Land': ['Plot'],
  'Farmhouse': ['2BHK', '3BHK', '4BHK', '5BHK', '6BHK', '7BHK', '8BHK', '9BHK'],
  'Commercial': ['Co-Working', 'Godown/Warehouse', 'Hotel/Resorts', 'Industrial Building', 'Office Space', 'Other Business', 'Plot', 'Showroom'],
  'House/Flat': ['1BHK', '1RK/Studio Apartment', '2BHK', '2RK', '3BHK', '3RK', '4+ BHK', '4BHK', 'Annexy'],
  'PG': ['Five Sharing', 'Four Sharing', 'Single Room', 'Three Sharing', 'Two Sharing'],
};

const FEATURES_OPTIONS = [
  'Parking',
  'Swimming Pool',
  'Gym',
  'Garden',
  '24/7 Security',
  'Lift',
  'Power Backup',
  'Club House',
  'Children Play Area',
  'CCTV Surveillance',
  'Fire Safety',
  'Visitor Parking',
];

export default function AdminAddProperty() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [listingType, setListingType] = useState('BUY');
  const [propertyType, setPropertyType] = useState('');
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [squareFeet, setSquareFeet] = useState('');
  const [furnishedType, setFurnishedType] = useState('Fully Furnished');
  const [constructionStatus, setConstructionStatus] = useState('Ready to move');
  const [preferredTenant, setPreferredTenant] = useState('All');
  const [features, setFeatures] = useState<string[]>([]);
  const [status, setStatus] = useState('active');
  const [featured, setFeatured] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const propertyTypes = listingType === 'BUY' ? BUY_TYPES : RENT_TYPES;
  const categories = propertyType ? CATEGORIES[propertyType] || [] : [];
  const showBedBath = !['Plot/Land'].includes(propertyType);
  const showPreferredTenant = listingType === 'RENT';

  const handleFeatureToggle = (feature: string) => {
    if (features.includes(feature)) {
      setFeatures(features.filter(f => f !== feature));
    } else {
      setFeatures([...features, feature]);
    }
  };

  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageUrl = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
  };

  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !propertyType || !price || !location || !city) {
      toast.error('Please fill all required fields');
      return;
    }

    const propertyData = {
      listingType,
      propertyType,
      category,
      title,
      description,
      price: Number(price),
      location,
      address,
      city,
      state,
      pincode,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      bathrooms: bathrooms ? Number(bathrooms) : undefined,
      squareFeet: squareFeet ? Number(squareFeet) : undefined,
      furnishedType,
      constructionStatus,
      preferredTenant: showPreferredTenant ? preferredTenant : undefined,
      features: features,
      status,
      featured,
      images: imageUrls.filter(url => url.trim() !== ''),
      thumbnailImage: thumbnailUrl || imageUrls[0],
    };

    setSubmitting(true);
    try {
      // Simulate property creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Property created successfully!');
      navigate('/admin/properties');
    } catch (error) {
      console.error('Error creating property:', error);
      toast.error('Failed to create property');
    } finally {
      setSubmitting(false);
    }
  };

  // Image upload states
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setThumbnailUploading(true);
    try {
      const response = await uploadPropertyImage(file);
      if (response.success && response.data.url) {
        setThumbnailUrl(response.data.url);
        toast.success('Thumbnail uploaded successfully!');
      }
    } catch (error: any) {
      console.error('Error uploading thumbnail:', error);
      toast.error(error.message || 'Failed to upload thumbnail');
    } finally {
      setThumbnailUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    try {
      const response = await uploadPropertyImage(file);
      if (response.success && response.data.url) {
        updateImageUrl(index, response.data.url);
        toast.success(`Image ${index + 1} uploaded successfully!`);
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/admin/properties"
            className="inline-flex items-center gap-2 text-[#002b5b] hover:text-[#f97316] mb-4 font-semibold"
          >
            <ArrowLeft size={20} />
            Back to Properties
          </Link>
          <h1 className="text-3xl font-bold text-[#002b5b]">Add New Property</h1>
          <p className="text-gray-600 mt-1">Fill in the details to add a new property listing</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-bold text-[#002b5b] mb-4">Basic Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Listing Type *
                  </label>
                  <select
                    value={listingType}
                    onChange={(e) => {
                      setListingType(e.target.value);
                      setPropertyType('');
                      setCategory('');
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                  >
                    <option value="BUY">For Buy</option>
                    <option value="RENT">For Rent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Property Type *
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => {
                      setPropertyType(e.target.value);
                      setCategory('');
                    }}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                  >
                    <option value="">Select Type</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {categories.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat: string) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                    placeholder="Enter price"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Property Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                  placeholder="e.g., Luxury 3BHK Apartment in Prime Location"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                  placeholder="Describe the property in detail..."
                />
              </div>
            </div>

            {/* Location Details */}
            <div>
              <h2 className="text-xl font-bold text-[#002b5b] mb-4">Location Details</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location/Area *
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                    placeholder="e.g., Sector 15, Dwarka"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                    placeholder="e.g., Delhi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                    placeholder="e.g., Delhi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                    placeholder="e.g., 110075"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                  placeholder="Enter complete address..."
                />
              </div>
            </div>

            {/* Property Specifications */}
            <div>
              <h2 className="text-xl font-bold text-[#002b5b] mb-4">Property Specifications</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {showBedBath && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Bedrooms
                      </label>
                      <input
                        type="number"
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Bathrooms
                      </label>
                      <input
                        type="number"
                        value={bathrooms}
                        onChange={(e) => setBathrooms(e.target.value)}
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                        placeholder="0"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Square Feet
                  </label>
                  <input
                    type="number"
                    value={squareFeet}
                    onChange={(e) => setSquareFeet(e.target.value)}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Furnished Type *
                  </label>
                  <select
                    value={furnishedType}
                    onChange={(e) => setFurnishedType(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                  >
                    {FURNISHED_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Construction Status *
                  </label>
                  <select
                    value={constructionStatus}
                    onChange={(e) => setConstructionStatus(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                  >
                    {CONSTRUCTION_STATUS.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {showPreferredTenant && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Tenant
                    </label>
                    <select
                      value={preferredTenant}
                      onChange={(e) => setPreferredTenant(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                    >
                      {PREFERRED_TENANTS.map(tenant => (
                        <option key={tenant} value={tenant}>{tenant}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Features & Amenities */}
            <div>
              <h2 className="text-xl font-bold text-[#002b5b] mb-4">Features & Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {FEATURES_OPTIONS.map(feature => (
                  <label key={feature} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      className="w-5 h-5 text-[#f97316] focus:ring-[#f97316] rounded"
                    />
                    <span className="text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Images */}
            <div>
              <h2 className="text-xl font-bold text-[#002b5b] mb-4">Property Images</h2>
              
              {/* Thumbnail Image */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Thumbnail Image *
                </label>
                <div className="space-y-3">
                  <input
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                    placeholder="https://example.com/image.jpg or upload file"
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">OR</span>
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleThumbnailUpload(e)}
                        className="hidden"
                      />
                      <div className="px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#f97316] transition text-center">
                        <Upload className="inline-block mr-2" size={18} />
                        <span className="text-sm font-semibold text-gray-700">Upload Thumbnail Image</span>
                      </div>
                    </label>
                  </div>
                  {thumbnailUploading && (
                    <p className="text-sm text-[#f97316]">Uploading thumbnail...</p>
                  )}
                  {thumbnailUrl && (
                    <div className="relative">
                      <img src={thumbnailUrl} alt="Thumbnail preview" className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">Main image for property card (Max 10MB)</p>
              </div>

              {/* Additional Images */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Images
                </label>
                <div className="space-y-3">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => updateImageUrl(index, e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                          placeholder="https://example.com/image.jpg or upload file"
                        />
                        {imageUrls.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImageUrl(index)}
                            className="px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <label className="block cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, index)}
                          className="hidden"
                        />
                        <div className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#f97316] transition text-center">
                          <Upload className="inline-block mr-2" size={16} />
                          <span className="text-sm text-gray-600">Upload Image {index + 1}</span>
                        </div>
                      </label>
                      {uploadingIndex === index && (
                        <p className="text-sm text-[#f97316]">Uploading image {index + 1}...</p>
                      )}
                      {url && (
                        <img src={url} alt={`Preview ${index + 1}`} className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200" />
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="mt-3 px-4 py-2 border border-[#f97316] text-[#f97316] rounded-lg hover:bg-orange-50 flex items-center gap-2"
                >
                  <Upload size={18} />
                  Add Another Image
                </button>
                <p className="text-sm text-gray-500 mt-2">You can use URLs or upload files (Max 10MB each)</p>
              </div>
            </div>

            {/* Status */}
            <div>
              <h2 className="text-xl font-bold text-[#002b5b] mb-4">Property Status</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-5 h-5 text-[#f97316] focus:ring-[#f97316] rounded"
                    />
                    <span className="text-gray-700 font-semibold">Mark as Featured Property</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/admin/properties')}
                className="px-8 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#f97316] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#ea580c] transition disabled:opacity-50"
              >
                {submitting ? 'Creating Property...' : 'Create Property'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}