
export enum LeadStatus {
  NEW = '신규',
  CONTACTED = '연락완료',
  PENDING = '보류',
  COMPLETED = '완료'
}

export interface SiteSettings {
  id?: string;
  hero: {
    title: string;
    subtitle: string;
    imageUrl: string;
    badges: string[];
    cta1: string;
    cta2: string;
  };
  partnership: {
    title: string;
    description: string;
    imageUrl?: string;
    cards: Array<{ title: string; content: string }>;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  points: string[];
  tags: string[];
  imageUrl: string;
  order: number;
  isActive: boolean;
}

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  images: string[];
  order: number;
  isActive: boolean;
  createdAt: number;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  isFixed: boolean;
  isActive: boolean;
  createdAt: number;
}

export interface Lead {
  id: string;
  storeName: string;
  phone: string;
  products: string[];
  region: string;
  preferredTime: string;
  message: string;
  status: LeadStatus;
  memo: string;
  createdAt: number;
}
