<template>
  <div class="about">
    <v-card class="mx-auto my-6 pa-4" max-width="800" elevation="3" rounded="lg">      <v-card-title class="text-h4 font-weight-bold">
        <v-icon icon="mdi-information-outline" color="primary" size="large" class="mr-3"></v-icon>
        About Yes Chef
      </v-card-title>
      
      <v-divider class="mx-auto my-4 border-opacity-50" style="width: 30%; border-width: 2px;" color="primary"></v-divider>
      
      <v-card-text>
        <p class="text-body-1 mb-6">
          Yes Chef is a modern recipe management application designed for home cooks and professional chefs alike. 
          Store your favorite recipes, organize them by tags, and access them from anywhere.
        </p>
        
        <v-row class="mb-6">
          <v-col cols="12" md="6">
            <v-card class="h-100" variant="outlined" rounded="lg">
              <v-card-title class="text-h6 font-weight-bold text-primary">
                <v-icon icon="mdi-code-tags" color="primary" class="mr-2"></v-icon>
                Technology Stack              </v-card-title>
              <v-card-text>
                <v-list density="compact" class="pa-0">
                  <v-list-item prepend-icon="mdi-chevron-right" class="text-primary">Vue 3 with Composition API</v-list-item>
                  <v-list-item prepend-icon="mdi-chevron-right" class="text-primary">TypeScript for type safety</v-list-item>
                  <v-list-item prepend-icon="mdi-chevron-right" class="text-primary">Vuetify 3 for UI components</v-list-item>
                  <v-list-item prepend-icon="mdi-chevron-right" class="text-primary">Express backend API</v-list-item>
                  <v-list-item prepend-icon="mdi-chevron-right" class="text-primary">PostgreSQL database</v-list-item>
                  <v-list-item prepend-icon="mdi-chevron-right" class="text-primary">Prisma ORM</v-list-item>
                  <v-list-item prepend-icon="mdi-chevron-right" class="text-primary">Vitest for testing</v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="h-100" variant="outlined" rounded="lg">
              <v-card-title class="text-h6 font-weight-bold text-primary">
                <v-icon icon="mdi-feature-search" color="primary" class="mr-2"></v-icon>
                Features              </v-card-title>
              <v-card-text>
                <v-list density="compact" class="pa-0">
                  <v-list-item prepend-icon="mdi-check" class="text-accent">Create and store your favorite recipes</v-list-item>
                  <v-list-item prepend-icon="mdi-check" class="text-accent">Organize recipes with tags</v-list-item>
                  <v-list-item prepend-icon="mdi-check" class="text-accent">Search for recipes by name or ingredients</v-list-item>
                  <v-list-item prepend-icon="mdi-check" class="text-accent">Share recipes with friends and family</v-list-item>
                  <v-list-item prepend-icon="mdi-check" class="text-accent">Beautiful, responsive design</v-list-item>
                  <v-list-item prepend-icon="mdi-check" class="text-accent">Simple and intuitive interface</v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
          <div class="bg-background pa-6 mb-6 font-italic rounded text-body-1 border-start border-accent border-4">
          "Cooking is like love. It should be entered into with abandon or not at all."
          <div class="text-caption text-right mt-2">— Harriet Van Horne</div>
        </div>
        
        <v-btn color="primary" variant="elevated" to="/" class="mt-4">
          <v-icon icon="mdi-arrow-left" class="mr-2"></v-icon>
          Back to Home
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AboutView'
});
</script>
