<template>
  <div>
    <!-- Mobile-optimized header -->
    <div class="d-flex flex-column flex-sm-row justify-space-between align-center mb-3">
      <h1 class="text-h4 font-weight-bold mb-2 mb-sm-0">
        Shopping List
      </h1>
      <div class="d-flex">
        <v-menu>
          <template #activator="{ props }">
            <v-btn 
              color="primary" 
              variant="outlined" 
              density="comfortable"
              v-bind="props"
              class="mr-2"
            >
              <v-icon start>
                mdi-dots-vertical
              </v-icon>
              Options
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="showAllItems = !showAllItems">
              <v-list-item-title>
                <v-icon start>
                  {{ showAllItems ? 'mdi-eye-off' : 'mdi-eye' }}
                </v-icon>
                {{ showAllItems ? 'Hide Purchased' : 'Show All Items' }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="markAllPurchased">
              <v-list-item-title>
                <v-icon start>
                  mdi-check-all
                </v-icon>
                Mark All as Purchased
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="clearPurchased">
              <v-list-item-title>
                <v-icon start>
                  mdi-delete
                </v-icon>
                Clear Purchased Items
              </v-list-item-title>
            </v-list-item>
            <v-divider />
            <v-list-item @click="printList">
              <v-list-item-title>
                <v-icon start>
                  mdi-printer
                </v-icon>
                Print List
              </v-list-item-title>
            </v-list-item>            <v-list-item @click="emailList">
              <v-list-item-title>
                <v-icon start>
                  mdi-email-outline
                </v-icon>
                Email List
              </v-list-item-title>
            </v-list-item>
            <v-divider />            <v-list-item @click="sendToInstacart">
              <v-list-item-title>
                <v-icon start>
                  mdi-cart-outline
                </v-icon>
                Send to Instacart
                <v-chip
                  size="x-small"
                  color="accent"
                  class="ml-2"
                >
                  Premium
                </v-chip>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        
        <v-btn
          color="accent"
          density="comfortable"
          @click="dialog = true"
        >
          <v-icon start>
            mdi-plus
          </v-icon>
          Add Item
        </v-btn>
      </div>
    </div>
    
    <div class="d-flex flex-column flex-lg-row gap-3">
      <!-- Left column for mobile, left side for desktop -->
      <div
        class="flex-grow-1 flex-lg-grow-0"
        style="width: 100%; max-width: 100%; flex-basis: 100%; box-sizing: border-box;"
        :class="{'flex-lg-basis-67': !selectedItem}"
      >
        <!-- Search box and progress bar -->
        <v-text-field
          v-model="search"
          label="Search items"
          density="compact"
          variant="outlined"
          hide-details
          class="mb-3"
          prepend-inner-icon="mdi-magnify"
          clearable
        />
        
        <!-- Shopping progress bar -->
        <div class="mb-3">
          <div class="d-flex justify-space-between align-center mb-1">
            <div class="text-body-2">
              <span class="font-weight-medium">{{ purchasedItems }}/{{ totalItems }}</span> 
              items purchased
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Est. Cost: <span class="font-weight-medium">$65.20</span>
            </div>
          </div>
          <v-progress-linear
            :model-value="(purchasedItems / Math.max(totalItems, 1)) * 100"
            color="success"
            height="8"
            rounded
          />
        </div>
        <!-- Grid layout with responsive components -->
        <v-row class="mt-0">
          <v-col 
            v-for="(section, index) in filteredSections" 
            :key="index"
            cols="12"
            sm="6"
            lg="6"
            class="py-1"
          >
            <!-- Use mobile component on small screens -->
            <mobile-shopping-section
              v-if="!isDesktop"
              :section="section"
              :show-all-items="showAllItems"
              :search-term="search"
              @toggle-purchased="(item) => toggleItemPurchased(section, item)"
              @select-item="(item) => selectItem(section, item)"
            />
            
            <!-- Use desktop component on larger screens -->
            <desktop-shopping-section
              v-else
              :section="section"
              :show-all-items="showAllItems"
              :search-term="search"
              @toggle-purchased="(item) => toggleItemPurchased(section, item)"
              @select-item="(item) => selectItem(section, item)"
            />
          </v-col>
        </v-row>
        
        <!-- Empty state for no items or when all filtered out -->
        <v-card
          v-if="filteredSections.length === 0"
          class="mt-4 pa-5 text-center"
          variant="outlined"
          elevation="0"
        >
          <v-icon
            icon="mdi-cart-outline"
            size="x-large"
            color="primary"
            class="mb-3"
          />
          <h3 class="text-h5 mb-2">
            No items to display
          </h3>
          <p class="text-body-1 text-medium-emphasis mb-4">
            {{ showAllItems ? "Your shopping list is empty" : "All items have been purchased" }}
          </p>      <v-btn
            v-if="!showAllItems"
            color="primary"
            density="comfortable"
            class="px-4"
            @click="showAllItems = true"
          >
            <v-icon
              start
            >
              mdi-eye
            </v-icon>
            Show All Items
          </v-btn>
          <v-btn
            v-else
            color="primary"
            density="comfortable"
            class="px-4"
            @click="dialog = true"
          >
            <v-icon
              start
            >
              mdi-plus
            </v-icon>
            Add an Item
          </v-btn>
        </v-card>
      </div>
      
      <!-- Right side detail panel (desktop only) -->
      <div 
        v-if="selectedItem" 
        class="d-none d-lg-block" 
        style="width: 33%; flex-basis: 33%; flex-grow: 0;"
      >
        <v-card
          variant="outlined"
          class="sticky-top"
          style="top: 16px;"
        >
          <v-card-item>
            <v-card-title>
              {{ selectedItem.name }}
              <v-chip
                size="small"
                :color="selectedItem.purchased ? 'success' : 'primary'"
                class="ml-2"
              >
                {{ selectedItem.purchased ? 'Purchased' : 'To Buy' }}
              </v-chip>
            </v-card-title>
            <v-card-subtitle class="mt-1">
              {{ selectedItem.quantity }}
            </v-card-subtitle>
          </v-card-item>
          
          <v-card-text>
            <div
              v-if="selectedItem.recipe"
              class="mb-4"
            >
              <div class="text-subtitle-1 font-weight-bold mb-2">
                Recipe
              </div>
              <v-chip
                color="primary"
                variant="outlined"
                size="large"
                prepend-icon="mdi-book-open-variant"
                class="mb-2"
              >
                {{ selectedItem.recipe }}
              </v-chip>
            </div>
            
            <div class="text-subtitle-1 font-weight-bold mb-2">
              Section
            </div>
            <v-chip
              :color="selectedSection.color"
              size="large"
              prepend-icon="mdi-tag"
              class="mb-4"
            >
              {{ selectedSection.name }}
            </v-chip>
            
            <!-- Extra information -->
            <div class="text-subtitle-1 font-weight-bold mb-2">
              Nutrition Info
            </div>
            <v-list
              density="compact"
              class="bg-grey-lighten-5 rounded mb-3"
            >
              <v-list-item>
                <v-list-item-title>Calories</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  120 kcal
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Protein</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  5g
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Carbs</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  20g
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            
            <div class="d-flex justify-space-between">
              <v-btn
                prepend-icon="mdi-checkbox-marked-circle-outline"
                :color="selectedItem.purchased ? 'error' : 'success'"
                variant="outlined"
                @click="toggleItemPurchased(selectedSection, selectedItem)"
              >
                {{ selectedItem.purchased ? 'Mark Unpurchased' : 'Mark Purchased' }}
              </v-btn>
              
              <v-btn
                icon="mdi-close"
                variant="text"
                @click="selectedItem = null; selectedSection = null"
              />
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>
    
    <!-- Floating action button for quick actions on mobile -->
    <v-btn
      class="position-fixed bottom-6 right-6 z-5 d-md-none"
      color="primary"
      icon="mdi-check-all"
      size="large"
      elevation="4"
      @click="markAllPurchased"
    />
    
    <!-- Add Item Dialog -->
    <v-dialog
      v-model="dialog"
      max-width="500"
    >
      <v-card>
        <v-card-title class="text-h5 pb-2">
          Add Item to Shopping List
        </v-card-title>
        
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="newItem.name"
              label="Item Name"
              variant="outlined"
              density="comfortable"
              required
              class="mb-2"
              placeholder="Enter item name"
              :rules="[v => !!v || 'Item name is required']"
            />
            
            <v-text-field
              v-model="newItem.quantity"
              label="Quantity"
              variant="outlined"
              density="comfortable"
              class="mb-2"
              placeholder="e.g., 2 lbs, 1 package"
            />
            
            <v-select
              v-model="newItem.section"
              :items="sectionOptions"
              label="Section"
              variant="outlined"
              density="comfortable"
              class="mb-2"
              required
              :rules="[v => !!v || 'Section is required']"
            />
            
            <v-text-field
              v-model="newItem.recipe"
              label="Recipe (optional)"
              variant="outlined"
              density="comfortable"
              placeholder="What recipe is this for?"
            />
          </v-form>
        </v-card-text>
        
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn
            variant="text"
            class="mr-2"
            @click="dialog = false"
          >
            Cancel
          </v-btn>          <v-btn
            color="primary"
            class="px-4"
            @click="addItem"
          >
            Add Item
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import MobileShoppingSection from '../components/shopping/MobileShoppingSection.vue';
import DesktopShoppingSection from '../components/shopping/DesktopShoppingSection.vue';

export default defineComponent({
  name: 'ShoppingView',
  
  components: {
    MobileShoppingSection,
    DesktopShoppingSection
  },
  
  setup() {
    const authStore = useAuthStore();
    const search = ref('');
    const dialog = ref(false);
    const expandedPanels = ref([0]); // First panel expanded by default
    const showAllItems = ref(true);
    const expandedSections = ref([0]); // First section expanded by default
    const selectedItem = ref(null);
    const selectedSection = ref(null);
    
    // Responsive layout handling
    const isDesktop = ref(window.innerWidth >= 960); // lg breakpoint in Vuetify
    
    // Update the desktop state on window resize
    const handleResize = () => {
      isDesktop.value = window.innerWidth >= 960;
    };
    
    // Set up and clean up window resize listener
    onMounted(() => {
      window.addEventListener('resize', handleResize);
    });
    
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });
    
    // Form reference for validation
    const form = ref(null);
    
    // New item form data
    const newItem = ref({
      name: '',
      quantity: '',
      section: '',
      recipe: '',
      purchased: false
    });
    
    const shoppingListSections = ref([
      {
        name: 'Produce',
        icon: 'mdi-fruit-watermelon',
        color: 'success',
        items: [
          { name: 'Spinach', quantity: '1 bag', recipe: 'Breakfast Smoothie', purchased: true },
          { name: 'Avocados', quantity: '3', recipe: 'Avocado Toast', purchased: false },
          { name: 'Bananas', quantity: '1 bunch', recipe: 'Breakfast Smoothie', purchased: false },
          { name: 'Bell Peppers', quantity: '2', recipe: 'Stir Fry', purchased: false },
          { name: 'Carrots', quantity: '1 lb', recipe: 'Roasted Vegetables', purchased: false },
          { name: 'Broccoli', quantity: '1 head', recipe: 'Stir Fry', purchased: false }
        ]
      },
      {
        name: 'Meat & Seafood',
        icon: 'mdi-food-steak',
        color: 'error',
        items: [
          { name: 'Chicken Breast', quantity: '2 lb', recipe: 'Sheet Pan Chicken', purchased: true },
          { name: 'Ground Turkey', quantity: '1 lb', recipe: 'Turkey Meatballs', purchased: false },
          { name: 'Salmon Fillets', quantity: '1 lb', recipe: 'Grilled Salmon', purchased: false }
        ]
      },
      {
        name: 'Dairy & Eggs',
        icon: 'mdi-egg',
        color: 'warning',
        items: [
          { name: 'Greek Yogurt', quantity: '32 oz', recipe: 'Breakfast Bowl', purchased: true },
          { name: 'Eggs', quantity: '1 dozen', recipe: 'Avocado Toast', purchased: false },
          { name: 'Feta Cheese', quantity: '4 oz', recipe: 'Mediterranean Bowl', purchased: false },
          { name: 'Milk', quantity: '1/2 gallon', recipe: 'Various', purchased: false }
        ]
      },
      {
        name: 'Grains & Pasta',
        icon: 'mdi-grain',
        color: 'amber',
        items: [
          { name: 'Quinoa', quantity: '2 cups', recipe: 'Quinoa Salad', purchased: true },
          { name: 'Oatmeal', quantity: '18 oz container', recipe: 'Breakfast Oatmeal', purchased: false },
          { name: 'Pasta', quantity: '1 box', recipe: 'Turkey Meatballs', purchased: false },
          { name: 'Bread', quantity: '1 loaf', recipe: 'Various', purchased: false }
        ]
      },
      {
        name: 'Pantry',
        icon: 'mdi-cupboard',
        color: 'brown',
        items: [
          { name: 'Olive Oil', quantity: '1 bottle', recipe: 'Various', purchased: false },
          { name: 'Canned Tomatoes', quantity: '2 cans', recipe: 'Turkey Meatballs', purchased: false },
          { name: 'Lentils', quantity: '1 bag', recipe: 'Lentil Soup', purchased: false },
          { name: 'Hummus', quantity: '8 oz', recipe: 'Mediterranean Bowl', purchased: false }
        ]
      }
    ]);
    
    // Calculate purchased count and whether all items are purchased for each section
    const processedSections = computed(() => {
      return shoppingListSections.value.map(section => {
        const purchasedCount = section.items.filter(item => item.purchased).length;
        return {
          ...section,
          purchasedCount,
          allPurchased: purchasedCount === section.items.length
        };
      });
    });
    
    // Section options for the add item form
    const sectionOptions = computed(() => {
      return shoppingListSections.value.map(section => ({
        title: section.name,
        value: section.name
      }));
    });
    
    // Filter sections based on search and show/hide purchased
    const filteredSections = computed(() => {
      return processedSections.value
        .filter(section => {
          if (!showAllItems.value && section.allPurchased) {
            return false;
          }
          
          // If there's a search, check if any items match
          if (search.value) {
            const matchingItems = section.items.filter(item => 
              item.name.toLowerCase().includes(search.value.toLowerCase()) ||
              (item.recipe && item.recipe.toLowerCase().includes(search.value.toLowerCase()))
            );
            return matchingItems.length > 0;
          }
          
          return true;
        })
        .map(section => ({
          ...section,
        }));
    });
    
    // Filter items within a section based on search and show/hide purchased
    const filteredItems = (section) => {
      return section.items.filter(item => {
        // Filter by purchase status if hideCompleted
        if (!showAllItems.value && item.purchased) {
          return false;
        }
        
        // Filter by search term
        if (search.value) {
          return item.name.toLowerCase().includes(search.value.toLowerCase()) ||
            (item.recipe && item.recipe.toLowerCase().includes(search.value.toLowerCase()));
        }
        
        return true;
      });
    };
    
    const totalItems = computed(() => {
      return shoppingListSections.value.reduce((total, section) => {
        return total + section.items.length;
      }, 0);
    });
    
    const purchasedItems = computed(() => {
      return shoppingListSections.value.reduce((total, section) => {
        return total + section.items.filter(item => item.purchased).length;
      }, 0);
    });
    
    // Toggle item purchased status
    const toggleItemPurchased = (section, item) => {
      item.purchased = !item.purchased;
    };
    
    // Mark all items as purchased
    const markAllPurchased = () => {
      shoppingListSections.value.forEach(section => {
        section.items.forEach(item => {
          item.purchased = true;
        });
      });
    };
    
    // Clear purchased items
    const clearPurchased = () => {
      shoppingListSections.value.forEach(section => {
        section.items = section.items.filter(item => !item.purchased);
      });
    };
    
    // Add a new item
    const addItem = () => {
      // Skip validation for now as the form.value.validate() is causing issues
      // We'll just check if the required fields are filled
      if (!newItem.value.name || !newItem.value.section) {
        return;
      }
      
      const targetSection = shoppingListSections.value.find(
        section => section.name === newItem.value.section
      );
      if (targetSection) {
        targetSection.items.push({
          name: newItem.value.name,
          quantity: newItem.value.quantity || '1',
          recipe: newItem.value.recipe || '',
          purchased: false
        });
        
        // Reset form
        newItem.value = {
          name: '',
          quantity: '',
          section: '',
          recipe: '',
          purchased: false
        };
        
        dialog.value = false;
      }
    };
    
    // Print shopping list
    const printList = () => {
      window.print();
    };
    
    // Email shopping list (placeholder)
    const emailList = () => {
      alert('This would email your shopping list in a real application.');
    };
    
    // Send shopping list to Instacart (Premium feature)
    const sendToInstacart = () => {
      const userPlan = authStore.userPlan;
      
      if (userPlan === 'premium' || userPlan === 'family') {
        alert('Your shopping list has been sent to Instacart! You can now review and complete your order on the Instacart platform.');
      } else {
        alert('Instacart integration is available for Premium and Family plan subscribers only. Please upgrade your plan to access this feature.');
      }
    };
    
    // Select an item to show details (desktop)
    const selectItem = (section, item) => {
      selectedItem.value = item;
      selectedSection.value = section;
    };
    
    return {
      authStore,
      search,
      dialog,
      form,
      newItem,
      shoppingListSections,
      processedSections,
      filteredSections,
      sectionOptions,
      filteredItems,
      totalItems,
      purchasedItems,
      expandedPanels,
      expandedSections,
      selectedItem,
      selectedSection,
      showAllItems,
      toggleItemPurchased,
      toggleExpandSection: () => {}, // No longer needed as it's handled by component
      selectItem,
      markAllPurchased,
      clearPurchased,
      addItem,
      printList,
      emailList,
      sendToInstacart,
      isDesktop
    };
  }
});
</script>

<style>
@media print {
  .v-btn, .v-text-field, .position-fixed {
    display: none !important;
  }
  
  .v-expansion-panel {
    box-shadow: none !important;
  }
  
  .v-expansion-panel-title {
    min-height: auto !important;
  }
  
  .v-expansion-panel-text {
    display: block !important;
  }
}

/* Custom styling for shopping list */
.shopping-panels .v-expansion-panel {
  margin-bottom: 8px;
}

.shopping-panels .v-expansion-panel-title {
  padding: 10px 16px;
}

.shopping-list .v-list-item {
  min-height: 40px !important;
  padding-top: 2px;
  padding-bottom: 2px;
}

.purchased-item {
  background-color: rgba(var(--v-theme-success), 0.05) !important;
  border-left: 3px solid rgb(var(--v-theme-success)) !important;
}

.shopping-list .v-list-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.05);
}

/* Custom cursor styles */
.cursor-pointer {
  cursor: pointer;
}
</style>
