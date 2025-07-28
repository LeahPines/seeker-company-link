import { getAuthToken, clearAuthData } from './auth';
import { toast } from '@/hooks/use-toast';


const API_BASE_URL = 'https://localhost:7100/api'; 


export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const createApiClient = () => {
  const makeRequest = async (
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> => {
    const token = getAuthToken();
    const url = `${API_BASE_URL}${endpoint}`;

    console.log('Making API request to:', url);
    console.log('Endpoint:', endpoint);
    console.log('Method:', options.method || 'GET');
    console.log('Request data:', options.body);

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      console.log('Response URL:', response.url);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized - clear auth and redirect to login
          clearAuthData();
          window.location.href = '/';
          throw new ApiError(401, 'Session expired');
        }
        
        if (response.status === 403) {
          toast({
            title: "Access Denied",
            description: "You're not allowed to perform this action",
            variant: "destructive",
          });
          throw new ApiError(403, 'Access denied');
        }

        if (response.status === 500) {
          toast({
            title: "Server Error",
            description: "Something went wrong. Please try again later.",
            variant: "destructive",
          });
          throw new ApiError(500, 'Server error');
        }

        const errorData = await response.json().catch(() => ({}));
        console.log('API Error Response:', errorData);
        console.log('Full error details:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          errorData
        });
        throw new ApiError(response.status, errorData.message || 'Request failed');
      }

      // Handle responses that might not have JSON content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        // For successful responses without JSON content, return a success indicator
        return { success: true };
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      toast({
        title: "Network Error",
        description: "Please check your connection and try again",
        variant: "destructive",
      });
      throw new ApiError(0, 'Network error');
    }
  };

  return {
    get: (endpoint: string) => makeRequest(endpoint),
    post: (endpoint: string, data?: any) => 
      makeRequest(endpoint, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      }),
    put: (endpoint: string, data?: any) => 
      makeRequest(endpoint, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      }),
    delete: (endpoint: string) => 
      makeRequest(endpoint, { method: 'DELETE' }),
  };
};

export const api = createApiClient();