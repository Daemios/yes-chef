<template>
  <div class="test">
    <h1>API Testing Page</h1>
    <div class="api-test">
      <button @click="testApiConnection">Test API Connection</button>
      <div v-if="apiMessage" class="api-response">
        <p>API Response: {{ apiMessage }}</p>
      </div>
      <div v-if="apiError" class="api-error">
        <p>Failed to connect to API: {{ apiError }}</p>
      </div>
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

<style scoped>
.test {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.api-test {
  margin-top: 20px;
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
</style>
