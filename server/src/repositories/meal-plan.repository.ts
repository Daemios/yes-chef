/**
 * Meal Plan Repository
 * Database interaction layer for meal plans
 */
import { PrismaClient, MealPlan, MealDay } from '@prisma/client';

const prisma = new PrismaClient();

export class MealPlanRepository {
  /**
   * Find all meal plans belonging to a user
   */
  static async findByUserId(userId: number): Promise<MealPlan[]> {
    return prisma.mealPlan.findMany({
      where: { userId },
      include: {
        days: {
          include: {
            breakfastRecipe: true,
            lunchRecipe: true,
            dinnerRecipe: true,
          }
        }
      },
      orderBy: { startDate: 'desc' }
    });
  }

  /**
   * Find a meal plan by ID
   */
  static async findById(id: number): Promise<MealPlan | null> {
    return prisma.mealPlan.findUnique({
      where: { id },
      include: {
        days: {
          include: {
            breakfastRecipe: true,
            lunchRecipe: true,
            dinnerRecipe: true,
          }
        }
      }
    });
  }

  /**
   * Create a new meal plan
   */  static async create(data: {
    name: string,
    startDate: Date | string,
    endDate: Date | string,
    userId: number,
    days?: {
      day: string,
      date: Date | string,
      breakfast?: string,
      lunch?: string,
      dinner?: string,
      breakfastId?: number | null,
      lunchId?: number | null,
      dinnerId?: number | null,
    }[]
  }): Promise<MealPlan> {
    try {
      // Make sure dates are properly formatted as Date objects for Prisma
      const formattedData = {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      };
      
      const { days, ...mealPlanData } = formattedData;
      
      // Process the days to ensure dates are Date objects and validate types
      const formattedDays = days?.map(day => {
        // Ensure day values are correct types
        const processedDay = {
          day: String(day.day),
          date: new Date(day.date),
          breakfast: day.breakfast || null,
          lunch: day.lunch || null,
          dinner: day.dinner || null,
          breakfastId: day.breakfastId || null,
          lunchId: day.lunchId || null,
          dinnerId: day.dinnerId || null
        };
        
        return processedDay;
      });
      
      console.log('Creating meal plan with formatted data:', 
        JSON.stringify({
          ...mealPlanData,
          days: formattedDays?.map(d => ({...d, date: d.date.toISOString()}))
        }, null, 2));
      
      return prisma.mealPlan.create({
        data: {
          ...mealPlanData,
          days: formattedDays ? {
            create: formattedDays
          } : undefined
        },
        include: {
          days: true
        }
      });    } catch (error) {
      console.error('Error in create meal plan repository:', error);
      throw error;
    }
  }

  /**
   * Update an existing meal plan
   */
  static async update(id: number, data: {
    name?: string,
    startDate?: Date | string,
    endDate?: Date | string,
    isActive?: boolean
  }): Promise<MealPlan> {
    // Format dates properly
    const formattedData = { ...data };
    
    if (formattedData.startDate) {
      formattedData.startDate = new Date(formattedData.startDate);
    }
    
    if (formattedData.endDate) {
      formattedData.endDate = new Date(formattedData.endDate);
    }
    
    return prisma.mealPlan.update({
      where: { id },
      data: formattedData,
      include: {
        days: {
          include: {
            breakfastRecipe: true,
            lunchRecipe: true,
            dinnerRecipe: true,
          }
        }
      }
    });
  }

  /**
   * Delete a meal plan
   */
  static async delete(id: number): Promise<MealPlan> {
    return prisma.mealPlan.delete({
      where: { id },
      include: { days: true }
    });
  }
  /**
   * Add a meal day to a meal plan
   */
  static async addMealDay(mealPlanId: number, dayData: {
    day: string,
    date: Date | string,
    breakfast?: string,
    lunch?: string, 
    dinner?: string,
    breakfastId?: number | null,
    lunchId?: number | null,
    dinnerId?: number | null,
  }): Promise<MealDay> {
    // Format the date properly
    const formattedData = { 
      ...dayData,
      date: typeof dayData.date === 'string' ? new Date(dayData.date) : dayData.date
    };
    
    return prisma.mealDay.create({
      data: {
        ...formattedData,
        mealPlanId
      },
      include: {
        breakfastRecipe: true,
        lunchRecipe: true,
        dinnerRecipe: true
      }
    });
  }

