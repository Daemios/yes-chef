/**
 * Recipe Repository
 * Handles operations for recipes using Prisma
 */

// Import shared models
import { ServerRecipe as Recipe, Tag, RecipeTag } from '../types/shared-models';
import { prisma } from '../services/prisma.service';

/**
 * Recipe Repository class
 */
export class RecipeRepositoryClass {
  /**
   * Find all recipes with optional filtering
   */
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Record<string, unknown>;
    orderBy?: Record<string, unknown>;
  } = {}): Promise<Recipe[]> {
    // Use Prisma to query the database
    const recipes = await prisma.recipe.findMany({
      skip: params.skip,
      take: params.take,
      where: params.where as any,
      orderBy: params.orderBy as any,
      include: {
        user: true,
        tags: {
          include: {
            tag: true
          }
        },
        ingredients: true
      }    });
    // Map Prisma types to our ServerRecipe model
    return recipes.map((recipe: any) => {
      let ingredients: string[] = [];
      
      // Handle ingredients text, which can be in various formats
      if (recipe.ingredientsText) {
        // First check if the string starts with [ which would indicate JSON
        if (typeof recipe.ingredientsText === 'string' && 
            recipe.ingredientsText.trim().startsWith('[')) {
          try {
            ingredients = JSON.parse(recipe.ingredientsText);
            // Ensure it's an array
            if (!Array.isArray(ingredients)) {
              console.warn(`Recipe ${recipe.id}: ingredientsText is not an array, converting...`);
              ingredients = [String(ingredients)];
            }
          } catch (error) {
            console.warn(`Recipe ${recipe.id}: Failed to parse ingredientsText as JSON, treating as newline-separated list`);
            // Not valid JSON, continue to next parsing method
          }
        }
        
        // If ingredients is still empty, try treating as newline-separated list
        if (ingredients.length === 0 && typeof recipe.ingredientsText === 'string') {
          // First try splitting by newlines
          if (recipe.ingredientsText.includes('\n')) {
            ingredients = recipe.ingredientsText.split('\n').map((item: string) => item.trim()).filter(Boolean);
          } 
          // If that doesn't work or produces only one item, try commas
          else if (recipe.ingredientsText.includes(',')) {
            ingredients = recipe.ingredientsText.split(',').map((item: string) => item.trim()).filter(Boolean);
          } 
          // If all else fails, treat as a single ingredient
          else {
            ingredients = [recipe.ingredientsText.trim()];
          }
        }
      }
      
      return {
        ...recipe,
        ingredients,
        // Transform tags to match expected format
        tags: recipe.tags.map((t: any) => ({
          recipeId: t.recipeId,
          tagId: t.tagId,
          tag: t.tag
        }))
      };
    }) as Recipe[];
  }

  /**
   * Find a recipe by ID
   */
  async findById(id: number): Promise<Recipe | null> {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        user: true,
        tags: {
          include: {
            tag: true
          }
        },
        ingredients: true
      }
    });
      if (!recipe) {
      return null;
    }
    
    let ingredients: string[] = [];
    
    // Safely parse ingredients from JSON string
    if (recipe.ingredientsText) {
      try {
        ingredients = JSON.parse(recipe.ingredientsText);
        // Ensure it's an array
        if (!Array.isArray(ingredients)) {
          console.warn(`Recipe ${recipe.id}: ingredientsText is not an array, converting...`);
          ingredients = [String(ingredients)];
        }
      } catch (error) {
        console.error(`Recipe ${recipe.id}: Failed to parse ingredientsText:`, recipe.ingredientsText);
        console.error('Parse error:', error);
        // Fallback: treat as comma-separated string or single ingredient
        if (typeof recipe.ingredientsText === 'string') {
          ingredients = recipe.ingredientsText.split(',').map((item: string) => item.trim());
        } else {
          ingredients = [];
        }
      }
    }
    
    // Transform to match expected model
    return {
      ...recipe,
      ingredients,
      tags: recipe.tags.map((t: any) => ({
        recipeId: t.recipeId,
        tagId: t.tagId,
        tag: t.tag
      }))
    } as Recipe;
  }

  /**
   * Create a new recipe
   */
  async create(data: Partial<Recipe>): Promise<Recipe> {
    // Convert ingredients array to JSON string
    const ingredientsText = JSON.stringify(data.ingredients || []);
    
    // Create recipe record
    const recipe = await prisma.recipe.create({
      data: {
        title: data.title || 'Untitled Recipe',
        description: data.description || '',
        ingredientsText: ingredientsText,
        instructions: data.instructions || '',
        prepTime: data.prepTime,
        cookTime: data.cookTime,
        servings: data.servings,
        imageUrl: data.imageUrl,
        user: data.userId ? { connect: { id: data.userId } } : undefined,
        tags: data.tags ? {
          create: (data.tags as RecipeTag[]).map(tag => ({
            tag: { connect: { id: tag.tagId } }
          }))
        } : undefined
      },
      include: {
        user: true,
        tags: {
          include: {
            tag: true
          }
        },
        ingredients: true
      }
    });
    
    // Transform to match expected model
    return {
      ...recipe,
      ingredients: recipe.ingredientsText ? JSON.parse(recipe.ingredientsText) : [],
      tags: recipe.tags.map((t: any) => ({
        recipeId: t.recipeId,
        tagId: t.tagId,
        tag: t.tag
      }))
    } as Recipe;
  }

  /**
   * Update a recipe
   */
  async update(id: number, data: Partial<Recipe>): Promise<Recipe> {
    // Get the current recipe
    const existingRecipe = await this.findById(id);
    if (!existingRecipe) {
      throw new Error('Recipe not found');
    }
    
    // Convert ingredients array to JSON string if present
    const ingredientsText = data.ingredients !== undefined 
      ? JSON.stringify(data.ingredients)
      : undefined;
    
    // Update recipe record
    const recipe = await prisma.recipe.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        ingredientsText: ingredientsText,
        instructions: data.instructions,
        prepTime: data.prepTime,
        cookTime: data.cookTime,
        servings: data.servings,
        imageUrl: data.imageUrl,
        // Update user if userId is changed
        user: data.userId !== undefined ? {
          connect: { id: data.userId }
        } : undefined,
        // Handle tag updates if present
        tags: data.tags ? {
          // Delete existing and recreate
          deleteMany: {},
          create: (data.tags as RecipeTag[]).map(tag => ({
            tag: { connect: { id: tag.tagId } }
          }))
        } : undefined
      },
      include: {
        user: true,
        tags: {
          include: {
            tag: true
          }
        },
        ingredients: true
      }
    });
    
    // Transform to match expected model
    return {
      ...recipe,
      ingredients: recipe.ingredientsText ? JSON.parse(recipe.ingredientsText) : [],
      tags: recipe.tags.map((t: any) => ({
        recipeId: t.recipeId,
        tagId: t.tagId,
        tag: t.tag
      }))
    } as Recipe;
  }

  /**
   * Delete a recipe
   */
  async delete(id: number): Promise<Recipe> {
    // Get the recipe before deletion
    const recipe = await this.findById(id);
    if (!recipe) {
      throw new Error('Recipe not found');
    }
    
    // Delete recipe and related records
    await prisma.recipe.delete({
      where: { id }
    });
    
    return recipe;
  }
}

export const RecipeRepository = new RecipeRepositoryClass();
