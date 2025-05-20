import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('API Routes with Vitest', () => {
  it('should return a welcome message from /api/hello endpoint', async () => {
    const response = await request(app).get('/api/hello');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Hello from Yes-Chef API!');
  });
  
  it('should handle non-existent routes properly', async () => {
    const response = await request(app).get('/api/nonexistent');
    expect(response.status).toBe(404);
  });
});
