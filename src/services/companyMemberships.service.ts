import { type CompanyMemberships } from '../interfaces/companyMemberships.interface.js';
import { CompanyMembershipsRepository } from '../repositories/companyMemberships.repository.js';

export const getAllCompanyMemberships = async () => {
  return await CompanyMembershipsRepository.findAll();
};

export const getCompanyMembershipById = async (id: string) => {
  return await CompanyMembershipsRepository.findById(id);
};

export const getCompanyMembershipsByCompany = async (idEmpresa: string) => {
  return await CompanyMembershipsRepository.findByCompany(idEmpresa);
};

export const createCompanyMembership = async (data: Partial<CompanyMemberships>) => {
  return await CompanyMembershipsRepository.create(data);
};

export const updateCompanyMembership = async (id: string, data: Partial<CompanyMemberships>) => {
  return await CompanyMembershipsRepository.update(id, data);
};

export const deleteCompanyMembership = async (id: string) => {
  return await CompanyMembershipsRepository.deleteLogical(id);
};