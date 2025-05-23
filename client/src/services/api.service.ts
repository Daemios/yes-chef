/**
 * API Service
 * Handles all API requests to the backend server
 */

/**
 * Base API URL
 * In development, the Vite proxy handles the routing to the API server
 */
const API_BASE = '/api';

/**
 * Get hello message from API
 * @returns Promise with API response
 */
export const fetchHelloMessage = async (): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_BASE}/hello`);
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
    const response = await fetch('/auth/register', {
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
    const response = await fetch('/auth/login', {
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
    const response = await fetch('/auth/me', {
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
