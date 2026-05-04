import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Save, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPrivacy() {
  const [content, setContent] = useState(`Last updated: February 11, 2026

ROM (Rentals On Market) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.

1. INFORMATION WE COLLECT

1.1 Personal Information
We may collect personal information that you voluntarily provide to us, including:
- Name, email address, and phone number
- Property preferences and search history
- Account credentials
- Payment information (processed securely through third-party providers)
- Communication preferences

1.2 Automatically Collected Information
When you visit our website, we automatically collect:
- IP address and device information
- Browser type and operating system
- Pages visited and time spent on each page
- Referral source and clickstream data
- Cookies and similar tracking technologies

2. HOW WE USE YOUR INFORMATION

We use the collected information for the following purposes:
- To provide and maintain our services
- To process property listings and inquiries
- To communicate with you about properties, updates, and offers
- To improve our website and user experience
- To prevent fraud and enhance security
- To comply with legal obligations
- To send marketing communications (with your consent)

3. INFORMATION SHARING AND DISCLOSURE

We may share your information with:
- Property owners and agents for inquiry purposes
- Service providers and business partners who assist in our operations
- Legal authorities when required by law
- Other users (only information you choose to make public)

We do not sell your personal information to third parties.

4. COOKIES AND TRACKING TECHNOLOGIES

We use cookies and similar technologies to:
- Remember your preferences and settings
- Analyze website traffic and usage patterns
- Provide personalized content and advertisements
- Improve website functionality

You can control cookies through your browser settings, but disabling them may affect website functionality.

5. DATA SECURITY

We implement appropriate technical and organizational security measures to protect your information, including:
- Encryption of sensitive data
- Secure server infrastructure
- Regular security audits
- Access controls and authentication

However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.

6. YOUR RIGHTS AND CHOICES

You have the right to:
- Access and review your personal information
- Update or correct inaccurate information
- Delete your account and personal data
- Opt-out of marketing communications
- Withdraw consent for data processing
- Request data portability

To exercise these rights, contact us at rentalsonmarket50@gmail.com

7. DATA RETENTION

We retain your personal information for as long as necessary to:
- Provide our services
- Comply with legal obligations
- Resolve disputes
- Enforce our agreements

When data is no longer needed, we securely delete or anonymize it.

8. CHILDREN'S PRIVACY

Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.

9. THIRD-PARTY LINKS

Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.

10. INTERNATIONAL DATA TRANSFERS

If you are accessing our services from outside India, your information may be transferred to and processed in India. By using our services, you consent to such transfers.

11. CHANGES TO THIS PRIVACY POLICY

We may update this Privacy Policy from time to time. We will notify you of significant changes by:
- Posting the updated policy on our website
- Sending an email notification (for registered users)
- Displaying a prominent notice on our platform

Your continued use of our services after changes constitutes acceptance of the updated policy.

12. CONTACT US

If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:

ROM (Rentals On Market)
Email: rentalsonmarket50@gmail.com
Phone: +91 9779139772, +91 7526856620
Address: HM50, First Floor, Phase 2, Mohali, Punjab

13. GDPR COMPLIANCE (For EU Users)

If you are located in the European Union, you have additional rights under GDPR:
- Right to data portability
- Right to object to processing
- Right to restrict processing
- Right to lodge a complaint with supervisory authority

14. CALIFORNIA PRIVACY RIGHTS (For CA Users)

California residents have the right to:
- Know what personal information is collected
- Know if personal information is sold or disclosed
- Opt-out of the sale of personal information
- Non-discrimination for exercising privacy rights

By using ROM, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.`);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate save operation
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Privacy Policy updated successfully!');
    }, 1000);
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#002b5b] flex items-center gap-3">
              <Shield size={32} className="text-[#f97316]" />
              Privacy Policy
            </h1>
            <p className="text-gray-600 mt-1">Manage your website's privacy policy</p>
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
              Privacy Policy Content
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Edit the content below. This will be displayed on the Privacy Policy page of your website.
            </p>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={25}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] font-mono text-sm"
            placeholder="Enter your privacy policy here..."
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
