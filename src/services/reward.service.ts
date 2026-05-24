import { RewardRepository } from '../repositories/reward.repository.js';
import { type Reward } from '../interfaces/reward.interface.js';

export const getAllRewards = async () => {
  return await RewardRepository.findAll();
};

export const getRewardById = async (id: string) => {
  return await RewardRepository.findById(id);
};

export const getRewardsByUser = async (idUsuario: string) => {
  return await RewardRepository.findByUser(idUsuario);
};

export const createReward = async (data: Partial<Reward>) => {
  return await RewardRepository.create(data);
};

export const updateReward = async (id: string, data: Partial<Reward>) => {
  return await RewardRepository.update(id, data);
};

export const deleteReward = async (id: string) => {
  return await RewardRepository.deleteLogical(id);
};