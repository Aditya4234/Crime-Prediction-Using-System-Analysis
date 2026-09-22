const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface FetchOptions extends RequestInit {
  token?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<{ success: boolean; data?: T; error?: string; message?: string }> {
  const { token, ...fetchOptions } = options;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...fetchOptions,
      headers,
      credentials: 'include',
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export const api = {
  get: <T>(endpoint: string, token?: string) =>
    fetchApi<T>(endpoint, { method: 'GET', token }),

  post: <T>(endpoint: string, body: any, token?: string) =>
    fetchApi<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      token,
    }),

  put: <T>(endpoint: string, body: any, token?: string) =>
    fetchApi<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      token,
    }),

  patch: <T>(endpoint: string, body: any, token?: string) =>
    fetchApi<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
      token,
    }),

  delete: <T>(endpoint: string, token?: string) =>
    fetchApi<T>(endpoint, { method: 'DELETE', token }),
};

export default api;
