import { Link } from 'react-router';
import { Bed, Bath, Maximize, MapPin, Heart, Share2 } from 'lucide-react';

interface PropertyCardProps {
  property: any;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <Link to={`/properties/${property.id}`} className="block relative aspect-[4/3] overflow-hidden group">
        <img
          src={property.thumbnailImage || property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Badge */}
        <div className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold text-white uppercase ${
          property.listingType === 'RENT' ? 'bg-green-500' : 'bg-orange-500'
        }`}>
          For {property.listingType}
        </div>

        {/* Quick Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center gap-2 text-white text-sm">
            <MapPin size={16} />
            <span className="line-clamp-1">{property.location}, {property.city}</span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        {/* Price */}
        <div className="text-[#f97316] font-bold text-xl mb-2">
          {formatPrice(property.price)}
          {property.listingType === 'RENT' && <span className="text-sm font-normal">/Month</span>}
        </div>

        {/* Title */}
        <Link to={`/properties/${property.id}`}>
          <h3 className="text-[#002b5b] font-bold text-lg mb-2 hover:text-[#f97316] transition line-clamp-1">
            {property.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {property.description}
        </p>

        {/* Features */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
          {property.bedrooms && (
            <div className="flex items-center gap-1 text-gray-700">
              <Bed size={18} />
              <span className="text-sm font-semibold">{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1 text-gray-700">
              <Bath size={18} />
              <span className="text-sm font-semibold">{property.bathrooms}</span>
            </div>
          )}
          {property.squareFeet && (
            <div className="flex items-center gap-1 text-gray-700">
              <Maximize size={18} />
              <span className="text-sm font-semibold">{property.squareFeet} Sq Ft</span>
            </div>
          )}
        </div>

        {/* Footer - Removed Agent Info and Action Buttons */}
      </div>
    </div>
  );
}