import { type Company } from '../interfaces/company.interface.js';
import { CompanyRepository } from '../repositories/company.repository.js';

export const getAllCompanies = async () => {
  return await CompanyRepository.findAll();
};

export const getCompanyById = async (id: string) => {
  return await CompanyRepository.findById(id);
};

export const createCompany = async (data: Partial<Company>) => {
  return await CompanyRepository.create(data);
};

export const updateCompany = async (id: string, data: Partial<Company>) => {
  return await CompanyRepository.update(id, data);
};

export const deleteCompany = async (id: string) => {
  return await CompanyRepository.deleteLogical(id);
};