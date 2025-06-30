import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar';

const steps = [
  {
    id: '01',
    title: 'Spot Properties',
    subtitle: 'Your eyes are your tool',
    description: 'Notice a property with a "For Sale" sign while walking, driving, or just going about your day? That\'s your opportunity! Properties are everywhere - in your neighborhood, on your commute, or during weekend outings.',
    detailedPoints: [
      'Look for "For Sale" signs on properties',
      'Notice properties that seem vacant or neglected',
      'Identify potential development opportunities',
      'Use your smartphone to capture clear photos'
    ],
    icon: (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-3xl blur-xl opacity-30 animate-pulse-slow"></div>
        <div className="relative bg-white rounded-3xl p-6 shadow-2xl">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#225AE3" strokeWidth="1.5">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v6m0 6v6m6-6h6M1 12h6m7.07-7.07l4.24 4.24M5.93 5.93l4.24 4.24m0 8.49l4.24 4.24M5.93 18.07l4.24-4.24" />
          </svg>
        </div>
      </div>
    ),
    bgGradient: 'from-blue-500/10 to-purple-500/10',
    borderColor: 'border-blue-500/20',
  },
  {
    id: '02',
    title: 'Submit Details',
    subtitle: 'Quick and easy reporting',
    description: 'Open our user-friendly app and submit the property details. Our smart form guides you through the process, ensuring you capture all the important information that real estate agents need.',
    detailedPoints: [
      'Take clear photos of the property and signage',
      'Record the exact address or location details',
      'Note any special features or conditions',
      'Submit through our streamlined mobile app'
    ],
    icon: (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B] to-[#225AE3] rounded-3xl blur-xl opacity-30 animate-pulse-slow"></div>
        <div className="relative bg-white rounded-3xl p-6 shadow-2xl">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#F59E0B" strokeWidth="1.5">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            <path d="M16 3v4a1 1 0 001 1h4" />
          </svg>
        </div>
      </div>
    ),
    bgGradient: 'from-orange-500/10 to-red-500/10',
    borderColor: 'border-orange-500/20',
  },
  {
    id: '03',
    title: 'Earn Rewards',
    subtitle: 'Get paid for successful leads',
    description: 'When your spotted property leads to a successful transaction, you earn money! Our transparent reward system ensures you get paid fairly and quickly for your valuable contribution to the real estate ecosystem.',
    detailedPoints: [
      'Earn commissions on successful property sales',
      'Get rewarded for quality, actionable leads',
      'Receive payments through secure banking',
      'Build a reputation for consistent spotting'
    ],
    icon: (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-[#225AE3] rounded-3xl blur-xl opacity-30 animate-pulse-slow"></div>
        <div className="relative bg-white rounded-3xl p-6 shadow-2xl">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#10B981" strokeWidth="1.5">
            <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    ),
    bgGradient: 'from-green-500/10 to-emerald-500/10',
    borderColor: 'border-green-500/20',
  },
];

const benefits = [
  {
    title: 'No Experience Required',
    description: 'Anyone can become a property spotter. If you can take a photo and use a smartphone, you\'re qualified!',
    icon: '🚀',
    color: 'from-blue-500 to-purple-600'
  },
  {
    title: 'Flexible Schedule',
    description: 'Spot properties on your own time - during your commute, weekend walks, or whenever you\'re out and about.',
    icon: '⏰',
    color: 'from-purple-500 to-pink-600'
  },
  {
    title: 'Real Income',
    description: 'Earn meaningful money from successful leads. Our top spotters make thousands of rands per month.',
    icon: '💰',
    color: 'from-green-500 to-blue-600'
  },
  {
    title: 'Community Support',
    description: 'Join a supportive community of property spotters who share tips, celebrate successes, and help each other grow.',
    icon: '👥',
    color: 'from-orange-500 to-red-600'
  },
  {
    title: 'Professional Growth',
    description: 'Learn about real estate markets, develop an eye for property potential, and build valuable industry connections.',
    icon: '📈',
    color: 'from-teal-500 to-green-600'
  },
  {
    title: 'Mobile-First Platform',
    description: 'Our intuitive mobile app makes spotting and submitting properties quick and effortless.',
    icon: '📱',
    color: 'from-indigo-500 to-purple-600'
  },
];

const faqs = [
  {
    question: 'How much can I earn as a property spotter?',
    answer: 'Earnings vary based on the properties you spot and successful transactions. Our top performers earn R5,000 - R20,000+ per month, with individual leads paying anywhere from R1,000 to R15,000+.'
  },
  {
    question: 'How quickly do I get paid?',
    answer: 'Once a property transaction is completed and lead is successful to a sale, payments are processed at the end of that month  directly to your bank account.'
  },
  {
    question: 'What types of properties should I look for?',
    answer: 'Any residential or commercial property with a "For Sale" sign, properties that appear vacant, or potential development opportunities. Our app provides detailed guidance.'
  },
  {
    question: 'Do I need any qualifications or experience?',
    answer: 'No qualifications needed! If you can use a smartphone and have good observational skills, you can be a successful property spotter.'
  },
  {
    question: 'What areas can I work in?',
    answer: 'You can spot properties anywhere in South Africa. We have active networks in all major cities and growing opportunities in smaller towns.'
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white font-sans overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E9EEFB]/40 via-white to-[#F59E0B]/10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#225AE3]/20 to-transparent rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-bl from-[#F59E0B]/20 to-transparent rounded-full blur-3xl animate-float-slower"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-gradient-to-tr from-[#225AE3]/15 to-transparent rounded-full blur-3xl animate-float-reverse"></div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 text-center">
        <div className="max-w-5xl mx-auto px-4">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#225AE3]/20 shadow-lg mb-8 animate-fade-in-up">
            <span className="w-2 h-2 bg-[#F59E0B] rounded-full mr-2 animate-pulse"></span>
            <span className="text-sm font-medium text-gray-700">Complete guide to property spotting</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8 animate-fade-in-up delay-100">
            How <span className="bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">PropertySpotter</span> Works
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Discover how you can turn everyday walks into real income. Our proven system makes it 
            <span className="font-semibold text-[#225AE3]"> simple, profitable, and accessible</span> to everyone.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-16 animate-fade-in-up delay-300">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">3</div>
              <div className="text-gray-600 text-sm">Simple Steps</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">5min</div>
              <div className="text-gray-600 text-sm">To Get Started</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">24/7</div>
              <div className="text-gray-600 text-sm">Earning Potential</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Steps Section */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-32">
            {steps.map((step, index) => (
              <div key={step.id} className={`grid lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                {/* Content Side */}
                <div className={`space-y-8 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                      {step.id}
                    </div>
                    <div>
                      <h3 className="text-4xl font-black text-gray-900">{step.title}</h3>
                      <p className="text-xl text-[#225AE3] font-semibold">{step.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-xl text-gray-700 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="space-y-4">
                    {step.detailedPoints.map((point, pointIndex) => (
                      <div key={pointIndex} className="flex items-start space-x-4">
                        <div className="w-6 h-6 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-gray-700 font-medium">{point}</p>
                      </div>
                    ))}
                  </div>

                  {/* CTA for each step */}
                  <div className="pt-6">
                    {index === steps.length - 1 ? (
                      <Link 
                        to="/register" 
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                      >
                        Start Earning Today
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    ) : (
                      <div className="text-sm text-gray-500 font-medium">
                        Next: {steps[index + 1].title}
                      </div>
                    )}
                  </div>
                </div>

                {/* Visual Side */}
                <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className={`relative bg-gradient-to-br ${step.bgGradient} rounded-3xl p-12 border-2 ${step.borderColor} backdrop-blur-sm`}>
                    {/* Floating Background Elements */}
                    <div className="absolute top-6 right-6 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
                    <div className="absolute bottom-8 left-8 w-16 h-16 bg-white/30 rounded-full blur-lg"></div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                      {step.icon}
                      
                      {/* Step illustration */}
                      <div className="w-full max-w-sm mx-auto">
                        {index === 0 && (
                          <div className="relative">
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                              <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4 flex items-center justify-center">
                                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </div>
                              <div className="text-sm text-gray-600">📸 Snap a photo</div>
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#F59E0B] rounded-full flex items-center justify-center text-white text-sm font-bold">
                              !
                            </div>
                          </div>
                        )}
                        
                        {index === 1 && (
                          <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <div className="space-y-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 bg-[#225AE3] rounded-full"></div>
                                <div className="h-2 bg-gray-200 rounded flex-1"></div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 bg-[#225AE3] rounded-full"></div>
                                <div className="h-2 bg-gray-200 rounded flex-1"></div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                                <div className="h-2 bg-gray-100 rounded flex-1"></div>
                              </div>
                              <div className="mt-6 bg-[#225AE3] text-white py-2 px-4 rounded-lg text-center text-sm font-semibold">
                                Submit Lead
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {index === 2 && (
                          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                            <div className="text-4xl mb-4">💰</div>
                            <div className="text-2xl font-bold text-[#225AE3] mb-2">R12,500</div>
                            <div className="text-sm text-gray-600 mb-4">Commission Earned</div>
                            <div className="bg-green-100 text-green-800 py-2 px-4 rounded-lg text-sm font-semibold">
                              Payment Processed
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-24 bg-gradient-to-br from-[#E9EEFB]/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Why Choose <span className="bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">PropertySpotter?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of successful property spotters who have discovered the perfect side hustle
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="group relative">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 h-full">
                  <div className="text-4xl mb-6">{benefit.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#225AE3] transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                  
                  {/* Hover Effect Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300 -z-10`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Frequently Asked <span className="bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about becoming a property spotter
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-start">
                  <span className="w-8 h-8 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 flex-shrink-0 mt-0.5">
                    Q
                  </span>
                  {faq.question}
                </h3>
                <div className="ml-12">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#225AE3] via-[#225AE3] to-[#F59E0B]"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float-slow"></div>
        <div className="absolute bottom-10 right-20 w-24 h-24 bg-white/20 rounded-full blur-xl animate-float-slower"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white z-10">
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            Ready to Start Your <span className="text-[#F59E0B]">Journey?</span>
          </h2>
          <p className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed">
            Join the PropertySpotter community today and start earning money from properties you discover. 
            <span className="font-semibold"> Your smartphone is all you need!</span>
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
            <Link 
              to="/register" 
              className="group px-10 py-5 bg-white text-[#225AE3] font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300"
            >
              <span className="flex items-center justify-center">
                Start Earning Now
                <svg className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            
            <Link 
              to="/" 
              className="group px-10 py-5 bg-white/20 backdrop-blur-sm text-white font-bold text-xl rounded-2xl border-2 border-white/30 hover:bg-white/30 transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>

          {/* Success Metrics */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto opacity-90">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-sm">Properties Spotted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">R1.2M+</div>
              <div className="text-sm">Rewards Paid</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-sm">Success Rate</div>
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
                <li><Link to="/" className="text-gray-400 hover:text-[#225AE3] transition-colors duration-200">Home</Link></li>
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
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0px); }
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
      `}</style>
    </div>
  )
}