import React from 'react';

const REVIEWS = [
  {
    id: 1,
    name: "Sarah Perera",
    role: "Small Business Owner",
    content: "inVerse helped me find the perfect loan for my bakery expansion. The AI comparison tool saved me days of visiting different banks.",
    rating: 5,
    image: "https://ui-avatars.com/api/?name=Sarah+Perera&background=0D8ABC&color=fff"
  },
  {
    id: 2,
    name: "Dilshan Silva",
    role: "Software Engineer",
    content: "I was overwhelmed by credit card options. The assistant explained the rewards clearly and I found a card that pays for my flights!",
    rating: 5,
    image: "https://ui-avatars.com/api/?name=Dilshan+Silva&background=random"
  },
  {
    id: 3,
    name: "Kumari Jayawardena",
    role: "Teacher",
    content: "Finally, a platform that makes banking simple. I moved my savings to a high-yield account I didn't even know existed.",
    rating: 4,
    image: "https://ui-avatars.com/api/?name=Kumari+Jayawardena&background=ef4444&color=fff"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Loved by Thousands of Sri Lankans</h2>
          <p className="text-gray-600">Don't just take our word for it. See what our community has to say.</p>
        </div>

        {/* Scrollable container for mobile, Grid for desktop */}
        <div className="flex flex-col md:flex-row gap-8 overflow-x-auto pb-4 md:pb-0 snap-x no-scrollbar">
          {REVIEWS.map((review) => (
            <div key={review.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex-1 min-w-[280px] snap-center hover:shadow-md transition-shadow">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic min-h-[80px]">"{review.content}"</p>
              <div className="flex items-center">
                <img src={review.image} alt={review.name} className="w-10 h-10 rounded-full mr-4 bg-gray-200" />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                  <p className="text-gray-500 text-xs">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Testimonials;