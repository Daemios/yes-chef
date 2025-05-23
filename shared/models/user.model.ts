/**
 * User Model
 * Represents a user in the application
 */

export interface User {
  id: number;
  email: string;
  name?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface UserProfile extends User {
  preferences?: {
    dietaryRestrictions?: string[];
    allergies?: string[];
    calorieGoal?: number;
    macroTargets?: {
      protein: number;
      carbs: number;
      fat: number;
    };
  };
  subscription?: {
    plan: 'basic' | 'premium' | 'family';
    status: 'active' | 'cancelled' | 'trial';
    trialEnds?: string | Date;
    nextBilling?: string | Date;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}
