import type { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import * as PaymentService from '../services/paymentMethods.service.js';

export const getPaymentMethods = catchAsync(async (_req: Request, res: Response) => {
    const methods = await PaymentService.getAllPaymentMethods();
    res.status(200).json({ success: true, data: methods });
});

export const getPaymentMethodById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID del método de pago no es válido' });
    }

    const method = await PaymentService.getPaymentMethodById(id);
    if (!method) {
        return res.status(404).json({ success: false, message: 'Método de pago no encontrado' });
    }

    res.status(200).json({ success: true, data: method });
});

export const createPaymentMethod = catchAsync(async (req: Request, res: Response) => {

    const { nombre, descripcion } = req.body;

    if (!nombre || !descripcion) {
        return res.status(400).json({
            success: false,
            message: 'Faltan campos obligatorios para generar el metodo de pago (nombre, descripcion)'
        });
    }

    const newMethod = await PaymentService.createPaymentMethod(req.body);
    res.status(201).json({ success: true, data: newMethod });
});

export const updatePaymentMethod = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID del método de pago no es válido' });
    }

    const updatedMethod = await PaymentService.updatePaymentMethod(id, req.body);
    if (!updatedMethod) {
        return res.status(404).json({ success: false, message: 'Método de pago no encontrado' });
    }

    res.status(200).json({ success: true, data: updatedMethod });
});

export const deletePaymentMethod = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID del método de pago no es válido' });
    }

    const isDeleted = await PaymentService.deletePaymentMethod(id);
    if (!isDeleted) {
        return res.status(404).json({ success: false, message: 'Método de pago no encontrado' });
    }

    res.status(200).json({ success: true, data: isDeleted });
});