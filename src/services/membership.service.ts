import { type Membership } from '../interfaces/membership.interface.js';
import { MembershipRepository } from '../repositories/membership.repository.js';

export const getAllMemberships = async () => {
  return await MembershipRepository.findAll();
};

export const getMembershipById = async (id: string) => {
  return await MembershipRepository.findById(id);
};

export const createMembership = async (data: Partial<Membership>) => {
  return await MembershipRepository.create(data);
};

export const updateMembership = async (id: string, data: Partial<Membership>) => {
  return await MembershipRepository.update(id, data);
};

export const deleteMembership = async (id: string) => {
  return await MembershipRepository.deleteLogical(id);
};