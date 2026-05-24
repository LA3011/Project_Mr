import type { User } from '../interfaces/user.interface.js';
import { UserRepository } from '../repositories/user.repository.js';

export const getAllUsers = async () => {
  return await UserRepository.findAll();
};

export const getUserById = async (id: string) => {
  return await UserRepository.findById(id);
};

export const updateUser = async (id: string, data: Partial<User>) => {
  return await UserRepository.update(id, data);
};

export const deleteUser = async (id: string) => {
  return await UserRepository.deleteLogical(id);
}; 