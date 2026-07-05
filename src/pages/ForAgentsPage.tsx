import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import company from '../config/company';

// Category A / Medium-priority "For Estate Agents" page.
// Professional tone: prospecting costs, Do Not Contact Register (POPIA),
// off-market exclusivity, and the pay-only-on-success model.

const problems = [
  {
    title: 'Cold-calling is being shut down',
    body: 'The POPI Act and the Do Not Contact Register make cold outreach legally risky and increasingly ineffective. The old prospecting playbook is closing.',
  },
  {
    title: 'Prospecting costs keep climbing',
    body: 'Show days, canvassing, pamphlets and paid ads cost more every year — with no guarantee of a mandate at the end of it.',
  },
  {
    title: 'The best stock is off-market',
    body: 'Motivated sellers are spotted on the ground long before they list. If you are not first to the door, you have already lost the mandate.',
  },
];

const steps = [
  {
    n: '01',
    title: 'Leads come to you',
    body: 'Spotters on the ground flag properties across your area. Each lead is checked before it reaches your agency.',
  },
  {
    n: '02',
    title: 'You work the mandate',
    body: 'Your agents follow up, secure the mandate, and take the deal through to transfer — the part you do best.',
  },
  {
    n: '03',
    title: 'Pay only on success',
    body: 'No subscriptions and no upfront fees. A referral fee is due only when a deal is successfully concluded.',
  },
];

const benefits = [
  'Pay only when a deal closes — zero risk',
  'Fresh, off-market seller leads in your area',
  'No cold-calling, no Do Not Contact Register exposure',
  'Every lead pre-checked before it reaches you',
  'A PPRA-registered, compliant platform',
  'A steady, predictable pipeline of opportunities',
];

export default function ForAgentsPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        {/* Light themed background to match the rest of the site */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#E9EEFB]/50 via-white to-[#F59E0B]/10"></div>
        <div className="absolute top-10 right-0 w-96 h-96 bg-gradient-to-bl from-[#225AE3]/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#F59E0B]/20 to-transparent rounded-full blur-3xl"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#225AE3]/20 shadow-lg mb-8">
            <span className="text-sm font-medium text-gray-700">For Estate Agents &amp; Agencies</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 text-gray-900">
            Stop chasing leads.<br />
            <span className="bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">Start closing them.</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed">
            Qualified, off-market seller leads delivered to your agency — with no cold-calling and no upfront cost.
            You only pay a referral fee when a deal successfully closes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-4 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              Partner with us
            </Link>
            <Link
              to="/agency-login"
              className="px-8 py-4 bg-white/80 backdrop-blur-sm text-[#225AE3] font-bold text-lg rounded-2xl border-2 border-[#225AE3]/20 hover:border-[#225AE3] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Agent / Agency login
            </Link>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Prospecting is getting harder</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The way agents find sellers is changing fast. Here&apos;s the squeeze every agency is feeling.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((p) => (
              <div key={p.title} className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{p.title}</h3>
                <p className="text-gray-600 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gradient-to-br from-[#E9EEFB]/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
              How it works for <span className="bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">agents</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">A simple, low-risk pipeline that fits how your agency already works.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.n} className="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <div className="text-5xl font-black text-[#225AE3]/10 mb-4">{s.n}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-gray-600 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Why agencies partner with us</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((b) => (
              <div key={b} className="flex items-start gap-3 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <svg className="w-6 h-6 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-800 font-medium">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-6">Ready for a pipeline that pays for itself?</h2>
          <p className="text-lg md:text-xl mb-10 opacity-90">
            Partner with a PPRA-registered platform and only pay when you close. Let&apos;s talk about your area.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/contact"
              className="px-10 py-5 bg-white text-[#225AE3] font-bold text-xl rounded-2xl shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              Partner with us
            </Link>
            <a
              href={company.contact.telHref}
              className="px-10 py-5 bg-white/15 backdrop-blur-sm text-white font-bold text-xl rounded-2xl border border-white/30 hover:bg-white/25 transition-all duration-300"
            >
              Call {company.contact.tel}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-semibold text-gray-300 mb-2">Property Spotter — registered &amp; regulated</p>
          <p className="text-sm text-gray-400">PPRA {company.ppra.certificateType} · {company.ppra.certificateNumber}</p>
          <p className="text-sm text-gray-400">{company.address.full}</p>
          <p className="text-sm text-gray-400 mt-2">
            <a href={company.contact.telHref} className="hover:text-[#225AE3]">{company.contact.tel}</a>
            {' · '}
            <a href={company.contact.emailHref} className="hover:text-[#225AE3]">{company.contact.email}</a>
          </p>
          <div className="mt-6">
            <Link to="/" className="text-[#225AE3] hover:text-[#F59E0B] transition-colors duration-200">← Back to home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
