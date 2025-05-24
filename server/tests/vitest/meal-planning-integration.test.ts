/**
 * Meal Planning Integration Tests
 * These tests verify the end-to-end flow from recipe creation to meal planning
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { 
  testUsers, 
  testRecipes,
  testMealPlans,
  createTestUser, 
  cleanupTestUsers, 
  getAuthHeaders, 
  getStandardHeaders
} from '../../utils/test.utils';
import { RecipeRepository } from '../../repositories/recipe.repository';
import { MealPlanRepository } from '../../repositories/meal-plan.repository';

describe('Meal Planning Integration', () => {
  let testUser: any;
  let authToken: string;
  let createdRecipeIds: number[] = [];
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
  });

  afterEach(async () => {
    // Clean up test data
    try {
      if (createdMealPlanId) {
        await MealPlanRepository.delete(createdMealPlanId);
      }
      
      for (const recipeId of createdRecipeIds) {
        await RecipeRepository.delete(recipeId);
      }
    } catch (error) {
      // Resources might already be deleted, ignore error
    }
    
    await cleanupTestUsers();
  });

  describe('Recipe to Meal Plan Flow', () => {
    it('should allow creating recipes and adding them to meal plans', async () => {
      // Step 1: Create multiple recipes
      const recipes = [
        {
          ...testRecipes.validRecipe,
          title: 'Breakfast Recipe',
          tags: ['breakfast', 'quick']
        },
        {
          ...testRecipes.validRecipe,
          title: 'Lunch Recipe',
          tags: ['lunch', 'salad']
        },
        {
          ...testRecipes.validRecipe,
          title: 'Dinner Recipe',
          tags: ['dinner', 'main course']
        }
      ];
      
      for (const recipe of recipes) {
        const createResponse = await request(app)
          .post('/api/recipes')
          .set(getAuthHeaders(authToken))
          .send(recipe);
        
        expect(createResponse.status).toBe(201);
        createdRecipeIds.push(createResponse.body.id);
      }
      
      expect(createdRecipeIds.length).toBe(3);
      
      // Step 2: Create a meal plan
      const createMealPlanResponse = await request(app)
        .post('/api/meal-plans')
        .set(getAuthHeaders(authToken))
        .send(testMealPlans.validMealPlan);
      
      expect(createMealPlanResponse.status).toBe(201);
      createdMealPlanId = createMealPlanResponse.body.id;
      
      // Step 3: Add recipes to meal slots
      const mealSlots = [
        { recipeId: createdRecipeIds[0], dayIndex: 0, mealType: 'breakfast' },
        { recipeId: createdRecipeIds[1], dayIndex: 0, mealType: 'lunch' },
        { recipeId: createdRecipeIds[2], dayIndex: 0, mealType: 'dinner' },
        { recipeId: createdRecipeIds[0], dayIndex: 1, mealType: 'breakfast' },
        { recipeId: createdRecipeIds[1], dayIndex: 1, mealType: 'lunch' },
        { recipeId: createdRecipeIds[2], dayIndex: 1, mealType: 'dinner' }
      ];
      
      for (const slot of mealSlots) {
        const addToSlotResponse = await request(app)
          .post('/api/meal-plans/slot')
          .set(getAuthHeaders(authToken))
          .send({
            mealPlanId: createdMealPlanId,
            dayIndex: slot.dayIndex,
            mealType: slot.mealType,
            recipeId: slot.recipeId
          });
        
        expect(addToSlotResponse.status).toBe(200);
      }
      
      // Step 4: Verify the meal plan has all recipes assigned
      const getMealPlanResponse = await request(app)
        .get(`/api/meal-plans/${createdMealPlanId}`)
        .set(getAuthHeaders(authToken));
      
      expect(getMealPlanResponse.status).toBe(200);
      
      const mealPlan = getMealPlanResponse.body;
      expect(mealPlan.days[0].breakfast).toBe(createdRecipeIds[0].toString());
      expect(mealPlan.days[0].lunch).toBe(createdRecipeIds[1].toString());
      expect(mealPlan.days[0].dinner).toBe(createdRecipeIds[2].toString());
      expect(mealPlan.days[1].breakfast).toBe(createdRecipeIds[0].toString());
      expect(mealPlan.days[1].lunch).toBe(createdRecipeIds[1].toString());
      expect(mealPlan.days[1].dinner).toBe(createdRecipeIds[2].toString());
      
      // Step 5: Remove a recipe from a meal slot
      const removeFromSlotResponse = await request(app)
        .delete(`/api/meal-plans/${createdMealPlanId}/slot`)
        .set(getAuthHeaders(authToken))
        .send({
          dayIndex: 0,
          mealType: 'lunch'
        });
      
      expect(removeFromSlotResponse.status).toBe(200);
      
      // Step 6: Verify the recipe was removed
      const updatedMealPlanResponse = await request(app)
        .get(`/api/meal-plans/${createdMealPlanId}`)
        .set(getAuthHeaders(authToken));
      
      expect(updatedMealPlanResponse.status).toBe(200);
      expect(updatedMealPlanResponse.body.days[0].lunch).toBe('');
      expect(updatedMealPlanResponse.body.days[0].breakfast).toBe(createdRecipeIds[0].toString());
      expect(updatedMealPlanResponse.body.days[0].dinner).toBe(createdRecipeIds[2].toString());
    });

    it('should handle edge cases in the recipe to meal plan flow', async () => {
      // Step 1: Create a recipe
      const createResponse = await request(app)
        .post('/api/recipes')
        .set(getAuthHeaders(authToken))
        .send(testRecipes.validRecipe);
      
      expect(createResponse.status).toBe(201);
      createdRecipeIds.push(createResponse.body.id);
      
      // Step 2: Create a meal plan
      const createMealPlanResponse = await request(app)
        .post('/api/meal-plans')
        .set(getAuthHeaders(authToken))
        .send(testMealPlans.validMealPlan);
      
      expect(createMealPlanResponse.status).toBe(201);
      createdMealPlanId = createMealPlanResponse.body.id;
      
      // Step 3: Test adding a recipe to an invalid day index
      const invalidDayResponse = await request(app)
        .post('/api/meal-plans/slot')
        .set(getAuthHeaders(authToken))
        .send({
          mealPlanId: createdMealPlanId,
          dayIndex: 99, // Invalid day index
          mealType: 'breakfast',
          recipeId: createdRecipeIds[0]
        });
      
      expect(invalidDayResponse.status).toBe(500); // Should return an error
      
      // Step 4: Test adding a recipe to an invalid meal type
      const invalidMealTypeResponse = await request(app)
        .post('/api/meal-plans/slot')
        .set(getAuthHeaders(authToken))
        .send({
          mealPlanId: createdMealPlanId,
          dayIndex: 0,
          mealType: 'invalid-meal-type', // Invalid meal type
          recipeId: createdRecipeIds[0]
        });
      
      expect(invalidMealTypeResponse.status).toBe(200); // Should actually work, as we use dynamic property access
      
      // Step 5: Test adding a non-existent recipe to a meal slot
      const nonExistentRecipeResponse = await request(app)
        .post('/api/meal-plans/slot')
        .set(getAuthHeaders(authToken))
        .send({
          mealPlanId: createdMealPlanId,
          dayIndex: 0,
          mealType: 'breakfast',
          recipeId: 9999 // Non-existent recipe ID
        });
      
      expect(nonExistentRecipeResponse.status).toBe(200); // Should work since we're just storing the ID
      
      // Step 6: Test removing a recipe from a non-existent meal slot
      const removeFromInvalidSlotResponse = await request(app)
        .delete(`/api/meal-plans/${createdMealPlanId}/slot`)
        .set(getAuthHeaders(authToken))
        .send({
          dayIndex: 99, // Invalid day index
          mealType: 'lunch'
        });
      
      expect(removeFromInvalidSlotResponse.status).toBe(500); // Should return an error
    });
  });
  
  describe('Multiple User Meal Planning', () => {
    let secondUser: any;
    let secondUserToken: string;
    let secondUserRecipeId: number;
    let secondUserMealPlanId: number;

    beforeEach(async () => {
      // Create a second test user
      secondUser = await createTestUser(testUsers.adminUser);
      
      const loginResponse = await request(app)
        .post('/auth/login')
        .set(getStandardHeaders())
        .send({
          email: testUsers.adminUser.email,
          password: testUsers.adminUser.password
        });
      
      secondUserToken = loginResponse.body.token;
      
      // Create a recipe for the second user
      const createRecipeResponse = await request(app)
        .post('/api/recipes')
        .set(getAuthHeaders(secondUserToken))
        .send({
          ...testRecipes.validRecipe,
          title: 'Second User Recipe'
        });
      
      secondUserRecipeId = createRecipeResponse.body.id;
      
      // Create a meal plan for the second user
      const createMealPlanResponse = await request(app)
        .post('/api/meal-plans')
        .set(getAuthHeaders(secondUserToken))
        .send(testMealPlans.validMealPlan);
      
      secondUserMealPlanId = createMealPlanResponse.body.id;
    });

    afterEach(async () => {
      // Clean up second user's data
      try {
        if (secondUserMealPlanId) {
          await MealPlanRepository.delete(secondUserMealPlanId);
        }
        
        if (secondUserRecipeId) {
          await RecipeRepository.delete(secondUserRecipeId);
        }
      } catch (error) {
        // Resources might already be deleted, ignore error
      }
    });

    it('should prevent users from accessing each other\'s meal plans', async () => {
      // Create a recipe for the first user
      const createFirstUserRecipeResponse = await request(app)
        .post('/api/recipes')
        .set(getAuthHeaders(authToken))
        .send({
          ...testRecipes.validRecipe,
          title: 'First User Recipe'
        });
      
      createdRecipeIds.push(createFirstUserRecipeResponse.body.id);
      
      // Create a meal plan for the first user
      const createFirstUserMealPlanResponse = await request(app)
        .post('/api/meal-plans')
        .set(getAuthHeaders(authToken))
        .send(testMealPlans.validMealPlan);
      
      createdMealPlanId = createFirstUserMealPlanResponse.body.id;
      
      // Try to access second user's meal plan with first user's token
      const getSecondUserMealPlanResponse = await request(app)
        .get(`/api/meal-plans/${secondUserMealPlanId}`)
        .set(getAuthHeaders(authToken));
      
      expect(getSecondUserMealPlanResponse.status).toBe(403);
      
      // Try to access first user's meal plan with second user's token
      const getFirstUserMealPlanResponse = await request(app)
        .get(`/api/meal-plans/${createdMealPlanId}`)
        .set(getAuthHeaders(secondUserToken));
      
      expect(getFirstUserMealPlanResponse.status).toBe(403);
      
      // Try to add a recipe to second user's meal plan with first user's token
      const addToSecondUserMealPlanResponse = await request(app)
        .post('/api/meal-plans/slot')
        .set(getAuthHeaders(authToken))
        .send({
          mealPlanId: secondUserMealPlanId,
          dayIndex: 0,
          mealType: 'breakfast',
          recipeId: createdRecipeIds[0]
        });
      
      expect(addToSecondUserMealPlanResponse.status).toBe(403);
      
      // Try to remove a recipe from second user's meal plan with first user's token
      const removeFromSecondUserMealPlanResponse = await request(app)
        .delete(`/api/meal-plans/${secondUserMealPlanId}/slot`)
        .set(getAuthHeaders(authToken))
        .send({
          dayIndex: 0,
          mealType: 'breakfast'
        });
      
      expect(removeFromSecondUserMealPlanResponse.status).toBe(403);
    });

    it('should handle concurrent meal planning operations correctly', async () => {
      // Create recipes for both users
      const firstUserRecipeResponse = await request(app)
        .post('/api/recipes')
        .set(getAuthHeaders(authToken))
        .send({
          ...testRecipes.validRecipe,
          title: 'First User Recipe'
        });
      
      createdRecipeIds.push(firstUserRecipeResponse.body.id);
      
      // Create meal plans for both users
      const firstUserMealPlanResponse = await request(app)
        .post('/api/meal-plans')
        .set(getAuthHeaders(authToken))
        .send(testMealPlans.validMealPlan);
      
      createdMealPlanId = firstUserMealPlanResponse.body.id;
      
      // Perform concurrent operations
      const firstUserPromise = request(app)
        .post('/api/meal-plans/slot')
        .set(getAuthHeaders(authToken))
        .send({
          mealPlanId: createdMealPlanId,
          dayIndex: 0,
          mealType: 'breakfast',
          recipeId: createdRecipeIds[0]
        });
      
      const secondUserPromise = request(app)
        .post('/api/meal-plans/slot')
        .set(getAuthHeaders(secondUserToken))
        .send({
          mealPlanId: secondUserMealPlanId,
          dayIndex: 0,
          mealType: 'breakfast',
          recipeId: secondUserRecipeId
        });
      
      const [firstUserResponse, secondUserResponse] = await Promise.all([
        firstUserPromise,
        secondUserPromise
      ]);
      
      expect(firstUserResponse.status).toBe(200);
      expect(secondUserResponse.status).toBe(200);
      
      // Verify each user's meal plan was updated correctly
      const firstUserMealPlanGetResponse = await request(app)
        .get(`/api/meal-plans/${createdMealPlanId}`)
        .set(getAuthHeaders(authToken));
      
      expect(firstUserMealPlanGetResponse.status).toBe(200);
      expect(firstUserMealPlanGetResponse.body.days[0].breakfast).toBe(createdRecipeIds[0].toString());
      
      const secondUserMealPlanGetResponse = await request(app)
        .get(`/api/meal-plans/${secondUserMealPlanId}`)
        .set(getAuthHeaders(secondUserToken));
      
      expect(secondUserMealPlanGetResponse.status).toBe(200);
      expect(secondUserMealPlanGetResponse.body.days[0].breakfast).toBe(secondUserRecipeId.toString());
    });
  });
});
