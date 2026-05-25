import { type CompanyAdministrator } from '../interfaces/companyAdministrator.interface.js';
import { CompanyAdministratorRepository } from '../repositories/companyAdministrator.repository.js';

export const getAllAssignments = async () => {
  return await CompanyAdministratorRepository.findAll();
};

export const getAssignmentById = async (id: string) => {
  return await CompanyAdministratorRepository.findById(id);
};

export const getAssignmentsByCompany = async (idEmpresa: string) => {
  return await CompanyAdministratorRepository.findByCompany(idEmpresa);
};

export const getAssignmentsByAdmin = async (idAdministrador: string) => {
  return await CompanyAdministratorRepository.findByAdministrator(idAdministrador);
};

export const createAssignment = async (data: Partial<CompanyAdministrator>) => {
  return await CompanyAdministratorRepository.create(data);
};

export const updateAssignment = async (id: string, data: Partial<CompanyAdministrator>) => {
  return await CompanyAdministratorRepository.update(id, data);
};

export const deleteAssignment = async (id: string) => {
  return await CompanyAdministratorRepository.deleteLogical(id);
};