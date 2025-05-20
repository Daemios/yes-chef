/**
 * Recipe Repository
 * Handles operations for recipes using in-memory storage
 */

// Define Recipe type locally instead of importing from Prisma
export interface Recipe {
  id: number;
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: number;
  user?: User;
  tags: Tag[];
}

// Define User type locally
export interface User {
  id: number;
  email: string;
  name?: string;
}

// Define Tag type locally
export interface Tag {
  id: number;
  name: string;
}

// In-memory data store
const recipeStore: Recipe[] = [
  {
    id: 1,
    title: 'Pasta Carbonara',
    description: 'A classic Italian pasta dish',
    ingredients: ['200g spaghetti', '100g pancetta', '2 eggs', '50g pecorino cheese', 'Black pepper'],
    instructions: 'Cook pasta. Fry pancetta. Mix eggs and cheese. Combine everything.',
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    imageUrl: 'https://example.com/carbonara.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 1,
    user: { id: 1, email: 'user@example.com', name: 'Test User' },
    tags: [{ id: 1, name: 'Italian' }, { id: 2, name: 'Quick' }]
  },
  {
    id: 2,
    title: 'Chicken Curry',
    description: 'Spicy chicken curry',
    ingredients: ['500g chicken', 'Curry powder', 'Onion', 'Garlic', 'Coconut milk'],
    instructions: 'Fry onion and garlic. Add chicken. Add spices. Add coconut milk. Simmer.',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    imageUrl: 'https://example.com/curry.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 1,
    user: { id: 1, email: 'user@example.com', name: 'Test User' },
    tags: [{ id: 3, name: 'Indian' }, { id: 4, name: 'Spicy' }]
  }
];

export class RecipeRepository {  /**
   * Find all recipes with optional filtering
   */
  async findAll(_params: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }): Promise<Recipe[]> {
    // Simple implementation without actual filtering for now
    return Promise.resolve(recipeStore);
  }

  /**
   * Find a recipe by ID
   */
  async findById(id: number): Promise<Recipe | null> {
    const recipe = recipeStore.find(r => r.id === id);
    return Promise.resolve(recipe || null);
  }

  /**
   * Create a new recipe
   */
  async create(data: Partial<Recipe>): Promise<Recipe> {
    const newId = Math.max(...recipeStore.map(r => r.id)) + 1;
    const newRecipe: Recipe = {
      id: newId,
      title: data.title || 'Untitled Recipe',
      description: data.description,
      ingredients: data.ingredients || [],
      instructions: data.instructions || '',
      prepTime: data.prepTime,
      cookTime: data.cookTime,
      servings: data.servings,
      imageUrl: data.imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: data.userId,
      user: data.user,
      tags: data.tags || []
    };
    
    recipeStore.push(newRecipe);
    return Promise.resolve(newRecipe);
  }

  /**
   * Update a recipe
   */
  async update(id: number, data: Partial<Recipe>): Promise<Recipe> {
    const index = recipeStore.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw new Error('Recipe not found');
    }
    
    const updatedRecipe = {
      ...recipeStore[index],
      ...data,
      updatedAt: new Date()
    };
    
    recipeStore[index] = updatedRecipe;
    return Promise.resolve(updatedRecipe);
  }

  /**
   * Delete a recipe
   */
  async delete(id: number): Promise<Recipe> {
    const index = recipeStore.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw new Error('Recipe not found');
    }
    
    const deletedRecipe = recipeStore[index];
    recipeStore.splice(index, 1);
    
    return Promise.resolve(deletedRecipe);
  }
}
