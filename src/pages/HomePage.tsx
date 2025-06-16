import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar';
import RecentBlogPosts from '../components/RecentBlogPosts';

const features = [
  {
    title: 'Spot Properties',
    description: 'See a property for sale? Snap a photo and submit the details in seconds.',
    icon: (
      <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#225AE3" strokeWidth="1.5"><circle cx="12" cy="12" r="9" stroke="#225AE3" strokeWidth="2"/><path stroke="#F59E0B" strokeWidth="2" d="M15 10a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
    ),
  },
  {
    title: 'Submit Details',
    description: 'Easy, guided forms make submitting a lead quick and hassle-free.',
    icon: (
      <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#225AE3" strokeWidth="1.5"><rect x="4" y="4" width="16" height="16" rx="4" stroke="#225AE3" strokeWidth="2"/><path stroke="#F59E0B" strokeWidth="2" d="M8 12h8M8 16h5"/></svg>
    ),
  },
  {
    title: 'Earn Rewards',
    description: 'Get paid when your lead results in a successful deal. No experience needed!',
    icon: (
      <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#225AE3" strokeWidth="1.5"><rect x="3" y="7" width="18" height="10" rx="5" stroke="#225AE3" strokeWidth="2"/><path stroke="#F59E0B" strokeWidth="2" d="M12 11v2m0 0h2m-2 0H10"/></svg>
    ),
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-tr from-[#E9EEFB] via-white to-[#225AE3]/10 animate-gradient-move" />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 flex flex-col items-center text-center overflow-hidden">
        {/* Floating shapes */}
        <div className="absolute left-0 top-0 w-40 h-40 bg-[#225AE3]/10 rounded-full blur-2xl -z-10 animate-float-slow" />
        <div className="absolute right-0 bottom-0 w-60 h-60 bg-[#F59E0B]/10 rounded-full blur-2xl -z-10 animate-float-slower" />
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            <span className="text-[#225AE3]">Spot</span> Properties.<br />
            <span className="text-[#F59E0B]">Earn</span> Rewards.<br />
            <span className="text-[#225AE3]">Change</span> Your Story.
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            PropertySpotter lets anyone earn by connecting real estate agents with properties for sale—no experience needed, just your eyes and your phone.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <Link to="/register" className="btn-primary text-lg shadow-xl">Start Spotting Now</Link>
            <Link to="/how-it-works" className="btn-secondary text-lg flex items-center justify-center">How It Works</Link>
          </div>
        </div>
        {/* Overlapping Card */}
        <div className="relative max-w-2xl mx-auto mt-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row items-center gap-8 border-t-4 border-[#225AE3]">
            <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=400&q=80" alt="Property" className="w-32 h-32 rounded-2xl object-cover border-4 border-[#E9EEFB]" />
            <div className="text-left">
              <h3 className="text-2xl font-bold text-[#225AE3] mb-1">"I spotted a house on my street and earned R12000!"</h3>
              <p className="text-gray-600">— Thabile, Centurion</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-[#E9EEFB]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600">Anyone can start earning in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition-transform duration-300 border-t-4 border-[#F59E0B]">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-[#225AE3] mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <RecentBlogPosts />

      {/* CTA Section */}
      <section className="relative section-padding bg-gradient-to-r from-[#225AE3] via-[#E9EEFB] to-white text-center overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[80vw] h-64 bg-[#225AE3]/10 rounded-full blur-3xl -z-10 animate-float-slower" />
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-[#225AE3] mb-4">Ready to Spot Your First Property?</h2>
          <p className="text-xl text-gray-700 mb-8">Sign up and start earning today. It's free, flexible, and open to everyone.</p>
          <Link to="/register" className="btn-primary text-lg px-10 py-4 shadow-xl">Create Your Free Account</Link>
        </div>
      </section>

      {/* Testimonials */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Trusted by Property Spotters
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Join our community of successful property spotters
            </p>
          </div>

          <div className="mt-12">
            <div className="bg-gray-50 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-[#225AE3] flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">TS</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Thabo Sibiya</h3>
                  <p className="text-gray-500">Property Spotter, Johannesburg</p>
                </div>
              </div>
              <p className="mt-4 text-gray-600">
                "I spotted a house in my neighborhood and earned R5,000!"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 mt-8 border-t border-[#E9EEFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between gap-8">
            <div>
              <h3 className="text-lg font-extrabold text-[#225AE3] mb-2">PropertySpotter</h3>
              <p className="text-gray-600 max-w-xs">Connecting property spotters with real estate opportunities. Earn on your terms.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="/how-it-works" className="text-gray-600 hover:text-[#225AE3]">About Us</a></li>
                <li><a href="/contact" className="text-gray-600 hover:text-[#225AE3]">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/terms-of-service" className="text-gray-600 hover:text-[#225AE3]">Terms of Service</Link></li>
                <li><Link to="/data-processing-agreement" className="text-gray-600 hover:text-[#225AE3]">Data Processing Agreement</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="/blog" className="text-gray-600 hover:text-[#225AE3]">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#225AE3]">Help Center</a></li>
                <li><Link to="/how-it-works" className="text-gray-600 hover:text-[#225AE3]">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="https://www.facebook.com/propertyspotter.co.za" className="text-gray-600 hover:text-[#225AE3]">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-600">&copy; 2025 PropertySpotter. All rights reserved.</p>
            <a
              href="/agency-login"
              className="mt-2 md:mt-0 text-[#225AE3] font-semibold hover:underline hover:text-blue-700 transition-colors"
            >
              Agency/Agent Login
            </a>
          </div>
        </div>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes gradient-move {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradient-move 8s ease-in-out infinite;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        @keyframes float-slower {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(30px); }
        }
        .animate-float-slower {
          animation: float-slower 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}