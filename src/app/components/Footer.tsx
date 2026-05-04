import { Link } from 'react-router';
import { Home, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1a1d29] text-white mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="bg-gradient-to-br from-[#f97316] to-[#ea580c] p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Home className="text-white" size={28} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">ROM</span>
                <span className="text-xs text-[#f97316] font-semibold tracking-wide">Rentals On Market</span>
              </div>
            </Link>
            
            <p className="text-gray-300 mb-6 leading-relaxed text-sm">
              Your trusted partner in finding the perfect home. We offer the best real estate solutions for buying and renting properties.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4 mb-6">
              <div className="group">
                <div className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors duration-200">
                  <div className="bg-[#002b5b] p-2 rounded-lg group-hover:bg-[#f97316] transition-colors duration-200">
                    <MapPin size={16} className="text-[#f97316] group-hover:text-white" />
                  </div>
                  <span className="text-sm leading-relaxed pt-1">HM50, First Floor, Phase 2, Mohali, Punjab</span>
                </div>
              </div>
              
              <div className="group">
                <div className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors duration-200">
                  <div className="bg-[#002b5b] p-2 rounded-lg group-hover:bg-[#f97316] transition-colors duration-200">
                    <Phone size={16} className="text-[#f97316] group-hover:text-white" />
                  </div>
                  <div className="flex flex-col text-sm pt-1">
                    <a href="tel:+919779139772" className="hover:text-[#f97316] transition">+91 9779139772</a>
                    <a href="tel:+917526856620" className="hover:text-[#f97316] transition">+91 7526856620</a>
                  </div>
                </div>
              </div>
              
              <div className="group">
                <div className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors duration-200">
                  <div className="bg-[#002b5b] p-2 rounded-lg group-hover:bg-[#f97316] transition-colors duration-200">
                    <Mail size={16} className="text-[#f97316] group-hover:text-white" />
                  </div>
                  <a href="mailto:rentalsonmarket50@gmail.com" className="text-sm pt-1 hover:text-[#f97316] transition break-all">
                    rentalsonmarket50@gmail.com
                  </a>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Follow Us</h4>
              <div className="flex items-center gap-3">
                <a href="#" className="bg-[#002b5b] p-2.5 rounded-lg text-gray-300 hover:bg-[#f97316] hover:text-white hover:scale-110 transition-all duration-200">
                  <Facebook size={18} />
                </a>
                <a href="#" className="bg-[#002b5b] p-2.5 rounded-lg text-gray-300 hover:bg-[#f97316] hover:text-white hover:scale-110 transition-all duration-200">
                  <Twitter size={18} />
                </a>
                <a href="#" className="bg-[#002b5b] p-2.5 rounded-lg text-gray-300 hover:bg-[#f97316] hover:text-white hover:scale-110 transition-all duration-200">
                  <Instagram size={18} />
                </a>
                <a href="#" className="bg-[#002b5b] p-2.5 rounded-lg text-gray-300 hover:bg-[#f97316] hover:text-white hover:scale-110 transition-all duration-200">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xl font-bold mb-6">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-[#f97316] transition">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-[#f97316] transition">
                  Contact us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-[#f97316] transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-6">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/properties?listingType=BUY" className="text-gray-400 hover:text-[#f97316] transition">
                  Buy Property
                </Link>
              </li>
              <li>
                <Link to="/properties?listingType=RENT" className="text-gray-400 hover:text-[#f97316] transition">
                  Rent Property
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-xl font-bold mb-6">Customer Care</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/terms-conditions" className="text-gray-400 hover:text-[#f97316] transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-[#f97316] transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-400 text-sm">
            &copy; 2026 <span className="text-[#f97316]">ROM - Rentals On Market</span>. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}