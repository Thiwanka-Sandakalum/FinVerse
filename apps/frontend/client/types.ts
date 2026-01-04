
export interface Product {
  id: string;
  institution: string;
  name: string;
  type: 'loan' | 'card' | 'savings' | 'investment';
  rate: string;
  term?: string;
  features: string[];
  logoUrl: string;
  badge?: string;
  featured?: boolean;
  backgroundImage?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  // New fields for Rich UI
  type?: 'text' | 'product-recommendation' | 'tool-suggestion' | 'comparison';
  data?: any; 
}

export enum ViewState {
  HOME = 'HOME',
  MARKETPLACE = 'MARKETPLACE',
  INSTITUTIONS = 'INSTITUTIONS',
  SIGNUP = 'SIGNUP',
  BLOG = 'BLOG',
  BLOG_POST = 'BLOG_POST',
  COMPARE = 'COMPARE',
  PROFILE = 'PROFILE',
  ABOUT = 'ABOUT',
  CHAT = 'CHAT',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
  TOOLS = 'TOOLS'
}
