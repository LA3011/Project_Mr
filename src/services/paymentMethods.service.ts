import { type PaymentMethods } from '../interfaces/paymentMethods.interface.js';
import { PaymentMethodsRepository } from '../repositories/paymentMethods.repository.js';

export const getAllPaymentMethods = async () => {
  return await PaymentMethodsRepository.findAll();
};

export const getPaymentMethodById = async (id: string) => {
  return await PaymentMethodsRepository.findById(id);
};

export const createPaymentMethod = async (data: Partial<PaymentMethods>) => {
  return await PaymentMethodsRepository.create(data);
};

export const updatePaymentMethod = async (id: string, data: Partial<PaymentMethods>) => {
  return await PaymentMethodsRepository.update(id, data);
};

export const deletePaymentMethod = async (id: string) => {
  return await PaymentMethodsRepository.deleteLogical(id);
};