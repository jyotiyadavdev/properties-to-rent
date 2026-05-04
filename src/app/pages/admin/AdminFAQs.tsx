import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminFAQs() {
  // Static FAQs data
  const staticFaqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I list my property on ROM?',
      answer: 'You can list your property by contacting us through the contact form or by calling our customer support. Our team will guide you through the entire process.',
      order: 1,
      createdAt: '2026-02-01T10:00:00Z',
      updatedAt: '2026-02-01T10:00:00Z'
    },
    {
      id: '2',
      question: 'What documents are required for renting a property?',
      answer: 'Typically, you need: \n- Valid ID proof (Aadhaar/PAN/Passport)\n- Address proof\n- Recent passport-size photographs\n- Income proof (salary slips/bank statements)\n- Previous rental agreement (if any)',
      order: 2,
      createdAt: '2026-02-01T10:05:00Z',
      updatedAt: '2026-02-01T10:05:00Z'
    },
    {
      id: '3',
      question: 'Is there any brokerage fee?',
      answer: 'Yes, we charge a nominal brokerage fee which varies based on the property type and value. Contact us for specific details.',
      order: 3,
      createdAt: '2026-02-01T10:10:00Z',
      updatedAt: '2026-02-01T10:10:00Z'
    },
    {
      id: '4',
      question: 'Can I schedule a property visit?',
      answer: 'Absolutely! You can schedule a property visit by submitting an inquiry through the property details page or by calling us directly.',
      order: 4,
      createdAt: '2026-02-01T10:15:00Z',
      updatedAt: '2026-02-01T10:15:00Z'
    },
    {
      id: '5',
      question: 'What is the refund policy for security deposits?',
      answer: 'Security deposits are refundable at the end of the lease period, subject to property inspection. Any damages will be deducted from the deposit.',
      order: 5,
      createdAt: '2026-02-01T10:20:00Z',
      updatedAt: '2026-02-01T10:20:00Z'
    }
  ];

  const [faqs, setFaqs] = useState<FAQ[]>(staticFaqs);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({ question: '', answer: '', order: 0 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert(editingFaq ? 'FAQ updated successfully!' : 'FAQ created successfully!');
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    alert('FAQ deleted successfully!');
  };

  const handleOpenModal = (faq?: FAQ) => {
    if (faq) {
      setEditingFaq(faq);
      setFormData({ question: faq.question, answer: faq.answer, order: faq.order });
    } else {
      setEditingFaq(null);
      setFormData({ question: '', answer: '', order: faqs.length + 1 });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFaq(null);
    setFormData({ question: '', answer: '', order: 0 });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">FAQ Management</h1>
            <p className="text-gray-600 mt-1">Manage frequently asked questions</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-[#002b5b] text-white px-6 py-3 rounded-lg hover:bg-[#003d7a] transition"
          >
            <Plus size={20} />
            Add FAQ
          </button>
        </div>

        {/* FAQs List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#002b5b]"></div>
            <p className="mt-2 text-gray-600">Loading FAQs...</p>
          </div>
        ) : faqs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No FAQs found. Add your first FAQ!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={faq.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <span className="bg-[#002b5b] text-white px-3 py-1 rounded-full text-sm font-semibold">
                        #{faq.order}
                      </span>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {faq.question}
                        </h3>
                        <p className="text-gray-700 whitespace-pre-line">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleOpenModal(faq)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Question *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002b5b] focus:border-transparent"
                    placeholder="Enter question"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Answer *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002b5b] focus:border-transparent"
                    placeholder="Enter answer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Display Order *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002b5b] focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">Lower numbers appear first</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#002b5b] text-white px-6 py-3 rounded-lg hover:bg-[#003d7a] transition"
                  >
                    <Save size={20} />
                    {editingFaq ? 'Update FAQ' : 'Create FAQ'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}