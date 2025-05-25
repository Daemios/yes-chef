import { TagRepository } from '../repositories/tag.repository';

export class TagServiceClass {
  constructor(private tagRepository: typeof TagRepository) {}

  /**
   * Validate tag data
   */
  private validateTagData(data: { name?: string; description?: string }) {
    if (!data.name?.trim()) {
      throw new Error('Tag name is required');
    }

    if (data.name.trim().length < 2) {
      throw new Error('Tag name must be at least 2 characters long');
    }

    if (data.name.trim().length > 50) {
      throw new Error('Tag name must be less than 50 characters');
    }
  }

  /**
   * Get all tags
   */
  async getAllTags() {
    return this.tagRepository.findMany();
  }

  /**
   * Get tag by ID
   */
  async getTagById(id: number) {
    return this.tagRepository.findById(id);
  }

  /**
   * Create a new tag
   */
  async createTag(data: { name: string; description?: string }) {
    this.validateTagData(data);

    // Check if tag already exists
    const existingTag = await this.tagRepository.findByName(data.name.trim());
    if (existingTag) {
      throw new Error('Tag with this name already exists');
    }

    return this.tagRepository.create({
      name: data.name.trim(),
      description: data.description?.trim()
    });
  }

  /**
   * Update a tag
   */
  async updateTag(id: number, data: { name?: string; description?: string }) {
    // Check if tag exists
    const existingTag = await this.tagRepository.findById(id);
    if (!existingTag) {
      throw new Error('Tag not found');
    }

    // Validate data if provided
    if (data.name !== undefined) {
      this.validateTagData({ name: data.name, description: data.description });

      // Check if name is already taken by another tag
      const tagWithName = await this.tagRepository.findByName(data.name.trim());
      if (tagWithName && tagWithName.id !== id) {
        throw new Error('Tag with this name already exists');
      }
    }

    return this.tagRepository.update(id, {
      name: data.name?.trim(),
      description: data.description?.trim()
    });
  }

  /**
   * Delete a tag
   */
  async deleteTag(id: number) {
    // Check if tag exists
    const existingTag = await this.tagRepository.findById(id);
    if (!existingTag) {
      throw new Error('Tag not found');
    }

    return this.tagRepository.delete(id);
  }
}

export const TagService = new TagServiceClass(TagRepository);
