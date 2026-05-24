import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.handler.js';
import {
    getCompanyMemberships,
    getCompanyMembershipById,
    getCompanyMembershipsByCompany,
    createCompanyMembership,
    updateCompanyMembership,
    deleteCompanyMembership
} from '../controllers/companyMemberships.controller.js';

const router = Router();

/**
 * @openapi
 * /api/company-memberships:
 *   get:
 *     summary: Obtiene la lista global de contratos de membresía asignados a empresas
 *     tags: [Membresías de Empresas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Historial global de membresías empresariales recuperado con éxito (success true, data records)"
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
 *                       id_empresa_membresia:
 *                         type: integer
 *                         example: 3
 *                       id_empresa:
 *                         type: integer
 *                         example: 3
 *                       id_membresia:
 *                         type: integer
 *                         example: 3
 *                       fecha_inicio:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-05-23T04:00:00.000Z"
 *                       fecha_fin:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-06-23T04:00:00.000Z"
 *                       estado_pago:
 *                         type: string
 *                         example: "NO PAGADO"
 *                       estado:
 *                         type: boolean
 *                         example: false
 *                       renovacion_automatica:
 *                         type: boolean
 *                         example: false
 *                       fecha_registro:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-05-24T22:57:18.076Z"
 *             example:
 *               success: true
 *               data:
 *                 - id_empresa_membresia: 3
 *                   id_empresa: 3
 *                   id_membresia: 3
 *                   fecha_inicio: "2026-05-23T04:00:00.000Z"
 *                   fecha_fin: "2026-06-23T04:00:00.000Z"
 *                   estado_pago: "NO PAGADO"
 *                   estado: false
 *                   renovacion_automatica: false
 *                   fecha_registro: "2026-05-24T22:57:18.076Z"
 *       401:
 *         description: No autorizado
 */
router.get('/', authenticateJWT, getCompanyMemberships);

/**
 * @openapi
 * /api/company-memberships/{id}:
 *   get:
 *     summary: Obtiene el detalle de la membresía de una empresa por su ID de contrato único
 *     tags: [Membresías de Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del registro de membresía de empresa a consultar
 *     responses:
 *       200:
 *         description: "Detalle del contrato de membresía de la empresa recuperado satisfactoriamente (success true, data record)"
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
 *                     id_empresa_membresia:
 *                       type: integer
 *                       example: 3
 *                     id_empresa:
 *                       type: integer
 *                       example: 3
 *                     id_membresia:
 *                       type: integer
 *                       example: 3
 *                     fecha_inicio:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-23T04:00:00.000Z"
 *                     fecha_fin:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-23T04:00:00.000Z"
 *                     estado_pago:
 *                       type: string
 *                       example: "NO PAGADO"
 *                     estado:
 *                       type: boolean
 *                       example: false
 *                     renovacion_automatica:
 *                       type: boolean
 *                       example: false
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-24T22:57:18.076Z"
 *             example:
 *               success: true
 *               data:
 *                 id_empresa_membresia: 3
 *                 id_empresa: 3
 *                 id_membresia: 3
 *                 fecha_inicio: "2026-05-23T04:00:00.000Z"
 *                 fecha_fin: "2026-06-23T04:00:00.000Z"
 *                 estado_pago: "NO PAGADO"
 *                 estado: false
 *                 renovacion_automatica: false
 *                 fecha_registro: "2026-05-24T22:57:18.076Z"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Registro de membresía empresarial no encontrado
 */
router.get('/:id', authenticateJWT, getCompanyMembershipById);

/**
 * @openapi
 * /api/company-memberships/company/{id_empresa}:
 *   get:
 *     summary: Lista todas las membresías adquiridas (activas e históricas) por una empresa específica
 *     tags: [Membresías de Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_empresa
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la empresa para consultar sus membresías
 *     responses:
 *       200:
 *         description: "Colección de membresías vinculadas a la empresa obtenida con éxito (success true, data records)"
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
 *                       id_empresa_membresia:
 *                         type: integer
 *                         example: 3
 *                       id_empresa:
 *                         type: integer
 *                         example: 3
 *                       id_membresia:
 *                         type: integer
 *                         example: 3
 *                       fecha_inicio:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-05-23T04:00:00.000Z"
 *                       fecha_fin:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-06-23T04:00:00.000Z"
 *                       estado_pago:
 *                         type: string
 *                         example: "NO PAGADO"
 *                       estado:
 *                         type: boolean
 *                         example: false
 *                       renovacion_automatica:
 *                         type: boolean
 *                         example: false
 *                       fecha_registro:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-05-24T22:57:18.076Z"
 *             example:
 *               success: true
 *               data:
 *                 - id_empresa_membresia: 3
 *                   id_empresa: 3
 *                   id_membresia: 3
 *                   fecha_inicio: "2026-05-23T04:00:00.000Z"
 *                   fecha_fin: "2026-06-23T04:00:00.000Z"
 *                   estado_pago: "NO PAGADO"
 *                   estado: false
 *                   renovacion_automatica: false
 *                   fecha_registro: "2026-05-24T22:57:18.076Z"
 *       401:
 *         description: No autorizado
 */
router.get('/company/:id_empresa', authenticateJWT, getCompanyMembershipsByCompany);

/**
 * @openapi
 * /api/company-memberships:
 *   post:
 *     summary: Asigna un plan de membresía a una empresa estableciendo vigencia y estado de pago
 *     tags: [Membresías de Empresas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_empresa
 *               - id_membresia
 *               - fecha_inicio
 *               - fecha_fin
 *               - estado_pago
 *             properties:
 *               id_empresa:
 *                 type: string
 *                 example: "3"
 *               id_membresia:
 *                 type: string
 *                 example: "3"
 *               fecha_inicio:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-05-23T00:00:00.000Z"
 *               fecha_fin:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-23T23:59:59.000Z"
 *               estado_pago:
 *                 type: string
 *                 description: "Estado de la transacción financiera (ej. PENDIENTE, PAGADO, RECHAZADO)"
 *                 example: "PAGADO"
 *               estado:
 *                 type: boolean
 *                 example: true
 *               renovacion_automatica:
 *                 type: boolean
 *                 example: true
 *           example:
 *             id_empresa: "3"
 *             id_membresia: "3"
 *             fecha_inicio: "2026-05-23T00:00:00.000Z"
 *             fecha_fin: "2026-06-23T23:59:59.000Z"
 *             estado_pago: "PAGADO"
 *             estado: true
 *             renovacion_automatica: true
 *     responses:
 *       201:
 *         description: "Contrato de membresía registrado y vinculado correctamente a la empresa (success true, data newRecord)"
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
 *                     id_empresa_membresia:
 *                       type: integer
 *                       example: 3
 *                     id_empresa:
 *                       type: integer
 *                       example: 3
 *                     id_membresia:
 *                       type: integer
 *                       example: 3
 *                     fecha_inicio:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-23T04:00:00.000Z"
 *                     fecha_fin:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-23T04:00:00.000Z"
 *                     estado_pago:
 *                       type: string
 *                       example: "PAGADO"
 *                     estado:
 *                       type: boolean
 *                       example: true
 *                     renovacion_automatica:
 *                       type: boolean
 *                       example: true
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-24T22:57:18.076Z"
 *             example:
 *               success: true
 *               data:
 *                 id_empresa_membresia: 3
 *                 id_empresa: 3
 *                 id_membresia: 3
 *                 fecha_inicio: "2026-05-23T04:00:00.000Z"
 *                 fecha_fin: "2026-06-23T04:00:00.000Z"
 *                 estado_pago: "PAGADO"
 *                 estado: true
 *                 renovacion_automatica: true
 *                 fecha_registro: "2026-05-24T22:57:18.076Z"
 *       400:
 *         description: "Faltan parámetros obligatorios estructurales (id_empresa, id_membresia, fecha_inicio, fecha_fin, estado_pago)"
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
 *                   example: "Faltan parámetros obligatorios estructurales (id_empresa, id_membresia, fecha_inicio, fecha_fin, estado_pago)"
 *             example:
 *               success: false
 *               message: "Faltan parámetros obligatorios estructurales (id_empresa, id_membresia, fecha_inicio, fecha_fin, estado_pago)"
 *       401:
 *         description: No autorizado
 */
router.post('/', authenticateJWT, createCompanyMembership);

/**
 * @openapi
 * /api/company-memberships/{id}:
 *   put:
 *     summary: Actualiza parcialmente las fechas, estado de pago o condiciones de renovación de la membresía de una empresa
 *     tags: [Membresías de Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del registro de membresía de empresa a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_membresia:
 *                 type: string
 *                 example: "3"
 *               fecha_inicio:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-05-23T00:00:00.000Z"
 *               fecha_fin:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-23T23:59:59.000Z"
 *               estado_pago:
 *                 type: string
 *                 example: "PAGADO"
 *               estado:
 *                 type: boolean
 *                 example: true
 *               renovacion_automatica:
 *                 type: boolean
 *                 example: true
 *           example:
 *             id_membresia: "3"
 *             fecha_inicio: "2026-05-23T00:00:00.000Z"
 *             fecha_fin: "2026-06-23T23:59:59.000Z"
 *             estado_pago: "PAGADO"
 *             estado: true
 *             renovacion_automatica: true
 *     responses:
 *       200:
 *         description: "Asignación de membresía modificada y actualizada con éxito (success true, data updatedRecord)"
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
 *                     id_empresa_membresia:
 *                       type: integer
 *                       example: 3
 *                     id_empresa:
 *                       type: integer
 *                       example: 3
 *                     id_membresia:
 *                       type: integer
 *                       example: 3
 *                     fecha_inicio:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-23T04:00:00.000Z"
 *                     fecha_fin:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-23T04:00:00.000Z"
 *                     estado_pago:
 *                       type: string
 *                       example: "PAGADO"
 *                     estado:
 *                       type: boolean
 *                       example: true
 *                     renovacion_automatica:
 *                       type: boolean
 *                       example: true
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-24T22:57:18.076Z"
 *             example:
 *               success: true
 *               data:
 *                 id_empresa_membresia: 3
 *                 id_empresa: 3
 *                 id_membresia: 3
 *                 fecha_inicio: "2026-05-23T04:00:00.000Z"
 *                 fecha_fin: "2026-06-23T04:00:00.000Z"
 *                 estado_pago: "PAGADO"
 *                 estado: true
 *                 renovacion_automatica: true
 *                 fecha_registro: "2026-05-24T22:57:18.076Z"
 *       400:
 *         description: "Cuerpo de solicitud vacío o identificador de ruta con formato erróneo"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: No se encontró el registro para procesar la actualización
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
 *                   example: "No se encontró el registro para procesar la actualización"
 *             example:
 *               success: false
 *               message: "No se encontró el registro para procesar la actualización"
 */
router.put('/:id', authenticateJWT, updateCompanyMembership);

/**
 * @openapi
 * /api/company-memberships/{id}:
 *   delete:
 *     summary: Inactiva de manera lógica el contrato de membresía de una empresa (estado = false)
 *     tags: [Membresías de Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del registro de membresía de empresa a desactivar
 *     responses:
 *       200:
 *         description: "Membresía empresarial dada de baja lógica de manera exitosa (success true, data deactivatedRecord)"
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
 *                     id_empresa_membresia:
 *                       type: integer
 *                       example: 3
 *                     id_empresa:
 *                       type: integer
 *                       example: 3
 *                     id_membresia:
 *                       type: integer
 *                       example: 3
 *                     fecha_inicio:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-23T04:00:00.000Z"
 *                     fecha_fin:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-23T04:00:00.000Z"
 *                     estado_pago:
 *                       type: string
 *                       example: "NO PAGADO"
 *                     estado:
 *                       type: boolean
 *                       example: false
 *                     renovacion_automatica:
 *                       type: boolean
 *                       example: false
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-24T22:57:18.076Z"
 *             example:
 *               success: true
 *               data:
 *                 id_empresa_membresia: 3
 *                 id_empresa: 3
 *                 id_membresia: 3
 *                 fecha_inicio: "2026-05-23T04:00:00.000Z"
 *                 fecha_fin: "2026-06-23T04:00:00.000Z"
 *                 estado_pago: "NO PAGADO"
 *                 estado: false
 *                 renovacion_automatica: false
 *                 fecha_registro: "2026-05-24T22:57:18.076Z"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: El registro no existe o ya se encuentra inactivo
 */
router.delete('/:id', authenticateJWT, deleteCompanyMembership);

export default router;