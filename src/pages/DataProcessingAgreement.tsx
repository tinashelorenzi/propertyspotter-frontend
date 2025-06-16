import { Link } from 'react-router-dom';

const DataProcessingAgreementPage = () => {
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
                <p className="text-xs text-gray-500">Your property, our treasure</p>
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
            <h1 className="text-4xl font-extrabold text-[#225AE3] mb-4">Data Processing Agreement</h1>
            <p className="text-gray-600">Effective Date: June 11, 2025</p>
          </div>

          <div className="prose max-w-none">
            <div className="mb-8">
              <p className="text-gray-700 leading-relaxed">
                This Data Processing Agreement ("DPA") is entered into between <strong>Property Spotter (Pty) Ltd</strong> ("Responsible Party"), 
                a company registered in the Republic of South Africa, with its principal place of business at Klerksdorp, North West, 2571, 
                South Africa; and <strong>Gridion Telecoms (Pty) Ltd</strong> ("Operator"), a company registered in the Republic of South Africa, 
                acting as the website host for Property Spotter (Pty) Ltd.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Collectively referred to as the "Parties" and individually as a "Party."
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#225AE3] mb-4">1. Purpose and Scope</h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>1.1</strong> This DPA forms part of the agreement between the Responsible Party and the Operator 
                  for the provision of website hosting services ("Services") for the website [Insert Website URL, e.g., (\"the Website\").
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>1.2</strong> This DPA governs the processing of personal information, as defined under the Protection 
                  of Personal Information Act, 2013 ("POPIA"), by the Operator on behalf of the Responsible Party in connection 
                  with the Services.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>1.3</strong> The Operator confirms that it does not store confidential information, as specified by 
                  the Responsible Party, but may process personal information as part of its hosting services (e.g., server logs, 
                  IP addresses, or usage data).
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#225AE3] mb-4">2. Definitions</h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>2.1 Personal Information:</strong> Information relating to an identifiable, living, natural person, 
                  or an identifiable, existing juristic person, as defined in POPIA.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>2.2 Processing:</strong> Any operation or activity, whether automated or not, concerning personal 
                  information, including collection, storage, use, dissemination, or destruction, as defined in POPIA.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>2.3 Responsible Party:</strong> Property Spotter (Pty) Ltd, which determines the purpose and means 
                  of processing personal information.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>2.4 Operator:</strong> Gridion Telecoms (Pty) Ltd, which processes personal information on behalf 
                  of the Responsible Party.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>2.5</strong> Other terms, such as "data subject" and "Information Regulator," have the meanings 
                  ascribed to them in POPIA.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#225AE3] mb-4">3. Obligations of the Operator</h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>3.1 Compliance with POPIA:</strong> The Operator shall process personal information only in accordance 
                  with this DPA, the Responsible Party's documented instructions, and POPIA, unless required otherwise by law. 
                  If the Operator is required by law to process personal information for another purpose, it shall notify the 
                  Responsible Party before such processing, unless prohibited by law.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>3.2 Purpose Limitation:</strong> The Operator shall process personal information solely to provide the 
                  Services, including hosting the Website, maintaining server logs, and ensuring Website functionality, as 
                  instructed by the Responsible Party.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>3.3 Confidentiality:</strong> The Operator shall ensure that all personnel authorized to process 
                  personal information are bound by confidentiality obligations.
                </p>
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>3.4 Security Measures:</strong> The Operator shall implement appropriate technical and organizational 
                    measures to protect personal information against unauthorized or unlawful processing, accidental loss, 
                    destruction, or damage, in accordance with POPIA. These measures include, but are not limited to:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2 ml-4">
                    <li>Encryption of data in transit, where applicable.</li>
                    <li>Access controls to limit processing to authorized personnel.</li>
                    <li>Regular security updates and maintenance of hosting infrastructure.</li>
                  </ul>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  <strong>3.5 No Storage of Confidential Information:</strong> The Operator confirms that it does not store 
                  confidential information, as specified by the Responsible Party. Any personal information processed (e.g., 
                  IP addresses or usage data in server logs) shall be handled in accordance with this DPA.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>3.6 Sub-Operators:</strong> The Operator shall not engage sub-operators to process personal information 
                  without the prior written consent of the Responsible Party. Where consent is granted, the Operator shall impose 
                  the same data protection obligations as set out in this DPA on any sub-operator.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>3.7 Data Subject Requests:</strong> The Operator shall promptly notify the Responsible Party of any 
                  requests from data subjects (e.g., for access, correction, or deletion of personal information) and shall assist 
                  the Responsible Party in responding to such requests, as required by POPIA.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>3.8 Data Breach Notification:</strong> In the event of a personal information breach, the Operator 
                  shall notify the Responsible Party without undue delay, and no later than 72 hours after becoming aware of 
                  the breach, providing sufficient details to enable the Responsible Party to comply with its obligations under 
                  POPIA, including notifying the Information Regulator and affected data subjects, if required.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#225AE3] mb-4">4. Obligations of the Responsible Party</h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>4.1</strong> The Responsible Party shall ensure that it has a lawful basis for processing personal 
                  information under POPIA, including obtaining necessary consents from data subjects where required.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>4.2</strong> The Responsible Party shall provide the Operator with clear and lawful instructions for 
                  the processing of personal information.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>4.3</strong> The Responsible Party shall respond to data subject requests and comply with its obligations 
                  as a Responsible Party under POPIA.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#225AE3] mb-4">5. Data Retention and Deletion</h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>5.1</strong> The Operator shall retain personal information only for as long as necessary to provide 
                  the Services or as instructed by the Responsible Party, unless otherwise required by law.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>5.2</strong> Upon termination of the Services or at the Responsible Party's request, the Operator 
                  shall, at the Responsible Party's option, securely delete or return all personal information to the Responsible 
                  Party, unless the Operator is required by law to retain such information.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#225AE3] mb-4">6. International Data Transfers</h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>6.1</strong> If the Operator processes personal information outside South Africa (e.g., through servers 
                  located abroad), it shall ensure that such processing complies with POPIA's requirements for cross-border data 
                  transfers, including implementing appropriate safeguards, such as standard contractual clauses or binding 
                  corporate rules.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>6.2</strong> The Operator shall notify the Responsible Party in advance of any intended cross-border 
                  transfer and obtain the Responsible Party's consent, where required.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#225AE3] mb-4">7. Audit and Compliance</h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>7.1</strong> The Operator shall make available to the Responsible Party all information necessary to 
                  demonstrate compliance with this DPA and POPIA.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>7.2</strong> The Operator shall allow for and contribute to audits or inspections conducted by the 
                  Responsible Party or an independent auditor appointed by the Responsible Party, at reasonable intervals and 
                  upon reasonable notice, to verify compliance with this DPA.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#225AE3] mb-4">8. Liability and Indemnity</h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>8.1</strong> The Operator shall indemnify the Responsible Party against any claims, losses, or damages 
                  arising from the Operator's failure to comply with this DPA or POPIA, except to the extent that such failure 
                  results from the Responsible Party's instructions or actions.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>8.2</strong> The Responsible Party shall indemnify the Operator against any claims, losses, or damages 
                  arising from the Responsible Party's failure to provide lawful instructions or comply with POPIA.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#225AE3] mb-4">9. Term and Termination</h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>9.1</strong> This DPA shall remain in effect for the duration of the Services agreement between the 
                  Parties or until all personal information is deleted or returned in accordance with Section 5.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>9.2</strong> Either Party may terminate this DPA if the other Party materially breaches its obligations 
                  and fails to remedy such breach within 30 days of receiving written notice.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#225AE3] mb-4">10. Governing Law and Jurisdiction</h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>10.1</strong> This DPA is governed by and construed in accordance with the laws of the Republic of 
                  South Africa.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>10.2</strong> Any disputes arising from this DPA shall be subject to the exclusive jurisdiction of 
                  the courts of South Africa.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#225AE3] mb-4">11. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For questions or concerns regarding this DPA or the processing of personal information, contact:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-[#225AE3] mb-2">Responsible Party: Property Spotter (Pty) Ltd</h4>
                  <p className="text-gray-700"><strong>Email:</strong> info@propertyspotter.co.za</p>
                  <p className="text-gray-700"><strong>Physical Address:</strong> Klerksdorp, North West, 2571, South Africa</p>
                  <p className="text-gray-700"><strong>Phone:</strong> 018 065 0047</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-[#225AE3] mb-2">Operator: Gridion Telecoms (Pty) Ltd</h4>
                  <p className="text-gray-700"><strong>Email:</strong> info@gridion.net</p>
                  <p className="text-gray-700"><strong>Physical Address:</strong> Scott Square, Scott Crescent, Stilfontein</p>
                  <p className="text-gray-700"><strong>Phone:</strong> 010 285 0040</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#225AE3] mb-4">12. Miscellaneous</h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>12.1 Entire Agreement:</strong> This DPA, together with the Services agreement and the Responsible 
                  Party's Privacy Policy, constitutes the entire agreement between the Parties regarding the processing of 
                  personal information and supersedes any prior agreements.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>12.2 Severability:</strong> If any provision of this DPA is found to be invalid or unenforceable, 
                  the remaining provisions shall continue in full force and effect.
                </p>
              </div>
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

export default DataProcessingAgreementPage;