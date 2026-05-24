import { type Category } from '../interfaces/category.interface.js';
import { CategoryRepository } from '../repositories/category.repository.js';

export const getAllCategories = async () => {
  return await CategoryRepository.findAll();
};

export const getCategoryById = async (id: string) => {
  return await CategoryRepository.findById(id);
};

export const createCategory = async (data: Partial<Category>) => {
  return await CategoryRepository.create(data);
};

export const updateCategory = async (id: string, data: Partial<Category>) => {
  return await CategoryRepository.update(id, data);
};

export const deleteCategory = async (id: string) => {
  return await CategoryRepository.deleteLogical(id);
};