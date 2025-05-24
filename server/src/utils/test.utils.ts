/**
 * Test Utilities
 * Helper functions for testing authentication and API endpoints
 */

import { generateToken } from './auth.utils';
import { UserRepository } from '../repositories/user.repository';
import { hashPassword } from './auth.utils';

/**
 * Test user data
 */
export const testUsers = {
  validUser: {
    email: 'test@example.com',
    password: 'testpassword123',
    name: 'Test User'
  },
  adminUser: {
    email: 'admin@example.com',
    password: 'adminpassword123',
    name: 'Admin User'
  },
  invalidUser: {
    email: 'invalid@example.com',
    password: 'wrongpassword'
  }
};

/**
 * Generate a valid JWT token for testing
 */
export const generateTestToken = (userId: number = 1, email: string = 'test@example.com'): string => {
  return generateToken(userId, email);
};

/**
 * Generate an invalid JWT token for testing
 */
export const generateInvalidToken = (): string => {
  return 'invalid.jwt.token';
};

/**
 * Create a test user in the database
 */
export const createTestUser = async (userData = testUsers.validUser) => {
  try {
    // Check if user already exists
    const existingUser = await UserRepository.findByEmail(userData.email);
    if (existingUser) {
      return existingUser;
    }

    // Hash the password
    const hashedPassword = await hashPassword(userData.password);

    // Create the user
    const user = await UserRepository.create({
      email: userData.email,
      name: userData.name,
      password: hashedPassword
    });

    return user;
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
};

/**
 * Clean up test users from the database
 */
export const cleanupTestUsers = async () => {
  try {
    const testEmails = Object.values(testUsers).map(user => user.email);
    
    for (const email of testEmails) {
      const user = await UserRepository.findByEmail(email);
      if (user) {
        // Note: UserRepository doesn't have a delete method, so we'll skip cleanup for now
        // In a real test environment, you'd implement user deletion
        console.log(`Test user ${email} would be cleaned up here`);
      }
    }
  } catch (error) {
    console.error('Error cleaning up test users:', error);
  }
};

/**
 * Sample recipe data for testing
 */
export const testRecipes = {
  validRecipe: {
    title: 'Test Recipe',
    description: 'A test recipe for testing purposes',
    ingredients: ['Test ingredient 1', 'Test ingredient 2'],
    instructions: ['Step 1: Test step', 'Step 2: Another test step'],
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: 'medium' as const,
    tags: ['test', 'sample']
  },
  updateRecipe: {
    title: 'Updated Test Recipe',
    description: 'An updated test recipe',
    prepTime: 20,
    cookTime: 35
  },
  invalidRecipe: {
    // Missing required fields
    description: 'Invalid recipe without title'
  }
};

/**
 * Sample meal plan data for testing
 */
export const testMealPlans = {
  validMealPlan: {
    name: 'Test Meal Plan',
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    isActive: true,
    days: [
      {
        day: 'Monday',
        date: new Date().toISOString().split('T')[0],
        breakfast: '',
        lunch: '',
        dinner: ''
      },
      {
        day: 'Tuesday',
        date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
        breakfast: '',
        lunch: '',
        dinner: ''
      }
    ]
  },
  updateMealPlan: {
    name: 'Updated Meal Plan',
    isActive: false
  },
  invalidMealPlan: {
    // Missing required fields
    days: []
  }
};

/**
 * Auth headers for testing protected routes
 */
export const getAuthHeaders = (token?: string) => {
  const authToken = token || generateTestToken();
  return {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  };
};

/**
 * Standard headers for non-authenticated requests
 */
export const getStandardHeaders = () => {
  return {
    'Content-Type': 'application/json'
  };
};
