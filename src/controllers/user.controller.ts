import type { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import * as UserService from '../services/user.service.js';

export const getUsers = catchAsync(async (_req: Request, res: Response) => {
  const users = await UserService.getAllUsers();
  res.status(200).json({ success: true, data: users });
});

export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof (id) != "string") {
    return res.status(400).json({ success: false, message: 'El ID proporcionado no es Válido' });
  }

  const user = await UserService.getUserById(id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  }

  res.status(200).json({ success: true, data: user });
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'El ID proporcionado no es válido' });
  }

  const updatedUser = await UserService.updateUser(id, req.body);

  if (!updatedUser) {
    return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  }

  res.status(200).json({
    success: true,
    data: updatedUser
  });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof (id) != "string") {
    return res.status(400).json({ success: false, message: 'El ID proporcionado no es Válido' });
  }

  const user = await UserService.deleteUser(id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'Usuario no encontrado o ya inactivo' });
  }

  res.status(200).json({
    success: true,
    data: user
  });
}); 