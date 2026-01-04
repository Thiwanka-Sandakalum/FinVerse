
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Blogs from '../components/Blogs';


const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const onBlogSelect = (blogId: number) => {
    // Navigate to the blog post page
    navigate(`/blog/${blogId}`);
  };
  return (
    <div className="animate-fade-in">
      <div className="bg-brand-50 py-16 text-center border-b border-brand-100">
        <h1 className="text-4xl font-serif font-bold text-brand-900 mb-4">inVerse Insights</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">Expert advice, financial tips, and the latest news to help you make smarter money decisions.</p>
      </div>
      <Blogs onBlogSelect={onBlogSelect} />
      {/* CTA for newsletter */}
      <div className="bg-brand-900 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Subscribe to our newsletter</h3>
          <p className="mb-6 opacity-80">Get the latest financial tips delivered straight to your inbox.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <input type="email" placeholder="Enter your email" className="px-6 py-3 rounded-full text-gray-800 w-full sm:w-96 focus:outline-none focus:ring-2 focus:ring-accent-500" />
            <button className="bg-accent-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold transition-colors">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
