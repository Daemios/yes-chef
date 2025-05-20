# Testing Guide for Yes-Chef

This project uses [Vitest](https://vitest.dev/) as its testing framework for both client (Vue) and server (Node.js/Express) code.

## Testing Structure

### Client Tests
- Location: `client/src/**/__tests__/*.test.ts`
- Configuration: `client/vitest.config.ts`

### Server Tests
- Location: `server/src/**/__tests__/*.test.ts` and `server/tests/**/*.test.ts`
- Configuration: `server/vitest.config.ts`

## Running Tests

### All Tests
```bash
npm test
```

### Client Tests Only
```bash
npm run test:client
```

### Server Tests Only
```bash
npm run test:server
```

### Watch Mode (for development)
```bash
npm run test:watch          # Both client and server
npm run test:client:watch   # Client only
npm run test:server:watch   # Server only
```

### UI Mode
```bash
npm run test:ui             # Both client and server in UI mode
npm run test:client:ui      # Client only in UI mode
npm run test:server:ui      # Server only in UI mode
```

### Coverage Reports
```bash
npm run test:coverage          # Generate coverage for both
npm run test:client:coverage   # Client coverage only
npm run test:server:coverage   # Server coverage only
```

Coverage reports are generated in:
- Client: `coverage-client/`
- Server: `coverage-server/`

## Writing Tests

### Client Tests Example (Vue Components)
```typescript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import YourComponent from '../YourComponent.vue';

describe('YourComponent.vue', () => {
  it('renders correctly', () => {
    const wrapper = mount(YourComponent);
    expect(wrapper.text()).toContain('Expected text');
  });
});
```

### Server Tests Example (API Endpoints)
```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app';

describe('API Route', () => {
  it('returns the expected response', async () => {
    const response = await request(app).get('/api/endpoint');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('property');
  });
});
```

## Mocking

### Mocking in Vitest
```typescript
import { vi } from 'vitest';

// Mock a module
vi.mock('../path/to/module', () => ({
  functionName: vi.fn().mockReturnValue('mocked value')
}));

// Reset mocks between tests
beforeEach(() => {
  vi.resetAllMocks();
});
```