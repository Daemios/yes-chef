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
