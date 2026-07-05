import { Link } from 'react-router-dom';

// Category A — Audience split.
// Three clear, self-select paths so a first-time visitor immediately knows
// which door is theirs: Spotter, Estate Agent, or Homeowner/Seller.
const paths = [
  {
    key: 'spotter',
    eyebrow: 'For Spotters',
    title: 'Earn cash from properties you spot',
    description: 'See a home for sale? Snap a photo, send it in, and earn a reward when it leads to a successful sale.',
    cta: 'Start spotting',
    to: '/register',
    accent: 'from-[#225AE3] to-[#F59E0B]',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" />
      </svg>
    ),
    primary: true,
  },
  {
    key: 'agent',
    eyebrow: 'For Estate Agents',
    title: 'Get qualified leads, pay only on success',
    description: 'Fresh, off-market seller leads delivered to your agency. No cold-calling, no upfront cost — you pay only when a deal closes.',
    cta: 'Partner with us',
    to: '/for-agents',
    accent: 'from-gray-800 to-gray-600',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a4 4 0 10-3-6.65" />
      </svg>
    ),
    primary: false,
  },
  {
    key: 'seller',
    eyebrow: 'For Homeowners',
    title: 'Thinking of selling?',
    description: 'A free property valuation and market report — coming soon. Get in touch and we’ll let you know the moment it’s live.',
    cta: 'Get in touch',
    to: '/contact',
    accent: 'from-[#F59E0B] to-[#225AE3]',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    primary: false,
  },
];

export default function AudienceSelector() {
  return (
    <section className="relative py-20 bg-gradient-to-b from-white to-[#E9EEFB]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
            Which one are <span className="bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">you?</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Property Spotter works for everyone in the deal. Pick your path to get started.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {paths.map((p) => (
            <Link
              key={p.key}
              to={p.to}
              className={`group relative flex flex-col bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border ${
                p.primary ? 'border-[#225AE3]/30 ring-1 ring-[#225AE3]/10' : 'border-gray-100'
              }`}
            >
              {p.primary && (
                <span className="absolute -top-3 left-8 px-3 py-1 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white text-xs font-bold rounded-full">
                  Most popular
                </span>
              )}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.accent} flex items-center justify-center mb-6`}>
                {p.icon}
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#225AE3] mb-2">{p.eyebrow}</p>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{p.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">{p.description}</p>
              <span className="inline-flex items-center font-semibold text-[#225AE3] group-hover:text-[#F59E0B] transition-colors duration-200">
                {p.cta}
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
