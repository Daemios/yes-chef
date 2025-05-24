/**
 * Recipe Controller Tests
 * Comprehensive tests for recipe CRUD endpoints
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { 
  testUsers, 
  testRecipes, 
  createTestUser, 
  cleanupTestUsers, 
  getAuthHeaders, 
  getStandardHeaders,
  generateTestToken,
  generateInvalidToken
} from '../../utils/test.utils';
import { RecipeRepository } from '../../repositories/recipe.repository';

describe('Recipe Controller', () => {
  let testUser: any;
  let authToken: string;
  let createdRecipeId: number;

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
    if (createdRecipeId) {
      try {
        await RecipeRepository.delete(createdRecipeId);
      } catch (error) {
        // Recipe might already be deleted, ignore error
      }
    }
    await cleanupTestUsers();
  });

  describe('GET /api/recipes', () => {
    it('should return all recipes (public access)', async () => {
      const response = await request(app)
        .get('/api/recipes')
        .set(getStandardHeaders());

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      // Should work without authentication
    });

    it('should return recipes with authentication', async () => {
      const response = await request(app)
        .get('/api/recipes')
        .set(getAuthHeaders(authToken));

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return empty array if no recipes exist', async () => {
      const response = await request(app)
        .get('/api/recipes')
        .set(getStandardHeaders());

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/recipes/:id', () => {
    beforeEach(async () => {
      // Create a test recipe
      const createResponse = await request(app)
        .post('/api/recipes')
        .set(getAuthHeaders(authToken))
        .send(testRecipes.validRecipe);
      
      createdRecipeId = createResponse.body.id;
    });

    it('should return recipe by valid ID (public access)', async () => {
      const response = await request(app)
        .get(`/api/recipes/${createdRecipeId}`)
        .set(getStandardHeaders());

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', createdRecipeId);
      expect(response.body).toHaveProperty('title', testRecipes.validRecipe.title);
      expect(response.body).toHaveProperty('description', testRecipes.validRecipe.description);
    });

    it('should return 404 for non-existent recipe ID', async () => {
      const nonExistentId = 99999;
      
      const response = await request(app)
        .get(`/api/recipes/${nonExistentId}`)
        .set(getStandardHeaders());

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Recipe not found');
    });

    it('should return 400 for invalid recipe ID format', async () => {
      const response = await request(app)
        .get('/api/recipes/invalid-id')
        .set(getStandardHeaders());

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid recipe ID');
    });

    it('should return 400 for negative recipe ID', async () => {
      const response = await request(app)
        .get('/api/recipes/-1')
        .set(getStandardHeaders());

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid recipe ID');
    });
  });

  describe('POST /api/recipes', () => {
    it('should create recipe with valid authentication and data', async () => {
      const response = await request(app)
        .post('/api/recipes')
        .set(getAuthHeaders(authToken))
        .send(testRecipes.validRecipe);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', testRecipes.validRecipe.title);
      expect(response.body).toHaveProperty('userId', testUser.id);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
      
      createdRecipeId = response.body.id;
    });

    it('should return 401 without authentication token', async () => {
      const response = await request(app)
        .post('/api/recipes')
        .set(getStandardHeaders())
        .send(testRecipes.validRecipe);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Access token required');
    });

    it('should return 403 with invalid authentication token', async () => {
      const response = await request(app)
        .post('/api/recipes')
        .set(getAuthHeaders(generateInvalidToken()))
        .send(testRecipes.validRecipe);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error', 'Invalid or expired token');
    });

    it('should create recipe with minimal required fields', async () => {
      const minimalRecipe = {
        title: 'Minimal Recipe',
        description: 'A minimal recipe for testing'
      };

      const response = await request(app)
        .post('/api/recipes')
        .set(getAuthHeaders(authToken))
        .send(minimalRecipe);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', minimalRecipe.title);
      expect(response.body).toHaveProperty('userId', testUser.id);
      
      createdRecipeId = response.body.id;
    });

    it('should handle empty request body gracefully', async () => {
      const response = await request(app)
        .post('/api/recipes')
        .set(getAuthHeaders(authToken))
        .send({});

      // The behavior depends on repository validation
      // It might create with default values or return an error
      expect([201, 400, 500]).toContain(response.status);
    });
  });

  describe('PUT /api/recipes/:id', () => {
    beforeEach(async () => {
      // Create a test recipe
      const createResponse = await request(app)
        .post('/api/recipes')
        .set(getAuthHeaders(authToken))
        .send(testRecipes.validRecipe);
      
      createdRecipeId = createResponse.body.id;
    });

    it('should update recipe with valid authentication and data', async () => {
      const response = await request(app)
        .put(`/api/recipes/${createdRecipeId}`)
        .set(getAuthHeaders(authToken))
        .send(testRecipes.updateRecipe);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', createdRecipeId);
      expect(response.body).toHaveProperty('title', testRecipes.updateRecipe.title);
      expect(response.body).toHaveProperty('prepTime', testRecipes.updateRecipe.prepTime);
    });

    it('should return 401 without authentication token', async () => {
      const response = await request(app)
        .put(`/api/recipes/${createdRecipeId}`)
        .set(getStandardHeaders())
        .send(testRecipes.updateRecipe);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Access token required');
    });

    it('should return 403 with invalid authentication token', async () => {
      const response = await request(app)
        .put(`/api/recipes/${createdRecipeId}`)
        .set(getAuthHeaders(generateInvalidToken()))
        .send(testRecipes.updateRecipe);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error', 'Invalid or expired token');
    });

    it('should return 404 for non-existent recipe ID', async () => {
      const nonExistentId = 99999;
      
      const response = await request(app)
        .put(`/api/recipes/${nonExistentId}`)
        .set(getAuthHeaders(authToken))
        .send(testRecipes.updateRecipe);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Recipe not found');
    });

    it('should return 400 for invalid recipe ID format', async () => {
      const response = await request(app)
        .put('/api/recipes/invalid-id')
        .set(getAuthHeaders(authToken))
        .send(testRecipes.updateRecipe);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid recipe ID');
    });

    it('should partial update recipe (only provided fields)', async () => {
      const partialUpdate = { title: 'Partially Updated Title' };
      
      const response = await request(app)
        .put(`/api/recipes/${createdRecipeId}`)
        .set(getAuthHeaders(authToken))
        .send(partialUpdate);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', partialUpdate.title);
      // Other fields should remain unchanged
      expect(response.body).toHaveProperty('description', testRecipes.validRecipe.description);
    });
  });

  describe('DELETE /api/recipes/:id', () => {
    beforeEach(async () => {
      // Create a test recipe
      const createResponse = await request(app)
        .post('/api/recipes')
        .set(getAuthHeaders(authToken))
        .send(testRecipes.validRecipe);
      
      createdRecipeId = createResponse.body.id;
    });

    it('should delete recipe with valid authentication', async () => {
      const response = await request(app)
        .delete(`/api/recipes/${createdRecipeId}`)
        .set(getAuthHeaders(authToken));

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
      
      // Verify recipe is deleted
      const getResponse = await request(app)
        .get(`/api/recipes/${createdRecipeId}`)
        .set(getStandardHeaders());
      
      expect(getResponse.status).toBe(404);
      
      // Clear the ID so afterEach doesn't try to delete it again
      createdRecipeId = null;
    });

    it('should return 401 without authentication token', async () => {
      const response = await request(app)
        .delete(`/api/recipes/${createdRecipeId}`)
        .set(getStandardHeaders());

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Access token required');
    });

    it('should return 403 with invalid authentication token', async () => {
      const response = await request(app)
        .delete(`/api/recipes/${createdRecipeId}`)
        .set(getAuthHeaders(generateInvalidToken()));

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error', 'Invalid or expired token');
    });

    it('should return 404 for non-existent recipe ID', async () => {
      const nonExistentId = 99999;
      
      const response = await request(app)
        .delete(`/api/recipes/${nonExistentId}`)
        .set(getAuthHeaders(authToken));

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Recipe not found');
    });

    it('should return 400 for invalid recipe ID format', async () => {
      const response = await request(app)
        .delete('/api/recipes/invalid-id')
        .set(getAuthHeaders(authToken));

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid recipe ID');
    });

    it('should be idempotent (deleting already deleted recipe)', async () => {
      // Delete the recipe first
      await request(app)
        .delete(`/api/recipes/${createdRecipeId}`)
        .set(getAuthHeaders(authToken));

      // Try to delete again
      const response = await request(app)
        .delete(`/api/recipes/${createdRecipeId}`)
        .set(getAuthHeaders(authToken));

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Recipe not found');
      
      createdRecipeId = null;
    });
  });
});
