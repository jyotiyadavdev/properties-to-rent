import { projectId, publicAnonKey } from '/utils/supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-9d116660`;

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('accessToken');
  
  console.log(`🌐 API Call: ${options.method || 'GET'} ${endpoint}`);
  console.log('🔑 Token exists:', !!token);
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    // Custom header for our token (Supabase won't intercept this)
    'X-Access-Token': token || '',
    // Authorization always uses publicAnonKey (to pass Supabase's validation)
    'Authorization': `Bearer ${publicAnonKey}`,
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    console.log(`📡 Response Status: ${response.status} ${response.statusText}`);
    
    const data = await response.json();
    console.log('📦 Response Data:', data);
    
    if (!response.ok) {
      const errorMessage = data.error || data.message || 'API request failed';
      console.error(`❌ API Error [${response.status}]:`, errorMessage);
      throw new Error(errorMessage);
    }

    console.log('✅ API call successful');
    return data;
  } catch (error: any) {
    console.error('❌ API Call Failed:', error);
    throw error;
  }
}

// ============================================
// Public APIs
// ============================================

export const getProperties = async (filters: any = {}) => {
  const params = new URLSearchParams();
  
  Object.keys(filters).forEach(key => {
    if (filters[key]) {
      params.append(key, filters[key]);
    }
  });

  return apiCall(`/properties?${params.toString()}`);
};

export const getFeaturedProperties = async () => {
  return apiCall('/properties/featured');
};

export const getPropertyById = async (id: string) => {
  return apiCall(`/properties/${id}`);
};

export const submitInquiry = async (inquiry: any) => {
  return apiCall('/inquiries', {
    method: 'POST',
    body: JSON.stringify(inquiry),
  });
};

// ============================================
// Admin APIs - Image Upload
// ============================================

export const uploadPropertyImage = async (file: File) => {
  const token = localStorage.getItem('accessToken');
  
  console.log('📤 Uploading image:', file.name, file.size);
  
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${BASE_URL}/admin/upload-image`, {
      method: 'POST',
      headers: {
        // Custom header for our token (Supabase won't intercept this)
        'X-Access-Token': token || '',
        // Authorization always uses publicAnonKey (to pass Supabase's validation)
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: formData,
    });

    console.log(`📡 Upload Response Status: ${response.status}`);
    
    const data = await response.json();
    console.log('📦 Upload Response Data:', data);
    
    if (!response.ok) {
      const errorMessage = data.error || 'Failed to upload image';
      console.error(`❌ Upload Error [${response.status}]:`, errorMessage);
      throw new Error(errorMessage);
    }

    console.log('✅ Image uploaded successfully:', data.data.url);
    return data;
  } catch (error: any) {
    console.error('❌ Image upload failed:', error);
    throw error;
  }
};

// ============================================
// Auth APIs
// ============================================

export const signup = async (data: { email: string; password: string; name: string }) => {
  console.log('🔵 Signup API call:', { email: data.email, name: data.name });
  try {
    const response = await apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    console.log('✅ Signup successful:', response);
    return response;
  } catch (error) {
    console.error('❌ Signup failed:', error);
    throw error;
  }
};

export const signin = async (data: { email: string; password: string }) => {
  console.log('🔐 Signin API call:', { email: data.email });
  
  const response = await apiCall('/auth/signin', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  console.log('📦 Signin response received:', response);

  if (response.success && response.accessToken) {
    console.log('💾 Storing access token in localStorage...');
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    console.log('✅ Token stored successfully');
    console.log('🔑 Token preview:', response.accessToken.substring(0, 50) + '...');
  } else {
    console.error('❌ No access token in response:', response);
    throw new Error('No access token received');
  }

  return response;
};

export const signout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

// ============================================
// Admin APIs
// ============================================

export const adminGetProperties = async () => {
  return apiCall('/admin/properties');
};

export const adminCreateProperty = async (property: any) => {
  return apiCall('/admin/properties', {
    method: 'POST',
    body: JSON.stringify(property),
  });
};

export const adminUpdateProperty = async (id: string, property: any) => {
  return apiCall(`/admin/properties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(property),
  });
};

export const adminDeleteProperty = async (id: string) => {
  return apiCall(`/admin/properties/${id}`, {
    method: 'DELETE',
  });
};

export const adminGetInquiries = async (filters: any = {}) => {
  const params = new URLSearchParams();
  
  Object.keys(filters).forEach(key => {
    if (filters[key]) {
      params.append(key, filters[key]);
    }
  });

  const queryString = params.toString();
  return apiCall(`/admin/inquiries${queryString ? `?${queryString}` : ''}`);
};

export const adminUpdateInquiryStatus = async (id: string, status: string) => {
  return apiCall(`/admin/inquiries/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
};

export const adminGetDashboard = async () => {
  return apiCall('/admin/dashboard');
};