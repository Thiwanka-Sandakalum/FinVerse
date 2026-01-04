
import React, { useState, useEffect, useRef } from 'react';
import { getBlogById } from '../data/blogs';
import { useNavigate, useParams } from 'react-router-dom';
import { MarkdownRenderer } from '../utils/formatChatText';


const BlogPostPage: React.FC = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const [blog, setBlog] = useState<any>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const navigate = useNavigate();
  const onBack = () => {
    navigate('/blog');
  };

  useEffect(() => {
    if (blogId) {
      setBlog(getBlogById(Number(blogId)));
    }
    window.scrollTo(0, 0);

    return () => {
      // Cleanup audio on unmount
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [blogId]);



  if (!blog) return <div>Blog not found</div>;

  return (
    <div className="animate-fade-in bg-white min-h-screen">
      {/* Hero Image */}
      <div className="relative h-[400px] w-full">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-white">
          <div className="max-w-4xl mx-auto">
            <button onClick={onBack} className="text-white/80 hover:text-white mb-6 flex items-center text-sm font-bold uppercase tracking-wider">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Articles
            </button>
            <span className="bg-brand-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
              {blog.category || 'Finance'}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight">{blog.title}</h1>
            <div className="flex items-center text-sm font-medium text-white/90">
              <span>By {blog.author || 'FinVerse Team'}</span>
              <span className="mx-3">•</span>
              <span>{blog.date || 'Recently Updated'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="prose prose-lg prose-indigo mx-auto text-gray-700 leading-relaxed">
          {blog.content ? (
            <MarkdownRenderer content={blog.content} />
          ) : (
            <p>Content not available.</p>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Share this article</h3>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors">Facebook</button>
            <button className="px-4 py-2 bg-sky-50 text-sky-600 rounded-lg font-bold text-sm hover:bg-sky-100 transition-colors">Twitter</button>
            <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors">Copy Link</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
