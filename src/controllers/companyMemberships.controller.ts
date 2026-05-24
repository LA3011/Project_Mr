import type { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import * as CompMembershipService from '../services/companyMemberships.service.js';

export const getCompanyMemberships = catchAsync(async (_req: Request, res: Response) => {
    const records = await CompMembershipService.getAllCompanyMemberships();
    res.status(200).json({ success: true, data: records });
});

export const getCompanyMembershipById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID de relación de membresía no es válido' });
    }

    const record = await CompMembershipService.getCompanyMembershipById(id);
    if (!record) {
        return res.status(404).json({ success: false, message: 'Registro de membresía empresarial no encontrado' });
    }

    res.status(200).json({ success: true, data: record });
});

export const getCompanyMembershipsByCompany = catchAsync(async (req: Request, res: Response) => {
    const { id_empresa } = req.params;

    if (!id_empresa || typeof id_empresa !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID de empresa suministrado no es válido' });
    }

    const records = await CompMembershipService.getCompanyMembershipsByCompany(id_empresa);
    res.status(200).json({ success: true, data: records });
});

export const createCompanyMembership = catchAsync(async (req: Request, res: Response) => {
    const { id_empresa, id_membresia, fecha_inicio, fecha_fin, estado_pago } = req.body;

    if (!id_empresa || !id_membresia || !fecha_inicio || !fecha_fin || !estado_pago) {
        return res.status(400).json({
            success: false,
            message: 'Faltan parámetros obligatorios estructurales (id_empresa, id_membresia, fecha_inicio, fecha_fin, estado_pago)'
        });
    }

    const newRecord = await CompMembershipService.createCompanyMembership(req.body);
    res.status(201).json({ success: true, data: newRecord });
});

export const updateCompanyMembership = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID de contrato de membresía de la ruta es inválido' });
    }

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ success: false, message: 'Cuerpo de petición vacío. Debe enviar al menos un campo a modificar' });
    }

    const updatedRecord = await CompMembershipService.updateCompanyMembership(id, req.body);
    if (!updatedRecord) {
        return res.status(404).json({ success: false, message: 'No se encontró el registro para procesar la actualización' });
    }

    res.status(200).json({ success: true, data: updatedRecord });
});

export const deleteCompanyMembership = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID enviado no cumple con los requisitos del sistema' });
    }

    const deactivatedRecord = await CompMembershipService.deleteCompanyMembership(id);
    if (!deactivatedRecord) {
        return res.status(404).json({ success: false, message: 'El registro no existe o ya se encuentra inactivo' });
    }

    res.status(200).json({
        success: true,
        data: deactivatedRecord
    });
});