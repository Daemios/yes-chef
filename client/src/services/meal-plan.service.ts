/**
 * Meal Plan Service
 * Handles all API requests related to meal plans
 */
import { fetchWithPortDiscovery } from './port-discovery.service';

// Get the stored authentication token
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * Enhanced fetch that falls back to port discovery if proxy fails
 */
const enhancedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  try {
    // Add auth token to headers if available
    const token = getAuthToken();
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      };
    }
    
    // Always ensure Content-Type is set for JSON requests
    if (options.body && typeof options.body === 'string' && !options.headers?.['Content-Type']) {
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json'
      };
    }

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
 * Get all user's meal plans
 */
export const getUserMealPlans = async (): Promise<any[]> => {  try {
    const response = await enhancedFetch('/api/meal-plans', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get meal plans');
    }

    return await response.json();
  } catch (error) {
    console.error('Get meal plans API Error:', error);
    throw error;
  }
};

/**
 * Create a new meal plan
 */
export const createMealPlan = async (mealPlanData: any): Promise<any> => {
  try {
    console.log('Creating meal plan with data:', JSON.stringify(mealPlanData, null, 2));
    
    const response = await enhancedFetch('/api/meal-plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mealPlanData),
    });

    if (!response.ok) {
      console.error('Server responded with non-OK status:', response.status);
      try {
        const errorData = await response.json();
        console.error('Error response body:', errorData);
        throw new Error(errorData.error || `Failed to create meal plan: ${response.status}`);
      } catch (jsonError) {
        // If we can't parse JSON from the error response
        throw new Error(`Failed to create meal plan: ${response.status}`);
      }
    }

    const responseData = await response.json();
    console.log('Successfully created meal plan:', responseData);
    return responseData;
  } catch (error) {
    console.error('Create meal plan API Error:', error);
    throw error;
  }
};

/**
 * Update an existing meal plan
 */
export const updateMealPlan = async (id: number, mealPlanData: any): Promise<any> => {
  try {    const response = await enhancedFetch(`/api/meal-plans/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mealPlanData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update meal plan');
    }

    return await response.json();
  } catch (error) {
    console.error('Update meal plan API Error:', error);
    throw error;
  }
};

/**
 * Add a recipe to a meal slot
 */
export const addRecipeToMealSlot = async (mealPlanId: number, dayIndex: number, mealType: string, recipeId: number): Promise<any> => {
  try {    const response = await enhancedFetch('/api/meal-plans/add-recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mealPlanId, 
        dayIndex, 
        mealType, 
        recipeId
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add recipe to meal plan');
    }

    return await response.json();
  } catch (error) {
    console.error('Add recipe to meal plan API Error:', error);
    throw error;
  }
};

/**
 * Remove a recipe from a meal slot
 */
export const removeRecipeFromMealSlot = async (mealPlanId: number, dayIndex: number, mealType: string): Promise<any> => {
  try {    const response = await enhancedFetch(`/api/meal-plans/${mealPlanId}/remove-recipe`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dayIndex, 
        mealType
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to remove recipe from meal plan');
    }

    return await response.json();
  } catch (error) {
    console.error('Remove recipe from meal plan API Error:', error);
    throw error;
  }
};
