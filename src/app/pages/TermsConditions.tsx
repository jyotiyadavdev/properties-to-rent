import Header from '../components/Header';
import Footer from '../components/Footer';
import { FileText, AlertCircle } from 'lucide-react';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-r from-[#002b5b] to-[#004080] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
              <FileText className="text-[#f97316]" size={40} />
            </div>
            <h1 className="text-5xl font-bold mb-6">Terms & Conditions</h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Please read these terms and conditions carefully before using our services.
            </p>
            <p className="text-sm text-gray-300 mt-4">Last Updated: February 11, 2026</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 md:p-12">
            {/* Important Notice */}
            <div className="bg-orange-50 border-l-4 border-[#f97316] p-6 mb-8 rounded">
              <div className="flex gap-3">
                <AlertCircle className="text-[#f97316] flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-[#002b5b] mb-2">Important Notice</h3>
                  <p className="text-gray-700">
                    By accessing and using the HomeVerse platform, you accept and agree to be bound by 
                    the terms and provisions of this agreement. If you do not agree to these terms, 
                    please do not use our services.
                  </p>
                </div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              {/* Section 1 */}
              <h2 className="text-2xl font-bold text-[#002b5b] mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms and Conditions ("Terms") govern your use of the HomeVerse website and services 
                (collectively, the "Service"). By accessing or using our Service, you agree to be bound by 
                these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                We reserve the right to update, change, or replace any part of these Terms by posting updates 
                and/or changes to our website. It is your responsibility to check this page periodically for 
                changes. Your continued use of or access to the Service following the posting of any changes 
                constitutes acceptance of those changes.
              </p>

              {/* Section 2 */}
              <h2 className="text-2xl font-bold text-[#002b5b] mt-8 mb-4">2. Use of Service</h2>
              <h3 className="text-xl font-semibold text-[#002b5b] mt-6 mb-3">2.1 Eligibility</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You must be at least 18 years of age to use this Service. By using this Service, you represent 
                and warrant that you are at least 18 years old and have the legal capacity to enter into this 
                agreement.
              </p>
              
              <h3 className="text-xl font-semibold text-[#002b5b] mt-6 mb-3">2.2 Account Responsibilities</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you create an account with us, you are responsible for maintaining the security of your 
                account and are fully responsible for all activities that occur under the account. You must 
                immediately notify us of any unauthorized uses of your account or any other breaches of security.
              </p>
              
              <h3 className="text-xl font-semibold text-[#002b5b] mt-6 mb-3">2.3 Prohibited Uses</h3>
              <p className="text-gray-700 leading-relaxed mb-2">You agree not to use the Service:</p>
              <ul className="list-disc pl-6 text-gray-700 leading-relaxed mb-6 space-y-2">
                <li>For any unlawful purpose or to solicit others to perform or participate in any unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
                <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                <li>For any obscene or immoral purpose</li>
              </ul>

              {/* Section 3 */}
              <h2 className="text-2xl font-bold text-[#002b5b] mt-8 mb-4">3. Property Listings</h2>
              <h3 className="text-xl font-semibold text-[#002b5b] mt-6 mb-3">3.1 Accuracy of Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                While we strive to ensure the accuracy of property listings, HomeVerse does not guarantee the 
                accuracy, completeness, or reliability of any property information. Users are responsible for 
                verifying all information independently before making any decisions.
              </p>
              
              <h3 className="text-xl font-semibold text-[#002b5b] mt-6 mb-3">3.2 Third-Party Content</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Property listings are provided by property owners and third parties. HomeVerse is not 
                responsible for the content, accuracy, or legality of these listings. Any transactions or 
                disputes between users and property owners are solely between those parties.
              </p>
              
              <h3 className="text-xl font-semibold text-[#002b5b] mt-6 mb-3">3.3 Verification</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                We make reasonable efforts to verify property listings, but we cannot guarantee the authenticity 
                of all information. Users should conduct their own due diligence, including property visits, 
                document verification, and legal consultation before entering into any agreement.
              </p>

              {/* Section 4 */}
              <h2 className="text-2xl font-bold text-[#002b5b] mt-8 mb-4">4. User Responsibilities</h2>
              <p className="text-gray-700 leading-relaxed mb-2">As a user of HomeVerse, you agree to:</p>
              <ul className="list-disc pl-6 text-gray-700 leading-relaxed mb-6 space-y-2">
                <li>Provide accurate and complete information when submitting inquiries or registering</li>
                <li>Conduct yourself professionally when interacting with property owners and other users</li>
                <li>Respect the intellectual property rights of HomeVerse and third parties</li>
                <li>Not misuse or attempt to gain unauthorized access to our systems or user accounts</li>
                <li>Comply with all applicable laws and regulations in your use of the Service</li>
                <li>Be responsible for your own property transactions and agreements</li>
              </ul>

              {/* Section 5 */}
              <h2 className="text-2xl font-bold text-[#002b5b] mt-8 mb-4">5. Privacy and Data Protection</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy, 
                which also governs the Service and informs users of our data collection practices. By using the 
                Service, you consent to the collection and use of your information as described in the Privacy Policy.
              </p>

              {/* Section 6 */}
              <h2 className="text-2xl font-bold text-[#002b5b] mt-8 mb-4">6. Intellectual Property Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Service and its original content, features, and functionality are and will remain the 
                exclusive property of HomeVerse and its licensors. The Service is protected by copyright, 
                trademark, and other laws. Our trademarks and trade dress may not be used in connection with 
                any product or service without our prior written consent.
              </p>

              {/* Section 7 */}
              <h2 className="text-2xl font-bold text-[#002b5b] mt-8 mb-4">7. Disclaimer of Warranties</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT ANY WARRANTIES OF ANY 
                KIND, WHETHER EXPRESS OR IMPLIED. HomeVerse DOES NOT WARRANT THAT THE SERVICE WILL BE 
                UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                We do not guarantee the accuracy, completeness, or usefulness of any information on the Service, 
                nor do we adopt, endorse, or accept responsibility for the accuracy or reliability of any 
                opinion, advice, or statement made by any party.
              </p>

              {/* Section 8 */}
              <h2 className="text-2xl font-bold text-[#002b5b] mt-8 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, HomeVerse SHALL NOT BE LIABLE FOR ANY 
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR 
                REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR 
                OTHER INTANGIBLE LOSSES RESULTING FROM:
              </p>
              <ul className="list-disc pl-6 text-gray-700 leading-relaxed mb-6 space-y-2">
                <li>Your access to or use of or inability to access or use the Service</li>
                <li>Any conduct or content of any third party on the Service</li>
                <li>Any content obtained from the Service</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              </ul>

              {/* Section 9 */}
              <h2 className="text-2xl font-bold text-[#002b5b] mt-8 mb-4">9. Indemnification</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                You agree to defend, indemnify, and hold harmless HomeVerse and its affiliates, licensors, and 
                service providers from and against any claims, liabilities, damages, judgments, awards, losses, 
                costs, expenses, or fees arising out of or relating to your violation of these Terms or your 
                use of the Service.
              </p>

              {/* Section 10 */}
              <h2 className="text-2xl font-bold text-[#002b5b] mt-8 mb-4">10. Termination</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may terminate or suspend your account and bar access to the Service immediately, without 
                prior notice or liability, under our sole discretion, for any reason whatsoever, including 
                without limitation if you breach the Terms.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Upon termination, your right to use the Service will immediately cease. If you wish to terminate 
                your account, you may simply discontinue using the Service and contact us to delete your account.
              </p>

              {/* Section 11 */}
              <h2 className="text-2xl font-bold text-[#002b5b] mt-8 mb-4">11. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                These Terms shall be governed by and construed in accordance with the laws of India, without 
                regard to its conflict of law provisions. Any disputes arising from these Terms or your use of 
                the Service shall be subject to the exclusive jurisdiction of the courts located in the 
                appropriate jurisdiction.
              </p>

              {/* Section 12 */}
              <h2 className="text-2xl font-bold text-[#002b5b] mt-8 mb-4">12. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                We reserve the right to modify or replace these Terms at any time at our sole discretion. 
                If a revision is material, we will provide at least 30 days' notice prior to any new terms 
                taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>

              {/* Section 13 */}
              <h2 className="text-2xl font-bold text-[#002b5b] mt-8 mb-4">13. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="list-none text-gray-700 leading-relaxed mb-6 space-y-2">
                <li><strong>Email:</strong> legal@homeverse.com</li>
                <li><strong>Phone:</strong> +91 1234567890</li>
                <li><strong>Address:</strong> 15/A, Nest Tower, NYC</li>
              </ul>

              {/* Acceptance */}
              <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg mt-8">
                <p className="text-gray-700 leading-relaxed">
                  <strong className="text-[#002b5b]">By using HomeVerse, you acknowledge that you have read, 
                  understood, and agree to be bound by these Terms and Conditions.</strong>
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
