import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-brand-700 pb-12 mb-12">

          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center mb-6 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-brand-700 rounded-tr-lg rounded-bl-lg flex items-center justify-center mr-2">
                <span className="text-white font-serif font-bold text-lg">iV</span>
              </div>
              <span className="font-serif text-2xl font-bold">inVerse</span>
            </Link>
            <p className="text-brand-200 text-sm leading-relaxed">
              Together, we simplify your choices and set goals. The security you have always been looking for, in your home.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Company</h4>
            <ul className="space-y-3 text-brand-200 text-sm">
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Press</a></li>
              <li><a href="#" className="hover:text-white">Corporate Responsibility</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Support</h4>
            <ul className="space-y-3 text-brand-200 text-sm">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><Link to="/chat" className="hover:text-white">Contact Us</Link></li>
              <li><a href="#" className="hover:text-white">Security</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Global Presence</h4>
            <div className="h-24 w-full bg-brand-800 rounded-lg flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-cover bg-center"></div>
              <span className="relative z-10 text-xs font-semibold uppercase tracking-widest text-brand-100">Operating in 30+ Countries</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-brand-300">
          <p>&copy; {new Date().getFullYear()} inVerse Financial Technologies. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Cookie Policy</a>
            <a href="#" className="hover:text-white">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;