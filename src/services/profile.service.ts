import { type Profile } from '../interfaces/profile.interface.js';
import { ProfileRepository } from '../repositories/profile.repository.js';

export const getAllProfiles = async () => {
  return await ProfileRepository.findAll();
};

export const getProfileById = async (id: string) => {
  return await ProfileRepository.findById(id);
};

export const createProfile = async (data: Partial<Profile>) => {
  return await ProfileRepository.create(data);
};

export const updateProfile = async (id: string, data: Partial<Profile>) => {
  return await ProfileRepository.update(id, data);
};

export const deleteProfile = async (id: string) => {
  return await ProfileRepository.deleteLogical(id);
};