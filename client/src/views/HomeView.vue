<template>
  <div class="min-h-100">
    <!-- Hero section with enhanced food imagery -->
    <v-row class="mt-12">
      <v-col
        cols="12"
        md="6"
        class="d-flex flex-column justify-center"
      >
        <h1 class="text-h2 font-weight-bold mb-4">
          Smart Meal Planning<br>Made <span class="text-accent">Simple</span>
        </h1>
        <p class="text-body-1 mb-6">
          Yes Chef helps you plan your meals, generate shopping lists, and track nutrition - all in one place.
        </p>
        <div class="d-flex flex-wrap gap-3">
          <v-btn
            to="/subscribe"
            color="accent"
            size="large"
            class="text-none mb-2 mr-2"
          >
            <v-icon start>
              mdi-silverware-fork-knife
            </v-icon>
            Start Meal Planning
          </v-btn>
          <v-btn
            to="/features"
            variant="outlined"
            size="large"
            class="text-none mb-2"
          >
            <v-icon start>
              mdi-information-outline
            </v-icon>
            Learn More
          </v-btn>
        </div>
      </v-col>
      
      <v-col
        cols="12"
        md="6"
      >
        <!-- Hero food image showcase with enhanced styling -->
        <div class="food-image-container">
          <div class="image-frame">
            <img 
              src="@/assets/images/healthy-food-bowl.jpg" 
              alt="Fresh healthy food bowl"
              class="food-showcase-image"
              style="width: 100%; height: 100%; object-fit: cover;"
            >
          </div>
        </div>
      </v-col>
    </v-row>    <div
      class="py-16 my-8 bg-dark"
      style="background-color: rgba(30, 41, 59, 0.5); border-top: 1px solid rgba(148, 163, 184, 0.1); border-bottom: 1px solid rgba(148, 163, 184, 0.1);"
    >
      <v-container>
        <v-row>
          <v-col
            cols="12"
            class="text-center mb-12"
          >
            <span class="text-overline text-accent font-weight-bold">SIMPLE PROCESS</span>
            <h2 class="text-h3 font-weight-bold mt-2 mb-3">
              How It Works
            </h2>
            <p
              class="text-subtitle-1 mx-auto"
              style="max-width: 600px"
            >
              Three simple steps to transform your meal planning routine
            </p>
          </v-col>
        </v-row>

        <v-row class="mt-6">
          <v-col
            v-for="(step, index) in steps"
            :key="index"
            cols="12"
            md="4"
            class="px-3"
          >
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                :elevation="isHovering ? 4 : 1"
                :class="['step-card', isHovering ? 'border border-accent' : '']"
                rounded="lg"
              >
                <div class="d-flex align-center mb-5">
                  <v-avatar 
                    color="accent" 
                    size="50"
                    class="mr-4"
                  >
                    <span class="text-h6 font-weight-bold">{{ index + 1 }}</span>
                  </v-avatar>
                  <h3 class="text-h5 font-weight-bold step-title">
                    {{ step.title }}
                  </h3>
                </div>
                
                <p class="text-body-1 step-description">
                  {{ step.description }}
                </p>
                
                <div class="text-center step-icon-container">
                  <v-icon
                    :icon="step.icon"
                    size="64"
                    color="accent"
                    class="opacity-75"
                  />
                </div>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>

        <v-row class="mt-12">
          <v-col
            cols="12"
            class="text-center"
          >
            <v-btn
              to="/subscribe"
              color="accent"
              size="large"
              class="px-6"
            >
              Get Started Today
              <v-icon end>
                mdi-arrow-right
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import '@/assets/styles/step-cards.css';

export default defineComponent({
  name: 'HomeView',
  data() {
    return {
      steps: [
        {
          title: 'Plan Your Meals',
          description: 'Easily select recipes from our curated database or add your own favorites to create personalized weekly meal plans in minutes.',
          icon: 'mdi-calendar-text'
        },
        {
          title: 'Generate Shopping Lists',
          description: 'Our smart system automatically combines ingredients from all your planned meals into organized shopping lists, saving you time and reducing waste.',
          icon: 'mdi-cart-outline'
        },
        {
          title: 'Track Nutrition',
          description: 'Monitor your nutritional intake with detailed breakdowns and visualizations to help you maintain a balanced, healthy diet effortlessly.',
          icon: 'mdi-chart-bar'
        }
      ]
    };
  }
});
</script>

<style scoped>
.food-image-container {
  position: relative;
  margin-top: -30px;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-frame {
  position: relative;
  border-radius: 50%;
  padding: 10px;
  background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.5));
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  transform: rotate(-3deg);
  border: 2px solid rgba(var(--v-theme-accent), 0.3);
}

.image-frame:hover {
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
}

.food-showcase-image {
  border-radius: 50%;
  border: 4px solid white;
  overflow: hidden;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.15);
  max-width: 100%;
  height: auto;
  aspect-ratio: 1/1;
}

/* Add accent glow effect */
.image-frame::after {
  content: '';
  position: absolute;
  top: -10px;
  right: -10px;
  bottom: -10px;
  left: -10px;
  background: radial-gradient(circle at center, rgba(var(--v-theme-accent), 0.2) 0%, transparent 70%);
  border-radius: 50%;
  z-index: -1;
  opacity: 0.7;
}

@media (max-width: 960px) {
  .food-image-container {
    margin-top: 30px;
  }
  
  .image-frame {
    transform: rotate(-2deg);
    padding: 5px;
  }
}
</style>
