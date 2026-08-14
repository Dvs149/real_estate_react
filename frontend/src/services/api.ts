import { Property, Location, PropertyType, Amenity, Agent, Blog, BlogCategory, Testimonial, Faq, Enquiry, Appointment, User, PaginatedResponse } from '../types';

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

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const text = await res.text();
    let data: any = null;

    if (text && text.trim()) {
      try {
        data = JSON.parse(text);
      } catch {
        // Extract JSON payload if PHP warning or HTML tags prepended
        const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        if (jsonMatch) {
          try {
            data = JSON.parse(jsonMatch[0]);
          } catch {}
        }
      }
    }

    if (!res.ok) {
      const errorMessage =
        data?.message ||
        data?.error ||
        (text && !text.startsWith('<') ? text : null) ||
        `Request failed with status ${res.status}`;
      throw new Error(errorMessage);
    }

    if (data === null) {
      if (text.startsWith('<')) {
        throw new Error('Server returned HTML response instead of JSON');
      }
      throw new Error('Invalid JSON response from server');
    }

    return data as T;
  } catch (err: any) {
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

export async function getBlogCategories(): Promise<{ data: BlogCategory[] }> {
  return fetchApi<{ data: BlogCategory[] }>('/blog-categories');
}

export async function getAdminBlogs(): Promise<{ data: Blog[] }> {
  return fetchApi<{ data: Blog[] }>('/admin/blogs');
}

export async function createBlog(data: Partial<Blog>): Promise<{ data: Blog }> {
  return fetchApi<{ data: Blog }>('/admin/blogs', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateBlog(id: number, data: Partial<Blog>): Promise<{ data: Blog }> {
  return fetchApi<{ data: Blog }>(`/admin/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteBlog(id: number): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/admin/blogs/${id}`, {
    method: 'DELETE',
  });
}

export async function toggleBlogPublish(id: number): Promise<{ message: string; is_published: boolean }> {
  return fetchApi<{ message: string; is_published: boolean }>(`/admin/blogs/${id}/publish`, {
    method: 'POST',
  });
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

export async function createAdminUser(data: {
  name: string;
  email: string;
  phone?: string;
  role: string;
  password: string;
}): Promise<{ data: User }> {
  return fetchApi<{ data: User }>('/admin/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdminUser(
  id: number,
  data: {
    name: string;
    email: string;
    phone?: string;
    role: string;
    password?: string;
  }
): Promise<{ data: User }> {
  return fetchApi<{ data: User }>(`/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function updateUserRole(id: number, role: string): Promise<{ user: User }> {
  return fetchApi<{ user: User }>(`/admin/users/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
}

export async function deleteAdminUser(id: number): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/admin/users/${id}`, {
    method: 'DELETE',
  });
}

export interface SiteSettings {
  site_address: string;
  site_phone: string;
  site_email: string;
  site_working_hours: string;
}

export async function getSettings(): Promise<SiteSettings> {
  return fetchApi<SiteSettings>('/settings');
}

export async function updateSettings(data: Partial<SiteSettings>): Promise<{ message: string; data: SiteSettings }> {
  const res = await fetchApi<{ message: string; data: SiteSettings }>('/admin/settings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (res && res.data && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('siteSettingsUpdated', { detail: res.data }));
  }
  return res;
}
