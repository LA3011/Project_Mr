import type { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import * as AdminCompanyService from '../services/companyAdministrator.service.js';

export const getAssignments = catchAsync(async (_req: Request, res: Response) => {
    const assignments = await AdminCompanyService.getAllAssignments();
    res.status(200).json({ success: true, data: assignments });
});

export const getAssignmentById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID de la asignación es requerido y debe ser una cadena válida' });
    }

    const assignment = await AdminCompanyService.getAssignmentById(id);
    if (!assignment) {
        return res.status(404).json({ success: false, message: 'Asignación de administrador no encontrada' });
    }

    res.status(200).json({ success: true, data: assignment });
});

export const getAssignmentsByCompany = catchAsync(async (req: Request, res: Response) => {
    const { id_empresa } = req.params;

    if (!id_empresa || typeof id_empresa !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID de la empresa proporcionado no es válido' });
    }

    const assignments = await AdminCompanyService.getAssignmentsByCompany(id_empresa);
    res.status(200).json({ success: true, data: assignments });
});

export const getAssignmentsByAdmin = catchAsync(async (req: Request, res: Response) => {
    const { id_administrador } = req.params;

    if (!id_administrador || typeof id_administrador !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID del administrador proporcionado no es válido' });
    }

    const assignments = await AdminCompanyService.getAssignmentsByAdmin(id_administrador);
    res.status(200).json({ success: true, data: assignments });
});

export const createAssignment = catchAsync(async (req: Request, res: Response) => {
    const { id_administrador, id_empresa } = req.body;

    if (!id_administrador || !id_empresa) {
        return res.status(400).json({
            success: false,
            message: 'Faltan parámetros obligatorios de vinculación (id_administrador, id_empresa)'
        });
    }

    const newAssignment = await AdminCompanyService.createAssignment(req.body);
    res.status(201).json({ success: true, data: newAssignment });
});

export const updateAssignment = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID de vinculación especificado en la ruta no es válido' });
    }

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ success: false, message: 'No se enviaron datos para actualizar en el cuerpo de la petición' });
    }

    const updatedAssignment = await AdminCompanyService.updateAssignment(id, req.body);
    if (!updatedAssignment) {
        return res.status(404).json({ success: false, message: 'No se encontró la asignación solicitada para actualizar' });
    }

    res.status(200).json({ success: true, data: updatedAssignment });
});

export const deleteAssignment = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID provisto no cumple con los requisitos para procesar la baja' });
    }

    const isDeleted = await AdminCompanyService.deleteAssignment(id);
    if (!isDeleted) {
        return res.status(404).json({ success: false, message: 'La asignación de administrador especificada no existe o ya fue dada de baja' });
    }

    res.status(200).json({ success: true });
});