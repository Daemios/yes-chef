import { ServerRecipe as Recipe, Tag, RecipeTag } from '../types/shared-models';
import { RecipeRepository } from '../repositories/recipe.repository';

export class RecipeServiceClass {
  constructor(private recipeRepository: typeof RecipeRepository) {}
  /**
   * Parse ingredient string into structured data
   */
  private parseIngredient(ingredientText: string) {
    const parts = ingredientText.trim().split(' ');
    let amount = '';
    let unit = '';
    let name = ingredientText;
    
    // Try to extract amount and unit from the beginning
    if (parts.length > 1) {
      const firstPart = parts[0];
      // Check if first part is a number or fraction
      if (/^[\d.,\/\s]+$/.test(firstPart)) {
        amount = firstPart;
        if (parts.length > 2) {
          // Check if second part might be a unit
          const secondPart = parts[1];
          const commonUnits = ['cup', 'cups', 'tbsp', 'tsp', 'oz', 'lb', 'g', 'kg', 'ml', 'l', 'liter', 'liters'];
          if (commonUnits.some(u => secondPart.toLowerCase().includes(u))) {
            unit = secondPart;
            name = parts.slice(2).join(' ');
          } else {
            name = parts.slice(1).join(' ');
          }
        } else {
          name = parts.slice(1).join(' ');
        }
      }
    }
      return {
      name: name.trim(),
      amount: amount || undefined,
      unit: unit || undefined,
      substitute: undefined,
      isOptional: false
    };
  }

  /**
   * Transform Prisma recipe to shared Recipe model
   */
  private transformRecipe(prismaRecipe: any): Recipe {
    const ingredients: string[] = prismaRecipe.ingredients.map((ingredient: any) => {
      // Use ingredient.ingredient.name for the name, since this is the related Ingredient
      const name = ingredient.ingredient?.name || ingredient.name || '';
      let ingredientText = name;
      if (ingredient.amount) {
        ingredientText = `${ingredient.amount}${ingredient.unit ? ' ' + ingredient.unit : ''} ${name}`.trim();
      }
      return ingredientText.trim();
    });
    
    return {
      ...prismaRecipe,
      ingredients,
      tags: prismaRecipe.tags.map((t: any) => ({
        recipeId: t.recipeId,
        tagId: t.tagId,
        tag: t.tag
      }))
    };
  }

  /**
   * Validate recipe data
   */
  private validateRecipeData(data: Partial<Recipe>) {
    if (!data.title?.trim()) {
      throw new Error('Recipe title is required');
    }

    if (!data.description?.trim()) {
      throw new Error('Recipe description is required');
    }

    if (!data.instructions?.trim()) {
      throw new Error('Recipe instructions are required');
    }
  }

  /**
   * Create a new recipe with business logic
   */
  async createRecipe(data: Partial<Recipe>): Promise<Recipe> {
    // Business logic: validate data
    this.validateRecipeData(data);

    // Business logic: parse ingredients
    const parsedIngredients = data.ingredients?.map(ing => this.parseIngredient(ing)) || [];
      // Business logic: extract tag IDs
    const tagIds = (data.tags as RecipeTag[])?.map(tag => tag.tagId).filter((id): id is number => id !== undefined) || [];    // Data access: create recipe
    const prismaRecipe = await this.recipeRepository.create({
      title: data.title || 'Untitled Recipe',
      description: data.description || '',
      instructions: data.instructions || '',
      prepTime: data.prepTime ?? undefined,
      cookTime: data.cookTime ?? undefined,
      servings: data.servings ?? undefined,
      difficulty: data.difficulty ?? undefined,
      imageUrl: data.imageUrl ?? undefined,
      isPublished: data.isPublished,
      userId: data.userId ?? undefined,
      ingredients: parsedIngredients,
      tagIds
    });

    // Business logic: transform to shared model
    return this.transformRecipe(prismaRecipe);
  }

  /**
   * Get recipe by ID
   */
  async getRecipeById(id: number): Promise<Recipe | null> {
    const prismaRecipe = await this.recipeRepository.findById(id);
    return prismaRecipe ? this.transformRecipe(prismaRecipe) : null;
  }

  /**
   * Get all recipes with filtering
   */
  async getRecipes(params: {
    skip?: number;
    take?: number;
    where?: Record<string, unknown>;
    orderBy?: Record<string, unknown>;
  } = {}): Promise<Recipe[]> {
    const prismaRecipes = await this.recipeRepository.findMany(params);
    return prismaRecipes.map(recipe => this.transformRecipe(recipe));
  }

  /**
   * Update recipe with business logic
   */
  async updateRecipe(id: number, data: Partial<Recipe>): Promise<Recipe> {
    // Business logic: check if recipe exists
    const existingRecipe = await this.recipeRepository.findById(id);
    if (!existingRecipe) {
      throw new Error('Recipe not found');
    }    // Business logic: validate data if provided
    if (data.title !== undefined || data.description !== undefined || data.instructions !== undefined) {
      const mergedData = {
        title: data.title ?? existingRecipe.title,
        description: data.description ?? existingRecipe.description ?? undefined,
        instructions: data.instructions ?? existingRecipe.instructions
      };
      this.validateRecipeData(mergedData);
    }    // Business logic: parse ingredients if provided
    const updateData: any = {
      title: data.title,
      description: data.description,
      instructions: data.instructions,
      prepTime: data.prepTime,
      cookTime: data.cookTime,
      servings: data.servings,
      difficulty: data.difficulty,
      imageUrl: data.imageUrl,
      isPublished: data.isPublished,
      userId: data.userId
    };

    if (data.ingredients) {
      updateData.ingredients = data.ingredients.map(ing => this.parseIngredient(ing));
    }    if (data.tags) {
      updateData.tagIds = (data.tags as RecipeTag[]).map(tag => tag.tagId).filter((id): id is number => id !== undefined);
    }

    const updatedRecipe = await this.recipeRepository.update(id, updateData);
    return this.transformRecipe(updatedRecipe);
  }

  /**
   * Delete recipe
   */
  async deleteRecipe(id: number): Promise<Recipe> {
    const recipe = await this.getRecipeById(id);
    if (!recipe) {
      throw new Error('Recipe not found');
    }

    await this.recipeRepository.delete(id);
    return recipe;
  }

  /**
   * Search recipes by title or ingredients
   */
  async searchRecipes(query: string, params: {
    skip?: number;
    take?: number;
  } = {}): Promise<Recipe[]> {
    const searchParams = {
      ...params,
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            ingredients: {
              some: {
                name: {
                  contains: query,
                  mode: 'insensitive'
                }
              }
            }
          }
        ]
      }
    };

    return this.getRecipes(searchParams);
  }

  /**
   * Get recipes by user ID
   */
  async getRecipesByUserId(userId: number, params: {
    skip?: number;
    take?: number;
  } = {}): Promise<Recipe[]> {
    const searchParams = {
      ...params,
      where: { userId },
      orderBy: { createdAt: 'desc' }
    };

    return this.getRecipes(searchParams);
  }

  /**
   * Get recipes by tag
   */
  async getRecipesByTag(tagId: number, params: {
    skip?: number;
    take?: number;
  } = {}): Promise<Recipe[]> {
    const searchParams = {
      ...params,
      where: {
        tags: {
          some: {
            tagId
          }
        }
      }
    };

    return this.getRecipes(searchParams);
  }
}

export const RecipeService = new RecipeServiceClass(RecipeRepository);
