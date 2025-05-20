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
  createdAt: string;
  updatedAt: string;
  userId?: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  tags?: {
    tag: {
      id: number;
      name: string;
    }
  }[];
}

export type CreateRecipeDTO = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRecipeDTO = Partial<CreateRecipeDTO>;
