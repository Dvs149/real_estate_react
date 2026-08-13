export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'user';
  phone?: string;
  avatar?: string;
  status: 'active' | 'inactive';
  created_at?: string;
}

export interface PropertyType {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

export interface Location {
  id: number;
  name: string;
  slug: string;
  city: string;
  state?: string;
  country?: string;
  image?: string;
  is_popular?: boolean;
  properties_count?: number;
}

export interface Amenity {
  id: number;
  name: string;
  slug: string;
  category: string;
  icon?: string;
}

export interface Agent {
  id: number;
  name: string;
  slug: string;
  email: string;
  phone: string;
  agency_name: string;
  experience_years: number;
  rating: number;
  avatar?: string;
  bio?: string;
  social_links?: Record<string, string>;
  properties_count?: number;
  properties?: Property[];
}

export interface PropertyImage {
  id: number;
  image_path: string;
  is_primary: boolean;
}

export interface PropertyFloorPlan {
  id: number;
  image_path: string;
  title: string;
  floor_name: string;
}

export interface Property {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  formatted_price: string;
  purpose: 'buy' | 'rent';
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  furnished_status: 'furnished' | 'semi-furnished' | 'unfurnished';
  property_status: 'available' | 'sold' | 'rented';
  is_featured: boolean;
  is_published: boolean;
  address: string;
  latitude?: number;
  longitude?: number;
  year_built: number;
  video_url?: string;
  views_count: number;
  primary_image?: string;
  images: PropertyImage[];
  floor_plans?: PropertyFloorPlan[];
  property_type: PropertyType;
  location: Location;
  agent: Agent;
  amenities: Amenity[];
  is_favorite?: boolean;
  created_at?: string;
}

export interface Enquiry {
  id: number;
  property_id?: number;
  agent_id?: number;
  user_id?: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'contact_in_progress' | 'resolved' | 'archived';
  notes?: string;
  created_at?: string;
  property?: Property;
  agent?: Agent;
}

export interface Appointment {
  id: number;
  property_id?: number;
  agent_id?: number;
  user_id?: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time_slot: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at?: string;
  property?: Property;
  agent?: Agent;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  author_name: string;
  published_at?: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company?: string;
  content: string;
  avatar?: string;
  rating: number;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta?: {
    current_page: number;
    last_page: number;
    total: number;
  };
}
