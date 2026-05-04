import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import Lottie from 'lottie-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';
import { 
  Home as HomeIcon, 
  Building2, 
  Car, 
  Shield, 
  Dumbbell, 
  Waves,
  BookOpen,
  Bed,
  Leaf,
  Wine,
  ShieldCheck,
  Search
} from 'lucide-react';
import bannerAnimation from '../../../All_Jsons/home-page-baner.json';
import { INDIAN_CITIES } from '../data/indianCities';

// Static Featured Properties Data
const STATIC_FEATURED_PROPERTIES = [
  {
    id: 'prop1',
    title: 'Luxury 3BHK Apartment in South Delhi',
    listingType: 'BUY',
    propertyType: 'Flat/Apartment',
    price: 25000000,
    location: 'Greater Kailash, Delhi',
    bedrooms: 3,
    bathrooms: 3,
    area: 1850,
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    featured: true,
    amenities: ['Parking', 'Gym', 'Swimming Pool', 'Garden'],
  },
  {
    id: 'prop2',
    title: 'Modern 2BHK Fully Furnished Flat',
    listingType: 'RENT',
    propertyType: 'House/Flat',
    price: 35000,
    location: 'Gurgaon Sector 56',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    featured: true,
    amenities: ['Power Backup', 'Gym', 'Parking'],
  },
  {
    id: 'prop3',
    title: 'Spacious 4BHK Villa with Garden',
    listingType: 'BUY',
    propertyType: 'Independent House/Villa',
    price: 45000000,
    location: 'DLF Phase 3, Gurgaon',
    bedrooms: 4,
    bathrooms: 4,
    area: 3200,
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'],
    featured: true,
    amenities: ['Garden', 'Parking', 'Club House', 'Security'],
  },
  {
    id: 'prop4',
    title: 'Premium PG for Girls in Noida',
    listingType: 'RENT',
    propertyType: 'PG',
    price: 12000,
    location: 'Noida Sector 62',
    bedrooms: 1,
    bathrooms: 1,
    area: 150,
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'],
    featured: true,
    amenities: ['WiFi', 'Meals', 'Laundry', 'AC'],
  },
  {
    id: 'prop5',
    title: 'Commercial Office Space',
    listingType: 'RENT',
    propertyType: 'Commercial',
    price: 125000,
    location: 'Connaught Place, Delhi',
    bedrooms: 0,
    bathrooms: 2,
    area: 2500,
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
    featured: true,
    amenities: ['Parking', 'Power Backup', 'Reception', 'Cafeteria'],
  },
  {
    id: 'prop6',
    title: 'Cozy 1BHK Apartment',
    listingType: 'RENT',
    propertyType: 'House/Flat',
    price: 18000,
    location: 'Dwarka, Delhi',
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    featured: true,
    amenities: ['Parking', 'Security', 'Lift'],
  },
];

const BUY_TYPES = [
  'Flat/Apartment',
  'Independent House/Villa',
  'Independent Builder Floor',
  'Plot/Land',
  'Farmhouse',
  'Commercial',
];

const RENT_TYPES = [
  'House/Flat',
  'PG',
  'Commercial',
];

