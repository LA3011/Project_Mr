import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.handler.js';
import {
    getAssignments,
    getAssignmentById,
    getAssignmentsByCompany,
    getAssignmentsByAdmin,
    createAssignment,
    updateAssignment,
    deleteAssignment
} from '../controllers/companyAdministrator.controller.js';

const router = Router();

/**
 * @openapi
 * /api/company-administrators:
 *   get:
 *     summary: Obtiene la lista de todas las asignaciones activas de administradores a empresas
 *     tags: [Administradores de Empresas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Lista de asignaciones recuperada con éxito (success true, data assignments)"
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
 *                       id_administrador_empresa:
 *                         type: integer
 *                         example: 1
 *                       id_administrador:
 *                         type: integer
 *                         example: 2
 *                       id_empresa:
 *                         type: integer
 *                         example: 3
 *                       fecha_asignacion:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-05-23T22:00:00.000Z"
 *                       estado:
 *                         type: boolean
 *                         example: true
 *             example:
 *               success: true
 *               data:
 *                 - id_administrador_empresa: 1
 *                   id_administrador: 2
 *                   id_empresa: 3
 *                   fecha_asignacion: "2026-05-23T22:00:00.000Z"
 *                   estado: true
 *       401:
 *         description: No autorizado
 */
router.get('/', authenticateJWT, getAssignments);

/**
 * @openapi
 * /api/company-administrators/{id}:
 *   get:
 *     summary: Obtiene los detalles de una asignación específica por su ID único
 *     tags: [Administradores de Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la asignación de administrador de empresa a consultar
 *     responses:
 *       200:
 *         description: "Asignación localizada y devuelta con éxito (success true, data assignment)"
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
 *                     id_administrador_empresa:
 *                       type: integer
 *                       example: 1
 *                     id_administrador:
 *                       type: integer
 *                       example: 2
 *                     id_empresa:
 *                       type: integer
 *                       example: 3
 *                     fecha_asignacion:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-23T22:00:00.000Z"
 *                     estado:
 *                       type: boolean
 *                       example: true
 *             example:
 *               success: true
 *               data:
 *                 id_administrador_empresa: 1
 *                 id_administrador: 2
 *                 id_empresa: 3
 *                 fecha_asignacion: "2026-05-23T22:00:00.000Z"
 *                 estado: true
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Asignación de administrador no encontrada
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
 *                   example: "Asignación de administrador no encontrada"
 *             example:
 *               success: false
 *               message: "Asignación de administrador no encontrada"
 */
router.get('/:id', authenticateJWT, getAssignmentById);

/**
 * @openapi
 * /api/company-administrators/company/{id_empresa}:
 *   get:
 *     summary: Lista todos los administradores activos asignados a una empresa en particular
 *     tags: [Administradores de Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_empresa
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la empresa para consultar sus administradores asignados
 *     responses:
 *       200:
 *         description: "Administradores de la empresa recuperados de forma satisfactoria (success true, data assignments)"
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
 *                       id_administrador_empresa:
 *                         type: integer
 *                         example: 1
 *                       id_administrador:
 *                         type: integer
 *                         example: 2
 *                       id_empresa:
 *                         type: integer
 *                         example: 3
 *                       fecha_asignacion:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-05-23T22:00:00.000Z"
 *                       estado:
 *                         type: boolean
 *                         example: true
 *             example:
 *               success: true
 *               data:
 *                 - id_administrador_empresa: 1
 *                   id_administrador: 2
 *                   id_empresa: 3
 *                   fecha_asignacion: "2026-05-23T22:00:00.000Z"
 *                   estado: true
 *       401:
 *         description: No autorizado
 */
router.get('/company/:id_empresa', authenticateJWT, getAssignmentsByCompany);

/**
 * @openapi
 * /api/company-administrators/administrator/{id_administrador}:
 *   get:
 *     summary: Lista todas las empresas asignadas a un administrador específico
 *     tags: [Administradores de Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_administrador
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del administrador para consultar sus empresas asignadas
 *     responses:
 *       200:
 *         description: "Empresas vinculadas al administrador recuperadas de forma satisfactoria (success true, data assignments)"
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
 *                       id_administrador_empresa:
 *                         type: integer
 *                         example: 1
 *                       id_administrador:
 *                         type: integer
 *                         example: 2
 *                       id_empresa:
 *                         type: integer
 *                         example: 3
 *                       fecha_asignacion:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-05-23T22:00:00.000Z"
 *                       estado:
 *                         type: boolean
 *                         example: true
 *             example:
 *               success: true
 *               data:
 *                 - id_administrador_empresa: 1
 *                   id_administrador: 2
 *                   id_empresa: 3
 *                   fecha_asignacion: "2026-05-23T22:00:00.000Z"
 *                   estado: true
 *       401:
 *         description: No autorizado
 */
