<template>
  <div>
    <v-row class="justify-center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="mx-auto pa-6 rounded-lg">
          <div class="text-center mb-6">
            <v-avatar color="primary" size="64" class="mb-4">
              <v-icon icon="mdi-chef-hat" size="36" color="white"></v-icon>
            </v-avatar>
            <h1 class="text-h4 font-weight-bold">Welcome Back</h1>
            <p class="text-subtitle-1 text-medium-emphasis">Log in to your Yes Chef account</p>
          </div>

          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              required
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              variant="outlined"
              required
            ></v-text-field>

            <div class="d-flex justify-space-between align-center mb-6">
              <v-checkbox
                v-model="rememberMe"
                label="Remember me"
                hide-details
                density="compact"
              ></v-checkbox>
              <router-link to="/forgot-password" class="text-decoration-none text-accent">
                Forgot Password?
              </router-link>
            </div>

            <v-btn
              type="submit"
              color="primary"
              block
              size="large"
              class="mb-4"
              :loading="isLoading"
            >
              Log In
            </v-btn>

            <div class="text-center">
              <div class="mb-4">
                <span class="text-medium-emphasis">Don't have an account?</span>
                <router-link to="/subscribe" class="text-decoration-none text-accent ml-1">
                  Sign up now
                </router-link>
              </div>

              <v-divider class="mb-4">
                <span class="text-caption text-medium-emphasis">OR</span>
              </v-divider>

              <v-btn variant="outlined" block class="mb-3">
                <v-icon start>mdi-google</v-icon>
                Continue with Google
              </v-btn>

              <v-btn variant="outlined" block>
                <v-icon start>mdi-facebook</v-icon>
                Continue with Facebook
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'LoginView',
  setup() {
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const showPassword = ref(false);
    const rememberMe = ref(false);
    const isLoading = ref(false);

    const handleLogin = async () => {
      isLoading.value = true;
      
      // Simulate API call with timeout
      setTimeout(() => {
        isLoading.value = false;
        // For demo purposes, just forward to dashboard
        router.push('/dashboard');
      }, 1000);
    };

    return {
      email,
      password,
      showPassword,
      rememberMe,
      isLoading,
      handleLogin
    };
  }
});
</script>
