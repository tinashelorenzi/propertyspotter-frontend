import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar';
import RecentBlogPosts from '../components/RecentBlogPosts';

const features = [
  {
    title: 'Spot Properties',
    description: 'See a property for sale? Snap a photo and submit the details in seconds. Our smart forms make it effortless.',
    icon: (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-2xl blur-lg opacity-30"></div>
        <div className="relative bg-white rounded-2xl p-4 shadow-lg">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#225AE3" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v6m0 6v6m6-6h6M1 12h6m7.07-7.07l4.24 4.24M5.93 5.93l4.24 4.24m0 8.49l4.24 4.24M5.93 18.07l4.24-4.24" />
          </svg>
        </div>
      </div>
    ),
    gradient: 'from-blue-500 to-purple-600',
  },
  {
    title: 'Submit Details',
    description: 'Easy, guided forms with smart validation make submitting a lead quick and hassle-free. No paperwork, no complexity.',
    icon: (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B] to-[#225AE3] rounded-2xl blur-lg opacity-30"></div>
        <div className="relative bg-white rounded-2xl p-4 shadow-lg">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#F59E0B" strokeWidth="2">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>
    ),
    gradient: 'from-orange-500 to-red-600',
  },
  {
    title: 'Earn Rewards',
    description: 'Get paid when your lead results in a successful deal. Real money, real fast. No experience needed—just your eyes!',
    icon: (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#225AE3] via-green-500 to-[#F59E0B] rounded-2xl blur-lg opacity-30"></div>
        <div className="relative bg-white rounded-2xl p-4 shadow-lg">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#10B981" strokeWidth="2">
            <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    ),
    gradient: 'from-green-500 to-emerald-600',
  },
];

const stats = [
  { number: '500+', label: 'Properties Spotted', icon: '🏠' },
  { number: 'R1.2M+', label: 'Rewards Paid', icon: '💰' },
  { number: '150+', label: 'Active Spotters', icon: '👥' },
  { number: '95%', label: 'Success Rate', icon: '⭐' },
];

