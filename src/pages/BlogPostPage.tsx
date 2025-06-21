import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  status: string;
  published_at: string;
}

// Default images for posts without featured images (same as blog page)
const defaultImages = [
  {
    url: 'https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?auto=format&fit=crop&w=1200&q=80',
    alt: 'Modern house architecture'
  },
  {
    url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
    alt: 'Luxury home exterior'
  },
  {
    url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80',
    alt: 'Real estate investment'
  },
  {
    url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
    alt: 'Beautiful home interior'
  },
  {
    url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80',
    alt: 'Property landscape'
  },
  {
    url: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=1200&q=80',
    alt: 'Modern apartment building'
  }
];

const gradientBackgrounds = [
  'from-blue-400 via-blue-500 to-blue-600',
  'from-purple-400 via-purple-500 to-purple-600',
  'from-green-400 via-green-500 to-green-600',
  'from-orange-400 via-orange-500 to-orange-600',
  'from-teal-400 via-teal-500 to-teal-600',
  'from-indigo-400 via-indigo-500 to-indigo-600',
];

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}blog/api/posts/${slug}/`);
      if (!response.ok) throw new Error('Failed to fetch blog post');
      const data = await response.json();
      setPost(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getDefaultImage = (postId: number) => {
    const imageIndex = postId % defaultImages.length;
    return defaultImages[imageIndex];
  };

  const getGradientBackground = (postId: number) => {
    const gradientIndex = postId % gradientBackgrounds.length;
    return gradientBackgrounds[gradientIndex];
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, ''); // Strip HTML tags
    const wordCount = textContent.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
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
            <p className="mt-6 text-gray-600 font-medium">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
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
            <h3 className="text-xl font-bold text-gray-900 mb-4">Article Not Found</h3>
            <p className="text-gray-600 mb-6">{error || 'The article you\'re looking for doesn\'t exist or has been moved.'}</p>
            <Link
              to="/blog"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const defaultImage = getDefaultImage(post.id);
  const gradientBg = getGradientBackground(post.id);
  const readingTime = getReadingTime(post.content);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E9EEFB]/40 via-white to-[#F59E0B]/10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#225AE3]/20 to-transparent rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-bl from-[#F59E0B]/20 to-transparent rounded-full blur-3xl animate-float-slower"></div>
      </div>

      <Navbar />

      {/* Breadcrumb */}
      <section className="pt-24 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-[#225AE3] transition-colors duration-200">
              Home
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link to="/blog" className="text-gray-500 hover:text-[#225AE3] transition-colors duration-200">
              Blog
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">{post.title}</span>
          </nav>
        </div>
      </section>

      {/* Article Header */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {format(new Date(post.published_at), 'MMMM d, yyyy')}
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readingTime} min read
            </div>

            <div className="bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white px-3 py-1 rounded-full text-xs font-semibold">
              PropertySpotter Insights
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-8">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-12 max-w-3xl">
            {post.excerpt}
          </p>
        </div>
      </section>

      {/* Featured Image */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            {post.featured_image_url ? (
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-[50vh] md:h-[60vh] object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = defaultImage.url;
                }}
              />
            ) : (
              <div className="relative w-full h-[50vh] md:h-[60vh]">
                <img
                  src={defaultImage.url}
                  alt={defaultImage.alt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const gradientDiv = target.nextElementSibling as HTMLElement;
                    if (gradientDiv) gradientDiv.style.display = 'flex';
                  }}
                />
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${gradientBg} hidden items-center justify-center`}
                  style={{ display: 'none' }}
                >
                  <div className="text-center text-white">
                    <svg className="w-24 h-24 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <p className="text-xl font-semibold opacity-90">PropertySpotter Insights</p>
                    <p className="text-sm opacity-75 mt-2">Real Estate Knowledge</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Gradient overlay for better text readability if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-8 md:p-12">
            {/* Article Body with Proper CKEditor Content Styling */}
            <div 
              className="blog-content prose prose-lg prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </section>

      {/* Article Footer & Navigation */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Share & Back Navigation */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Back to Blog */}
              <Link
                to="/blog"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Blog
              </Link>

              {/* Share Buttons */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Share this article:</span>
                
                {/* Facebook Share */}
                <button
                  onClick={() => {
                    const url = encodeURIComponent(window.location.href);
                    const title = encodeURIComponent(post.title);
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`, '_blank', 'width=600,height=400');
                  }}
                  className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
                  title="Share on Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>

                {/* Twitter Share */}
                <button
                  onClick={() => {
                    const url = encodeURIComponent(window.location.href);
                    const title = encodeURIComponent(post.title);
                    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank', 'width=600,height=400');
                  }}
                  className="p-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors duration-200"
                  title="Share on Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>

                {/* LinkedIn Share */}
                <button
                  onClick={() => {
                    const url = encodeURIComponent(window.location.href);
                    const title = encodeURIComponent(post.title);
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`, '_blank', 'width=600,height=400');
                  }}
                  className="p-3 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors duration-200"
                  title="Share on LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>

                {/* Copy Link */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    // You could add a toast notification here
                  }}
                  className="p-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors duration-200"
                  title="Copy Link"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#225AE3] via-[#225AE3] to-[#F59E0B]"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float-slow"></div>
        <div className="absolute bottom-10 right-20 w-24 h-24 bg-white/20 rounded-full blur-xl animate-float-slower"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready to Start <span className="text-[#F59E0B]">Spotting?</span>
          </h2>
          <p className="text-xl mb-12 opacity-90 leading-relaxed max-w-2xl mx-auto">
            Turn your property knowledge into real income. Join thousands of successful spotters across South Africa.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link 
              to="/register" 
              className="px-10 py-5 bg-white text-[#225AE3] font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300"
            >
              Start Earning Today
            </Link>
            
            <Link 
              to="/how-it-works" 
              className="px-10 py-5 bg-white/20 backdrop-blur-sm text-white font-bold text-xl rounded-2xl border-2 border-white/30 hover:bg-white/30 transition-all duration-300"
            >
              Learn How It Works
            </Link>
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
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">PropertySpotter</h3>
                  <p className="text-gray-400">Your property, our treasure</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Connecting property spotters with real estate opportunities across South Africa.
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
            </div>
          </div>
        </div>
      </footer>

      {/* Blog Content Styling for CKEditor Output */}
      <style>{`
        /* Custom Animations */
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(30px) rotate(-180deg); }
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 10s ease-in-out infinite;
        }

        /* Blog Content Styling - Fixes CKEditor Output Issues */
        .blog-content {
          line-height: 1.8;
          color: #374151;
        }

        /* Headings */
        .blog-content h1 {
          font-size: 2.25rem;
          font-weight: 800;
          color: #111827;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          background: linear-gradient(135deg, #225AE3 0%, #F59E0B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .blog-content h2 {
          font-size: 1.875rem;
          font-weight: 700;
          color: #111827;
          margin-top: 2.5rem;
          margin-bottom: 1.25rem;
          line-height: 1.3;
        }

        .blog-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.4;
        }

        .blog-content h4 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.5;
        }

        .blog-content h5 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #374151;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          line-height: 1.5;
        }

        .blog-content h6 {
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          line-height: 1.5;
        }

        /* Paragraphs */
        .blog-content p {
          margin-bottom: 1.5rem;
          font-size: 1.125rem;
          line-height: 1.8;
          color: #374151;
        }

        .blog-content p:last-child {
          margin-bottom: 0;
        }

        /* Lists - FIX FOR BULLET OVERFLOW ISSUE */
        .blog-content ul {
          margin: 1.5rem 0;
          padding-left: 0;
          list-style: none;
        }

        .blog-content ul li {
          position: relative;
          margin-bottom: 0.75rem;
          padding-left: 2rem;
          font-size: 1.125rem;
          line-height: 1.7;
          color: #374151;
        }

        .blog-content ul li::before {
          content: '';
          position: absolute;
          left: 0.5rem;
          top: 0.7rem;
          width: 6px;
          height: 6px;
          background: linear-gradient(135deg, #225AE3 0%, #F59E0B 100%);
          border-radius: 50%;
        }

        .blog-content ol {
          margin: 1.5rem 0;
          padding-left: 0;
          counter-reset: list-counter;
          list-style: none;
        }

        .blog-content ol li {
          position: relative;
          margin-bottom: 0.75rem;
          padding-left: 3rem;
          font-size: 1.125rem;
          line-height: 1.7;
          color: #374151;
          counter-increment: list-counter;
        }

        .blog-content ol li::before {
          content: counter(list-counter);
          position: absolute;
          left: 0;
          top: 0;
          width: 2rem;
          height: 2rem;
          background: linear-gradient(135deg, #225AE3 0%, #F59E0B 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: 600;
        }

        /* Nested Lists */
        .blog-content ul ul,
        .blog-content ol ol,
        .blog-content ul ol,
        .blog-content ol ul {
          margin: 0.5rem 0;
        }

        .blog-content ul ul li::before {
          background: #D1D5DB;
          width: 4px;
          height: 4px;
        }

        /* Links */
        .blog-content a {
          color: #225AE3;
          text-decoration: none;
          font-weight: 500;
          border-bottom: 1px solid transparent;
          transition: all 0.2s ease;
        }

        .blog-content a:hover {
          color: #F59E0B;
          border-bottom-color: #F59E0B;
        }

        /* Blockquotes */
        .blog-content blockquote {
          margin: 2rem 0;
          padding: 1.5rem 2rem;
          background: linear-gradient(135deg, #E9EEFB 0%, #FFF8F1 100%);
          border-left: 4px solid #225AE3;
          border-radius: 0.75rem;
          font-style: italic;
          font-size: 1.25rem;
          line-height: 1.7;
          color: #374151;
        }

        .blog-content blockquote p {
          margin: 0;
        }

        /* Images */
        .blog-content img {
          max-width: 100%;
          height: auto;
          margin: 2rem auto;
          display: block;
          border-radius: 1rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        /* Tables */
        .blog-content table {
          width: 100%;
          margin: 2rem 0;
          border-collapse: collapse;
          background: white;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .blog-content th {
          background: linear-gradient(135deg, #225AE3 0%, #F59E0B 100%);
          color: white;
          font-weight: 600;
          padding: 1rem;
          text-align: left;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .blog-content td {
          padding: 1rem;
          border-bottom: 1px solid #E5E7EB;
          font-size: 0.875rem;
          color: #374151;
        }

        .blog-content tr:last-child td {
          border-bottom: none;
        }

        .blog-content tr:hover {
          background: #F9FAFB;
        }

        /* Code blocks */
        .blog-content pre {
          background: #1F2937;
          color: #F9FAFB;
          padding: 1.5rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          margin: 2rem 0;
          font-size: 0.875rem;
          line-height: 1.7;
        }

        .blog-content code {
          background: #F3F4F6;
          color: #1F2937;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
        }

        .blog-content pre code {
          background: transparent;
          color: inherit;
          padding: 0;
        }

        /* Horizontal Rules */
        .blog-content hr {
          margin: 3rem 0;
          border: none;
          height: 1px;
          background: linear-gradient(135deg, #225AE3 0%, #F59E0B 100%);
        }

        /* Strong and Emphasis */
        .blog-content strong {
          font-weight: 700;
          color: #111827;
        }

        .blog-content em {
          font-style: italic;
        }

        /* First paragraph special styling */
        .blog-content > p:first-of-type {
          font-size: 1.25rem;
          color: #111827;
          font-weight: 500;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .blog-content {
            font-size: 1rem;
          }
          
          .blog-content h1 {
            font-size: 1.875rem;
          }
          
          .blog-content h2 {
            font-size: 1.5rem;
          }
          
          .blog-content h3 {
            font-size: 1.25rem;
          }
          
          .blog-content p,
          .blog-content ul li,
          .blog-content ol li {
            font-size: 1rem;
          }
          
          .blog-content blockquote {
            font-size: 1.125rem;
            padding: 1rem 1.5rem;
          }
          
          .blog-content ul li {
            padding-left: 1.5rem;
          }
          
          .blog-content ol li {
            padding-left: 2.5rem;
          }
          
          .blog-content > p:first-of-type {
            font-size: 1.125rem;
          }
        }
      `}</style>
    </div>
  );
};