  /**
   * Update a meal day
   */
  static async updateMealDay(id: number, data: {
    breakfast?: string,
    lunch?: string,
    dinner?: string,
    breakfastId?: number | null,
    lunchId?: number | null,
    dinnerId?: number | null,
  }): Promise<MealDay> {
    return prisma.mealDay.update({
      where: { id },
      data,
      include: {
        breakfastRecipe: true,
        lunchRecipe: true,
        dinnerRecipe: true
      }
    });
  }

  /**
   * Delete a meal day
   */
  static async deleteMealDay(id: number): Promise<MealDay> {
    return prisma.mealDay.delete({
      where: { id }
    });
  }

  /**
   * Add a recipe to a specific meal slot (breakfast, lunch, or dinner)
   */
  static async addRecipeToMealSlot(
    mealPlanId: number,
    dayIndex: number,
    mealType: string,
    recipeId: number
  ): Promise<MealPlan> {
    // First get the meal plan to find the correct day
    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id: mealPlanId },
      include: { days: true }
    });

    if (!mealPlan || !mealPlan.days[dayIndex]) {
      throw new Error('Meal plan or day not found');
    }

    const dayId = mealPlan.days[dayIndex].id;
    
    // Update field based on meal type
    const updateData: any = {};
    
    if (mealType === 'breakfast') {
      updateData.breakfastId = recipeId;
      updateData.breakfast = null; // Clear any text-only meal name
    } else if (mealType === 'lunch') {
      updateData.lunchId = recipeId;
      updateData.lunch = null; // Clear any text-only meal name
    } else if (mealType === 'dinner') {
      updateData.dinnerId = recipeId;
      updateData.dinner = null; // Clear any text-only meal name
    } else {
      throw new Error('Invalid meal type');
    }

    // Update the meal day
    await prisma.mealDay.update({
      where: { id: dayId },
      data: updateData
    });

    // Return the updated meal plan with full details
    return prisma.mealPlan.findUnique({
      where: { id: mealPlanId },
      include: {
        days: {
          include: {
            breakfastRecipe: true,
            lunchRecipe: true,
            dinnerRecipe: true
          }
        }
      }
    }) as Promise<MealPlan>;
  }

  /**
   * Remove a recipe from a specific meal slot (breakfast, lunch, or dinner)
   */
  static async removeRecipeFromMealSlot(
    mealPlanId: number,
    dayIndex: number,
    mealType: string
  ): Promise<MealPlan> {
    // First get the meal plan to find the correct day
    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id: mealPlanId },
      include: { days: true }
    });

    if (!mealPlan || !mealPlan.days[dayIndex]) {
      throw new Error('Meal plan or day not found');
    }

    const dayId = mealPlan.days[dayIndex].id;
    
    // Update field based on meal type
    const updateData: any = {};
    
    if (mealType === 'breakfast') {
      updateData.breakfastId = null;
    } else if (mealType === 'lunch') {
      updateData.lunchId = null;
    } else if (mealType === 'dinner') {
      updateData.dinnerId = null;
    } else {
      throw new Error('Invalid meal type');
    }

    // Update the meal day
    await prisma.mealDay.update({
      where: { id: dayId },
      data: updateData
    });

    // Return the updated meal plan with full details
    return prisma.mealPlan.findUnique({
      where: { id: mealPlanId },
      include: {
        days: {
          include: {
            breakfastRecipe: true,
            lunchRecipe: true,
            dinnerRecipe: true
          }
        }
      }
    }) as Promise<MealPlan>;
  }
}