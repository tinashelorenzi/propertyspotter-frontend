import { Link } from 'react-router-dom';

// Save this as src/pages/TermsOfServicePage.tsx

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-tr from-[#E9EEFB] via-white to-[#225AE3]/10" />
      
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-4">
              <img 
                src="https://raw.githubusercontent.com/tinashelorenzi/propertyspotter-prod/refs/heads/main/static/images/logo.png"
                alt="PropertySpotter Logo"
                className="h-10 w-auto"
              />
              <div>
                <p className="text-xs text-gray-500">Your property, our pleasure</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/" className="btn-secondary">Back to Home</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-[#225AE3] mb-4">Terms of Service</h1>
            <p className="text-gray-600">Last Updated: June 06, 2025</p>
          </div>

          <div className="prose max-w-none">
            <div className="mb-8">
              <p className="text-gray-700 leading-relaxed">
                Welcome to Property Spotter (Pty) Ltd ("the Website"). These Terms of Service ("Terms") govern 
                your access to and use of the Website, including any content, functionality, and services offered 
                on or through the Website. By accessing or using the Website, you agree to be bound by these 
                Terms. If you do not agree with these Terms, please do not use the Website.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#225AE3] mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing or using the Website, you confirm that you are at least 18 years old or have the 
                legal capacity to enter into a binding agreement under South African law. If you are accessing 
                the Website on behalf of a company or organization, you represent that you have the authority to 
                bind such entity to these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#225AE3] mb-4">2. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify or update these Terms at any time, at our sole discretion. Any 
                changes will be effective immediately upon posting on the Website. Your continued use of the 
                Website after such changes constitutes your acceptance of the revised Terms. It is your 
                responsibility to regularly review these Terms for updates.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#225AE3] mb-4">3. Use of the Website</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Eligibility</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may only use the Website if you comply with these Terms and all applicable laws, including 
                the Consumer Protection Act, 2008 (Act No. 68 of 2008) ("CPA") and the Electronic 
                Communications and Transactions Act, 2002 (Act No. 25 of 2002) ("ECTA").
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Prohibited Activities</h3>
              <p className="text-gray-700 leading-relaxed mb-2">You agree not to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Use the Website for any unlawful or prohibited purpose.</li>
                <li>Attempt to gain unauthorized access to any portion of the Website or its systems.</li>
                <li>Engage in any activity that disrupts, damages, or interferes with the Website's functionality.</li>
                <li>Use the Website to transmit any harmful code, malware, or viruses.</li>
                <li>Violate the intellectual property rights of Property Spotter (Pty) Ltd or any third party.</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 Account Registration</h3>
              <p className="text-gray-700 leading-relaxed">
                To access certain features of the Website, you may need to create an account. You agree to 
                provide accurate, current, and complete information during registration and to keep your 
                account details updated. You are responsible for maintaining the confidentiality of your account 
                credentials and for all activities that occur under your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#225AE3] mb-4">4. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed">
                All content on the Website, including text, graphics, logos, images, and software, is the property 
                of Property Spotter (Pty) Ltd or its licensors and is protected by South African and international 
                intellectual property laws. You may not copy, reproduce, distribute, or create derivative works 
                from any content without prior written consent from Property Spotter (Pty) Ltd.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#225AE3] mb-4">5. Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Your use of the Website is subject to our Privacy Policy, which complies with the Protection of 
                Personal Information Act, 2013 (Act No. 4 of 2013) ("POPIA"). Please review our Privacy Policy to 
                understand how we collect, use, and protect your personal information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#225AE3] mb-4">6. User Content</h2>
              <p className="text-gray-700 leading-relaxed">
                If you post, upload, or submit content to the Website ("User Content"), you grant Property 
                Spotter (Pty) Ltd a non-exclusive, royalty-free, worldwide license to use, reproduce, modify, and 
                display such content in connection with the operation of the Website. You represent and 
                warrant that you own or have the necessary rights to your User Content and that it does not 
                violate any laws or third-party rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#225AE3] mb-4">7. Third-Party Links and Services</h2>
              <p className="text-gray-700 leading-relaxed">
                The Website may contain links to third-party websites or services that are not owned or 
                controlled by Property Spotter (Pty) Ltd. We are not responsible for the content, privacy 
                policies, or practices of any third-party websites or services. You access such third-party 
                services at your own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#225AE3] mb-4">8. Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                We may terminate or suspend your access to the Website at our sole discretion, without notice, 
                for any reason, including if we believe you have violated these Terms. Upon termination, your 
                right to use the Website will cease immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#225AE3] mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                To the fullest extent permitted by South African law, Property Spotter (Pty) Ltd shall not be liable 
                for any direct, indirect, incidental, consequential, or special damages arising out of or in 
                connection with your use of the Website, including but not limited to damages for loss of profits, 
                data, or other intangible losses.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#225AE3] mb-4">10. Indemnity</h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify and hold harmless Property Spotter (Pty) Ltd, its affiliates, officers, 
                directors, employees, and agents from any claims, liabilities, damages, or expenses (including 
                legal fees) arising from your use of the Website, your violation of these Terms, or your 
                infringement of any third-party rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#225AE3] mb-4">11. Governing Law and Jurisdiction</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms are governed by and construed in accordance with the laws of the Republic of 
                South Africa. Any disputes arising from these Terms or your use of the Website shall be subject 
                to the exclusive jurisdiction of the courts of South Africa.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#225AE3] mb-4">12. Consumer Rights under the CPA</h2>
              <p className="text-gray-700 leading-relaxed">
                If you are a consumer as defined under the Consumer Protection Act, 2008, your rights under 
                the CPA are not affected by these Terms. You may have additional rights, including the right to 
                safe, good-quality goods and services, and the right to cancel certain transactions within a 
                cooling-off period as provided under Section 16 of the CPA.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#225AE3] mb-4">13. Electronic Communications</h2>
              <p className="text-gray-700 leading-relaxed">
                By using the Website, you consent to receiving electronic communications from Property 
                Spotter (Pty) Ltd in accordance with the Electronic Communications and Transactions Act, 
                2002. You agree that any agreements, notices, or other communications sent electronically 
                satisfy any legal requirement that such communications be in writing.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#225AE3] mb-4">14. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions or concerns about these Terms, please contact us at:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700"><strong>Email:</strong> info@propertyspotter.co.za</p>
                <p className="text-gray-700"><strong>Physical Address:</strong> Klerksdorp, North West, 2571, South Africa</p>
                <p className="text-gray-700"><strong>Phone:</strong> 018 065 0047</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#225AE3] mb-4">15. Entire Agreement</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms, together with the Privacy Policy, constitute the entire agreement between you and 
                Property Spotter (Pty) Ltd regarding your use of the Website and supersede any prior 
                agreements or understandings.
              </p>
            </section>
          </div>

          {/* Back to Home Button */}
          <div className="text-center mt-12">
            <Link to="/" className="btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 mt-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">&copy; 2025 PropertySpotter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfServicePage;