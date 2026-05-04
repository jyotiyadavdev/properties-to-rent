import Header from '../components/Header';
import Footer from '../components/Footer';
import { Shield, Lock, Eye, UserCheck, Bell, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
  const highlights = [
    {
      icon: Lock,
      title: 'Data Security',
      description: 'Your personal information is encrypted and securely stored.',
    },
    {
      icon: Eye,
      title: 'Transparency',
      description: 'We are clear about what data we collect and how we use it.',
    },
    {
      icon: UserCheck,
      title: 'Your Control',
      description: 'You have full control over your personal information.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-r from-[#002b5b] to-[#004080] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
              <Shield className="text-[#f97316]" size={40} />
            </div>
            <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-gray-300 mt-4">Last Updated: February 11, 2026</p>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {highlights.map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                  <item.icon className="text-[#f97316]" size={28} />
                </div>
                <h3 className="text-xl font-bold text-[#002b5b] mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <h2 className="text-2xl font-bold text-[#002b5b] mt-8 mb-4">Introduction</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                HomeVerse ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy 
                explains how we collect, use, disclose, and safeguard your information when you visit our 
                website and use our services. Please read this privacy policy carefully. If you do not agree 
                with the terms of this privacy policy, please do not access the site.
              </p>

              {/* Section 1 */}
              <h2 className="text-2xl font-bold text-[#002b5b] mt-8 mb-4">1. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-[#002b5b] mt-6 mb-3">1.1 Personal Information</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc pl-6 text-gray-700 leading-relaxed mb-4 space-y-2">
                <li>Submit property inquiries through our contact forms</li>
                <li>Register for an account on our platform</li>
                <li>Subscribe to our newsletter or marketing communications</li>
                <li>Participate in surveys or promotions</li>
                <li>Contact our customer support team</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                Personal information may include: name, email address, phone number, mailing address, and any 
                other information you choose to provide.
              </p>
              
              <h3 className="text-xl font-semibold text-[#002b5b] mt-6 mb-3">1.2 Automatically Collected Information</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                When you visit our website, we automatically collect certain information about your device, 
                including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 leading-relaxed mb-4 space-y-2">
                <li>IP address and browser type</li>
                <li>Operating system and device information</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website addresses</li>
                <li>Clickstream data and interaction patterns</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-[#002b5b] mt-6 mb-3">1.3 Cookies and Tracking Technologies</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                We use cookies, web beacons, and similar tracking technologies to enhance your experience, 
                analyze usage patterns, and deliver personalized content. You can control cookie preferences 
                through your browser settings, but disabling cookies may limit certain features of our service.
              </p>

              {/* Section 2 */}
              <h2 className="text-2xl font-bold text-[#002b5b] mt-8 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 leading-relaxed mb-6 space-y-2">
                <li>Processing and responding to your property inquiries and requests</li>
                <li>Creating and managing your user account</li>
                <li>Providing customer support and responding to your questions</li>
                <li>Sending you updates, newsletters, and marketing communications (with your consent)</li>
                <li>Improving our website functionality and user experience</li>
                <li>Analyzing usage patterns and conducting market research</li>
                <li>Detecting and preventing fraud, security threats, and technical issues</li>
                <li>Complying with legal obligations and enforcing our terms</li>
                <li>Connecting you with property owners and facilitating transactions</li>
              </ul>

              {/* Section 3 */}
              <h2 className="text-2xl font-bold text-[#002b5b] mt-8 mb-4">3. How We Share Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                We may share your information in the following circumstances:
              </p>
              
              <h3 className="text-xl font-semibold text-[#002b5b] mt-6 mb-3">3.1 With Property Owners</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                When you submit an inquiry about a property, we share your contact information (name and phone 
                number) with the property owner so they can respond to your inquiry directly.
              </p>
              
              <h3 className="text-xl font-semibold text-[#002b5b] mt-6 mb-3">3.2 With Service Providers</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may share your information with third-party service providers who perform services on our 
                behalf, such as hosting, data analysis, email delivery, and customer service. These providers 
                are contractually obligated to protect your information and use it only for authorized purposes.
              </p>
              
              <h3 className="text-xl font-semibold text-[#002b5b] mt-6 mb-3">3.3 For Legal Reasons</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may disclose your information if required by law, court order, or governmental request, or 
                if we believe disclosure is necessary to protect our rights, property, or safety, or that of 
                others.
              </p>
              
              <h3 className="text-xl font-semibold text-[#002b5b] mt-6 mb-3">3.4 Business Transfers</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred 
                to the acquiring entity. We will notify you of any such change and the choices you may have 
                regarding your information.
              </p>

              {/* Section 4 */}
              <h2 className="text-2xl font-bold text-[#002b5b] mt-8 mb-4">4. Data Security</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement appropriate technical and organizational security measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. These measures 
                include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 leading-relaxed mb-4 space-y-2">
                <li>Encryption of sensitive data during transmission and storage</li>
                <li>Regular security assessments and vulnerability testing</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Employee training on data protection and privacy</li>
                <li>Secure backup and disaster recovery procedures</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-6">
                However, please note that no method of transmission over the Internet or electronic storage is 
                100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>

              {/* Section 5 */}
              <h2 className="text-2xl font-bold text-[#002b5b] mt-8 mb-4">5. Your Privacy Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 leading-relaxed mb-4 space-y-2">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Objection:</strong> Object to processing of your personal information</li>
                <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for marketing communications at any time</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-6">
                To exercise these rights, please contact us using the information provided at the end of this 
                policy. We will respond to your request within a reasonable timeframe as required by applicable law.
              </p>

              {/* Section 6 */}
              <h2 className="text-2xl font-bold text-[#002b5b] mt-8 mb-4">6. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                We retain your personal information for as long as necessary to fulfill the purposes outlined 
                in this Privacy Policy, unless a longer retention period is required or permitted by law. When 
                we no longer need your information, we will securely delete or anonymize it.
              </p>

              {/* Section 7 */}
              <h2 className="text-2xl font-bold text-[#002b5b] mt-8 mb-4">7. Third-Party Links</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Our website may contain links to third-party websites and services. We are not responsible for 
                the privacy practices or content of these third parties. We encourage you to review the privacy 
                policies of any third-party sites you visit.
              </p>

              {/* Section 8 */}
              <h2 className="text-2xl font-bold text-[#002b5b] mt-8 mb-4">8. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Our services are not directed to children under the age of 18. We do not knowingly collect 
                personal information from children. If you believe we have collected information from a child, 
                please contact us immediately, and we will take steps to delete such information.
              </p>

              {/* Section 9 */}
              <h2 className="text-2xl font-bold text-[#002b5b] mt-8 mb-4">9. International Data Transfers</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Your information may be transferred to and processed in countries other than your country of 
                residence. These countries may have data protection laws that differ from your jurisdiction. 
                By using our services, you consent to the transfer of your information to these countries.
              </p>

              {/* Section 10 */}
              <h2 className="text-2xl font-bold text-[#002b5b] mt-8 mb-4">10. Marketing Communications</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                With your consent, we may send you promotional emails about new properties, special offers, 
                and other updates. You can opt out of marketing communications at any time by clicking the 
                "unsubscribe" link in our emails or contacting us directly. Please note that you may still 
                receive transactional emails related to your inquiries or account.
              </p>

              {/* Section 11 */}
              <h2 className="text-2xl font-bold text-[#002b5b] mt-8 mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                We may update this Privacy Policy from time to time to reflect changes in our practices or 
                applicable laws. We will notify you of any material changes by posting the updated policy on 
                our website and updating the "Last Updated" date. We encourage you to review this policy 
                periodically to stay informed about how we protect your information.
              </p>

              {/* Section 12 */}
              <h2 className="text-2xl font-bold text-[#002b5b] mt-8 mb-4">12. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data 
                practices, please contact us:
              </p>
              <ul className="list-none text-gray-700 leading-relaxed mb-6 space-y-2">
                <li><strong>Email:</strong> privacy@homeverse.com</li>
                <li><strong>Phone:</strong> +91 1234567890</li>
                <li><strong>Address:</strong> 15/A, Nest Tower, NYC</li>
              </ul>

              {/* Consent */}
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mt-8">
                <p className="text-gray-700 leading-relaxed">
                  <strong className="text-[#002b5b]">By using HomeVerse, you acknowledge that you have read 
                  and understood this Privacy Policy and consent to the collection, use, and disclosure of 
                  your information as described herein.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
