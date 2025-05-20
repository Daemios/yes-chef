<template>
  <div class="subscribe">
    <v-row class="justify-center">
      <v-col cols="12" md="10" lg="8">
        <v-card class="rounded-lg">
          <v-row>
            <v-col cols="12" md="5" class="bg-primary pa-8">
              <div class="text-white">
                <h2 class="text-h4 font-weight-bold mb-4">Ready to transform your meal planning?</h2>
                <p class="text-subtitle-1 mb-6">Create your account and start your 14-day free trial today.</p>
                
                <div class="mb-6">
                  <div v-for="(benefit, index) in benefits" :key="index" class="d-flex align-center mb-3">
                    <v-icon icon="mdi-check-circle" color="accent" class="mr-3"></v-icon>
                    <span>{{ benefit }}</span>
                  </div>
                </div>
                
                <v-img src="/img/subscribe-illustration.svg" alt="Yes Chef Meal Planning" class="mt-6" max-height="180" contain />
              </div>
            </v-col>
            
            <v-col cols="12" md="7" class="pa-8">
              <h3 class="text-h5 font-weight-bold mb-4">Create Your Account</h3>
              
              <v-form @submit.prevent="handleSignup">
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="firstName"
                      label="First Name"
                      variant="outlined"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="lastName"
                      label="Last Name"
                      variant="outlined"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
                
                <v-text-field
                  v-model="email"
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  required
                ></v-text-field>
                
                <v-text-field
                  v-model="password"
                  label="Password"
                  :type="showPassword ? 'text' : 'password'"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  variant="outlined"
                  required
                ></v-text-field>
                
                <v-select
                  v-model="plan"
                  :items="plans"
                  label="Select Plan"
                  variant="outlined"
                  required
                ></v-select>
                
                <v-checkbox
                  v-model="terms"
                  label="I agree to the Terms of Service and Privacy Policy"
                  required
                ></v-checkbox>
                
                <v-btn
                  type="submit"
                  color="accent"
                  block
                  size="large"
                  class="mt-4"
                  :loading="isLoading"
                >
                  Start Free Trial
                </v-btn>
                
                <p class="text-caption text-center mt-4 text-medium-emphasis">
                  No credit card required for trial. You won't be charged until after your 14-day free trial.
                </p>
              </v-form>
              
              <v-divider class="my-4"></v-divider>
              
              <div class="text-center">
                <p class="text-body-2 mb-2">Already have an account?</p>
                <v-btn to="/login" variant="text" color="primary">
                  Log In
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'SubscribeView',
  setup() {
    const router = useRouter();
    const firstName = ref('');
    const lastName = ref('');
    const email = ref('');
    const password = ref('');
    const showPassword = ref(false);
    const plan = ref('premium');
    const terms = ref(false);
    const isLoading = ref(false);
    
    const plans = [
      { title: 'Basic Plan - $4.99/month', value: 'basic' },
      { title: 'Premium Plan - $9.99/month', value: 'premium' },
      { title: 'Family Plan - $14.99/month', value: 'family' }
    ];
    
    const benefits = [
      'Plan your meals for the week in minutes',
      'Generate smart shopping lists automatically',
      'Track nutrition and dietary preferences',
      'Access thousands of recipes',
      'Cancel anytime during your trial'
    ];
    
    const handleSignup = async () => {
      isLoading.value = true;
      
      // Simulate API call with timeout
      setTimeout(() => {
        isLoading.value = false;
        // For demo purposes, just forward to dashboard
        router.push('/dashboard');
      }, 1000);
    };
    
    return {
      firstName,
      lastName,
      email,
      password,
      showPassword,
      plan,
      plans,
      terms,
      benefits,
      isLoading,
      handleSignup
    };
  }
});
</script>
