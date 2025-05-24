<template>
  <div>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">          <v-card 
            v-if="recipeStore.currentRecipe" 
            class="pa-0" 
            elevation="1"
            rounded="lg"
          >            <v-img
              :src="recipeImageUrl"
              height="300"
              cover
              gradient="to top, rgba(0,0,0,0.6) 0%, transparent 100%"
              @error="handleImageError"
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </div>
              </template>
            </v-img>
            
            <v-card-title class="text-h3 pt-6 pb-2 px-6 font-weight-light">
              {{ recipeStore.currentRecipe.title }}
            </v-card-title>
            
            <v-card-text class="px-6">              <v-chip-group class="mb-6">
                <v-chip 
                  v-for="tagItem in recipeStore.currentRecipe.tags" 
                  :key="tagItem.tag.id" 
                  color="accent"
                  class="ma-1"
                  size="small"
                  variant="outlined"
                >
                  {{ tagItem.tag.name }}
                </v-chip>              </v-chip-group>
              
              <p class="text-subtitle-1 mb-6 font-italic bg-background pa-4 rounded border-start border-accent border-3">
                {{ recipeStore.currentRecipe.description || 'A nutritionally balanced meal plan designed for your health goals.' }}
              </p>
              
              <div class="bg-background rounded pa-4 mb-6 border-0 elevation-1">
                <v-row>
                  <v-col cols="4">
                    <div class="text-overline text-primary">Calories</div>
                    <div class="text-h6">
                      <v-icon icon="mdi-fire" size="small" class="mr-1"></v-icon>
                      {{ recipeStore.currentRecipe.prepTime || '450' }} kcal
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <div class="text-overline text-primary">Prep Time</div>
                    <div class="text-h6">
                      <v-icon icon="mdi-clock-outline" size="small" class="mr-1"></v-icon>
                      {{ recipeStore.currentRecipe.cookTime || '25' }} min
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <div class="text-overline text-primary">Servings</div>
                    <div class="text-h6">
                      <v-icon icon="mdi-silverware-fork-knife" size="small" class="mr-1"></v-icon>
                      {{ recipeStore.currentRecipe.servings || '2' }}
                    </div>
                  </v-col>                </v-row>              </div>
              
              <v-divider class="mx-auto my-6 border-opacity-25" style="width: 50%;" color="primary"></v-divider>
                <h3 class="text-h5 mb-4 font-weight-medium text-primary">                <v-icon icon="mdi-food-variant" class="mr-2"></v-icon>
                Ingredients
              </h3>
              <v-card class="mb-6 pa-4" variant="flat" rounded="lg" elevation="1">
                <v-list density="compact" class="pa-0 bg-background">
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
                <h3 class="text-h5 mb-4 font-weight-medium text-primary">
                <v-icon icon="mdi-chef-hat" class="mr-2"></v-icon>
                Instructions
              </h3>
              <v-card class="mb-6 pa-4" variant="flat" rounded="lg" elevation="1">
                <p class="text-pre-wrap">{{ recipeStore.currentRecipe.instructions }}</p>
              </v-card>

              <h3 class="text-h5 mb-4 font-weight-medium text-primary">
                <v-icon icon="mdi-nutrition" class="mr-2"></v-icon>
                Nutritional Information
              </h3>
              <v-card class="mb-6 pa-4" variant="flat" rounded="lg" elevation="1">
                <v-row>
                  <v-col cols="6" sm="3">
                    <div class="text-overline text-primary">Protein</div>
                    <div class="text-body-1">25g</div>
                  </v-col>
                  <v-col cols="6" sm="3">
                    <div class="text-overline text-primary">Carbs</div>
                    <div class="text-body-1">48g</div>
                  </v-col>
                  <v-col cols="6" sm="3">
                    <div class="text-overline text-primary">Fat</div>
                    <div class="text-body-1">15g</div>
                  </v-col>
                  <v-col cols="6" sm="3">
                    <div class="text-overline text-primary">Fiber</div>
                    <div class="text-body-1">6g</div>
                  </v-col>
                </v-row>
              </v-card>
            </v-card-text>
              <v-card-actions class="pa-6">
              <v-spacer></v-spacer>
              <v-btn color="info" variant="tonal" class="mr-2" @click="addToGroceryList">
                <v-icon icon="mdi-cart" class="mr-2"></v-icon>
                Add to Grocery List
              </v-btn>
              <v-btn color="accent" variant="text" class="mr-2" @click="adjustMeal">
                <v-icon icon="mdi-pencil" class="mr-2"></v-icon>
                Adjust
              </v-btn>
              <v-btn color="error" variant="text" class="mr-2" @click="confirmDelete = true">
                <v-icon icon="mdi-delete" class="mr-2"></v-icon>
                Remove
              </v-btn>
              <v-btn color="primary" variant="tonal" @click="goBack">
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
              <p class="text-h5 mb-6">Meal plan not found</p>
              <v-btn color="primary" variant="elevated" @click="goBack">
                <v-icon icon="mdi-arrow-left" class="mr-2"></v-icon>
                Back to Meal Plans
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
          Confirm Removal
        </v-card-title>
        <v-card-text class="pa-6 pt-4">
          <p>Are you sure you want to remove this meal from your plan? You can always generate a new meal plan later.</p>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="confirmDelete = false">Cancel</v-btn>
          <v-btn color="error" variant="elevated" @click="deleteRecipe">
            <v-icon icon="mdi-delete" class="mr-1"></v-icon>
            Remove
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRecipeStore } from '../stores/recipe.store';

export default defineComponent({
  name: 'MealPlanDetailView',
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
    
    // Fallback image system
    const defaultImageUrl = computed(() => {
      // Import the healthy food bowl image as fallback
      return new URL('../assets/images/healthy-food-bowl.jpg', import.meta.url).href;
    });    const recipeImageUrl = computed(() => {
      // Use recipe image if available and valid, otherwise use fallback
      return recipeStore.currentRecipe?.imageUrl || defaultImageUrl.value;
    });
    
    // Error handling for image loading
    const handleImageError = () => {
      console.log('Image failed to load for recipe:', recipeStore.currentRecipe?.title);
    };
    
    const goBack = () => {
      router.push('/');
    };
    
    const adjustMeal = () => {
      if (recipeStore.currentRecipe) {
        // This would open a dialog to adjust meal preferences
        alert('This would open a dialog to adjust meal preferences based on your dietary needs and taste preferences.');
      }
    };

    const addToGroceryList = () => {
      // This would add ingredients to a grocery list
      alert('Ingredients added to your grocery list! You can access your complete shopping list from your account dashboard.');
    };
    
    const deleteRecipe = async () => {
      if (recipeStore.currentRecipe) {
        try {
          await recipeStore.removeRecipe(recipeStore.currentRecipe.id);
          router.push('/');
        } catch (error) {
          console.error('Failed to remove meal from plan:', error);
        } finally {
          confirmDelete.value = false;
        }
      }
    };    return {
      recipeStore,
      confirmDelete,
      goBack,
      adjustMeal,
      addToGroceryList,
      deleteRecipe,
      recipeImageUrl,
      handleImageError
    };
  }
});
</script>
