<template>
  <div class="min-h-100">
    <h1 class="text-h4 font-weight-bold mb-6">My Account</h1>
    
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="mb-6">
          <v-card-item class="text-center pa-6">
            <v-avatar size="120" class="mb-4">
              <v-img :src="authStore.user.avatar" alt="Profile"></v-img>
            </v-avatar>
            <v-card-title class="text-h5 font-weight-bold mb-1">{{ authStore.fullName }}</v-card-title>
            <v-card-subtitle>{{ authStore.user.role }} Member</v-card-subtitle>
            <v-chip color="success" class="mt-2">Active Subscription</v-chip>
          </v-card-item>
          
          <v-divider></v-divider>
          
          <v-list density="compact" nav>
            <v-list-item value="profile" to="/account/profile" prepend-icon="mdi-account">
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item>
            <v-list-item value="billing" to="/account/billing" prepend-icon="mdi-credit-card">
              <v-list-item-title>Billing & Subscription</v-list-item-title>
            </v-list-item>
            <v-list-item value="preferences" to="/account/preferences" prepend-icon="mdi-food-apple">
              <v-list-item-title>Dietary Preferences</v-list-item-title>
            </v-list-item>
            <v-list-item value="notifications" to="/account/notifications" prepend-icon="mdi-bell">
              <v-list-item-title>Notifications</v-list-item-title>
            </v-list-item>
            <v-list-item value="security" to="/account/security" prepend-icon="mdi-shield-lock">
              <v-list-item-title>Security</v-list-item-title>
            </v-list-item>
          </v-list>
          
          <v-divider></v-divider>
          
          <v-list>
            <v-list-item value="help" to="/support" prepend-icon="mdi-help-circle">
              <v-list-item-title>Help & Support</v-list-item-title>
            </v-list-item>
            <v-list-item value="logout" prepend-icon="mdi-logout" @click="authStore.toggleAuth">
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
        
        <v-card>
          <v-card-title class="text-h6">
            <v-icon start color="primary">mdi-information</v-icon>
            Account Info
          </v-card-title>
          <v-divider></v-divider>
          <v-list density="compact">
            <v-list-item>
              <v-list-item-title>Member Since</v-list-item-title>
              <template v-slot:append>{{ authStore.user.memberSince }}</template>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Plan</v-list-item-title>
              <template v-slot:append>
                <v-chip color="primary" size="small">{{ authStore.user.plan }}</v-chip>
              </template>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Next Billing</v-list-item-title>
              <template v-slot:append>{{ authStore.user.nextBilling }}</template>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Meal Plans Created</v-list-item-title>
              <template v-slot:append>24</template>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Custom Recipes</v-list-item-title>
              <template v-slot:append>12</template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="8">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
        
        <!-- Default profile content (when no sub-route is active) -->
        <v-card v-if="$route.path === '/account'">
          <v-card-title class="text-h5 font-weight-bold">
            <v-icon start color="primary">mdi-account</v-icon>
            Profile Information
          </v-card-title>
          
          <v-divider></v-divider>
          
          <v-card-text class="pa-4">
            <v-form>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profile.firstName"
                    label="First Name"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profile.lastName"
                    label="Last Name"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>
              
              <v-text-field
                v-model="profile.email"
                label="Email Address"
                variant="outlined"
                type="email"
                readonly
              ></v-text-field>
              
              <v-text-field
                v-model="profile.phone"
                label="Phone Number"
                variant="outlined"
              ></v-text-field>
              
              <v-select
                v-model="profile.timezone"
                :items="timezones"
                label="Timezone"
                variant="outlined"
              ></v-select>
              
              <v-textarea
                v-model="profile.bio"
                label="Bio"
                variant="outlined"
                rows="3"
                placeholder="Tell us about yourself and your cooking style"
              ></v-textarea>
              
              <v-file-input
                label="Profile Picture"
                accept="image/*"
                variant="outlined"
                prepend-icon="mdi-camera"
              ></v-file-input>
              
              <v-card-actions class="pa-0 mt-4">
                <v-spacer></v-spacer>
                <v-btn variant="text" color="primary">Cancel</v-btn>
                <v-btn color="primary">Save Changes</v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

export default defineComponent({
  name: 'AccountView',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    
    const profile = ref({
      firstName: authStore.user.firstName,
      lastName: authStore.user.lastName,
      email: authStore.user.email,
      phone: '(555) 123-4567',
      timezone: 'America/New_York',
      bio: 'I love exploring new recipes and cooking for my family. Passionate about healthy eating and meal prepping!'
    });
    
    const timezones = [
      'America/New_York',
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles',
      'Europe/London',
      'Europe/Paris',
      'Asia/Tokyo',
      'Australia/Sydney'
    ];
    
    const logout = () => {
      authStore.logout();
      router.push('/');
    };
    
    return {
      profile,
      timezones,
      logout,
      authStore
    };
  }
});
</script>
