<template>
  <div class="mx-auto" style="max-width: 800px;">
    <h1 class="text-h4 font-weight-bold mb-6">API Documentation & Testing</h1>
    
    <section class="mb-10">
      <h2 class="text-h5 font-weight-bold mb-4">API Documentation</h2>
      <p class="mb-4">Welcome to the Yes Chef API documentation. This page provides information about our public API endpoints.</p>
      
      <!-- API documentation content goes here -->
      <div class="bg-grey-lighten-4 rounded pa-4 mb-4">
        <h3 class="text-h6 font-weight-bold">GET /api/hello</h3>
        <p class="mb-2">Returns a hello message from the server.</p>
        <v-sheet class="bg-grey-lighten-3 pa-3 rounded overflow-x-auto">
          <pre class="ma-0">{ "message": "Hello from Yes Chef API!" }</pre>
        </v-sheet>
      </div>
      
      <!-- Add more API endpoints documentation as needed -->
    </section>
    
    <section class="mb-10">
      <h2 class="text-h5 font-weight-bold mb-4">API Connection Test</h2>
      <p class="mb-4">Use the button below to test the API connection:</p>
      
      <v-btn color="success" @click="testApiConnection" class="mb-4">Test API Connection</v-btn>
      
      <v-alert
        v-if="apiMessage"
        type="success"
        class="mt-4"
      >
        API Response: {{ apiMessage }}
      </v-alert>
      
      <v-alert
        v-if="apiError"
        type="error"
        class="mt-4"
      >
        Failed to connect to API: {{ apiError }}
      </v-alert>
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
