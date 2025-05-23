/**
 * User Repository
 * Simple database operations for users
 */

import { prisma } from '../services/prisma.service';

interface User {
  id: number;
  email: string;
  name: string | null;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserRepository {
  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  /**
   * Find user by ID
   */
  static async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id }
    });
  }

  /**
   * Create a new user
   */
  static async create(userData: {
    email: string;
    name?: string;
    password: string;
  }): Promise<User> {
    return prisma.user.create({
      data: userData
    });
  }

  /**
   * Update user information
   */
  static async update(id: number, userData: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: userData
    });
  }
}
