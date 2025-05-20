<template>
  <div class="api-page">
    <h1>API Documentation & Testing</h1>
    
    <section class="api-docs">
      <h2>API Documentation</h2>
      <p>Welcome to the Yes Chef API documentation. This page provides information about our public API endpoints.</p>
      
      <!-- API documentation content goes here -->
      <div class="endpoint">
        <h3>GET /api/hello</h3>
        <p>Returns a hello message from the server.</p>
        <pre>{ "message": "Hello from Yes Chef API!" }</pre>
      </div>
      
      <!-- Add more API endpoints documentation as needed -->
    </section>
    
    <section class="api-testing">
      <h2>API Connection Test</h2>
      <p>Use the button below to test the API connection:</p>
      
      <button @click="testApiConnection">Test API Connection</button>
      
      <div v-if="apiMessage" class="api-response">
        <p>API Response: {{ apiMessage }}</p>
      </div>
      
      <div v-if="apiError" class="api-error">
        <p>Failed to connect to API: {{ apiError }}</p>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { fetchHelloMessage } from '../services/api.service';

export default defineComponent({
  name: 'ApiView',
  setup() {
    const apiMessage = ref('');
    const apiError = ref('');

    const testApiConnection = async () => {
      try {
        apiError.value = '';
        const response = await fetchHelloMessage();
        apiMessage.value = response.message;
      } catch (error) {
        apiMessage.value = '';
        apiError.value = (error as Error).message || 'Unknown error';
      }
    };

    return {
      apiMessage,
      apiError,
      testApiConnection
    };
  }
});
</script>

<style scoped>
.api-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

section {
  margin-bottom: 40px;
}

.endpoint {
  background-color: #f8f8f8;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 15px;
}

pre {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}

.api-response {
  margin-top: 10px;
  padding: 10px;
  background-color: #e7f7e7;
  border-radius: 4px;
}

.api-error {
  margin-top: 10px;
  padding: 10px;
  background-color: #f7e7e7;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
