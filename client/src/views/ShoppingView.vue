<template>
  <div>
    <!-- Mobile-optimized header -->
    <div class="d-flex flex-column flex-sm-row justify-space-between align-center mb-4">
      <h1 class="text-h4 font-weight-bold mb-3 mb-sm-0">Shopping List</h1>
      <div class="d-flex">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn 
              color="primary" 
              variant="outlined" 
              v-bind="props"
              class="mr-2"
            >
              <v-icon start>mdi-dots-vertical</v-icon>
              Options
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="showAllItems = !showAllItems">
              <v-list-item-title>
                <v-icon start>{{ showAllItems ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                {{ showAllItems ? 'Hide Purchased' : 'Show All Items' }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="markAllPurchased">
              <v-list-item-title>
                <v-icon start>mdi-check-all</v-icon>
                Mark All as Purchased
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="clearPurchased">
              <v-list-item-title>
                <v-icon start>mdi-delete</v-icon>
                Clear Purchased Items
              </v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="printList">
              <v-list-item-title>
                <v-icon start>mdi-printer</v-icon>
                Print List
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="emailList">
              <v-list-item-title>
                <v-icon start>mdi-email-outline</v-icon>
                Email List
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        
        <v-btn color="accent" @click="dialog = true">
          <v-icon start>mdi-plus</v-icon>
          Add Item
        </v-btn>
      </div>
    </div>
    
    <!-- Search box - more prominent on mobile -->
    <v-text-field
      v-model="search"
      label="Search items"
      density="comfortable"
      variant="outlined"
      hide-details
      class="mb-4"
      prepend-inner-icon="mdi-magnify"
      clearable
    ></v-text-field>
    
    <!-- Shopping progress bar -->
    <div class="mb-4">
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
      ></v-progress-linear>
    </div>
    
    <!-- Shopping list content - optimized for mobile -->
    <v-expansion-panels v-model="expandedPanels" multiple variant="accordion">
      <v-expansion-panel
        v-for="(section, index) in filteredSections"
        :key="index"
        :value="index"
        :class="{'opacity-70': section.allPurchased && !showAllItems}"
      >
        <v-expansion-panel-title>
          <div class="d-flex align-center w-100">
            <v-icon :icon="section.icon" :color="section.color" class="mr-3"></v-icon>
            <div class="flex-grow-1">
              <div class="d-flex align-center">
                <strong>{{ section.name }}</strong>
                <v-chip
                  size="x-small"
                  :color="section.allPurchased ? 'success' : 'primary'"
                  class="ml-2"
                >
                  {{ section.items.length }}
                </v-chip>
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ section.purchasedCount }}/{{ section.items.length }} purchased
              </div>
            </div>
            <v-progress-circular
              :model-value="(section.purchasedCount / section.items.length) * 100"
              :color="section.allPurchased ? 'success' : 'primary'"
              size="24"
              width="2"
              class="mr-2 d-none d-sm-flex"
            ></v-progress-circular>
          </div>
        </v-expansion-panel-title>
        
        <v-expansion-panel-text>
          <v-list class="pa-0">
            <v-list-item
              v-for="(item, itemIndex) in filteredItems(section)"
              :key="itemIndex"
              :class="{'bg-grey-lighten-4': item.purchased}"
              rounded
              class="mb-1 transition"
              @click="toggleItemPurchased(section, item)"
            >
              <template v-slot:prepend>
                <v-checkbox
                  v-model="item.purchased"
                  color="success"
                  hide-details
                  @click.stop
                ></v-checkbox>
              </template>
              
              <v-list-item-title :class="{ 'text-decoration-line-through': item.purchased }">
                {{ item.name }}
              </v-list-item-title>
              
              <v-list-item-subtitle class="d-flex align-center">
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
            </v-list-item>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    
    <!-- Empty state for no items or when all filtered out -->
    <v-card
      v-if="filteredSections.length === 0"
      class="mt-4 pa-4 text-center"
      variant="outlined"
    >
      <v-icon icon="mdi-cart" size="large" color="primary" class="mb-2"></v-icon>
      <h3 class="text-h6 mb-2">No items to display</h3>
      <p class="text-body-2 text-medium-emphasis mb-4">
        {{ showAllItems ? "Your shopping list is empty" : "All items have been purchased" }}
      </p>
      <v-btn v-if="!showAllItems" color="primary" @click="showAllItems = true">
        Show All Items
      </v-btn>
      <v-btn v-else color="primary" @click="dialog = true">
        Add an Item
      </v-btn>
    </v-card>
    
    <!-- Floating action button for quick actions on mobile -->
    <v-btn
      class="position-fixed bottom-6 right-6 z-5 d-md-none"
      color="primary"
      icon="mdi-check-all"
      size="large"
      elevation="4"
      @click="markAllPurchased"
    ></v-btn>
    
    <!-- Add Item Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">
          Add Item to Shopping List
        </v-card-title>
        
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="newItem.name"
              label="Item Name"
              variant="outlined"
              required
              :rules="[v => !!v || 'Item name is required']"
            ></v-text-field>
            
            <v-text-field
              v-model="newItem.quantity"
              label="Quantity"
              variant="outlined"
              placeholder="e.g., 2 lbs, 1 package"
            ></v-text-field>
            
            <v-select
              v-model="newItem.section"
              :items="sectionOptions"
              label="Section"
              variant="outlined"
              required
              :rules="[v => !!v || 'Section is required']"
            ></v-select>
            
            <v-text-field
              v-model="newItem.recipe"
              label="Recipe (optional)"
              variant="outlined"
              placeholder="What recipe is this for?"
            ></v-text-field>
          </v-form>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="addItem">Add Item</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';

export default defineComponent({
  name: 'ShoppingView',
  setup() {
    const authStore = useAuthStore();
    const search = ref('');
    const dialog = ref(false);
    const expandedPanels = ref([0]); // First panel expanded by default
    const showAllItems = ref(true);
    
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
      if (!form.value.validate().valid) {
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
      showAllItems,
      toggleItemPurchased,
      markAllPurchased,
      clearPurchased,
      addItem,
      printList,
      emailList
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
</style>
