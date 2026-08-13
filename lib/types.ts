export interface Category {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  description: string;
  icon_name: string;
  image_url: string;
  brands: string[];
  features: string[];
  specifications: TechSpec[];
  applications: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SubCategory {
  id: string;
  category_id: string;
  name: string;
  sort_order: number;
  products?: Product[];
}

export interface Product {
  id: string;
  category_id: string;
  sub_category_id: string | null;
  name: string;
  spec: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  image?: string;
  slug?: string;
  featured?: boolean;
}

export interface TechSpec {
  label: string;
  value: string;
}

export type RfqStatus = 'new' | 'reviewed' | 'quoted' | 'closed';

export interface RfqRequest {
  id: string;
  company: string;
  contact_person: string;
  phone: string;
  email: string;
  category: string;
  message: string;
  status: RfqStatus;
  created_at: string;
  rfq_items?: RfqItem[];
}

export interface RfqItem {
  id: string;
  rfq_request_id: string;
  product_name: string;
  spec: string | null;
  category: string;
  quantity: number;
  created_at: string;
}

export interface RfqSubmission {
  company: string;
  contact_person: string;
  phone: string;
  email: string;
  category: string;
  message: string;
  items: {
    product_name: string;
    spec: string | null;
    category: string;
    quantity: number;
  }[];
}
