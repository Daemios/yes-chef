import { Request, Response } from 'express';
import { TagService } from '../services/tag.service';

/**
 * Get all tags
 */
export const getAllTags = async (_req: Request, res: Response): Promise<void> => {
  try {
    const tags = await TagService.getAllTags();
    res.status(200).json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
};

/**
 * Get tag by ID
 */
export const getTagById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid tag ID' });
      return;
    }
    
    const tag = await TagService.getTagById(id);
    
    if (!tag) {
      res.status(404).json({ error: 'Tag not found' });
      return;
    }
    
    res.status(200).json(tag);
  } catch (error) {
    console.error('Error fetching tag:', error);
    res.status(500).json({ error: 'Failed to fetch tag' });
  }
};

/**
 * Create a new tag
 */
export const createTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const newTag = await TagService.createTag(req.body);
    res.status(201).json(newTag);
  } catch (error) {
    console.error('Error creating tag:', error);
    if (error instanceof Error && error.message.includes('unique constraint')) {
      res.status(409).json({ error: 'Tag name already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create tag' });
    }
  }
};

/**
 * Update an existing tag
 */
export const updateTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid tag ID' });
      return;
    }
    
    const updatedTag = await TagService.updateTag(id, req.body);
    res.status(200).json(updatedTag);
  } catch (error) {
    console.error('Error updating tag:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404).json({ error: 'Tag not found' });
    } else if (error instanceof Error && error.message.includes('unique constraint')) {
      res.status(409).json({ error: 'Tag name already exists' });
    } else {
      res.status(500).json({ error: 'Failed to update tag' });
    }
  }
};

/**
 * Delete a tag
 */
export const deleteTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid tag ID' });
      return;
    }
    
    await TagService.deleteTag(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting tag:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404).json({ error: 'Tag not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete tag' });
    }
  }
};
