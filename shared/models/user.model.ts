export interface User {
  id: number;
  email: string;
  name: string | null;
  password: string;
  role: string;
  isActive: boolean;
  lastLoginAt: Date | null;
  profileImage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends Omit<User, 'password'> {
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
