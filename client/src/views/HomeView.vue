<template>  <div class="home">
    <div class="bg-primary py-16 text-center mb-8">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="8" lg="6">
            <h1 class="text-h2 font-weight-bold text-white mb-4">Welcome to Yes Chef</h1>
            <p class="text-h6 text-white mb-6">Your personal recipe collection</p>
            <v-btn
              color="accent"
              size="large"
              class="text-white"
              elevation="3"
              @click="createNewRecipe"
            >
              <v-icon icon="mdi-plus" class="mr-2"></v-icon>
              Add New Recipe
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- API Test Section -->
    <v-card class="mx-auto my-6 pa-4" max-width="600" elevation="3" rounded="lg">
      <v-card-title class="text-h5 font-weight-bold">
        <v-icon icon="mdi-api" color="primary" class="mr-2"></v-icon>
        API Connection
      </v-card-title>
      <v-card-text>
        <p>This is a Vue.js application with Node/Express backend using TypeScript.</p>
        <v-btn
          color="primary"
          class="mt-4"
          variant="elevated"
          @click="fetchMessage"
          :loading="apiLoading"
          :disabled="apiLoading"
        >
          <v-icon icon="mdi-connection" class="mr-2"></v-icon>
          Test API Connection
        </v-btn>
        <v-alert
          v-if="apiMessage"
          density="comfortable"
          type="success"
          variant="tonal"
          class="mt-4"
        >
          {{ apiMessage }}
        </v-alert>
        <v-alert
          v-if="apiError"
          density="comfortable"
          type="error"
          variant="tonal"
          class="mt-4"
        >
          {{ apiError }}
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- Recipe List Section -->
    <v-card class="mx-auto my-6 pa-4" max-width="800" elevation="3" rounded="lg">
      <v-card-title class="d-flex align-center">
        <v-icon icon="mdi-book-open-variant" color="primary" size="large" class="mr-3"></v-icon>
        <span class="text-h4 font-weight-bold">Recipes</span>
        <v-spacer></v-spacer>
        <v-btn 
          color="accent" 
          variant="elevated" 
          class="text-white"
          prepend-icon="mdi-plus" 
          @click="createNewRecipe"
        >
          Add Recipe        </v-btn>
      </v-card-title>
      
      <v-divider class="mx-auto my-4 border-opacity-50" style="width: 30%; border-width: 2px;" color="primary"></v-divider>
      
      <v-card-text>
        <v-btn
          color="info"
          variant="outlined"
          class="mb-6"
          @click="loadRecipes"
          :loading="recipeStore.loading"
          :disabled="recipeStore.loading"
        >
          <v-icon icon="mdi-refresh" class="mr-2"></v-icon>
          Refresh Recipes
        </v-btn>

        <v-alert
          v-if="recipeStore.error"
          type="error"
          variant="tonal"
          class="mb-4"
        >
          {{ recipeStore.error }}
        </v-alert>

        <v-list v-if="recipeStore.recipes.length > 0" class="bg-light-cream">
          <v-list-item
            v-for="recipe in recipeStore.getSortedRecipes"
            :key="recipe.id"
            :title="recipe.title"
            :subtitle="recipe.description || 'No description'"
            class="recipe-card mb-2"
            rounded="lg"
            elevation="1"
            variant="elevated"
            active-color="primary"
          >
            <template v-slot:prepend>
              <v-avatar color="primary" class="text-white">
                {{ recipe.title.charAt(0).toUpperCase() }}
              </v-avatar>
            </template>
            
            <template v-slot:append>
              <v-btn 
                icon="mdi-eye" 
                variant="text" 
                color="primary" 
                @click="viewRecipe(recipe.id)"
              ></v-btn>
            </template>
          </v-list-item>
        </v-list>
        
        <v-card 
          v-else-if="!recipeStore.loading" 
          class="pa-6 text-center bg-light-cream"
          variant="outlined"
          rounded="lg"
        >
          <v-icon icon="mdi-food-off" size="64" color="text-light" class="mb-4"></v-icon>
          <p class="text-h6 mb-4">No recipes found.</p>
          <p class="mb-4">Time to add your first culinary creation!</p>
          <v-btn 
            color="accent" 
            variant="elevated" 
            class="text-white"
            prepend-icon="mdi-plus" 
            @click="createNewRecipe"
          >
            Create First Recipe
          </v-btn>
        </v-card>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchHelloMessage } from '../services/api.service';
import { useRecipeStore } from '../stores/recipe.store';

export default defineComponent({
  name: 'HomeView',
  setup() {
    const router = useRouter();
    const recipeStore = useRecipeStore();
    
    // API test state
    const apiMessage = ref('');
    const apiError = ref('');
    const apiLoading = ref(false);

    // Load recipes on component mount
    onMounted(async () => {
      await loadRecipes();
    });

    const fetchMessage = async () => {
      apiLoading.value = true;
      apiError.value = '';
      try {
        const data = await fetchHelloMessage();
        apiMessage.value = data.message;
      } catch (err) {
        apiError.value = 'Failed to connect to API';
        console.error('API Error:', err);
      } finally {
        apiLoading.value = false;
      }
    };

    const loadRecipes = async () => {
      try {
        await recipeStore.fetchAllRecipes();
      } catch (err) {
        console.error('Error loading recipes:', err);
      }
    };

    const viewRecipe = (id: number) => {
      router.push(`/recipes/${id}`);
    };

    const createNewRecipe = () => {
      router.push('/recipes/new');
    };

    return {
      // API test
      apiMessage,
      apiError,
      apiLoading,
      fetchMessage,
      
      // Recipe functionality
      recipeStore,
      loadRecipes,
      viewRecipe,
      createNewRecipe
    };
  }
});
</script>

<style scoped>
.home {
  min-height: 100%;
}
</style>
