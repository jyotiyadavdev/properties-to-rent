import { Link } from 'react-router';
import { Home, Menu, Phone, Mail, MapPin, Facebook, Twitter, Instagram, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Scroll down detection
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsScrolled(true);
      } 
      // Scroll up detection
      else if (currentScrollY < lastScrollY) {
        setIsScrolled(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md overflow-hidden transition-all duration-300">
      {/* Header Top */}
      <div 
        className={`bg-[#002b5b] text-white transition-all duration-300 overflow-hidden ${
          isScrolled ? 'max-h-0 py-0' : 'max-h-20 py-3'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <a href="mailto:rentalsonmarket50@gmail.com" className="flex items-center gap-2 hover:text-[#f97316]">
                <Mail size={16} />
                <span>rentalsonmarket50@gmail.com</span>
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-[#f97316]">
                <MapPin size={16} />
                <span>HM50, Phase 2, Mohali, Punjab</span>
              </a>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <a href="#" className="hover:text-[#f97316]">
                  <Facebook size={16} />
                </a>
                <a href="#" className="hover:text-[#f97316]">
                  <Twitter size={16} />
                </a>
                <a href="#" className="hover:text-[#f97316]">
                  <Instagram size={16} />
                </a>
              </div>
              <Link
                to="/admin/login"
                className="bg-[#f97316] text-white px-4 py-1.5 text-sm font-semibold rounded hover:bg-[#ea580c] transition"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Header Bottom */}
      <div className="bg-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <Home className="text-[#f97316]" size={32} />
              <div className="flex flex-col">
                <span className="text-2xl font-bold">ROM</span>
                <span className="text-[10px] text-gray-500 -mt-1">Rentals On Market</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-[#5f6c7b] font-semibold hover:text-[#f97316] transition">
                Home
              </Link>
              <Link to="/properties" className="text-[#5f6c7b] font-semibold hover:text-[#f97316] transition">
                Properties
              </Link>
              <Link to="/about" className="text-[#5f6c7b] font-semibold hover:text-[#f97316] transition">
                About
              </Link>
              <Link to="/contact" className="text-[#5f6c7b] font-semibold hover:text-[#f97316] transition">
                Contact
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-[#002b5b]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t pt-4 flex flex-col gap-4">
              <Link
                to="/"
                className="text-[#5f6c7b] font-semibold hover:text-[#f97316] transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/properties"
                className="text-[#5f6c7b] font-semibold hover:text-[#f97316] transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Properties
              </Link>
              <Link
                to="/about"
                className="text-[#5f6c7b] font-semibold hover:text-[#f97316] transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-[#5f6c7b] font-semibold hover:text-[#f97316] transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}