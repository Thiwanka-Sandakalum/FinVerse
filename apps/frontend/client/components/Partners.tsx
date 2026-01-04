import React from 'react';

const BANKS = [
  { name: 'Bank of Ceylon', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/Bank_of_Ceylon.svg/1200px-Bank_of_Ceylon.svg.png' },
  { name: "People's Bank", logo: "https://www.invest.lk/wp-content/uploads/2017/12/logo.png" },
  { name: 'Commercial Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Commercial_Bank_logo.svg/1280px-Commercial_Bank_logo.svg.png' },
  { name: 'Hatton National Bank', logo: 'https://onlinebanking.hnb.lk/images/public/styles/img//PngHnbLogoColored.png' },
  { name: 'Sampath Bank', logo: 'https://vectorseek.com/wp-content/uploads/2023/09/Sampath-Bank-Plc-Logo-Vector.svg-.png' },
  { name: 'HSBC', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/HSBC_Logo_2018.png' },
  { name: 'DFCC Bank', logo: 'https://properties.dfcc.lk/dfccweb/uploads/38bdcb67-8a17-4d6c-b461-9c99588f58cb/DFCC-LogoStack.png' },
];

const Partners: React.FC = () => {
  return (
    <section className="py-10 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
          Trusted by leading financial institutions in Sri Lanka
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
           {BANKS.map((bank, index) => (
             <div key={index} className="flex justify-center items-center h-16 w-32 group cursor-pointer">
               <img 
                 src={bank.logo} 
                 alt={bank.name} 
                 className="max-h-12 max-w-full w-auto object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                 onError={(e) => {
                   // Fallback if logo fails to load
                   (e.target as HTMLImageElement).src = `https://placehold.co/120x60/f3f4f6/374151?text=${bank.name.split(' ')[0]}`;
                 }}
               />
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};
export default Partners;