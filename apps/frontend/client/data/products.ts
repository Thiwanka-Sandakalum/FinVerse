
import { Product } from '../types';

// Helper to parse rate for sorting/filtering
export const parseRate = (rateStr: string): number => {
  const match = rateStr.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[0]) : 0;
};

// Background images by type
const BG_IMAGES = {
  loan: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80', // House keys / Property
  card: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=1600&q=80', // Shopping / POS
  savings: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1600&q=80', // Money jar / Coins
  investment: 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&w=1600&q=80' // Stock chart
};

const BASE_PRODUCTS: Product[] = [
  {
    id: '1',
    institution: 'Citi Bank',
    name: 'Conventional Home Loan',
    type: 'loan',
    rate: '3.5% APR',
    term: '15 or 30 years',
    features: ['Low down payment', 'Fixed rates', 'Digital application', 'No prepayment penalty'],
    logoUrl: 'https://logo.clearbit.com/citi.com',
    badge: 'Best Rate Today',
    featured: true,
    backgroundImage: BG_IMAGES.loan
  },
  {
    id: '2',
    institution: 'Chase',
    name: 'Sapphire Preferred®',
    type: 'card',
    rate: '21.49% Variable APR',
    features: ['60,000 Bonus Points', '$95 Annual Fee', '2x Points on Travel', 'Travel Insurance Included'],
    logoUrl: 'https://logo.clearbit.com/chase.com',
    badge: 'Most Popular',
    featured: true,
    backgroundImage: BG_IMAGES.card
  },
  {
    id: '3',
    institution: 'Wells Fargo',
    name: 'Platinum Savings',
    type: 'savings',
    rate: '4.15% APY',
    features: ['No monthly fees', 'FDIC Insured', '24/7 Access', 'Overdraft Protection'],
    logoUrl: 'https://logo.clearbit.com/wellsfargo.com',
    featured: true,
    backgroundImage: BG_IMAGES.savings
  },
  {
    id: '4',
    institution: 'HSBC',
    name: 'Premier Checking',
    type: 'savings',
    rate: '0.01% APY',
    features: ['Global Transfers', 'No foreign fees', 'Priority Service'],
    logoUrl: 'https://logo.clearbit.com/hsbc.com',
    featured: false,
    backgroundImage: BG_IMAGES.savings
  },
  {
    id: '5',
    institution: 'Fidelity',
    name: 'Zero Total Market Index',
    type: 'investment',
    rate: '12.5% 5yr Return',
    features: ['0% Expense Ratio', 'No Minimums', 'Broad Market Exposure'],
    logoUrl: 'https://logo.clearbit.com/fidelity.com',
    badge: 'Top Performer',
    featured: true,
    backgroundImage: BG_IMAGES.investment
  },
  {
    id: '6',
    institution: 'Bank of America',
    name: 'Customized Cash Rewards',
    type: 'card',
    rate: '18.24% APR',
    features: ['3% Cash Back', 'No Annual Fee', '0% Intro APR for 15 billing cycles'],
    logoUrl: 'https://logo.clearbit.com/bankofamerica.com',
    featured: false,
    backgroundImage: BG_IMAGES.card
  },
  {
    id: '7',
    institution: 'SoFi',
    name: 'Personal Loan',
    type: 'loan',
    rate: '8.99% APR',
    term: '2-7 years',
    features: ['No Origination Fees', 'Unemployment Protection', 'Fast Funding'],
    logoUrl: 'https://logo.clearbit.com/sofi.com',
    featured: false,
    backgroundImage: BG_IMAGES.loan
  },
  {
    id: '8',
    institution: 'Vanguard',
    name: 'S&P 500 ETF',
    type: 'investment',
    rate: '10.8% Avg Return',
    features: ['Low Fees', 'Tax Efficient', 'Auto Rebalancing'],
    logoUrl: 'https://logo.clearbit.com/vanguard.com',
    featured: false,
    backgroundImage: BG_IMAGES.investment
  }
];

// Generate more products for pagination/demo
const GENERATED_PRODUCTS: Product[] = Array.from({ length: 24 }).map((_, i) => {
  const base = BASE_PRODUCTS[i % BASE_PRODUCTS.length];
  return {
    ...base,
    id: `gen-${i}`,
    name: `${base.name} ${Math.floor(i / 8) + 1}`,
    rate: base.type === 'loan' || base.type === 'card' 
      ? `${(parseRate(base.rate) + (Math.random() * 2 - 1)).toFixed(2)}% APR`
      : `${(parseRate(base.rate) + (Math.random() * 0.5)).toFixed(2)}% APY`,
    featured: Math.random() > 0.8,
    badge: Math.random() > 0.9 ? 'New Arrival' : undefined,
    backgroundImage: BG_IMAGES[base.type]
  };
});

export const ALL_PRODUCTS = [...BASE_PRODUCTS, ...GENERATED_PRODUCTS];

export const getProductById = (id: string): Product | undefined => {
  return ALL_PRODUCTS.find(p => p.id === id);
};

export const getRelatedProducts = (product: Product, limit: number = 4): Product[] => {
  return ALL_PRODUCTS
    .filter(p => p.type === product.type && p.id !== product.id)
    .slice(0, limit);
};