router.get('/administrator/:id_administrador', authenticateJWT, getAssignmentsByAdmin);

/**
 * @openapi
 * /api/company-administrators:
 *   post:
 *     summary: Vincula un administrador a una empresa corporativa
 *     tags: [Administradores de Empresas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_administrador
 *               - id_empresa
 *             properties:
 *               id_administrador:
 *                 type: string
 *                 example: "2"
 *               id_empresa:
 *                 type: string
 *                 example: "3"
 *               fecha_asignacion:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-05-23T18:00:00.000Z"
 *               estado:
 *                 type: boolean
 *                 example: true
 *           example:
 *             id_administrador: "2"
 *             id_empresa: "3"
 *             fecha_asignacion: "2026-05-23T18:00:00.000Z"
 *             estado: true
 *     responses:
 *       201:
 *         description: "Asignación creada y guardada exitosamente (success true, data newAssignment)"
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
 *                     id_administrador_empresa:
 *                       type: integer
 *                       example: 1
 *                     id_administrador:
 *                       type: integer
 *                       example: 2
 *                     id_empresa:
 *                       type: integer
 *                       example: 3
 *                     fecha_asignacion:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-23T22:00:00.000Z"
 *                     estado:
 *                       type: boolean
 *                       example: true
 *             example:
 *               success: true
 *               data:
 *                 id_administrador_empresa: 1
 *                 id_administrador: 2
 *                 id_empresa: 3
 *                 fecha_asignacion: "2026-05-23T22:00:00.000Z"
 *                 estado: true
 *       400:
 *         description: "Faltan parámetros obligatorios de vinculación (id_administrador, id_empresa)"
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
 *                   example: "Faltan parámetros obligatorios de vinculación (id_administrador, id_empresa)"
 *             example:
 *               success: false
 *               message: "Faltan parámetros obligatorios de vinculación (id_administrador, id_empresa)"
 *       401:
 *         description: No autorizado
 */
router.post('/', authenticateJWT, createAssignment);

/**
 * @openapi
 * /api/company-administrators/{id}:
 *   put:
 *     summary: Modifica las propiedades o el estado de una asignación existente
 *     tags: [Administradores de Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la asignación de administrador de empresa a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_administrador:
 *                 type: string
 *                 example: "2"
 *               id_empresa:
 *                 type: string
 *                 example: "3"
 *               fecha_asignacion:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-05-23T18:00:00.000Z"
 *               estado:
 *                 type: boolean
 *                 example: true
 *           example:
 *             id_administrador: "2"
 *             id_empresa: "3"
 *             fecha_asignacion: "2026-05-23T18:00:00.000Z"
 *             estado: true
 *     responses:
 *       200:
 *         description: "Asignación actualizada correctamente (success true, data updatedAssignment)"
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
 *                     id_administrador_empresa:
 *                       type: integer
 *                       example: 1
 *                     id_administrador:
 *                       type: integer
 *                       example: 2
 *                     id_empresa:
 *                       type: integer
 *                       example: 3
 *                     fecha_asignacion:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-23T22:00:00.000Z"
 *                     estado:
 *                       type: boolean
 *                       example: true
 *             example:
 *               success: true
 *               data:
 *                 id_administrador_empresa: 1
 *                 id_administrador: 2
 *                 id_empresa: 3
 *                 fecha_asignacion: "2026-05-23T22:00:00.000Z"
 *                 estado: true
 *       400:
 *         description: "Cuerpo de solicitud vacío o identificador de ruta con formato erróneo"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: No se encontró la asignación solicitada para actualizar
 */
router.put('/:id', authenticateJWT, updateAssignment);

/**
 * @openapi
 * /api/company-administrators/{id}:
 *   delete:
 *     summary: Da de baja lógicamente a un administrador de una empresa (desactivación)
 *     tags: [Administradores de Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la asignación de administrador de empresa a desactivar
 *     responses:
 *       200:
 *         description: "Administrador desactivado de la empresa con éxito (success: true)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *             example:
 *               success: true
 *       400:
 *         description: "El ID provisto no cumple con los requisitos para procesar la baja"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: La asignación de administrador especificada no existe o ya fue dada de baja
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
 *                   example: "La asignación de administrador especificada no existe o ya fue dada de baja"
 *             example:
 *               success: false
 *               message: "La asignación de administrador especificada no existe o ya fue dada de baja"
 */
router.delete('/:id', authenticateJWT, deleteAssignment);

export default router;