import { type Schedules } from '../interfaces/schedules.interface.js';
import { SchedulesRepository } from '../repositories/schedules.repository.js';

export const getAllSchedules = async () => {
  return await SchedulesRepository.findAll();
};

export const getScheduleById = async (id: string) => {
  return await SchedulesRepository.findById(id);
};

export const getSchedulesByBranch = async (idSucursal: string) => {
  return await SchedulesRepository.findByBranch(idSucursal);
};

export const createSchedule = async (data: Partial<Schedules>) => {
  return await SchedulesRepository.create(data);
};

export const updateSchedule = async (id: string, data: Partial<Schedules>) => {
  return await SchedulesRepository.update(id, data);
};

export const deleteSchedule = async (id: string) => {
  return await SchedulesRepository.delete(id);
};