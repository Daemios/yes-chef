/**
 * Meal Plan Controller Tests
 * Comprehensive tests for meal plan CRUD and meal slot endpoints
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { 
  testUsers, 
  createTestUser, 
  cleanupTestUsers, 
  getAuthHeaders, 
  getStandardHeaders,
  testRecipes,
  generateTestToken,
  generateInvalidToken
} from '../../utils/test.utils';
import { RecipeRepository } from '../../repositories/recipe.repository';
import { MealPlanRepository } from '../../repositories/meal-plan.repository';

describe('Meal Plan Controller', () => {
  let testUser: any;
  let authToken: string;
  let createdRecipeId: number;
  let createdMealPlanId: number;

  beforeEach(async () => {
    // Clean up any existing test data
    await cleanupTestUsers();
    
    // Create and authenticate a test user
    testUser = await createTestUser(testUsers.validUser);
    
    const loginResponse = await request(app)
      .post('/auth/login')
      .set(getStandardHeaders())
      .send({
        email: testUsers.validUser.email,
        password: testUsers.validUser.password
      });
    
    authToken = loginResponse.body.token;
    
    // Create a test recipe to use in meal plans
    const createRecipeResponse = await request(app)
      .post('/api/recipes')
      .set(getAuthHeaders(authToken))
      .send(testRecipes.validRecipe);
    
    createdRecipeId = createRecipeResponse.body.id;
    
    // Create a test meal plan
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const testMealPlan = {
      name: 'Test Meal Plan',
      userId: testUser.id,
      startDate: today.toISOString(),
      endDate: tomorrow.toISOString(),
      isActive: true,
      days: [
        {
          day: 'Monday',
          date: today.toISOString().split('T')[0],
          breakfast: '',
          lunch: '',
          dinner: ''
        },
        {
          day: 'Tuesday',
          date: tomorrow.toISOString().split('T')[0],
          breakfast: '',
          lunch: '',
          dinner: ''
        }
      ]
    };
    
    const createMealPlanResponse = await request(app)
      .post('/api/meal-plans')
      .set(getAuthHeaders(authToken))
      .send(testMealPlan);
    
    createdMealPlanId = createMealPlanResponse.body.id;
  });

  afterEach(async () => {
    // Clean up test data
    try {
      if (createdMealPlanId) {
        await MealPlanRepository.delete(createdMealPlanId);
      }
      
      if (createdRecipeId) {
        await RecipeRepository.delete(createdRecipeId);
      }
    } catch (error) {
      // Resource might already be deleted, ignore error
    }
    
    await cleanupTestUsers();
  });

  describe('GET /api/meal-plans', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/meal-plans')
        .set(getStandardHeaders());

      expect(response.status).toBe(401);
    });

    it('should return meal plans with valid authentication', async () => {
      const response = await request(app)
        .get('/api/meal-plans')
        .set(getAuthHeaders(authToken));

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should only return meal plans belonging to authenticated user', async () => {
      // Create a second user and meal plan
      const secondUser = await createTestUser(testUsers.adminUser);
      const secondUserToken = generateTestToken(secondUser.id, secondUser.email);
      
      // Create meal plan for second user
      const testMealPlan = {
        name: 'Second User Meal Plan',
        userId: secondUser.id,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        isActive: true,
        days: []
      };
      
      await request(app)
        .post('/api/meal-plans')
        .set(getAuthHeaders(secondUserToken))
        .send(testMealPlan);
      
      // Get first user's meal plans
      const response = await request(app)
        .get('/api/meal-plans')
        .set(getAuthHeaders(authToken));

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      // All returned meal plans should belong to first user
      response.body.forEach((mealPlan: any) => {
        expect(mealPlan.userId).toBe(testUser.id);
      });
    });
  });

  describe('GET /api/meal-plans/:id', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get(`/api/meal-plans/${createdMealPlanId}`)
        .set(getStandardHeaders());

      expect(response.status).toBe(401);
    });

    it('should return meal plan by valid ID with authentication', async () => {
      const response = await request(app)
        .get(`/api/meal-plans/${createdMealPlanId}`)
        .set(getAuthHeaders(authToken));

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(createdMealPlanId);
      expect(response.body.userId).toBe(testUser.id);
    });

    it('should return 404 for non-existent meal plan', async () => {
      const response = await request(app)
        .get(`/api/meal-plans/9999`)
        .set(getAuthHeaders(authToken));

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get(`/api/meal-plans/invalid-id`)
        .set(getAuthHeaders(authToken));

      expect(response.status).toBe(400);
    });

    it('should return 403 when accessing another user\'s meal plan', async () => {
      // Create a second user
      const secondUser = await createTestUser(testUsers.adminUser);
      const secondUserToken = generateTestToken(secondUser.id, secondUser.email);
      
      // Attempt to access first user's meal plan with second user's token
      const response = await request(app)
        .get(`/api/meal-plans/${createdMealPlanId}`)
        .set(getAuthHeaders(secondUserToken));

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/meal-plans', () => {
    it('should return 401 without authentication', async () => {
      const testMealPlan = {
        name: 'Unauthorized Meal Plan',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        isActive: true,
        days: []
      };
      
      const response = await request(app)
        .post('/api/meal-plans')
        .set(getStandardHeaders())
        .send(testMealPlan);

      expect(response.status).toBe(401);
    });

    it('should create a meal plan with valid data and authentication', async () => {
      const testMealPlan = {
        name: 'Valid Meal Plan',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        isActive: true,
        days: [
          {
            day: 'Wednesday',
            date: new Date().toISOString().split('T')[0],
            breakfast: '',
            lunch: '',
            dinner: ''
          }
        ]
      };
      
      const response = await request(app)
        .post('/api/meal-plans')
        .set(getAuthHeaders(authToken))
        .send(testMealPlan);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Valid Meal Plan');
      expect(response.body.userId).toBe(testUser.id);
      expect(Array.isArray(response.body.days)).toBe(true);
      expect(response.body.days.length).toBe(1);
    });

    it('should automatically add userId from authenticated user', async () => {
      const testMealPlan = {
        name: 'Auto User ID Meal Plan',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        isActive: true,
        days: []
      };
      
      const response = await request(app)
        .post('/api/meal-plans')
        .set(getAuthHeaders(authToken))
        .send(testMealPlan);

      expect(response.status).toBe(201);
      expect(response.body.userId).toBe(testUser.id);
    });
  });

  describe('PUT /api/meal-plans/:id', () => {
    it('should return 401 without authentication', async () => {
      const updateData = {
        name: 'Updated Name'
      };
      
      const response = await request(app)
        .put(`/api/meal-plans/${createdMealPlanId}`)
        .set(getStandardHeaders())
        .send(updateData);

      expect(response.status).toBe(401);
    });

    it('should update meal plan with valid data and authentication', async () => {
      const updateData = {
        name: 'Updated Meal Plan Name'
      };
      
      const response = await request(app)
        .put(`/api/meal-plans/${createdMealPlanId}`)
        .set(getAuthHeaders(authToken))
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Meal Plan Name');
      expect(response.body.id).toBe(createdMealPlanId);
    });

    it('should return 404 for non-existent meal plan', async () => {
      const updateData = {
        name: 'Updated Name'
      };
      
      const response = await request(app)
        .put(`/api/meal-plans/9999`)
        .set(getAuthHeaders(authToken))
        .send(updateData);

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid ID format', async () => {
      const updateData = {
        name: 'Updated Name'
      };
      
      const response = await request(app)
        .put(`/api/meal-plans/invalid-id`)
        .set(getAuthHeaders(authToken))
        .send(updateData);

      expect(response.status).toBe(400);
    });

    it('should return 403 when updating another user\'s meal plan', async () => {
      // Create a second user
      const secondUser = await createTestUser(testUsers.adminUser);
      const secondUserToken = generateTestToken(secondUser.id, secondUser.email);
      
      const updateData = {
        name: 'Unauthorized Update'
      };
      
      // Attempt to update first user's meal plan with second user's token
      const response = await request(app)
        .put(`/api/meal-plans/${createdMealPlanId}`)
        .set(getAuthHeaders(secondUserToken))
        .send(updateData);

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/meal-plans/:id', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .delete(`/api/meal-plans/${createdMealPlanId}`)
        .set(getStandardHeaders());

      expect(response.status).toBe(401);
    });

    it('should delete meal plan with valid ID and authentication', async () => {
      const response = await request(app)
        .delete(`/api/meal-plans/${createdMealPlanId}`)
        .set(getAuthHeaders(authToken));

      expect(response.status).toBe(204);
      
      // Verify meal plan was deleted
      const getResponse = await request(app)
        .get(`/api/meal-plans/${createdMealPlanId}`)
        .set(getAuthHeaders(authToken));
      
      expect(getResponse.status).toBe(404);
    });

    it('should return 404 for non-existent meal plan', async () => {
      const response = await request(app)
        .delete(`/api/meal-plans/9999`)
        .set(getAuthHeaders(authToken));

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .delete(`/api/meal-plans/invalid-id`)
        .set(getAuthHeaders(authToken));

      expect(response.status).toBe(400);
    });

    it('should return 403 when deleting another user\'s meal plan', async () => {
      // Create a second user
      const secondUser = await createTestUser(testUsers.adminUser);
      const secondUserToken = generateTestToken(secondUser.id, secondUser.email);
      
      // Attempt to delete first user's meal plan with second user's token
      const response = await request(app)
        .delete(`/api/meal-plans/${createdMealPlanId}`)
        .set(getAuthHeaders(secondUserToken));

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/meal-plans/slot', () => {
    it('should return 401 without authentication', async () => {
      const slotData = {
        mealPlanId: createdMealPlanId,
        dayIndex: 0,
        mealType: 'breakfast',
        recipeId: createdRecipeId
      };
      
      const response = await request(app)
        .post('/api/meal-plans/slot')
        .set(getStandardHeaders())
        .send(slotData);

      expect(response.status).toBe(401);
    });

    it('should add recipe to meal slot with valid data and authentication', async () => {
      const slotData = {
        mealPlanId: createdMealPlanId,
        dayIndex: 0,
        mealType: 'breakfast',
        recipeId: createdRecipeId
      };
      
      const response = await request(app)
        .post('/api/meal-plans/slot')
        .set(getAuthHeaders(authToken))
        .send(slotData);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(createdMealPlanId);
      expect(response.body.days[0].breakfast).toBe(createdRecipeId.toString());
    });

    it('should return 400 for missing required fields', async () => {
      const invalidSlotData = {
        mealPlanId: createdMealPlanId,
        // Missing other required fields
      };
      
      const response = await request(app)
        .post('/api/meal-plans/slot')
        .set(getAuthHeaders(authToken))
        .send(invalidSlotData);

      expect(response.status).toBe(400);
    });

    it('should return 404 for non-existent meal plan', async () => {
      const slotData = {
        mealPlanId: 9999,
        dayIndex: 0,
        mealType: 'breakfast',
        recipeId: createdRecipeId
      };
      
      const response = await request(app)
        .post('/api/meal-plans/slot')
        .set(getAuthHeaders(authToken))
        .send(slotData);

      expect(response.status).toBe(404);
    });

    it('should return 403 when adding recipe to another user\'s meal plan', async () => {
      // Create a second user
      const secondUser = await createTestUser(testUsers.adminUser);
      const secondUserToken = generateTestToken(secondUser.id, secondUser.email);
      
      const slotData = {
        mealPlanId: createdMealPlanId,
        dayIndex: 0,
        mealType: 'breakfast',
        recipeId: createdRecipeId
      };
      
      // Attempt to add recipe to first user's meal plan with second user's token
      const response = await request(app)
        .post('/api/meal-plans/slot')
        .set(getAuthHeaders(secondUserToken))
        .send(slotData);

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/meal-plans/:id/slot', () => {
    beforeEach(async () => {
      // Add a recipe to a meal slot to test removal
      const slotData = {
        mealPlanId: createdMealPlanId,
        dayIndex: 0,
        mealType: 'lunch',
        recipeId: createdRecipeId
      };
      
      await request(app)
        .post('/api/meal-plans/slot')
        .set(getAuthHeaders(authToken))
        .send(slotData);
    });
    
    it('should return 401 without authentication', async () => {
      const slotData = {
        dayIndex: 0,
        mealType: 'lunch'
      };
      
      const response = await request(app)
        .delete(`/api/meal-plans/${createdMealPlanId}/slot`)
        .set(getStandardHeaders())
        .send(slotData);

      expect(response.status).toBe(401);
    });

    it('should remove recipe from meal slot with valid data and authentication', async () => {
      const slotData = {
        dayIndex: 0,
        mealType: 'lunch'
      };
      
      const response = await request(app)
        .delete(`/api/meal-plans/${createdMealPlanId}/slot`)
        .set(getAuthHeaders(authToken))
        .send(slotData);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(createdMealPlanId);
      expect(response.body.days[0].lunch).toBe('');
    });

    it('should return 400 for missing required fields', async () => {
      const invalidSlotData = {
        // Missing required fields
      };
      
      const response = await request(app)
        .delete(`/api/meal-plans/${createdMealPlanId}/slot`)
        .set(getAuthHeaders(authToken))
        .send(invalidSlotData);

      expect(response.status).toBe(400);
    });

    it('should return 404 for non-existent meal plan', async () => {
      const slotData = {
        dayIndex: 0,
        mealType: 'lunch'
      };
      
      const response = await request(app)
        .delete(`/api/meal-plans/9999/slot`)
        .set(getAuthHeaders(authToken))
        .send(slotData);

      expect(response.status).toBe(404);
    });

    it('should return 403 when removing recipe from another user\'s meal plan', async () => {
      // Create a second user
      const secondUser = await createTestUser(testUsers.adminUser);
      const secondUserToken = generateTestToken(secondUser.id, secondUser.email);
      
      const slotData = {
        dayIndex: 0,
        mealType: 'lunch'
      };
      
      // Attempt to remove recipe from first user's meal plan with second user's token
      const response = await request(app)
        .delete(`/api/meal-plans/${createdMealPlanId}/slot`)
        .set(getAuthHeaders(secondUserToken))
        .send(slotData);

      expect(response.status).toBe(403);
    });
  });
});