const testimonials = [
  {
    name: 'Sarah Mitchell',
    location: 'Sandton, Johannesburg',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b7e2?auto=format&fit=crop&w=150&q=80',
    quote: 'I spotted a house on my morning walk and earned R8,000! PropertySpotter turned my daily routine into extra income.',
    amount: 'R8,000',
    color: 'from-pink-500 to-rose-600'
  },
  {
    name: 'Michael Chen',
    location: 'Cape Town',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    quote: 'As a real estate agent, I thought I knew all the opportunities. PropertySpotter showed me there are always more!',
    amount: 'R15,000',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    name: 'Nomsa Dlamini',
    location: 'Durban',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    quote: 'The extra income from property spotting helped me save for my own home. Every street has potential!',
    amount: 'R12,500',
    color: 'from-purple-500 to-violet-600'
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E9EEFB]/40 via-white to-[#F59E0B]/10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#225AE3]/20 to-transparent rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-bl from-[#F59E0B]/20 to-transparent rounded-full blur-3xl animate-float-slower"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-gradient-to-tr from-[#225AE3]/15 to-transparent rounded-full blur-3xl animate-float-reverse"></div>
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 flex flex-col items-center text-center min-h-screen justify-center">
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-[#225AE3]/30 to-[#F59E0B]/30 rounded-full blur-xl animate-bounce-slow"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-[#F59E0B]/40 to-[#225AE3]/40 rounded-full blur-lg animate-pulse-slow"></div>
        
        <div className="max-w-5xl mx-auto px-4 z-10">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#225AE3]/20 shadow-lg mb-8 animate-fade-in-up">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            <span className="text-sm font-medium text-gray-700">Live earning opportunities available</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-black leading-tight mb-8 animate-fade-in-up delay-100">
            <span className="block bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">
              Spot.
            </span>
            <span className="block text-gray-900">
              Earn.
            </span>
            <span className="block bg-gradient-to-r from-[#F59E0B] to-[#225AE3] bg-clip-text text-transparent">
              Repeat.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Turn your daily walks into real income. PropertySpotter connects you with 
            <span className="font-semibold text-[#225AE3]"> lucrative property opportunities</span> — 
            no experience needed, just your smartphone and keen eyes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16 animate-fade-in-up delay-300">
            <Link 
              to="/register" 
              className="group relative px-8 py-4 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center">
                Start Earning Today
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B] to-[#225AE3] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <Link 
              to="/properties" 
              className="group px-8 py-4 bg-white/80 backdrop-blur-sm text-[#225AE3] font-bold text-lg rounded-2xl border-2 border-[#225AE3]/20 hover:border-[#225AE3] shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <span className="flex items-center justify-center">
                Browse Properties
                <svg className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up delay-400">
            {stats.map((stat, idx) => (
              <div key={idx} className="group">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-white/50">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent mb-1">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[#225AE3]/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-[#225AE3] rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              How It <span className="bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to turn your neighborhood knowledge into real income
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {features.map((feature, idx) => (
              <div key={idx} className="group relative">
                {/* Connecting Line */}
                {idx < features.length - 1 && (
                  <div className="hidden lg:block absolute top-24 left-full w-12 h-0.5 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] opacity-30 z-10"></div>
                )}
                
                <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-500 border border-gray-100 group-hover:border-[#225AE3]/20">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-8 w-8 h-8 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {idx + 1}
                  </div>

                  {/* Icon */}
                  <div className="mb-6 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-[#225AE3] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-center">
                    {feature.description}
                  </p>

                  {/* Hover Effect Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#225AE3]/5 to-[#F59E0B]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 bg-gradient-to-br from-[#E9EEFB]/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Success <span className="bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">Stories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real people, real earnings, real opportunities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="group relative">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
                  {/* Quote */}
                  <div className="mb-6">
                    <svg className="w-8 h-8 text-[#225AE3] mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                    </svg>
                    <p className="text-gray-700 italic leading-relaxed">"{testimonial.quote}"</p>
                  </div>

                  {/* Earnings Badge */}
                  <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${testimonial.color} text-white rounded-full text-sm font-bold mb-6`}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Earned {testimonial.amount}
                  </div>

                  {/* Profile */}
                  <div className="flex items-center">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#225AE3]/20"
                    />
                    <div className="ml-4">
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-gray-500 text-sm">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <RecentBlogPosts />

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#225AE3] via-[#225AE3] to-[#F59E0B]"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float-slow"></div>
        <div className="absolute bottom-10 right-20 w-24 h-24 bg-white/20 rounded-full blur-xl animate-float-slower"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white z-10">
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            Ready to Start <span className="text-[#F59E0B]">Earning?</span>
          </h2>
          <p className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed">
            Join thousands of property spotters who are already turning their neighborhood knowledge into steady income. 
            <span className="font-semibold"> It's free, flexible, and rewarding.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link 
              to="/register" 
              className="group px-10 py-5 bg-white text-[#225AE3] font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300"
            >
              <span className="flex items-center justify-center">
                Create Free Account
                <svg className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            
            <Link 
              to="/how-it-works" 
              className="group px-10 py-5 bg-white/20 backdrop-blur-sm text-white font-bold text-xl rounded-2xl border-2 border-white/30 hover:bg-white/30 transition-all duration-300"
            >
              Learn More
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-16 opacity-80">
            <div className="flex items-center text-sm">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              4.9/5 Rating
            </div>
            <div className="flex items-center text-sm">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Secure Platform
            </div>
            <div className="flex items-center text-sm">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Fast Payouts
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <img 
                  src="https://raw.githubusercontent.com/tinashelorenzi/propertyspotter-prod/refs/heads/main/static/images/logo.png"
                  alt="PropertySpotter Logo"
                  className="h-12 w-auto"
                />
                <div>
                  <h3 className="property-spotter-heading text-2xl font-bold bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">PropertySpotter</h3>
                  <p className="text-gray-400">Your property, our treasure</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Connecting property spotters with real estate opportunities across South Africa. 
                Turn your neighborhood knowledge into steady income.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link to="/how-it-works" className="text-gray-400 hover:text-[#225AE3] transition-colors duration-200">How It Works</Link></li>
                <li><Link to="/properties" className="text-gray-400 hover:text-[#225AE3] transition-colors duration-200">Properties</Link></li>
                <li><Link to="/blog" className="text-gray-400 hover:text-[#225AE3] transition-colors duration-200">Blog</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-[#225AE3] transition-colors duration-200">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Legal</h4>
              <ul className="space-y-3">
                <li><Link to="/terms-of-service" className="text-gray-400 hover:text-[#225AE3] transition-colors duration-200">Terms of Service</Link></li>
                <li><Link to="/data-processing-agreement" className="text-gray-400 hover:text-[#225AE3] transition-colors duration-200">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400">&copy; 2025 PropertySpotter. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a
                href="/agency-login"
                className="text-[#225AE3] font-semibold hover:text-[#F59E0B] transition-colors duration-200"
              >
                Agency/Agent Login
              </a>
              <a href="https://www.facebook.com/propertyspotter.co.za" className="text-gray-400 hover:text-[#225AE3] transition-colors duration-200">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Animations Styles */}
      <style>{`
        @keyframes gradient-move {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(30px) rotate(-180deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(90deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0px); }
        }
        
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradient-move 8s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 10s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float-reverse 8s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  )
}