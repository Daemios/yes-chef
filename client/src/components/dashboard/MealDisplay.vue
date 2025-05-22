<template>
  <div class="meal-display">
    <div class="d-flex align-center">
      <MealIcon 
        :meal-name="mealName"
        :servings="servings"
        :icon-name="iconName"
        :icon-color="iconColor"
        class="meal-icon"
      />
      <div class="meal-info">
        <div class="text-body-2 meal-name">
          {{ mealName }}
        </div>
        <div class="text-caption meal-servings">
          {{ servings }} servings
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MealIcon from './MealIcon.vue';

interface Props {
  mealName: string;
  servings: number;
  iconName: string;
  iconColor: string;
  mealType?: string;
}

defineProps<Props>();
</script>

<style scoped>
.meal-display {
  width: 100%;
  height: 100%;
  padding: 12px;
}

.meal-icon {
  flex-shrink: 0;
}

.meal-info {
  flex-grow: 1;
  min-width: 0; /* Prevent text overflow */
}

.meal-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meal-servings {
  white-space: nowrap;
}
</style>
