/**
 * API Controller Tests
 */
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app';

describe('API Controller', () => {
  describe('GET /api/hello', () => {
    it('should return a 200 status code', async () => {
      const response = await request(app).get('/api/hello');
      expect(response.status).toBe(200);
    });

    it('should return a JSON response with a message property', async () => {
      const response = await request(app).get('/api/hello');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Hello from Yes-Chef API!');
    });
  });
});
