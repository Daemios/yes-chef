import { prisma } from '../services/prisma.service';

export interface MealData {
  recipeId: number;
  userId?: number;
  date: Date;
  servings: number;
  mealType: string;
}

export interface MealWithRecipe {
  id: number;
  recipeId: number;
  userId: number | null;
  date: Date;
  servings: number;
  mealType: string;
  createdAt: Date;
  updatedAt: Date;
  recipe: {
    id: number;
    title: string;
    description: string | null;
    instructions: string;
    prepTime: number | null;
    cookTime: number | null;
    servings: number | null;
    difficulty: string | null;
    imageUrl: string | null;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
    userId: number | null;
  };
  user?: {
    id: number;
    email: string;
    name: string | null;
  } | null;
}

export class MealRepository {
  /**
   * Find all meals for a user within a date range
   */
  static async findByUserIdAndDateRange(
    userId: number,
    startDate: Date,
    endDate: Date
  ): Promise<MealWithRecipe[]> {
    return prisma.meal.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        recipe: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: [
        { date: 'asc' },
        { mealType: 'asc' }
      ]
    }) as Promise<MealWithRecipe[]>;
  }

  /**
   * Find all meals for a user
   */
  static async findByUserId(userId: number): Promise<MealWithRecipe[]> {
    return prisma.meal.findMany({
      where: { userId },
      include: {
        recipe: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: [
        { date: 'desc' },
        { mealType: 'asc' }
      ]
    }) as Promise<MealWithRecipe[]>;
  }

  /**
   * Find meals by date
   */
  static async findByDate(date: Date, userId?: number): Promise<MealWithRecipe[]> {
    const whereClause: any = {
      date: {
        gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
      }
    };

    if (userId) {
      whereClause.userId = userId;
    }

    return prisma.meal.findMany({
      where: whereClause,
      include: {
        recipe: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: { mealType: 'asc' }
    }) as Promise<MealWithRecipe[]>;
  }

  /**
   * Find a meal by ID
   */
  static async findById(id: number): Promise<MealWithRecipe | null> {
    return prisma.meal.findUnique({
      where: { id },
      include: {
        recipe: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    }) as Promise<MealWithRecipe | null>;
  }

  /**
   * Create a new meal
   */
  static async create(data: MealData): Promise<MealWithRecipe> {
    return prisma.meal.create({
      data: {
        recipeId: data.recipeId,
        userId: data.userId || null,
        date: data.date,
        servings: data.servings,
        mealType: data.mealType
      },
      include: {
        recipe: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    }) as Promise<MealWithRecipe>;
  }

  /**
   * Update an existing meal
   */
  static async update(id: number, data: Partial<MealData>): Promise<MealWithRecipe> {
    return prisma.meal.update({
      where: { id },
      data: {
        ...(data.recipeId && { recipeId: data.recipeId }),
        ...(data.userId !== undefined && { userId: data.userId }),
        ...(data.date && { date: data.date }),
        ...(data.servings && { servings: data.servings }),
        ...(data.mealType && { mealType: data.mealType })
      },
      include: {
        recipe: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    }) as Promise<MealWithRecipe>;
  }

  /**
   * Delete a meal
   */
  static async delete(id: number): Promise<MealWithRecipe> {
    return prisma.meal.delete({
      where: { id },
      include: {
        recipe: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    }) as Promise<MealWithRecipe>;
  }

  /**
   * Get meals grouped by date for a user
   */
  static async getMealsByWeek(
    userId: number,
    startDate: Date
  ): Promise<{ [key: string]: MealWithRecipe[] }> {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    const meals = await this.findByUserIdAndDateRange(userId, startDate, endDate);
    
    // Group meals by date
    const groupedMeals: { [key: string]: MealWithRecipe[] } = {};
    
    meals.forEach(meal => {
      const dateKey = meal.date.toISOString().split('T')[0];
      if (!groupedMeals[dateKey]) {
        groupedMeals[dateKey] = [];
      }
      groupedMeals[dateKey].push(meal);
    });

    return groupedMeals;
  }

  /**
   * Add or update a meal for a specific date and meal type
   */
  static async setMealForSlot(
    userId: number,
    date: Date,
    mealType: string,
    recipeId: number,
    servings: number = 1
  ): Promise<MealWithRecipe> {
    // Check if a meal already exists for this slot
    const existingMeal = await prisma.meal.findFirst({
      where: {
        userId,
        date: {
          gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
        },
        mealType
      }
    });

    if (existingMeal) {
      // Update existing meal
      return this.update(existingMeal.id, {
        recipeId,
        servings
      });
    } else {
      // Create new meal
      return this.create({
        recipeId,
        userId,
        date,
        servings,
        mealType      });
    }
  }

  /**
   * Remove a meal from a specific date and meal type
   */
  static async removeMealFromSlot(
    userId: number,
    date: Date,
    mealType: string
  ): Promise<boolean> {
    const meal = await prisma.meal.findFirst({
      where: {
        userId,
        date: {
          gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
        },
        mealType
      }
    });

    if (meal) {
      await MealRepository.delete(meal.id);
      return true;
    }

    return false;
  }
}
