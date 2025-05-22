<template>
  <v-card
    :class="{
      'opacity-75': section.allPurchased && !showAllItems,
      'cursor-pointer': true
    }"
    variant="outlined"
    @click="toggleExpand"
  >
    <!-- Section Header -->
    <v-card-item class="pa-2">
      <div class="d-flex align-center">
        <v-avatar
          :color="section.color"
          class="mr-2"
          size="32"
        >
          <v-icon
            :icon="section.icon"
            color="white"
            size="small"
          />
        </v-avatar>
        
        <div class="flex-grow-1">
          <div class="d-flex align-center">
            <div class="text-subtitle-1 font-weight-bold">
              {{ section.name }}
            </div>
            <v-chip
              size="x-small"
              :color="section.allPurchased ? 'success' : 'primary'"
              class="ml-2"
            >
              {{ section.purchasedCount }}/{{ section.items.length }}
            </v-chip>
          </div>
        </div>
        
        <v-progress-circular
          :model-value="(section.purchasedCount / section.items.length) * 100"
          :color="section.allPurchased ? 'success' : 'primary'"
          size="20"
          width="2"
          class="mr-2"
        />
        <v-icon
          :icon="isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          size="small"
        />
      </div>
    </v-card-item>
    
    <!-- Expandable Item List -->
    <v-expand-transition>
      <div v-show="isExpanded">
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
              'py-1': true
            }"
            rounded
            height="auto"
            @click.stop="toggleItemPurchased(item)"
          >
            <!-- Optimize for easy tapping on mobile -->
            <template #prepend>
              <v-checkbox
                v-model="item.purchased"
                :color="item.purchased ? 'success' : 'primary'"
                hide-details
                density="compact"
                class="mt-0 pt-0 mr-3"
                @click.stop
              />
            </template>
            
            <v-list-item-title 
              :class="{ 'text-decoration-line-through text-medium-emphasis': item.purchased }"
              class="text-body-1"
            >
              {{ item.name }}
            </v-list-item-title>
            
            <v-list-item-subtitle class="text-body-2">
              {{ item.quantity }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';

// Define necessary types
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
  name: 'MobileShoppingSection',
  
  props: {
    section: {
      type: Object as PropType<ShoppingSection>,
      required: true
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
/* Mobile-optimized styles */
.cursor-pointer {
  cursor: pointer;
}

/* Larger touch targets for mobile */
:deep(.v-selection-control) {
  min-height: 36px;
}
</style>
