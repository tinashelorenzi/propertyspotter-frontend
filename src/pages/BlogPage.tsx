import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url: string | null;
  status: string;
  published_at: string;
}

interface BlogResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BlogPost[];
}

// Default images for posts without featured images
const defaultImages = [
  {
    url: 'https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?auto=format&fit=crop&w=800&q=80',
    alt: 'Modern house architecture'
  },
  {
    url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
    alt: 'Luxury home exterior'
  },
  {
    url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80',
    alt: 'Real estate investment'
  },
  {
    url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    alt: 'Beautiful home interior'
  },
  {
    url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80',
    alt: 'Property landscape'
  },
  {
    url: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=800&q=80',
    alt: 'Modern apartment building'
  }
];

// Gradient backgrounds as fallback for default images
const gradientBackgrounds = [
  'from-blue-400 via-blue-500 to-blue-600',
  'from-purple-400 via-purple-500 to-purple-600',
  'from-green-400 via-green-500 to-green-600',
  'from-orange-400 via-orange-500 to-orange-600',
  'from-teal-400 via-teal-500 to-teal-600',
  'from-indigo-400 via-indigo-500 to-indigo-600',
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterAndSortPosts();
  }, [posts, searchQuery, sortBy]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}blog/api/posts/`);
      if (!response.ok) throw new Error('Failed to fetch blog posts');
      const data: BlogResponse = await response.json();
      setPosts(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPosts = () => {
    let filtered = Array.isArray(posts) ? [...posts] : [];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort posts
    filtered.sort((a, b) => {
      const dateA = new Date(a.published_at).getTime();
      const dateB = new Date(b.published_at).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    setFilteredPosts(filtered);
  };

  const getDefaultImage = (postId: number) => {
    const imageIndex = postId % defaultImages.length;
    return defaultImages[imageIndex];
  };

  const getGradientBackground = (postId: number) => {
    const gradientIndex = postId % gradientBackgrounds.length;
    return gradientBackgrounds[gradientIndex];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] pt-20">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#225AE3]/20 border-t-[#225AE3] mx-auto"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#F59E0B]/20 border-t-[#F59E0B] animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Loading amazing content...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] pt-20">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h3>
            <p className="text-red-500 mb-6">{error}</p>
            <button
              onClick={fetchPosts}
              className="px-6 py-3 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E9EEFB]/40 via-white to-[#F59E0B]/10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#225AE3]/20 to-transparent rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-bl from-[#F59E0B]/20 to-transparent rounded-full blur-3xl animate-float-slower"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-gradient-to-tr from-[#225AE3]/15 to-transparent rounded-full blur-3xl animate-float-reverse"></div>
      </div>

      <Navbar />
      
      {/* Header Section */}
      <section className="relative pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#225AE3]/20 shadow-lg mb-8 animate-fade-in-up">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              <span className="text-sm font-medium text-gray-700">Fresh insights & expert tips</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8 animate-fade-in-up delay-100">
              Property <span className="bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">Insights</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              Discover expert insights about property spotting, real estate trends, and proven strategies to 
              <span className="font-semibold text-[#225AE3]"> maximize your earning potential</span> in the property market.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto animate-fade-in-up delay-300">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">{posts.length}+</div>
              <div className="text-gray-600 text-sm">Articles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">Weekly</div>
              <div className="text-gray-600 text-sm">Updates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">Expert</div>
              <div className="text-gray-600 text-sm">Content</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="relative py-12 bg-white/80 backdrop-blur-sm border-y border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search articles, tips, and insights..."
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#225AE3] focus:border-[#225AE3] bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300 text-gray-900 placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium whitespace-nowrap">Sort by:</span>
              <select
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#225AE3] focus:border-[#225AE3] bg-white shadow-lg font-medium text-gray-900 transition-all duration-300"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {searchQuery ? (
                <>Showing <span className="font-semibold text-[#225AE3]">{filteredPosts.length}</span> results for "<span className="font-semibold">{searchQuery}</span>"</>
              ) : (
                <>Showing <span className="font-semibold text-[#225AE3]">{filteredPosts.length}</span> articles</>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No articles found</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {searchQuery 
                  ? `We couldn't find any articles matching "${searchQuery}". Try adjusting your search terms.`
                  : 'No blog posts are available at the moment. Check back soon for fresh content!'
                }
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-3 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => {
                const defaultImage = getDefaultImage(post.id);
                const gradientBg = getGradientBackground(post.id);
                
                return (
                  <Link 
                    key={post.id} 
                    to={`/blog/${post.slug}`}
                    className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                  >
                    {/* Image Section */}
                    <div className="relative h-56 overflow-hidden">
                      {post.featured_image_url ? (
                        <img
                          src={post.featured_image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = defaultImage.url;
                          }}
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          {/* Try to load default image first, fallback to gradient */}
                          <img
                            src={defaultImage.url}
                            alt={defaultImage.alt}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              // If default image fails, replace with gradient
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const gradientDiv = target.nextElementSibling as HTMLElement;
                              if (gradientDiv) gradientDiv.style.display = 'flex';
                            }}
                          />
                          {/* Gradient fallback */}
                          <div 
                            className={`absolute inset-0 bg-gradient-to-br ${gradientBg} hidden items-center justify-center`}
                            style={{ display: 'none' }}
                          >
                            <div className="text-center text-white">
                              <svg className="w-16 h-16 mx-auto mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                              </svg>
                              <p className="text-sm font-medium opacity-90">PropertySpotter Insights</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Reading time badge */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
                        {Math.ceil(post.excerpt.split(' ').length / 200)} min read
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8">
                      {/* Date */}
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {format(new Date(post.published_at), 'MMM d, yyyy')}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-[#225AE3] transition-colors duration-300">
                        {post.title}
                      </h3>
                      
                      {/* Excerpt */}
                      <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>

                      {/* Read More Link */}
                      <div className="flex items-center justify-between">
                        <span className="text-[#225AE3] font-semibold group-hover:text-[#F59E0B] transition-colors duration-300 flex items-center">
                          Read More
                          <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                        
                        {/* Category badge (using a simple indicator for now) */}
                        <div className="w-3 h-3 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#225AE3] via-[#225AE3] to-[#F59E0B]"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float-slow"></div>
        <div className="absolute bottom-10 right-20 w-24 h-24 bg-white/20 rounded-full blur-xl animate-float-slower"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Stay In The <span className="text-[#F59E0B]">Loop</span>
          </h2>
          <p className="text-xl mb-12 opacity-90 leading-relaxed max-w-2xl mx-auto">
            Get the latest property insights, market trends, and earning opportunities delivered straight to your inbox.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="px-8 py-4 bg-white text-[#225AE3] font-bold rounded-xl hover:bg-gray-100 transition-colors duration-300 whitespace-nowrap">
              Subscribe
            </button>
          </div>
          
          <p className="mt-6 text-sm opacity-75">
            Join 500+ property spotters getting weekly insights • Unsubscribe anytime
          </p>
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
                <li><Link to="/" className="text-gray-400 hover:text-[#225AE3] transition-colors duration-200">Home</Link></li>
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
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}