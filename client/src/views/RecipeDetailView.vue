<template>
  <div class="recipe-detail">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card 
            v-if="recipeStore.currentRecipe" 
            class="pa-0" 
            elevation="3"
            rounded="lg"
          >
            <v-img
              v-if="recipeStore.currentRecipe.imageUrl"
              :src="recipeStore.currentRecipe.imageUrl"
              height="300"
              cover
              class="recipe-image"
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </div>
              </template>
            </v-img>
            
            <div v-else class="recipe-image-placeholder">
              <v-icon icon="mdi-food-variant" size="64" color="white"></v-icon>
            </div>
            
            <v-card-title class="text-h3 pt-6 pb-2 px-6">
              {{ recipeStore.currentRecipe.title }}
            </v-card-title>
            
            <v-card-text class="px-6">
              <v-chip-group class="mb-6">
                <v-chip 
                  v-for="tagItem in recipeStore.currentRecipe.tags" 
                  :key="tagItem.tag.id" 
                  color="primary"
                  class="ma-1"
                  size="small"
                >
                  {{ tagItem.tag.name }}
                </v-chip>              </v-chip-group>
              
              <p class="text-subtitle-1 mb-6 font-italic bg-background pa-4 rounded border-start border-accent border-3">
                {{ recipeStore.currentRecipe.description || 'A delicious recipe worth trying!' }}
              </p>
              
              <div class="bg-background rounded pa-4 mb-6 border border-dashed border-primary">
                <v-row>
                  <v-col cols="4">
                    <div class="text-overline text-primary">Prep Time</div>
                    <div class="text-h6">
                      <v-icon icon="mdi-clock-outline" size="small" class="mr-1"></v-icon>
                      {{ recipeStore.currentRecipe.prepTime || 'N/A' }} min
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <div class="text-overline text-primary">Cook Time</div>
                    <div class="text-h6">
                      <v-icon icon="mdi-stove" size="small" class="mr-1"></v-icon>
                      {{ recipeStore.currentRecipe.cookTime || 'N/A' }} min
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <div class="text-overline text-primary">Servings</div>
                    <div class="text-h6">
                      <v-icon icon="mdi-silverware-fork-knife" size="small" class="mr-1"></v-icon>
                      {{ recipeStore.currentRecipe.servings || 'N/A' }}
                    </div>
                  </v-col>                </v-row>
              </div>
              
              <v-divider class="mx-auto my-6 border-opacity-50" style="width: 50%; border-width: 2px;" color="primary"></v-divider>
                <h3 class="text-h5 mb-4 font-weight-bold text-primary">
                <v-icon icon="mdi-food-variant" class="mr-2"></v-icon>
                Ingredients
              </h3>
              <v-card class="mb-6 pa-4" variant="outlined" rounded="lg">
                <v-list density="compact" class="pa-0">
                  <v-list-item
                    v-for="(ingredient, i) in recipeStore.currentRecipe.ingredients" 
                    :key="i"
                    prepend-icon="mdi-circle-small"
                    class="text-primary" 
                    :class="i !== recipeStore.currentRecipe.ingredients.length - 1 ? 'border-b' : ''"
                  >
                    {{ ingredient }}
                  </v-list-item>
                </v-list>
              </v-card>
              
              <h3 class="text-h5 mb-4 font-weight-bold text-primary">
                <v-icon icon="mdi-chef-hat" class="mr-2"></v-icon>
                Instructions
              </h3>
              <v-card class="mb-6 pa-4" variant="outlined" rounded="lg">
                <p class="white-space-pre-wrap">{{ recipeStore.currentRecipe.instructions }}</p>
              </v-card>
            </v-card-text>
            
            <v-card-actions class="pa-6">
              <v-spacer></v-spacer>
              <v-btn color="accent" variant="elevated" class="text-white mr-2" @click="editRecipe">
                <v-icon icon="mdi-pencil" class="mr-2"></v-icon>
                Edit
              </v-btn>
              <v-btn color="error" variant="elevated" class="mr-2" @click="confirmDelete = true">
                <v-icon icon="mdi-delete" class="mr-2"></v-icon>
                Delete
              </v-btn>
              <v-btn color="secondary" variant="elevated" class="text-white" @click="goBack">
                <v-icon icon="mdi-arrow-left" class="mr-2"></v-icon>
                Back
              </v-btn>
            </v-card-actions>
          </v-card>
          
          <v-card v-else-if="recipeStore.loading" height="400" class="d-flex justify-center align-center" rounded="lg">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          </v-card>
          
          <v-card v-else height="400" class="d-flex justify-center align-center" rounded="lg">
            <div class="text-center pa-6">
              <v-icon icon="mdi-alert-circle" color="error" size="64" class="mb-4"></v-icon>
              <p class="text-h5 mb-6">Recipe not found</p>
              <v-btn color="primary" variant="elevated" @click="goBack">
                <v-icon icon="mdi-arrow-left" class="mr-2"></v-icon>
                Back to Recipes
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    
    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="confirmDelete" max-width="500" rounded="lg">
      <v-card rounded="lg">
        <v-card-title class="text-h5 pa-4 bg-error text-white">
          <v-icon icon="mdi-alert" class="mr-2"></v-icon>
          Confirm Delete
        </v-card-title>
        <v-card-text class="pa-6 pt-4">
          <p>Are you sure you want to delete this recipe? This action cannot be undone.</p>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="confirmDelete = false">Cancel</v-btn>
          <v-btn color="error" variant="elevated" @click="deleteRecipe">
            <v-icon icon="mdi-delete" class="mr-1"></v-icon>
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRecipeStore } from '../stores/recipe.store';

export default defineComponent({
  name: 'RecipeDetailView',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const recipeStore = useRecipeStore();
    const confirmDelete = ref(false);
    
    onMounted(async () => {
      if (route.params.id && !isNaN(Number(route.params.id))) {
        await recipeStore.fetchRecipeDetails(Number(route.params.id));
      }
    });
    
    const goBack = () => {
      router.push('/');
    };
    
    const editRecipe = () => {
      if (recipeStore.currentRecipe) {
        router.push(`/recipes/${recipeStore.currentRecipe.id}/edit`);
      }
    };
    
    const deleteRecipe = async () => {
      if (recipeStore.currentRecipe) {
        try {
          await recipeStore.removeRecipe(recipeStore.currentRecipe.id);
          router.push('/');
        } catch (error) {
          console.error('Failed to delete recipe:', error);
        } finally {
          confirmDelete.value = false;
        }
      }
    };
    
    return {
      recipeStore,
      confirmDelete,
      goBack,
      editRecipe,
      deleteRecipe
    };
  }
});
</script>

<style scoped>
.white-space-pre-wrap {
  white-space: pre-wrap;
}

.recipe-image {
  position: relative;
}

.recipe-image::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%);
  pointer-events: none;
}

.recipe-image-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--v-theme-primary);
}
</style>
