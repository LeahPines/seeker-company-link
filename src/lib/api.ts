import { getAuthToken, clearAuthData } from './auth';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = 'https://your-backend-api.com/api'; // Replace with actual backend URL

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
        throw new ApiError(response.status, errorData.message || 'Request failed');
      }

      return await response.json();
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