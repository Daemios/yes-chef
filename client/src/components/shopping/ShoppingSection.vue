<template>
  <v-card
    :class="{
      'opacity-75': section.allPurchased && !showAllItems,
      'cursor-pointer': !isDesktop
    }"
    variant="outlined"
    @click="toggleExpand"
  >
    <v-card-item class="pa-3">
      <div class="d-flex align-center">
        <v-avatar
          :color="section.color"
          class="mr-3"
          size="36"
        >
          <v-icon
            :icon="section.icon"
            color="white"
          />
        </v-avatar>
        
        <div class="flex-grow-1">
          <div class="d-flex align-center">
            <div class="text-subtitle-1 font-weight-bold">
              {{ section.name }}
            </div>
            <v-chip
              size="small"
              :color="section.allPurchased ? 'success' : 'primary'"
              class="ml-2"
            >
              {{ section.items.length }}
            </v-chip>
          </div>
          <div class="text-body-2 text-medium-emphasis">
            {{ section.purchasedCount }}/{{ section.items.length }} purchased
          </div>
        </div>
        
        <v-progress-circular
          :model-value="(section.purchasedCount / section.items.length) * 100"
          :color="section.allPurchased ? 'success' : 'primary'"
          size="24"
          width="2"
          class="mr-3"
        />
        <v-icon
          v-if="!isDesktop"
          :icon="isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        />
      </div>
    </v-card-item>
    
    <v-expand-transition>
      <div v-show="isDesktop || isExpanded">
        <v-divider />
        <v-list
          density="compact"
          class="pa-0"
        >
          <v-list-item
            v-for="(item, itemIndex) in filteredItems(section)"
            :key="itemIndex"
            :class="{
              'bg-success-lighten-5 border-start border-success border-3': item.purchased,
              'py-2': true
            }"
            rounded
            height="auto"
            @click.stop="toggleItemPurchased(item)"
          >
            <template #prepend>
              <v-checkbox
                v-model="item.purchased"
                :color="item.purchased ? 'success' : 'primary'"
                hide-details
                density="compact"
                @click.stop
              />
            </template>
            
            <v-list-item-title :class="{ 'text-decoration-line-through text-medium-emphasis': item.purchased }">
              {{ item.name }}
            </v-list-item-title>
            
            <v-list-item-subtitle class="d-flex align-center mt-1">
              <span class="font-weight-medium">{{ item.quantity }}</span>
              <v-chip
                v-if="item.recipe"
                size="x-small"
                variant="outlined"
                color="primary"
                class="ml-2"
              >
                {{ item.recipe }}
              </v-chip>
            </v-list-item-subtitle>
            
            <template #append>
              <v-btn
                icon="mdi-information-outline"
                variant="text"
                size="small"
                class="d-none d-lg-flex"
                @click.stop="selectItem(item)"
              />
            </template>
          </v-list-item>
        </v-list>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue';

// Define necessary types for component props
interface ShoppingItem {
  name: string;
  quantity: string;
  recipe?: string;
  purchased: boolean;
}

interface ShoppingSection {
  name: string;
  icon: string;
  color: string;
  items: ShoppingItem[];
  purchasedCount: number;
  allPurchased: boolean;
}

export default defineComponent({
  name: 'ShoppingSection',
  
  props: {
    section: {
      type: Object as PropType<ShoppingSection>,
      required: true
    },
    isDesktop: {
      type: Boolean,
      default: false
    },
    showAllItems: {
      type: Boolean,
      default: true
    },
    searchTerm: {
      type: String,
      default: ''
    }
  },
  
  emits: ['toggle-purchased', 'select-item'],
  
  setup(props, { emit }) {
    const isExpanded = ref(false);
    
    // Toggle expansion of a section
    const toggleExpand = () => {
      // Skip toggling on desktop as sections are always expanded
      if (props.isDesktop) {
        return;
      }
      
      // On mobile, toggle the expanded state
      isExpanded.value = !isExpanded.value;
    };
    
    // Filter items based on search and show/hide purchased
    const filteredItems = (section) => {
      return section.items.filter(item => {
        // Filter by purchase status if hideCompleted
        if (!props.showAllItems && item.purchased) {
          return false;
        }
        
        // Filter by search term
        if (props.searchTerm) {
          return item.name.toLowerCase().includes(props.searchTerm.toLowerCase()) ||
            (item.recipe && item.recipe.toLowerCase().includes(props.searchTerm.toLowerCase()));
        }
        
        return true;
      });
    };
    
    // Toggle item purchased status
    const toggleItemPurchased = (item: ShoppingItem) => {
      emit('toggle-purchased', item);
    };
    
    // Select an item to show details
    const selectItem = (item: ShoppingItem) => {
      emit('select-item', item);
    };
    
    return {
      isExpanded,
      toggleExpand,
      filteredItems,
      toggleItemPurchased,
      selectItem
    };
  }
});
</script>

<style scoped>
/* Any component-specific styles can go here */
.cursor-pointer {
  cursor: pointer;
}
</style>
