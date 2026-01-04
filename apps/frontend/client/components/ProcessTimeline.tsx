import React from 'react';

const STEPS = [
  {
    id: 1,
    title: "Discover",
    description: "Browse financial products from multiple institutions to find the best fit.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80",
    delay: "0ms"
  },
  {
    id: 2,
    title: "Save & Organize",
    description: "Create your personal hub to keep track of your favorite financial products.",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=500&q=80",
    delay: "150ms"
  },
  {
    id: 3,
    title: "Chat",
    description: "AI assistant for advice and instant financial insights.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=500&q=80",
    delay: "300ms"
  },
  {
    id: 4,
    title: "Share",
    description: "Share comparisons with family and friends.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=500&q=80",
    delay: "450ms"
  },
  {
    id: 5,
    title: "Apply",
    description: "Connect with institutions to start your financial journey.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500&q=80",
    delay: "600ms"
  }
];

const ProcessTimeline: React.FC = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-serif font-bold text-brand-900 mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Your journey to better financial decisions in five simple steps.</p>
        </div>

        <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-[40%] left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
                {STEPS.map((step) => (
                    <div 
                        key={step.id} 
                        className="group relative flex flex-col items-center text-center animate-fade-in-up" 
                        style={{ animationDelay: step.delay }}
                    >
                        {/* Thumbnail Image Container */}
                        <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-lg mb-8 relative border-[6px] border-white group-hover:shadow-2xl transition-all duration-300 bg-gray-100 transform group-hover:-translate-y-2 z-10">
                             <div className="absolute inset-0 bg-brand-900/10 group-hover:bg-transparent transition-colors z-20"></div>
                             <img 
                                src={step.image} 
                                alt={step.title} 
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                             />
                             
                             {/* Number Badge */}
                             <div className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur text-brand-900 font-bold rounded-full flex items-center justify-center shadow-md z-30">
                                {step.id}
                             </div>
                        </div>

                        {/* Content */}
                        <div className="bg-white p-2 rounded-xl w-full relative z-20">
                            <h3 className="text-xl font-bold text-brand-900 mb-3 group-hover:text-brand-600 transition-colors">{step.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessTimeline;