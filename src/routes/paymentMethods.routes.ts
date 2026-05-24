import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.handler.js';
import {
    getPaymentMethods,
    getPaymentMethodById,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod
} from '../controllers/paymentMethods.controller.js';

const router = Router();

/**
 * @openapi
 * /api/payment-methods:
 *   get:
 *     summary: Obtiene el catálogo de todos los métodos de pago disponibles
 *     tags: [Métodos de Pago]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Lista de métodos de pago recuperada con éxito (success true, data methods)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_metodo_pago:
 *                         type: integer
 *                         example: 1
 *                       nombre:
 *                         type: string
 *                         example: "Pago Móvil"
 *                       icono:
 *                         type: string
 *                         example: "phone-android"
 *                       descripcion:
 *                         type: string
 *                         example: "Transferencias interbancarias inmediatas usando número de teléfono y cédula."
 *                       estado:
 *                         type: boolean
 *                         example: false
 *             example:
 *               success: true
 *               data:
 *                 - id_metodo_pago: 1
 *                   nombre: "Pago Móvil"
 *                   icono: "phone-android"
 *                   descripcion: "Transferencias interbancarias inmediatas usando número de teléfono y cédula."
 *                   estado: false
 *       401:
 *         description: No autorizado
 */
router.get('/', authenticateJWT, getPaymentMethods);

/**
 * @openapi
 * /api/payment-methods/{id}:
 *   get:
 *     summary: Obtiene la información detallada de un método de pago por su ID
 *     tags: [Métodos de Pago]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del método de pago a consultar
 *     responses:
 *       200:
 *         description: "Datos del método de pago obtenidos correctamente (success true, data method)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_metodo_pago:
 *                       type: integer
 *                       example: 1
 *                     nombre:
 *                       type: string
 *                       example: "Pago Móvil"
 *                     icono:
 *                       type: string
 *                       example: "phone-android"
 *                     descripcion:
 *                       type: string
 *                       example: "Transferencias interbancarias inmediatas usando número de teléfono y cédula."
 *                     estado:
 *                       type: boolean
 *                       example: false
 *             example:
 *               success: true
 *               data:
 *                 id_metodo_pago: 1
 *                 nombre: "Pago Móvil"
 *                 icono: "phone-android"
 *                 descripcion: "Transferencias interbancarias inmediatas usando número de teléfono y cédula."
 *                 estado: false
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Método de pago no encontrado
 */
router.get('/:id', authenticateJWT, getPaymentMethodById);

/**
 * @openapi
 * /api/payment-methods:
 *   post:
 *     summary: Registra un nuevo método de pago en el catálogo general
 *     tags: [Métodos de Pago]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Pago Móvil"
 *               icono:
 *                 type: string
 *                 description: "Nombre de la clase del icono o URL del vector ilustrativo (opcional)"
 *                 example: "phone-android"
 *               descripcion:
 *                 type: string
 *                 example: "Transferencias interbancarias inmediatas usando número de teléfono y cédula."
 *           example:
 *             nombre: "Pago Móvil"
 *             icono: "phone-android"
 *             descripcion: "Transferencias interbancarias inmediatas usando número de teléfono y cédula."
 *     responses:
 *       201:
 *         description: "Método de pago registrado exitosamente (success true, data newMethod)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_metodo_pago:
 *                       type: integer
 *                       example: 1
 *                     nombre:
 *                       type: string
 *                       example: "Pago Móvil"
 *                     icono:
 *                       type: string
 *                       example: "phone-android"
 *                     descripcion:
 *                       type: string
 *                       example: "Transferencias interbancarias inmediatas usando número de teléfono y cédula."
 *                     estado:
 *                       type: boolean
 *                       example: true
 *             example:
 *               success: true
 *               data:
 *                 id_metodo_pago: 1
 *                 nombre: "Pago Móvil"
 *                 icono: "phone-android"
 *                 descripcion: "Transferencias interbancarias inmediatas usando número de teléfono y cédula."
 *                 estado: true
 *       400:
 *         description: "Faltan campos obligatorios para generar el metodo de pago (nombre, descripcion)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Faltan campos obligatorios para generar el metodo de pago (nombre, descripcion)"
 *             example:
 *               success: false
 *               message: "Faltan campos obligatorios para generar el metodo de pago (nombre, descripcion)"
 *       401:
 *         description: No autorizado
 */
router.post('/', authenticateJWT, createPaymentMethod);

/**
 * @openapi
 * /api/payment-methods/{id}:
 *   put:
 *     summary: Modifica los datos informativos o el identificador visual de un método de pago
 *     tags: [Métodos de Pago]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del método de pago a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Pago Móvil Interbancario"
 *               icono:
 *                 type: string
 *                 example: "mobile-pay-icon"
 *               descripcion:
 *                 type: string
 *                 example: "Pasarela para transacciones comerciales en bolívares en tiempo real."
 *           example:
 *             nombre: "Pago Móvil Interbancario"
 *             icono: "mobile-pay-icon"
 *             descripcion: "Pasarela para transacciones comerciales en bolívares en tiempo real."
 *     responses:
 *       200:
 *         description: "Método de pago actualizado de forma satisfactoria (success true, data updateMethod)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_metodo_pago:
 *                       type: integer
 *                       example: 1
 *                     nombre:
 *                       type: string
 *                       example: "Pago Móvil"
 *                     icono:
 *                       type: string
 *                       example: "phone-android"
 *                     descripcion:
 *                       type: string
 *                       example: "Transferencias interbancarias inmediatas usando número de teléfono y cédula."
 *                     estado:
 *                       type: boolean
 *                       example: true
 *             example:
 *               success: true
 *               data:
 *                 id_metodo_pago: 1
 *                 nombre: "Pago Móvil"
 *                 icono: "phone-android"
 *                 descripcion: "Transferencias interbancarias inmediatas usando número de teléfono y cédula."
 *                 estado: true
 *       400:
 *         description: El ID del método de pago no es válido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Método de pago no encontrado
 */
router.put('/:id', authenticateJWT, updatePaymentMethod);

/**
 * @openapi
 * /api/payment-methods/{id}:
 *   delete:
 *     summary: Elimina permanentemente un método de pago del catálogo comercial
 *     tags: [Métodos de Pago]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del método de pago a eliminar
 *     responses:
 *       200:
 *         description: "Método de pago removido de la base de datos (success true, data isDeleted)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_metodo_pago:
 *                       type: integer
 *                       example: 1
 *                     nombre:
 *                       type: string
 *                       example: "Pago Móvil"
 *                     icono:
 *                       type: string
 *                       example: "phone-android"
 *                     descripcion:
 *                       type: string
 *                       example: "Transferencias interbancarias inmediatas usando número de teléfono y cédula."
 *                     estado:
 *                       type: boolean
 *                       example: false
 *             example:
 *               success: true
 *               data:
 *                 id_metodo_pago: 1
 *                 nombre: "Pago Móvil"
 *                 icono: "phone-android"
 *                 descripcion: "Transferencias interbancarias inmediatas usando número de teléfono y cédula."
 *                 estado: false
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Método de pago no encontrado
 */
router.delete('/:id', authenticateJWT, deletePaymentMethod);

export default router;