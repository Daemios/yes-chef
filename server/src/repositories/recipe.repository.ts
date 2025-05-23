/**
 * Recipe Repository
 * Handles operations for recipes using in-memory storage
 */

// Import shared models
import { ServerRecipe as Recipe, Tag, RecipeTag } from '../types/shared-models';

/**
 * Recipe Repository class
 */
export class RecipeRepositoryClass {
  // In-memory data store
  private recipeStore: Recipe[] = [
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
      tags: [
        { recipeId: 1, tagId: 1, tag: { id: 1, name: 'Italian' } },
        { recipeId: 1, tagId: 2, tag: { id: 2, name: 'Quick' } }
      ]
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
      tags: [
        { recipeId: 2, tagId: 3, tag: { id: 3, name: 'Indian' } },
        { recipeId: 2, tagId: 4, tag: { id: 4, name: 'Spicy' } }
      ]
    }
  ];

  // Helper function to process tags for consistency
  private processTagsForRecipe(
    recipeId: number, 
    tags?: Array<RecipeTag | Tag | Record<string, unknown>>
  ): RecipeTag[] {
    if (!tags || !Array.isArray(tags)) {
      return [];
    }
    
    return tags.map(tagItem => {
      // Case: It's already a RecipeTag with a tag property
      if (tagItem && typeof tagItem === 'object' && 'tag' in tagItem && tagItem.tag) {
        const tag = tagItem.tag as Tag;
        return {
          recipeId: recipeId,
          tagId: tag.id,
          tag: { id: tag.id, name: tag.name }
        };
      }
      
      // Case: It's a direct Tag object
      if (tagItem && typeof tagItem === 'object' && 'id' in tagItem && 'name' in tagItem) {
        const id = Number((tagItem as any).id);
        const name = String((tagItem as any).name);
        return {
          recipeId: recipeId,
          tagId: id,
          tag: { id, name }
        };
      }
      
      // Fallback
      return {
        recipeId: recipeId,
        tagId: 0,
        tag: { id: 0, name: 'Unknown' }
      };
    });
  }

  /**
   * Find all recipes with optional filtering
   */
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Record<string, unknown>;
    orderBy?: Record<string, unknown>;
  } = {}): Promise<Recipe[]> {
    // Apply basic filtering
    let results = [...this.recipeStore];
    
    // Apply pagination if provided
    if (params.skip !== undefined || params.take !== undefined) {
      const skip = params.skip || 0;
      const take = params.take || results.length;
      results = results.slice(skip, skip + take);
    }
    
    return Promise.resolve(results);
  }

  /**
   * Find a recipe by ID
   */
  async findById(id: number): Promise<Recipe | null> {
    const recipe = this.recipeStore.find((r: Recipe) => r.id === id);
    return Promise.resolve(recipe || null);
  }

  /**
   * Create a new recipe
   */
  async create(data: Partial<Recipe>): Promise<Recipe> {
    // Determine new ID
    const newId = Math.max(...this.recipeStore.map((r: Recipe) => r.id), 0) + 1;
    
    // Process tags
    const processedTags = this.processTagsForRecipe(newId, data.tags);
    
    // Create the new recipe
    const newRecipe: Recipe = {
      id: newId,
      title: data.title || 'Untitled Recipe',
      description: data.description || '',
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
      tags: processedTags
    };
    
    this.recipeStore.push(newRecipe);
    return Promise.resolve(newRecipe);
  }

  /**
   * Update a recipe
   */
  async update(id: number, data: Partial<Recipe>): Promise<Recipe> {
    const index = this.recipeStore.findIndex((r: Recipe) => r.id === id);
    
    if (index === -1) {
      throw new Error('Recipe not found');
    }
    
    // Start with a copy of the existing recipe
    const currentRecipe = this.recipeStore[index];
    
    // Create updated recipe object
    const updatedRecipe: Recipe = {
      ...currentRecipe,
      title: data.title !== undefined ? data.title : currentRecipe.title,
      description: data.description !== undefined ? data.description : currentRecipe.description,
      ingredients: data.ingredients !== undefined ? data.ingredients : currentRecipe.ingredients,
      instructions: data.instructions !== undefined ? data.instructions : currentRecipe.instructions,
      prepTime: data.prepTime !== undefined ? data.prepTime : currentRecipe.prepTime,
      cookTime: data.cookTime !== undefined ? data.cookTime : currentRecipe.cookTime,
      servings: data.servings !== undefined ? data.servings : currentRecipe.servings,
      imageUrl: data.imageUrl !== undefined ? data.imageUrl : currentRecipe.imageUrl,
      userId: data.userId !== undefined ? data.userId : currentRecipe.userId,
      user: data.user !== undefined ? data.user : currentRecipe.user,
      updatedAt: new Date()
    };
    
    // Process tags if provided, otherwise keep existing tags
    if (data.tags !== undefined) {
      updatedRecipe.tags = this.processTagsForRecipe(id, data.tags);
    }
    
    this.recipeStore[index] = updatedRecipe;
    return Promise.resolve(updatedRecipe);
  }

  /**
   * Delete a recipe
   */
  async delete(id: number): Promise<Recipe> {
    const index = this.recipeStore.findIndex((r: Recipe) => r.id === id);
    
    if (index === -1) {
      throw new Error('Recipe not found');
    }
    
    const deletedRecipe = this.recipeStore[index];
    this.recipeStore.splice(index, 1);
    
    return Promise.resolve(deletedRecipe);
  }
}

export const RecipeRepository = new RecipeRepositoryClass();