export default function Home() {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search form state
  const [listingType, setListingType] = useState('BUY');
  const [propertyType, setPropertyType] = useState('');
  const [location, setLocation] = useState('');
  
  // Autocomplete state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    // Use static data instead of API call
    setFeaturedProperties(STATIC_FEATURED_PROPERTIES);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (listingType) params.append('listingType', listingType);
    if (propertyType) params.append('propertyType', propertyType);
    if (location) params.append('location', location);
    
    navigate(`/properties?${params.toString()}`);
  };

  const propertyTypes = listingType === 'BUY' ? BUY_TYPES : RENT_TYPES;

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    if (value.length > 0) {
      const filtered = INDIAN_CITIES.filter(city => city.toLowerCase().includes(value.toLowerCase()));
      setFilteredCities(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleCityClick = (city: string) => {
    setLocation(city);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-[#002b5b] mb-6 leading-tight">
                Find Your Dream House By Us
              </h1>
              
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Discover the perfect property that suits your lifestyle. We offer the best real estate solutions for buying and renting homes across the country.
              </p>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="bg-[#f97316] p-6 rounded-2xl shadow-xl">
                {/* Buy/Rent Toggle Buttons */}
                <div className="flex gap-2 mb-5">
                  <button
                    type="button"
                    onClick={() => {
                      setListingType('BUY');
                      setPropertyType('');
                    }}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold text-base transition-all ${
                      listingType === 'BUY'
                        ? 'bg-white text-[#f97316] shadow-md'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setListingType('RENT');
                      setPropertyType('');
                    }}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold text-base transition-all ${
                      listingType === 'RENT'
                        ? 'bg-white text-[#f97316] shadow-md'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    Rent
                  </button>
                </div>

                {/* Search Fields in White Container */}
                <div className="bg-white rounded-xl p-3 flex flex-col md:flex-row gap-3 items-stretch">
                  {/* Property Type Dropdown */}
                  <div className="flex-1 relative">
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full h-full text-gray-700 font-medium bg-white focus:outline-none text-base cursor-pointer appearance-none z-10 pl-4 pr-10 py-3"
                      style={{ border: 'none', minHeight: '100%', position: 'relative' }}
                    >
                      <option value="">All Property Types</option>
                      {propertyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Divider */}
                  <div className="hidden md:block w-px bg-gray-200"></div>

                  {/* Location Input */}
                  <div className="flex-1 relative">
                    <div className="flex items-center gap-2 px-4">
                      <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input
                        type="text"
                        value={location}
                        onChange={handleLocationChange}
                        onFocus={() => location && setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        placeholder="Search by locality"
                        className="flex-1 py-3 text-gray-700 font-medium bg-transparent border-none focus:outline-none text-base placeholder:text-gray-400"
                      />
                    </div>
                    {showSuggestions && filteredCities.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                        {filteredCities.slice(0, 10).map(city => (
                          <div
                            key={city}
                            className="px-4 py-3 cursor-pointer hover:bg-orange-50 hover:text-[#f97316] transition-colors border-b border-gray-100 last:border-b-0"
                            onClick={() => handleCityClick(city)}
                          >
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="font-medium">{city}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Search Button */}
                  <button
                    type="submit"
                    className="bg-[#f97316] text-white py-3 px-6 md:px-8 rounded-lg font-semibold text-base hover:bg-[#ea580c] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <Search size={20} />
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Hero Image */}
            <div className="hidden lg:block">
              <Lottie
                animationData={bannerAnimation}
                loop
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Images */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600"
                alt="House interior"
                className="rounded-lg shadow-xl"
              />
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400"
                alt="House interior 2"
                className="absolute bottom-[-50px] right-[-50px] w-64 rounded-lg shadow-xl hidden md:block mx-[14px] my-[-10px]"
              />
            </div>

            {/* Content */}
            <div>
              <div className="inline-block bg-orange-100 text-[#f97316] px-4 py-2 rounded-full text-sm font-semibold mb-4">
                About Us
              </div>
              
              <h2 className="text-4xl font-bold text-[#002b5b] mb-6">
                The Leading Real Estate Rental Marketplace
              </h2>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                Over 39,000 people work for us in more than 70 countries all over the world. This breadth of global coverage, combined with specialist services.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <HomeIcon className="text-[#f97316]" size={24} />
                  </div>
                  <p className="text-gray-700 font-semibold pt-2">Smart Home Design</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Leaf className="text-[#f97316]" size={24} />
                  </div>
                  <p className="text-gray-700 font-semibold pt-2">Beautiful Scene Around</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Wine className="text-[#f97316]" size={24} />
                  </div>
                  <p className="text-gray-700 font-semibold pt-2">Exceptional Lifestyle</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="text-[#f97316]" size={24} />
                  </div>
                  <p className="text-gray-700 font-semibold pt-2">Complete 24/7 Security</p>
                </div>
              </div>

              <Link
                to="/properties"
                className="inline-block bg-[#f97316] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#ea580c] transition"
              >
                View All Properties
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-[#f0f9ff]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block bg-orange-100 text-[#f97316] px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Our Services
            </div>
            <h2 className="text-4xl font-bold text-[#002b5b]">Our Main Focus</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400"
                alt="Buy home"
                className="w-20 h-20 mb-6"
              />
              <h3 className="text-2xl font-bold text-[#002b5b] mb-4">Buy a Home</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Over 1 million+ homes for sale available on the website, we can match you with a house you will want to call home.
              </p>
              <Link to="/properties?listingType=BUY" className="text-[#f97316] font-semibold flex items-center gap-2 hover:gap-4 transition-all">
                Find A Home →
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <img
                src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400"
                alt="Rent home"
                className="w-20 h-20 mb-6"
              />
              <h3 className="text-2xl font-bold text-[#002b5b] mb-4">Rent a Home</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Over 1 million+ homes for rent available on the website, we can match you with a house you will want to call home.
              </p>
              <Link to="/properties?listingType=RENT" className="text-[#f97316] font-semibold flex items-center gap-2 hover:gap-4 transition-all">
                Find A Home →
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <img
                src="https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400"
                alt="Sell home"
                className="w-20 h-20 mb-6"
              />
              <h3 className="text-2xl font-bold text-[#002b5b] mb-4">Sell a Home</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Over 1 million+ homes for sale available on the website, we can match you with a house you will want to sell.
              </p>
              <a href="#contact" className="text-[#f97316] font-semibold flex items-center gap-2 hover:gap-4 transition-all">
                Contact Us →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block bg-orange-100 text-[#f97316] px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Properties
            </div>
            <h2 className="text-4xl font-bold text-[#002b5b] mb-4">Featured Listings</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-[#f97316] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {featuredProperties.map((property: any) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No featured properties available at the moment.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/properties"
              className="inline-block bg-[#f97316] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#ea580c] transition"
            >
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-20 bg-[#f0f9ff]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block bg-orange-100 text-[#f97316] px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Our Amenities
            </div>
            <h2 className="text-4xl font-bold text-[#002b5b]">Building Amenities</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Car, name: 'Parking Space' },
              { icon: Waves, name: 'Swimming Pool' },
              { icon: Shield, name: 'Private Security' },
              { icon: Dumbbell, name: 'Fitness Center' },
              { icon: BookOpen, name: 'Library Area' },
              { icon: Bed, name: 'King Size Beds' },
              { icon: HomeIcon, name: 'Smart Homes' },
              { icon: Building2, name: "Kid's Playland" },
            ].map((amenity, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl hover:bg-[#f97316] hover:text-white transition-all group text-center"
              >
                <amenity.icon className="w-12 h-12 mx-auto mb-4 text-[#f97316] group-hover:text-white" />
                <h3 className="font-semibold text-[#002b5b] group-hover:text-white">{amenity.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-[#f97316] to-[#ea580c]">
        <div className="container mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-sm p-12 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white">
              <h2 className="text-4xl font-bold mb-4">Looking for a Dream Home?</h2>
              <p className="text-xl">We can help you realize your dream of a new home</p>
            </div>
            <Link
              to="/properties"
              className="bg-white text-[#f97316] px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition flex items-center gap-2 whitespace-nowrap"
            >
              Explore Properties →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}