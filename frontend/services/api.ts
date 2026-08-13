import { Property, Location, PropertyType, Amenity, Agent, Blog, Testimonial, Faq, Enquiry, Appointment, User, PaginatedResponse } from '../types';

const API_BASE = '/api';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${res.status}`);
    }

    return res.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (typeof window === 'undefined') {
      return { data: [] } as unknown as T;
    }
    throw err;
  }
}

// Property APIs
export async function getProperties(params: Record<string, any> = {}): Promise<PaginatedResponse<Property>> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      if (Array.isArray(val)) {
        query.append(key, val.join(','));
      } else {
        query.append(key, String(val));
      }
    }
  });
  const queryString = query.toString() ? `?${query.toString()}` : '';
  return fetchApi<PaginatedResponse<Property>>(`/properties${queryString}`);
}

export async function getPropertyBySlug(slug: string): Promise<{ data: Property }> {
  return fetchApi<{ data: Property }>(`/properties/${slug}`);
}

export async function createProperty(data: Partial<Property>): Promise<{ data: Property }> {
  return fetchApi<{ data: Property }>('/properties', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProperty(id: number, data: Partial<Property>): Promise<{ data: Property }> {
  return fetchApi<{ data: Property }>(`/properties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteProperty(id: number): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/properties/${id}`, {
    method: 'DELETE',
  });
}

export async function toggleFavorite(propertyId: number): Promise<{ message: string; is_favorite: boolean }> {
  return fetchApi<{ message: string; is_favorite: boolean }>(`/properties/${propertyId}/favorite`, {
    method: 'POST',
  });
}

export async function getFavorites(): Promise<PaginatedResponse<Property>> {
  return fetchApi<PaginatedResponse<Property>>('/favorites');
}

// Metadata APIs
export async function getLocations(): Promise<{ data: Location[] }> {
  return fetchApi<{ data: Location[] }>('/locations');
}

export async function createLocation(data: Partial<Location>): Promise<{ data: Location }> {
  return fetchApi<{ data: Location }>('/locations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateLocation(id: number, data: Partial<Location>): Promise<{ data: Location }> {
  return fetchApi<{ data: Location }>(`/locations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteLocation(id: number): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/locations/${id}`, {
    method: 'DELETE',
  });
}

export async function getPropertyTypes(): Promise<{ data: PropertyType[] }> {
  return fetchApi<{ data: PropertyType[] }>('/property-types');
}

export async function getAmenities(): Promise<{ data: Amenity[] }> {
  return fetchApi<{ data: Amenity[] }>('/amenities');
}

// Agent APIs
export async function getAgents(): Promise<{ data: Agent[] }> {
  return fetchApi<{ data: Agent[] }>('/agents');
}

export async function getAgentBySlug(slug: string): Promise<{ data: Agent }> {
  return fetchApi<{ data: Agent }>(`/agents/${slug}`);
}

// Submission APIs
export async function submitEnquiry(data: Partial<Enquiry>): Promise<{ message: string; data: Enquiry }> {
  return fetchApi<{ message: string; data: Enquiry }>('/enquiries', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function submitAppointment(data: Partial<Appointment>): Promise<{ message: string; data: Appointment }> {
  return fetchApi<{ message: string; data: Appointment }>('/appointments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getUserEnquiries(): Promise<{ data: Enquiry[] }> {
  return fetchApi<{ data: Enquiry[] }>('/enquiries');
}

export async function getUserAppointments(): Promise<{ data: Appointment[] }> {
  return fetchApi<{ data: Appointment[] }>('/appointments');
}

// CMS APIs
export async function getBlogs(): Promise<{ data: Blog[] }> {
  return fetchApi<{ data: Blog[] }>('/blogs');
}

export async function getBlogBySlug(slug: string): Promise<{ data: Blog }> {
  return fetchApi<{ data: Blog }>(`/blogs/${slug}`);
}

export async function getTestimonials(): Promise<{ data: Testimonial[] }> {
  return fetchApi<{ data: Testimonial[] }>('/testimonials');
}

export async function getFaqs(): Promise<{ data: Faq[] }> {
  return fetchApi<{ data: Faq[] }>('/faqs');
}

// Admin APIs
export async function getAdminStats(): Promise<any> {
  return fetchApi<any>('/admin/stats');
}

export async function updateEnquiryStatus(id: number, status: string): Promise<any> {
  return fetchApi<any>(`/admin/enquiries/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function updateAppointmentStatus(id: number, status: string): Promise<any> {
  return fetchApi<any>(`/admin/appointments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function togglePropertyPublish(id: number): Promise<any> {
  return fetchApi<any>(`/admin/properties/${id}/publish`, {
    method: 'POST',
  });
}

export async function togglePropertyFeatured(id: number): Promise<any> {
  return fetchApi<any>(`/admin/properties/${id}/featured`, {
    method: 'POST',
  });
}

export async function getAdminUsers(): Promise<{ data: User[] }> {
  return fetchApi<{ data: User[] }>('/admin/users');
}

export async function updateUserRole(id: number, role: string): Promise<{ user: User }> {
  return fetchApi<{ user: User }>(`/admin/users/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
}
