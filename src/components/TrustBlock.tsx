import company from '../config/company';

// Category B — Trust & Credibility.
// A clear, prominent proof-of-legitimacy block: PPRA registration, the
// accountable director, registered address, contact details, and plain-language
// reassurance on compliance and data handling.
export default function TrustBlock() {
  const { ppra, director, address, contact } = company;

  return (
    <section id="trust" className="relative py-20 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center px-4 py-2 bg-[#E9EEFB] rounded-full mb-5">
            <svg className="w-4 h-4 mr-2 text-[#225AE3]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm font-semibold text-[#225AE3]">Registered &amp; Regulated</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
            A real, <span className="bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">legitimate</span> South African business
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Property Spotter is a registered estate agency, regulated by the PPRA under the {ppra.act}. Here&apos;s the proof.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* PPRA credential card */}
          <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">PPRA {ppra.certificateType}</p>
                <p className="text-2xl font-black text-gray-900 mt-1 tracking-tight">{ppra.certificateNumber}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#225AE3] to-[#F59E0B] flex items-center justify-center shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Issued under</dt>
                <dd className="font-medium text-gray-900 text-right">{ppra.act}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Industry</dt>
                <dd className="font-medium text-gray-900 text-right">{ppra.industry}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Valid until</dt>
                <dd className="font-medium text-gray-900 text-right">{ppra.validUntil}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Registered address</dt>
                <dd className="font-medium text-gray-900 text-right">{address.full}</dd>
              </div>
            </dl>

            <a
              href={ppra.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center px-6 py-3 bg-[#225AE3] text-white font-semibold rounded-xl hover:bg-[#1c4bc0] transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6M9 17h4" />
              </svg>
              View our PPRA Certificate
            </a>
          </div>

          {/* Director + contact + reassurance */}
          <div className="flex flex-col gap-6">
            {/* Director */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex items-center gap-5">
              <img
                src={director.photo}
                alt={director.name}
                className="w-20 h-20 rounded-2xl object-cover border border-gray-100 shrink-0"
              />
              <div>
                <p className="text-xs font-semibold text-[#225AE3] uppercase tracking-wide">Accountable to you</p>
                <h3 className="text-xl font-bold text-gray-900">{director.name}</h3>
                <p className="text-gray-600">{director.title}, Property Spotter</p>
              </div>
            </div>

            {/* Contact */}
            <div className="grid sm:grid-cols-2 gap-4">
              <a href={contact.telHref} className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:border-[#225AE3]/30 transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E9EEFB] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#225AE3]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Call us</p>
                    <p className="font-semibold text-gray-900">{contact.tel}</p>
                  </div>
                </div>
              </a>
              <a href={contact.emailHref} className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:border-[#225AE3]/30 transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E9EEFB] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#225AE3]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Email us</p>
                    <p className="font-semibold text-gray-900 truncate">{contact.email}</p>
                  </div>
                </div>
              </a>
            </div>

            {/* Reassurance */}
            <div className="bg-gradient-to-br from-[#E9EEFB]/60 to-white rounded-2xl p-6 border border-[#225AE3]/10">
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Every lead is checked by a registered estate agent before any deal proceeds.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Rewards are paid securely to your bank account once a deal is successfully concluded.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Your personal information is handled in line with the POPI Act &mdash; we never sell your data.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
