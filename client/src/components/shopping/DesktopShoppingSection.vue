<template>
  <v-card
    elevation="1" 
    class="mb-4 rounded-lg shopping-section-card h-100"
  >
    <!-- Section Header -->
    <v-card-item
      :class="['pa-3', 'section-header', section.allPurchased ? 'bg-success-lighten-5' : 'bg-primary-lighten-5']"
    >
      <div class="d-flex align-center">
        <v-avatar
          :color="section.color"
          class="mr-3"
          size="42"
        >
          <v-icon
            :icon="section.icon"
            color="white"
          />
        </v-avatar>
        
        <div class="flex-grow-1">
          <div class="d-flex align-center mb-1">
            <div class="text-h6 font-weight-bold">
              {{ section.name }}
            </div>
            <v-chip
              size="small"
              :color="section.allPurchased ? 'success' : 'primary'"
              class="ml-2"
            >
              {{ section.items.length }} items
            </v-chip>
          </div>
          <div class="text-body-2">
            <span class="font-weight-medium">{{ section.purchasedCount }}/{{ section.items.length }}</span> 
            items purchased
          </div>
        </div>
        
        <v-progress-circular
          :model-value="(section.purchasedCount / section.items.length) * 100"
          :color="section.allPurchased ? 'success' : 'primary'"
          size="32"
          width="3"
          class="mr-3"
        />
      </div>
    </v-card-item>
    
    <v-divider />
    
    <!-- Item Grid -->    <v-card-text class="pa-3">
      <v-row>
        <v-col
          v-for="(item, itemIndex) in filteredItems(section)"
          :key="itemIndex"
          cols="12"
          sm="6"
          class="pa-2"
        >
          <v-card
            flat
            :class="[
              'pa-3 item-card',
              item.purchased ? 'bg-success-lighten-5 purchased-item' : 'unpurchased-item'
            ]"
            @click.stop="toggleItemPurchased(item)"
          >
            <div class="d-flex align-center">
              <v-checkbox
                v-model="item.purchased"
                :color="item.purchased ? 'success' : 'primary'"
                density="comfortable"
                hide-details
                class="mr-4"
                @click.stop
              />
              
              <div class="flex-grow-1">
                <div class="d-flex align-center flex-wrap">
                  <span
                    :class="{ 'text-decoration-line-through text-medium-emphasis': item.purchased }"
                    class="text-subtitle-1 font-weight-medium mr-2"
                  >
                    {{ item.name }}
                  </span>
                  
                  <v-chip
                    v-if="item.recipe"
                    size="x-small"
                    variant="outlined"
                    color="primary"
                    class="mr-2"
                  >
                    {{ item.recipe }}
                  </v-chip>
                  
                  <span class="text-body-2">
                    <span class="font-weight-medium">{{ item.quantity }}</span>
                  </span>
                </div>
              </div>
              
              <v-btn
                icon="mdi-information-outline"
                variant="text"
                size="small"
                class="ms-2 details-btn"
                color="primary"
                @click.stop="selectItem(item)"
              />
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

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
  name: 'DesktopShoppingSection',
  
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
      filteredItems,
      toggleItemPurchased,
      selectItem
    };
  }
});
</script>

<style scoped>
/* Enhanced styling for desktop shopping section */
:deep(.shopping-section-card) {
  border-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px !important;
  overflow: hidden;
}

:deep(.section-header) {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

:deep(.v-progress-circular) {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.item-card {
  transition: all 0.15s ease-in-out;
  border-radius: 8px !important;
  height: 100%;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.12);
  cursor: pointer;
}

.item-card:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
  border-color: rgba(var(--v-theme-primary), 0.4);
}

.purchased-item {
  border-left: 4px solid rgb(var(--v-theme-success)) !important;
}

.unpurchased-item:hover {
  transform: translateY(-2px);
}

.details-btn {
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

.item-card:hover .details-btn {
  opacity: 1;
}
</style>
