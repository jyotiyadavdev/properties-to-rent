import Header from '../components/Header';
import Footer from '../components/Footer';
import { Building2, Users, Award, Target, Eye, Heart, CheckCircle2, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function About() {
  const [stats, setStats] = useState({
    properties: 0,
    cities: 0,
    loading: true,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9d116660/properties?limit=1000`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.pagination) {
          // Count unique cities
          const uniqueCities = new Set(result.data?.map((p: any) => p.city).filter(Boolean));
          
          setStats({
            properties: result.pagination.total || 0,
            cities: uniqueCities.size || 0,
            loading: false,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const displayStats = [
    { icon: Building2, label: 'Properties Listed', value: stats.loading ? '...' : `${stats.properties}+` },
    { icon: TrendingUp, label: 'Cities Covered', value: stats.loading ? '...' : `${stats.cities}+` },
    { icon: Users, label: 'Happy Clients', value: '1000+' },
    { icon: Award, label: 'Years Experience', value: '2+' },
  ];

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To revolutionize the real estate industry by providing transparent, efficient, and customer-centric property solutions that empower people to find their dream homes.',
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description: 'To be the most trusted and preferred real estate platform, connecting millions of buyers, sellers, and renters across the nation with seamless technology and exceptional service.',
    },
    {
      icon: Heart,
      title: 'Our Values',
      description: 'Integrity, transparency, customer satisfaction, innovation, and excellence drive everything we do. We believe in building lasting relationships based on trust and reliability.',
    },
  ];

  const features = [
    'Verified property listings with genuine information',
    'Expert guidance from experienced real estate professionals',
    'Transparent pricing with no hidden charges',
    'Wide range of properties across multiple locations',
    'Easy search and filter options for quick results',
    'Dedicated customer support available 24/7',
    'Secure and hassle-free transaction process',
    'Regular updates on market trends and insights',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-r from-[#002b5b] to-[#004080] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">About ROM</h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Your trusted partner in finding the perfect property. We connect dreams with reality, 
              making home ownership accessible and stress-free for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {displayStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                  <stat.icon className="text-[#f97316]" size={32} />
                </div>
                <div className="text-4xl font-bold text-[#002b5b] mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-orange-100 text-[#f97316] px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Our Story
              </div>
              <h2 className="text-4xl font-bold text-[#002b5b] mb-4">The Journey of ROM</h2>
            </div>
            
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p className="mb-6">
                Founded in 2009, ROM (Rentals On Market) emerged from a simple vision: to make real estate accessible, 
                transparent, and stress-free for everyone. What started as a small team of passionate real 
                estate professionals has now grown into one of the leading property platforms in the country.
              </p>
              <p className="mb-6">
                Over the past 15 years, we've helped thousands of families find their dream homes, assisted 
                investors in making smart property decisions, and supported landlords in connecting with 
                reliable tenants. Our commitment to excellence and customer satisfaction has been the 
                cornerstone of our success.
              </p>
              <p>
                Today, ROM operates across 50+ cities, listing over 5000+ verified properties ranging 
                from affordable apartments to luxury villas. We leverage cutting-edge technology combined 
                with human expertise to deliver an unmatched property search experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
                  <value.icon className="text-[#f97316]" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-[#002b5b] mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-orange-100 text-[#f97316] px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Why Choose Us
              </div>
              <h2 className="text-4xl font-bold text-[#002b5b] mb-4">What Makes Us Different</h2>
              <p className="text-gray-600 text-lg">
                We go beyond just listing properties. Here's what sets us apart:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#f97316] flex-shrink-0 mt-1" size={24} />
                  <p className="text-gray-700 font-medium">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#002b5b] to-[#004080] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Find Your Dream Home?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect property with ROM.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/properties"
              className="inline-block bg-[#f97316] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#ea580c] transition"
            >
              Browse Properties
            </a>
            <a
              href="/contact"
              className="inline-block bg-white text-[#002b5b] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}