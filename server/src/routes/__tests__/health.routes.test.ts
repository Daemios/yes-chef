/**
 * Health Routes Tests
 */
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app';

describe('Health Routes', () => {
  describe('GET /health', () => {
    it('should return a 200 status code', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
    });

    it('should return a JSON response with status, uptime, and timestamp', async () => {
      const response = await request(app).get('/health');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body.status).toBe('ok');
    });
  });
});
