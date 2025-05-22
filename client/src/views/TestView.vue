<template>
  <div class="mx-auto pa-5" style="max-width: 800px;">
    <h1 class="text-h4 font-weight-bold mb-6">API Testing Page</h1>
    <div class="mt-5">
      <v-btn @click="testApiConnection" color="primary">Test API Connection</v-btn>
      
      <v-alert
        v-if="apiMessage"
        type="success"
        variant="tonal"
        class="mt-3"
        border="start"
      >
        API Response: {{ apiMessage }}
      </v-alert>
      
      <v-alert
        v-if="apiError"
        type="error"
        variant="tonal"
        class="mt-3"
        border="start"
      >
        Failed to connect to API: {{ apiError }}
      </v-alert>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { fetchHelloMessage } from '../services/api.service';

export default defineComponent({
  name: 'TestView',
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
