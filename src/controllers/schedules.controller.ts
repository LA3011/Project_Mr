import type { Request, Response } from 'express';
import * as ScheduleService from '../services/schedules.service.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getSchedules = catchAsync(async (_req: Request, res: Response) => {
  const schedules = await ScheduleService.getAllSchedules();
  res.status(200).json({ success: true, data: schedules });
});

export const getScheduleById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'El ID de horario no es válido' });
  }

  const schedule = await ScheduleService.getScheduleById(id);
  if (!schedule) {
    return res.status(404).json({ success: false, message: 'Horario no encontrado' });
  }

  res.status(200).json({ success: true, data: schedule });
});

export const getSchedulesByBranch = catchAsync(async (req: Request, res: Response) => {
  const { id_sucursal } = req.params;

  if (!id_sucursal || typeof id_sucursal !== 'string') {
    return res.status(400).json({ success: false, message: 'El ID de sucursal no es válido' });
  }

  const schedules = await ScheduleService.getSchedulesByBranch(id_sucursal);
  res.status(200).json({ success: true, data: schedules });
});

export const createSchedule = catchAsync(async (req: Request, res: Response) => {

  const { id_sucursal, dia_semana, hora_apertura, hora_cierre } = req.body;

  if (!id_sucursal || !dia_semana || !hora_apertura || !hora_cierre) {
    return res.status(400).json({
      success: false,
      message: 'Faltan campos obligatorios para emitir el horario sucursal (id_sucursal, dia_semana, hora_apertura, hora_cierre)'
    });
  }

  const newSchedule = await ScheduleService.createSchedule(req.body);
  res.status(201).json({ success: true, data: newSchedule });
});

export const updateSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'El ID de horario no es válido' });
  }

  const updatedSchedule = await ScheduleService.updateSchedule(id, req.body);
  if (!updatedSchedule) {
    return res.status(404).json({ success: false, message: 'Horario no encontrado' });
  }

  res.status(200).json({ success: true, data: updatedSchedule });
});

export const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'El ID de horario no es válido' });
  }

  const isDeleted = await ScheduleService.deleteSchedule(id);
  if (!isDeleted) {
    return res.status(404).json({ success: false, message: 'Horario no encontrado para eliminar' });
  }

  res.status(200).json({ success: true });
});