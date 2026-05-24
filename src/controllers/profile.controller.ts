import type { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import * as ProfileService from '../services/profile.service.js';

export const getProfiles = catchAsync(async (_req: Request, res: Response) => {
  const profiles = await ProfileService.getAllProfiles();
  res.status(200).json({ success: true, data: profiles });
});

export const getProfileById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'El ID de perfil no es válido' });
  }

  const profile = await ProfileService.getProfileById(id);
  if (!profile) {
    return res.status(404).json({ success: false, message: 'Perfil no encontrado' });
  }

  res.status(200).json({ success: true, data: profile });
});

export const createProfile = catchAsync(async (req: Request, res: Response) => {

  const { nombre, descripcion, nivel_acceso } = req.body;

  if (!nombre || !nivel_acceso || !descripcion) {
    return res.status(400).json({
      success: false,
      message: 'Faltan campos obligatorios para generar el Perfil (nombre, descripcion, nivel_acceso)'
    });
  }

  const newProfile = await ProfileService.createProfile(req.body);
  res.status(201).json({ success: true, data: newProfile });
});

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'El ID de perfil no es válido' });
  }

  const updatedProfile = await ProfileService.updateProfile(id, req.body);
  if (!updatedProfile) {
    return res.status(404).json({ success: false, message: 'Perfil no encontrado' });
  }

  res.status(200).json({ success: true, data: updatedProfile });
});

export const deleteProfile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'El ID de perfil no es válido' });
  }

  const deletedProfile = await ProfileService.deleteProfile(id);
  if (!deletedProfile) {
    return res.status(404).json({ success: false, message: 'Perfil no encontrado o ya inactivo' });
  }

  res.status(200).json({
    success: true,
    data: deletedProfile
  });
});