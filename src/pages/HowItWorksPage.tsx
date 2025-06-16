import { Link } from 'react-router-dom'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="fixed inset-0 -z-10 bg-gradient-to-tr from-[#E9EEFB] via-white to-[#225AE3]/10 animate-gradient-move" />
      <nav className="bg-white/80 backdrop-blur shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-extrabold tracking-tight text-[#225AE3]">PropertySpotter</Link>
            <div className="flex items-center space-x-4">
              <Link to="/" className="btn-secondary">Home</Link>
              <button className="btn-primary shadow-lg">Get Started</button>
            </div>
          </div>
        </div>
      </nav>
      <section className="pt-32 pb-20 flex flex-col items-center text-center overflow-hidden">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            How PropertySpotter Works
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            Discover how you can turn everyday walks into real income. It's simple, flexible, and open to everyone.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-10 mt-12 w-full max-w-4xl">
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-[#225AE3]">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#225AE3" strokeWidth="1.5" className="mb-4"><circle cx="12" cy="12" r="9" stroke="#225AE3" strokeWidth="2"/><path stroke="#F59E0B" strokeWidth="2" d="M15 10a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <h2 className="text-xl font-bold text-[#225AE3] mb-2">1. Spot a Property</h2>
            <p className="text-gray-600 text-center">See a property for sale or with a for-sale sign? Snap a photo and note the location.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-[#F59E0B]">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#225AE3" strokeWidth="1.5" className="mb-4"><rect x="4" y="4" width="16" height="16" rx="4" stroke="#225AE3" strokeWidth="2"/><path stroke="#F59E0B" strokeWidth="2" d="M8 12h8M8 16h5"/></svg>
            <h2 className="text-xl font-bold text-[#225AE3] mb-2">2. Submit the Details</h2>
            <p className="text-gray-600 text-center">Use our app to submit the property's details. Our form is quick and easy to use.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-[#225AE3]">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#225AE3" strokeWidth="1.5" className="mb-4"><rect x="3" y="7" width="18" height="10" rx="5" stroke="#225AE3" strokeWidth="2"/><path stroke="#F59E0B" strokeWidth="2" d="M12 11v2m0 0h2m-2 0H10"/></svg>
            <h2 className="text-xl font-bold text-[#225AE3] mb-2">3. Get Rewarded</h2>
            <p className="text-gray-600 text-center">If your lead results in a successful deal, you get paid. It's that easy!</p>
          </div>
        </div>
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="bg-[#E9EEFB] rounded-2xl p-8 shadow-xl flex flex-col items-center">
            <h3 className="text-2xl font-bold text-[#225AE3] mb-2">Why Spot with Us?</h3>
            <ul className="text-gray-700 text-lg space-y-2 text-left">
              <li>• <span className="font-semibold text-[#F59E0B]">No experience needed</span> — anyone can join</li>
              <li>• <span className="font-semibold text-[#F59E0B]">Flexible</span> — spot properties anytime, anywhere</li>
              <li>• <span className="font-semibold text-[#F59E0B]">Real rewards</span> — get paid for successful leads</li>
              <li>• <span className="font-semibold text-[#F59E0B]">Supportive community</span> — we help you succeed</li>
            </ul>
            <Link to="/" className="btn-primary mt-8">Back to Home</Link>
          </div>
        </div>
      </section>
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
                <li><a href="#" className="text-gray-600 hover:text-[#225AE3]">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-[#225AE3]">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#225AE3]">Help Center</a></li>
                <li><Link to="/data-processing-agreement" className="text-gray-600 hover:text-[#225AE3]">Data Processing Agreement</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="https://www.facebook.com/propertyspotter.co.za" className="text-gray-600 hover:text-[#225AE3]">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-600">
            <p>&copy; 2024 PropertySpotter. All rights reserved.</p>
          </div>
        </div>
      </footer>
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