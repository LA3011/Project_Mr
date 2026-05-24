import type { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import * as RewardService from '../services/reward.service.js';

export const getRewards = catchAsync(async (_req: Request, res: Response) => {
    const rewards = await RewardService.getAllRewards();
    res.status(200).json({ success: true, data: rewards });
});

export const getRewardById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID de recompensa proporcionado no es válido o está ausente' });
    }

    const reward = await RewardService.getRewardById(id);
    if (!reward) {
        return res.status(404).json({ success: false, message: 'Recompensa no encontrada' });
    }

    res.status(200).json({ success: true, data: reward });
});

export const getRewardsByUser = catchAsync(async (req: Request, res: Response) => {
    const { id_usuario } = req.params;

    if (!id_usuario || typeof id_usuario !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID de usuario requerido no es válido' });
    }

    const rewards = await RewardService.getRewardsByUser(id_usuario);
    res.status(200).json({ success: true, data: rewards });
});

export const createReward = catchAsync(async (req: Request, res: Response) => {
    const { id_usuario, titulo, tipo, descripcion } = req.body;

    if (!id_usuario || !titulo || !tipo || !descripcion) {
        return res.status(400).json({
            success: false,
            message: 'Faltan campos obligatorios para emitir la recompensa (id_usuario, titulo, tipo, descripcion)'
        });
    }

    const newReward = await RewardService.createReward(req.body);
    res.status(201).json({ success: true, data: newReward });
});

export const updateReward = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID de recompensa especificado en la ruta no es válido' });
    }

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ success: false, message: 'Cuerpo de petición vacío. Debe enviar al menos un campo a modificar' });
    }

    const updatedReward = await RewardService.updateReward(id, req.body);
    if (!updatedReward) {
        return res.status(404).json({ success: false, message: 'Recompensa no encontrada para actualizar' });
    }

    res.status(200).json({ success: true, data: updatedReward });
});

export const deleteReward = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID de recompensa para desactivación no es válido' });
    }

    const deletedReward = await RewardService.deleteReward(id);
    if (!deletedReward) {
        return res.status(404).json({ success: false, message: 'Recompensa no encontrada o previamente inactivada' });
    }

    res.status(200).json({
        success: true,
        data: deletedReward
    });
});