<template>
  <div class="meal-header d-flex align-center justify-center">
    <v-icon
      size="small"
      :color="iconColor"
      class="mr-2"
    >
      {{ iconName }}
    </v-icon>
    <span class="text-body-2 font-weight-medium">{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  iconName: string;
  iconColor: string;
}>();
</script>

<style scoped>
.meal-header {
  height: 100%;
  width: 100%;
}
</style>
