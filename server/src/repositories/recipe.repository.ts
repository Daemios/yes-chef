import { prisma } from '../services/prisma.service';

/**
 * Recipe Repository class - handles only data access operations
 */
export class RecipeRepositoryClass {
  /**
   * Find all recipes with optional filtering
   */
  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Record<string, unknown>;
    orderBy?: Record<string, unknown>;
  } = {}) {
    return prisma.recipe.findMany({
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
      }
    });
  }

  /**
   * Find a recipe by ID
   */
  async findById(id: number) {
    return prisma.recipe.findUnique({
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
  }

  /**
   * Create a new recipe
   */  async create(data: {
    title: string;
    description: string;
    instructions: string;
    prepTime?: number;
    cookTime?: number;
    servings?: number;
    difficulty?: string;
    imageUrl?: string;
    isPublished?: boolean;
    userId?: number;
    ingredients?: { name: string; amount?: string; unit?: string; substitute?: string; isOptional?: boolean; }[];
    tagIds?: number[];
  }) {
    return prisma.recipe.create({
      data: {
        title: data.title,
        description: data.description,
        instructions: data.instructions,
        prepTime: data.prepTime,
        cookTime: data.cookTime,
        servings: data.servings,
        difficulty: data.difficulty,
        imageUrl: data.imageUrl,
        isPublished: data.isPublished,
        user: data.userId ? { connect: { id: data.userId } } : undefined,
        ingredients: data.ingredients ? {
          create: data.ingredients
        } : undefined,
        tags: data.tagIds ? {
          create: data.tagIds.map(tagId => ({
            tag: { connect: { id: tagId } }
          }))
        } : undefined
      },
      include: {
        user: true,
        tags: { include: { tag: true } },
        ingredients: true
      }
    });
  }

  /**
   * Update a recipe
   */  async update(id: number, data: {
    title?: string;
    description?: string;
    instructions?: string;
    prepTime?: number;
    cookTime?: number;
    servings?: number;
    difficulty?: string;
    imageUrl?: string;
    isPublished?: boolean;
    userId?: number;
    ingredients?: { name: string; amount?: string; unit?: string; substitute?: string; isOptional?: boolean; }[];
    tagIds?: number[];
  }) {
    return prisma.recipe.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        instructions: data.instructions,
        prepTime: data.prepTime,
        cookTime: data.cookTime,
        servings: data.servings,
        difficulty: data.difficulty,
        imageUrl: data.imageUrl,
        isPublished: data.isPublished,
        user: data.userId !== undefined ? {
          connect: { id: data.userId }
        } : undefined,
        // Handle ingredients updates if present
        ingredients: data.ingredients ? {
          deleteMany: {},
          create: data.ingredients
        } : undefined,
        // Handle tag updates if present
        tags: data.tagIds ? {
          deleteMany: {},
          create: data.tagIds.map(tagId => ({
            tag: { connect: { id: tagId } }
          }))
        } : undefined
      },
      include: {
        user: true,
        tags: { include: { tag: true } },
        ingredients: true
      }
    });
  }

  /**
   * Delete a recipe
   */
  async delete(id: number) {
    return prisma.recipe.delete({
      where: { id }
    });
  }
}

export const RecipeRepository = new RecipeRepositoryClass();
