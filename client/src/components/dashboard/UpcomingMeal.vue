<template>
  <v-card
    variant="flat"
    class="d-flex justify-center align-center pa-2 bg-transparent"
    :class="{
      'needs-prep': needsPrep,
      'is-prepared': isPrepared
    }"
  >
    <div class="d-flex flex-column align-center">
      <!-- Meal name shown outside of chip -->
      <div class="text-caption text-medium-emphasis mb-1">
        {{ mealName }}
      </div>
      
      <!-- Colored chip showing leftover servings if any -->
      <div class="d-flex align-center">
        <v-chip
          v-if="leftovers > 0"
          :color="color"
          size="x-small"
          label
          density="compact"
          class="px-2"
        >
          <span>Left: {{ leftovers }}</span>
        </v-chip>
        
        <v-icon
          v-if="needsPrep"
          size="x-small"
          color="warning"
          class="ms-2"
          icon="mdi-chef-hat"
          title="Needs prep today"
        />
        <v-icon
          v-if="isPrepared"
          size="x-small"
          color="success"
          class="ms-2"
          icon="mdi-check-circle"
          title="Already prepared"
        />
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UpcomingMeal',
  props: {
    mealName: {
      type: String,
      required: true
    },
    dayName: {
      type: String,
      required: true
    },
    mealType: {
      type: String,
      required: true,
      validator: (value: string) => ['breakfast', 'lunch', 'dinner'].includes(value)
    },
    color: {
      type: String,
      required: true
    },
    needsPrep: {
      type: Boolean,
      default: false
    },
    isPrepared: {
      type: Boolean,
      default: false
    },
    leftovers: {
      type: Number,
      default: 0
    }
  }
});
</script>

<style scoped>
/* Use Vuetify classes for styling */
:deep(.v-card) {
  transition: all 0.2s ease;
  overflow: hidden;
  min-height: 60px;
}

:deep(.v-card:hover) {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

/* Meal prep status indicators */
.needs-prep {
  box-shadow: 0 0 0 1px rgba(var(--v-theme-warning), 0.5);
}

.is-prepared {
  box-shadow: 0 0 0 1px rgba(var(--v-theme-success), 0.5);
}
</style>