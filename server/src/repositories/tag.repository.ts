import { prisma } from '../services/prisma.service';

/**
 * Tag Repository class - handles only data access operations
 */
export class TagRepositoryClass {
  /**
   * Find all tags
   */
  async findMany() {
    return prisma.recipeTag.findMany({
      orderBy: { name: 'asc' }
    });
  }

  /**
   * Find a tag by ID
   */
  async findById(id: number) {
    return prisma.recipeTag.findUnique({
      where: { id }
    });
  }

  /**
   * Find a tag by name
   */
  async findByName(name: string) {
    return prisma.recipeTag.findUnique({
      where: { name }
    });
  }

  /**
   * Create a new tag
   */
  async create(data: {
    name: string;
    description?: string;
  }) {
    return prisma.recipeTag.create({
      data: {
        name: data.name,
        description: data.description
      }
    });
  }

  /**
   * Update a tag
   */
  async update(id: number, data: {
    name?: string;
    description?: string;
  }) {
    return prisma.recipeTag.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description
      }
    });
  }

  /**
   * Delete a tag
   */
  async delete(id: number) {
    return prisma.recipeTag.delete({
      where: { id }
    });
  }
}

export const TagRepository = new TagRepositoryClass();
