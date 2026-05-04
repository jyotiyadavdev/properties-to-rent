import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Save, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminTerms() {
  const [content, setContent] = useState(`Last updated: February 11, 2026

Welcome to ROM (Rentals On Market). These terms and conditions outline the rules and regulations for the use of our website and services.

1. ACCEPTANCE OF TERMS
By accessing this website, you accept these terms and conditions in full. If you disagree with any part of these terms, you must not use our website.

2. PROPERTY LISTINGS
- All property listings on ROM are provided by property owners, agents, or authorized representatives.
- ROM does not guarantee the accuracy, completeness, or availability of any property listing.
- Users are responsible for verifying property details before making any transactions.

3. USER ACCOUNTS
- Users must provide accurate and complete information when creating an account.
- You are responsible for maintaining the confidentiality of your account credentials.
- You must notify us immediately of any unauthorized use of your account.

4. PROHIBITED ACTIVITIES
Users must not:
- Post false, misleading, or fraudulent property listings
- Use the platform for any illegal purposes
- Harass, abuse, or harm other users
- Attempt to gain unauthorized access to our systems
- Scrape or collect data from our website without permission

5. PROPERTY TRANSACTIONS
- All transactions between buyers, renters, and property owners are their sole responsibility.
- ROM acts as a platform to connect parties and is not involved in the actual transaction.
- Users should conduct their own due diligence before entering into any agreement.

6. INTELLECTUAL PROPERTY
- All content on ROM, including text, graphics, logos, and software, is our property or licensed to us.
- You may not reproduce, distribute, or create derivative works without our written permission.

7. LIMITATION OF LIABILITY
- ROM is provided "as is" without any warranties, express or implied.
- We are not liable for any damages arising from the use of our platform.
- We do not guarantee uninterrupted or error-free service.

8. PRIVACY
Your use of ROM is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.

9. MODIFICATIONS TO TERMS
We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the platform constitutes acceptance of the modified terms.

10. TERMINATION
We reserve the right to terminate or suspend access to our platform without prior notice for conduct that we believe violates these terms or is harmful to other users.

11. GOVERNING LAW
These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Punjab, India.

12. CONTACT INFORMATION
If you have any questions about these Terms and Conditions, please contact us:
- Email: rentalsonmarket50@gmail.com
- Phone: +91 9779139772, +91 7526856620
- Address: HM50, First Floor, Phase 2, Mohali, Punjab

By using ROM, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.`);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate save operation
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Terms & Conditions updated successfully!');
    }, 1000);
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#002b5b] flex items-center gap-3">
              <FileText size={32} className="text-[#f97316]" />
              Terms & Conditions
            </h1>
            <p className="text-gray-600 mt-1">Manage your website's terms and conditions</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#f97316] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#ea580c] transition flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={20} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Editor Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Terms & Conditions Content
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Edit the content below. This will be displayed on the Terms & Conditions page of your website.
            </p>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={25}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] font-mono text-sm"
            placeholder="Enter your terms and conditions here..."
          />

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Character count: {content.length}
            </p>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#f97316] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#ea580c] transition disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#002b5b] mb-4">Preview</h2>
          <div className="prose max-w-none text-gray-700 whitespace-pre-line">
            {content}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}