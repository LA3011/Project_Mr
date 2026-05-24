import type { Request, Response } from 'express';
import * as MembershipService from '../services/membership.service.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getMemberships = catchAsync(async (_req: Request, res: Response) => {
    const memberships = await MembershipService.getAllMemberships();
    res.status(200).json({ success: true, data: memberships });
});

export const getMembershipById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID de membresía proporcionado no es válido o está ausente' });
    }

    const membership = await MembershipService.getMembershipById(id);
    if (!membership) {
        return res.status(404).json({ success: false, message: 'Membresía no encontrada' });
    }

    res.status(200).json({ success: true, data: membership });
});

export const createMembership = catchAsync(async (req: Request, res: Response) => {
    const { nombre, precio, fecha_inicio, fecha_final, descripcion } = req.body;

    if (!nombre || !precio || !fecha_inicio || !fecha_final || !descripcion) {
        return res.status(400).json({
            success: false,
            message: 'Faltan campos obligatorios para dar de alta la membresía (nombre, precio, fecha_inicio, fecha_final, descripcion)'
        });
    }

    if (isNaN(Number(precio)) || Number(precio) < 0) {
        return res.status(400).json({ success: false, message: 'El precio debe ser un valor numérico mayor o igual a cero' });
    }

    const newMembership = await MembershipService.createMembership(req.body);
    res.status(201).json({ success: true, data: newMembership });
});

export const updateMembership = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID de membresía de la ruta no posee un formato válido' });
    }

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ success: false, message: 'Cuerpo de petición vacío. Debe suministrar los campos a modificar' });
    }

    const updatedMembership = await MembershipService.updateMembership(id, req.body);
    if (!updatedMembership) {
        return res.status(404).json({ success: false, message: 'Membresía no encontrada para procesar la actualización' });
    }

    res.status(200).json({ success: true, data: updatedMembership });
});

export const deleteMembership = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID de membresía enviado es inválido para completar la operación' });
    }

    const deletedMembership = await MembershipService.deleteMembership(id);
    if (!deletedMembership) {
        return res.status(404).json({ success: false, message: 'Membresía no encontrada o ya inactiva dentro del sistema' });
    }

    res.status(200).json({
        success: true,
        data: deletedMembership
    });
});