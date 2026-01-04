
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { BLOG_POSTS } from '../data/blogs';

interface BlogsProps {
    onBlogSelect?: (id: number) => void;
}

const Blogs: React.FC<BlogsProps> = ({ onBlogSelect }) => {
    return (
        <section className="py-20 bg-[#f4f8fa]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Latest Stories Section */}
                <h2 className="text-3xl font-bold text-[#0c2b5e] mb-10 font-sans">Latest stories</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                    {BLOG_POSTS.map(post => (
                        <div
                            key={post.id}
                            className="group cursor-pointer flex flex-col h-full bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300"
                            onClick={() => onBlogSelect && onBlogSelect(post.id)}
                        >
                            <div className="overflow-hidden rounded-t-2xl aspect-[4/3] relative">
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                {post.category && (
                                    <span className="absolute top-3 left-3 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full shadow">{post.category}</span>
                                )}
                            </div>
                            <div className="flex-1 flex flex-col p-5">
                                <h3 className="font-bold text-xl text-gray-900 mb-2 leading-snug group-hover:text-blue-700 transition-colors">
                                    {post.title}
                                </h3>
                                <div className="flex items-center text-gray-500 text-xs mb-3 space-x-2">
                                    {post.author && <span>By <span className="font-semibold text-gray-700">{post.author}</span></span>}
                                    {post.date && <span className="mx-1">•</span>}
                                    {post.date && <span>{post.date}</span>}
                                </div>
                                {post.content && (() => {
                                    // Find the first non-empty paragraph for preview
                                    const paragraphs = post.content.split(/\n\n+/).filter(p => p.trim().length > 0);
                                    const preview = paragraphs[0] || '';
                                    return (
                                        <div className="prose prose-sm text-gray-600 mb-4 max-h-24 overflow-hidden">
                                            <ReactMarkdown>{preview}</ReactMarkdown>
                                        </div>
                                    );
                                })()}
                                <div className="flex items-center text-[#2563eb] font-semibold text-sm mt-auto">
                                    Read more <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Protect Yourself Banner */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row items-center mb-24">
                    <div className="md:w-1/2 p-10 lg:p-16">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block">PROTECT YOURSELF</span>
                        <h3 className="text-3xl md:text-4xl font-bold text-[#0c2b5e] mb-6 leading-tight">
                            8 of the newest scams targeting your money
                        </h3>
                        <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                            Fresh forms of financial fraud crop up all the time. Here's what to look for — and how to keep your money and identity safe.
                        </p>
                        <a
                            href="https://www.usbank.com/financialiq/manage-your-household/protect-your-assets/new-scams-targeting-your-money.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#2563eb] font-bold text-lg flex items-center hover:text-blue-800"
                        >
                            Learn more <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </a>
                    </div>
                    <div className="md:w-1/2 h-full min-h-[400px] relative">
                        <img src="https://www.usbank.com/content/dam/usbank/en/images/photos/common/photo-sending-money-via-phone-3x2.jpg/jcr:content/renditions/cq5dam.webp.1200.800.webp" alt="Scam protection" className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Blogs;
