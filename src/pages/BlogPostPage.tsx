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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#225AE3]"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-500">Error: {error}</div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500">Post not found</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Header */}
      <div className="bg-white shadow-sm pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to="/blog" className="text-[#225AE3] hover:text-[#1a4bc0] mb-4 inline-block">
            ← Back to Blog
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mt-4">{post.title}</h1>
          <p className="mt-2 text-gray-600">{format(new Date(post.published_at), 'MMMM d, yyyy')}</p>
        </div>
      </div>

      {/* Featured Image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <img
          src={post.featured_image_url}
          alt={post.title}
          className="w-full h-[400px] object-cover rounded-xl shadow-sm"
        />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Back to Blog Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/blog"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#225AE3] hover:bg-[#1a4bc0]"
        >
          ← Back to Blog
        </Link>
      </div>
    </div>
  );
} 