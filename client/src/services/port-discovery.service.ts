/**
 * Port Discovery Service
 * Handles dynamic discovery of server port for API calls
 */

interface ServerPortInfo {
  port: number;
  lastUpdated: string | null;
}

let cachedServerPort: number | null = null;
let lastPortCheck = 0;
const PORT_CHECK_INTERVAL = 5000; // Check every 5 seconds

/**
 * Discover the actual server port by trying to fetch from common ports
 */
const discoverServerPort = async (): Promise<number> => {
  const commonPorts = [3002, 3003, 3001, 3000, 3004, 3005];
  
  for (const port of commonPorts) {
    try {
      const response = await fetch(`http://localhost:${port}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(1000) // 1 second timeout
      });
      
      if (response.ok) {
        console.log(`Discovered server running on port ${port}`);
        return port;
      }
    } catch (error) {
      // Port not available or server not responding, try next
      continue;
    }
  }
  
  // Fallback to default port
  console.warn('Could not discover server port, falling back to 3002');
  return 3002;
};

/**
 * Get the server port with caching and discovery fallback
 */
export const getServerPort = async (): Promise<number> => {
  const now = Date.now();
  
  // Return cached port if we checked recently
  if (cachedServerPort && (now - lastPortCheck) < PORT_CHECK_INTERVAL) {
    return cachedServerPort;
  }
  
  try {
    // Try to discover the port
    const discoveredPort = await discoverServerPort();
    cachedServerPort = discoveredPort;
    lastPortCheck = now;
    return discoveredPort;
  } catch (error) {
    console.warn('Port discovery failed:', error);
    
    // Return cached port if available, otherwise default
    return cachedServerPort || 3002;
  }
};

/**
 * Create API URL with dynamic port discovery
 */
export const createApiUrl = async (endpoint: string): Promise<string> => {
  const port = await getServerPort();
  return `http://localhost:${port}${endpoint}`;
};

/**
 * Enhanced fetch with automatic port discovery and retries
 */
export const fetchWithPortDiscovery = async (
  endpoint: string, 
  options: RequestInit = {}
): Promise<Response> => {
  let lastError: Error | null = null;
  
  // Try with current cached port first
  if (cachedServerPort) {
    try {
      const url = `http://localhost:${cachedServerPort}${endpoint}`;
      const response = await fetch(url, options);
      if (response.ok || response.status < 500) {
        return response;
      }
    } catch (error) {
      lastError = error as Error;
    }
  }
  
  // If that failed, rediscover the port and try again
  try {
    const port = await getServerPort();
    const url = `http://localhost:${port}${endpoint}`;
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    // If all attempts failed, throw the most recent error
    throw lastError || error;
  }
};
