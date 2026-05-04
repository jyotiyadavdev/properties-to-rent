import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Home,
  ArrowLeft,
  Check,
  Car,
  Dumbbell,
  Waves,
  Trees,
  Building2,
  Shield,
  Zap,
  Droplets,
  Wifi,
  Wind,
  FlameKindling,
  Users,
  Lightbulb,
  ShoppingCart,
  GraduationCap,
  Utensils,
  Bed as BedIcon,
  Armchair,
  Tv,
  WashingMachine,
  Refrigerator
} from 'lucide-react';

// Static Property Data
const STATIC_PROPERTY_DATA: any = {
  'prop1': {
    id: 'prop1',
    title: 'Luxury 3BHK Apartment in South Delhi',
    description: 'Experience luxury living in this stunning 3BHK apartment located in the heart of Greater Kailash. This spacious property features modern amenities, beautiful interiors, and a prime location with easy access to shopping centers, schools, and metro stations.',
    listingType: 'BUY',
    propertyType: 'Flat/Apartment',
    category: '3BHK',
    price: 25000000,
    location: 'Greater Kailash, Delhi',
    address: 'Greater Kailash',
    city: 'Delhi',
    bedrooms: 3,
    bathrooms: 3,
    area: 1850,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
    ],
    furnishedType: 'Fully Furnished',
    constructionStatus: 'Ready to move',
    amenities: ['Parking', 'Gym', 'Swimming Pool', 'Garden', 'Club House', '24x7 Security', 'Power Backup', 'Lift', 'Water Supply'],
    postedDate: '2026-01-15',
  },
  'prop2': {
    id: 'prop2',
    title: 'Modern 2BHK Fully Furnished Flat',
    description: 'Beautiful 2BHK apartment perfect for families. Features include modern kitchen, spacious bedrooms, and premium fittings throughout.',
    listingType: 'RENT',
    propertyType: 'House/Flat',
    category: '2BHK',
    price: 35000,
    location: 'Gurgaon Sector 56',
    city: 'Gurgaon',
    address: 'Sector 56',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
    ],
    furnishedType: 'Fully Furnished',
    constructionStatus: 'Ready to move',
    preferredTenant: 'Family',
    amenities: ['Power Backup', 'Gym', 'Parking', 'Lift', 'Security', 'Clubhouse'],
    postedDate: '2026-01-20',
  },
  'prop3': {
    id: 'prop3',
    title: 'Spacious 4BHK Villa with Garden',
    description: 'Luxurious villa with private garden, modern amenities, and premium location. Perfect for large families looking for space and comfort.',
    listingType: 'BUY',
    propertyType: 'Independent House/Villa',
    category: '4BHK',
    price: 45000000,
    location: 'DLF Phase 3, Gurgaon',
    city: 'Gurgaon',
    address: 'DLF Phase 3',
    bedrooms: 4,
    bathrooms: 4,
    area: 3200,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
    ],
    furnishedType: 'Semi Furnished',
    constructionStatus: 'Ready to move',
    amenities: ['Garden', 'Parking', 'Club House', 'Security', 'Power Backup', 'Water Supply'],
    postedDate: '2026-01-10',
  },
};

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhoneNumber] = useState('+91 ');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Handle phone input to keep +91 prefix
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Always keep "+91 " as prefix
    if (value.startsWith('+91 ')) {
      setPhoneNumber(value);
    } else if (value.length < 4) {
      // If user tries to delete prefix, reset to "+91 "
      setPhoneNumber('+91 ');
    }
  };

  useEffect(() => {
    if (id) {
      loadProperty();
    }
  }, [id]);

  const loadProperty = async () => {
    setLoading(true);
    try {
      const response = STATIC_PROPERTY_DATA[id!];
      setProperty(response);
    } catch (error) {
      console.error('Error loading property:', error);
      alert('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone) {
      alert('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    
    try {
      const inquiryData = {
        name,
        email,
        phone,
        message,
        propertyId: property.id,
        propertyTitle: property.title,
        propertyUrl: window.location.href,
        propertyPrice: property.price,
        propertyLocation: `${property.address || property.location}, ${property.city}`,
        propertyType: property.propertyType,
        listingType: property.listingType,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9d116660/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(inquiryData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      // Show success message
      setShowSuccessMessage(true);
      
      // Clear form
      setName('');
      setEmail('');
      setPhoneNumber('+91 ');
      setMessage('');
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get icon for amenity
  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    
    if (amenityLower.includes('parking') || amenityLower.includes('car')) return Car;
    if (amenityLower.includes('gym') || amenityLower.includes('fitness')) return Dumbbell;
    if (amenityLower.includes('swimming') || amenityLower.includes('pool')) return Waves;
    if (amenityLower.includes('garden') || amenityLower.includes('park')) return Trees;
    if (amenityLower.includes('club') || amenityLower.includes('community')) return Building2;
    if (amenityLower.includes('security') || amenityLower.includes('cctv')) return Shield;
    if (amenityLower.includes('power') || amenityLower.includes('backup') || amenityLower.includes('generator')) return Zap;
    if (amenityLower.includes('lift') || amenityLower.includes('elevator')) return ArrowLeft;
    if (amenityLower.includes('water')) return Droplets;
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return Wifi;
    if (amenityLower.includes('ac') || amenityLower.includes('air condition')) return Wind;
    if (amenityLower.includes('gas') || amenityLower.includes('pipeline')) return FlameKindling;
    if (amenityLower.includes('play') || amenityLower.includes('children')) return Users;
    if (amenityLower.includes('intercom')) return Lightbulb;
    if (amenityLower.includes('shopping') || amenityLower.includes('mall')) return ShoppingCart;
    if (amenityLower.includes('school')) return GraduationCap;
    if (amenityLower.includes('kitchen') || amenityLower.includes('modular')) return Utensils;
    if (amenityLower.includes('servant') || amenityLower.includes('maid')) return BedIcon;
    if (amenityLower.includes('furniture') || amenityLower.includes('sofa')) return Armchair;
    if (amenityLower.includes('tv') || amenityLower.includes('television')) return Tv;
    if (amenityLower.includes('washing') || amenityLower.includes('laundry')) return WashingMachine;
    if (amenityLower.includes('fridge') || amenityLower.includes('refrigerator')) return Refrigerator;
    
    return Check; // Default icon
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 pb-20 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#f97316] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 pb-20 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Property Not Found</h1>
          <Link to="/properties" className="text-[#f97316] hover:underline">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const images = property.images && property.images.length > 0 
    ? property.images 
    : [property.thumbnailImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Full Width Image Gallery */}
      <div className="pt-32">
        {/* Image Gallery - Full Width */}
        <div className="w-full bg-black">
          <div className="relative w-full" style={{ height: '70vh' }}>
            <img
              src={images[selectedImage]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            
            {/* Badge */}
            <div className={`absolute top-8 right-8 px-6 py-3 text-base font-bold text-white uppercase shadow-lg ${property.listingType === 'RENT' ? 'bg-green-500' : 'bg-orange-500'}`}>
              For {property.listingType}
            </div>

            {/* Back Button Overlay */}
            <Link
              to="/properties"
              className="absolute top-8 left-8 inline-flex items-center gap-2 bg-white text-[#002b5b] hover:bg-[#f97316] hover:text-white px-4 py-2 rounded-lg font-semibold shadow-lg transition"
            >
              <ArrowLeft size={20} />
              Back to Properties
            </Link>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="bg-white border-t border-gray-200">
              <div className="container mx-auto px-4 py-4">
                <div className="flex gap-3 overflow-x-auto">
                  {images.map((img: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-32 h-24 rounded overflow-hidden border-3 transition ${selectedImage === index ? 'border-[#f97316] ring-2 ring-[#f97316]' : 'border-gray-300 hover:border-gray-400'}`}
                    >
                      <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Section - Two Column Layout */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Property Details (2/3 width) */}
            <div className="lg:col-span-2">
              {/* Property Details */}
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-[#002b5b] mb-2">{property.title}</h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={18} className="text-[#f97316]" />
                    <span>{property.address || property.location}, {property.city}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b">
                  <div className="text-4xl font-bold text-[#f97316]">
                    {formatPrice(property.price)}
                    {property.listingType === 'RENT' && <span className="text-lg font-normal">/Month</span>}
                  </div>
                </div>

                {/* Key Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pb-8 border-b">
                  {property.bedrooms && (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Bed className="text-[#f97316]" size={28} />
                      </div>
                      <p className="font-bold text-[#002b5b]">{property.bedrooms} Bedrooms</p>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Bath className="text-[#f97316]" size={28} />
                      </div>
                      <p className="font-bold text-[#002b5b]">{property.bathrooms} Bathrooms</p>
                    </div>
                  )}
                  {property.area && (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Maximize className="text-[#f97316]" size={28} />
                      </div>
                      <p className="font-bold text-[#002b5b]">{property.area} Sq Ft</p>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Home className="text-[#f97316]" size={28} />
                    </div>
                    <p className="font-bold text-[#002b5b]">{property.propertyType}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[#002b5b] mb-4">Description</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
                </div>

                {/* Property Information */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[#002b5b] mb-4">Property Information</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-600">Property Type</span>
                      <span className="font-semibold text-[#002b5b]">{property.propertyType}</span>
                    </div>
                    {property.category && (
                      <div className="flex justify-between py-3 border-b">
                        <span className="text-gray-600">Category</span>
                        <span className="font-semibold text-[#002b5b]">{property.category}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-600">Furnished Type</span>
                      <span className="font-semibold text-[#002b5b]">{property.furnishedType}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-600">Construction Status</span>
                      <span className="font-semibold text-[#002b5b]">{property.constructionStatus}</span>
                    </div>
                    {property.preferredTenant && (
                      <div className="flex justify-between py-3 border-b">
                        <span className="text-gray-600">Preferred Tenant</span>
                        <span className="font-semibold text-[#002b5b]">{property.preferredTenant}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-600">City</span>
                      <span className="font-semibold text-[#002b5b]">{property.city}</span>
                    </div>
                  </div>
                </div>

                {/* Features & Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[#002b5b] mb-4">Features & Amenities</h2>
                    <div className="grid md:grid-cols-2 gap-3">
                      {property.amenities.map((feature: string, index: number) => {
                        const IconComponent = getAmenityIcon(feature);
                        return (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                              <IconComponent className="text-[#f97316]" size={20} />
                            </div>
                            <span className="text-gray-700 font-medium">{feature}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Location & Map */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[#002b5b] mb-4">Location</h2>
                  
                  {/* Address Display */}
                  <div className="flex items-start gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
                    <MapPin className="text-[#f97316] flex-shrink-0 mt-1" size={24} />
                    <div>
                      <p className="font-semibold text-[#002b5b] mb-1">Property Address</p>
                      <p className="text-gray-700">{property.address || property.location}, {property.city}</p>
                    </div>
                  </div>

                  {/* Google Map Embed */}
                  <div className="relative w-full h-[400px] rounded-lg overflow-hidden border-2 border-gray-200 mb-4">
                    <iframe
                      title="Property Location"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(`${property.address || property.location}, ${property.city}`)}&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    
                    {/* Open in Google Maps Button - Overlay */}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.address || property.location}, ${property.city}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-[#f97316] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#ea580c] transition shadow-lg hover:shadow-xl mx-[210px] my-[0px]"
                    >
                      <MapPin size={18} />
                      View on Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Inquiry Form (1/3 width) */}
            <div className="lg:col-span-1">
              {/* Inquiry Form Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6 sticky top-28">
                <h3 className="text-xl font-bold text-[#002b5b] mb-6">Send Inquiry</h3>
                
                {/* Success Message */}
                {showSuccessMessage && (
                  <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    <p className="font-semibold mb-1">Thank you!</p>
                    <p className="text-sm">Your inquiry has been submitted successfully. Our team will connect with you soon.</p>
                  </div>
                )}

                {/* Inquiry Form */}
                <form onSubmit={handleSubmitInquiry} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                      placeholder="Your email (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                      placeholder="XXXXXXXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent resize-none"
                      placeholder="I'm interested in this property..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#f97316] text-white py-3 rounded-lg font-semibold hover:bg-[#ea580c] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit Query'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}