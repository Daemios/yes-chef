/**
 * API Service
 * Handles all API requests to the backend server
 */
import { fetchWithPortDiscovery } from './port-discovery.service';

/**
 * Base API URL
 * In development, the Vite proxy handles the routing to the API server
 * In production or when proxy fails, we use direct port discovery
 */
const API_BASE = '/api';

/**
 * Enhanced fetch that falls back to port discovery if proxy fails
 */
const enhancedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  try {
    // First try the normal fetch (works with Vite proxy in development)
    const response = await fetch(url, options);
    if (response.ok || response.status < 500) {
      return response;
    }
    throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    console.warn(`Proxy fetch failed for ${url}, trying direct connection:`, error);
    
    // If proxy fails, try direct connection with port discovery
    return await fetchWithPortDiscovery(url, options);
  }
};

/**
 * Get hello message from API
 * @returns Promise with API response
 */
export const fetchHelloMessage = async (): Promise<{ message: string }> => {
  try {
    const response = await enhancedFetch(`${API_BASE}/hello`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Authentication API calls
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: number;
    email: string;
    name?: string;
    createdAt: string;
  };
  token: string;
}

export interface UserResponse {
  user: {
    id: number;
    email: string;
    name?: string;
    createdAt: string;
  };
}

/**
 * Register a new user
 */
export const registerUser = async (userData: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await enhancedFetch('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Registration API Error:', error);
    throw error;
  }
};

/**
 * Login user
 */
export const loginUser = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await enhancedFetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Login API Error:', error);
    throw error;
  }
};

/**
 * Get current user info
 */
export const getCurrentUser = async (token: string): Promise<UserResponse> => {
  try {
    const response = await enhancedFetch('/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get user info');
    }

    return await response.json();
  } catch (error) {
    console.error('Get user API Error:', error);
    throw error;
  }
};
