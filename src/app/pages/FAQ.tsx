import Header from '../components/Header';
import Footer from '../components/Footer';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9d116660/faqs`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch FAQs');
      }

      const result = await response.json();
      if (result.success && result.data) {
        // Group FAQs by category (if you add category field in database)
        // For now, show all FAQs in one section
        setFaqs(result.data);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (questionIndex: number) => {
    setOpenIndex(openIndex === questionIndex ? null : questionIndex);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-r from-[#002b5b] to-[#004080] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
              <HelpCircle className="text-[#f97316]" size={40} />
            </div>
            <h1 className="text-5xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Find answers to common questions about ROM, property listings, and our services.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#f97316]"></div>
                <p className="mt-4 text-gray-600">Loading FAQs...</p>
              </div>
            ) : faqs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <HelpCircle className="mx-auto text-gray-400 mb-4" size={64} />
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No FAQs Available</h3>
                <p className="text-gray-500">FAQs will be added soon. Please check back later.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {faqs.map((faq, questionIndex) => {
                  const isOpen = openIndex === questionIndex;

                  return (
                    <div
                      key={faq.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      <button
                        className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition"
                        onClick={() => toggleQuestion(questionIndex)}
                      >
                        <span className="font-semibold text-[#002b5b] text-lg pr-4">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`text-[#f97316] flex-shrink-0 transition-transform duration-300 ${
                            isOpen ? 'transform rotate-180' : ''
                          }`}
                          size={24}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen ? 'max-h-96' : 'max-h-0'
                        }`}
                      >
                        <div className="px-6 pb-5 pt-2 text-gray-700 leading-relaxed border-t">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#002b5b] mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our support team is here to help you.
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#f97316] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#ea580c] transition"
          >
            Contact Support
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}