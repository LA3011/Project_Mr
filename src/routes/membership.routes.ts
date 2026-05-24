import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.handler.js';
import { 
  getMemberships, 
  getMembershipById, 
  createMembership, 
  updateMembership, 
  deleteMembership 
} from '../controllers/membership.controller.js';

const router = Router();

/**
 * @openapi
 * /api/memberships:
 *   get:
 *     summary: Obtiene la lista completa de planes de membresías registrados
 *     tags: [Membresías]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Lista de planes de membresías recuperada exitosamente (success true, data memberships)"
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
 *                       id_membresia:
 *                         type: integer
 *                         example: 3
 *                       nombre:
 *                         type: string
 *                         example: "Plan Corporativo Premium"
 *                       descripcion:
 *                         type: string
 *                         example: "Acceso ilimitado a galerías destacadas y mayor visibilidad en búsquedas globales."
 *                       precio:
 *                         type: string
 *                         example: "149.99"
 *                       fecha_inicio:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-05-23T04:00:00.000Z"
 *                       fecha_final:
 *                         type: string
 *                         format: date-time
 *                         example: "2027-05-23T04:00:00.000Z"
 *                       prioridad_busqueda:
 *                         type: integer
 *                         example: 3
 *                       permite_favoritos:
 *                         type: boolean
 *                         example: true
 *                       permite_destacado:
 *                         type: boolean
 *                         example: true
 *                       permite_galeria:
 *                         type: boolean
 *                         example: true
 *                       permite_promociones:
 *                         type: boolean
 *                         example: true
 *                       cantidad_publicidad:
 *                         type: integer
 *                         example: 10
 *                       estado:
 *                         type: boolean
 *                         example: false
 *                       fecha_creacion:
 *                         type: string
 *                         example: "16:59:19.330351"
 *             example:
 *               success: true
 *               data:
 *                 - id_membresia: 3
 *                   nombre: "Plan Corporativo Premium"
 *                   descripcion: "Acceso ilimitado a galerías destacadas y mayor visibilidad en búsquedas globales."
 *                   precio: "149.99"
 *                   fecha_inicio: "2026-05-23T04:00:00.000Z"
 *                   fecha_final: "2027-05-23T04:00:00.000Z"
 *                   prioridad_busqueda: 3
 *                   permite_favoritos: true
 *                   permite_destacado: true
 *                   permite_galeria: true
 *                   permite_promociones: true
 *                   cantidad_publicidad: 10
 *                   estado: false
 *                   fecha_creacion: "16:59:19.330351"
 *                 - id_membresia: 2
 *                   nombre: "Plan Corporativo Premium"
 *                   descripcion: "Acceso ilimitado a galerías destacadas y mayor visibilidad en búsquedas globales."
 *                   precio: "149.99"
 *                   fecha_inicio: "2026-05-23T04:00:00.000Z"
 *                   fecha_final: "2027-05-23T04:00:00.000Z"
 *                   prioridad_busqueda: 3
 *                   permite_favoritos: true
 *                   permite_destacado: true
 *                   permite_galeria: true
 *                   permite_promociones: true
 *                   cantidad_publicidad: 10
 *                   estado: true
 *                   fecha_creacion: "16:58:53.732893"
 *       401:
 *         description: No autorizado
 */
router.get('/', authenticateJWT, getMemberships);

/**
 * @openapi
 * /api/memberships/{id}:
 *   get:
 *     summary: Recupera el detalle de una membresía por su ID único
 *     tags: [Membresías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la membresía a consultar
 *     responses:
 *       200:
 *         description: "Información detallada de la membresía obtenida correctamente"
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
 *                     id_membresia:
 *                       type: integer
 *                       example: 3
 *                     nombre:
 *                       type: string
 *                       example: "Plan Corporativo Premium"
 *                     descripcion:
 *                       type: string
 *                       example: "Acceso ilimitado a galerías destacadas y mayor visibilidad en búsquedas globales."
 *                     precio:
 *                       type: string
 *                       example: "149.99"
 *                     fecha_inicio:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-23T04:00:00.000Z"
 *                     fecha_final:
 *                       type: string
 *                       format: date-time
 *                       example: "2027-05-23T04:00:00.000Z"
 *                     prioridad_busqueda:
 *                       type: integer
 *                       example: 3
 *                     permite_favoritos:
 *                       type: boolean
 *                       example: true
 *                     permite_destacado:
 *                       type: boolean
 *                       example: true
 *                     permite_galeria:
 *                       type: boolean
 *                       example: true
 *                     permite_promociones:
 *                       type: boolean
 *                       example: true
 *                     cantidad_publicidad:
 *                       type: integer
 *                       example: 10
 *                     estado:
 *                       type: boolean
 *                       example: false
 *                     fecha_creacion:
 *                       type: string
 *                       example: "16:59:19.330351"
 *             example:
 *               success: true
 *               data:
 *                 id_membresia: 3
 *                 nombre: "Plan Corporativo Premium"
 *                 descripcion: "Acceso ilimitado a galerías destacadas y mayor visibilidad en búsquedas globales."
 *                 precio: "149.99"
 *                 fecha_inicio: "2026-05-23T04:00:00.000Z"
 *                 fecha_final: "2027-05-23T04:00:00.000Z"
 *                 prioridad_busqueda: 3
 *                 permite_favoritos: true
 *                 permite_destacado: true
 *                 permite_galeria: true
 *                 permite_promociones: true
 *                 cantidad_publicidad: 10
 *                 estado: false
 *                 fecha_creacion: "16:59:19.330351"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Membresía no encontrada
 */
router.get('/:id', authenticateJWT, getMembershipById);

/**
 * @openapi
 * /api/memberships:
 *   post:
 *     summary: Registra un nuevo plan de membresía comercial con privilegios operativos
 *     tags: [Membresías]
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
 *               - precio
 *               - fecha_inicio
 *               - fecha_final
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Plan Corporativo Premium"
 *               descripcion:
 *                 type: string
 *                 example: "Acceso ilimitado a galerías destacadas y mayor visibilidad en búsquedas globales."
 *               precio:
 *                 type: number
 *                 example: 149.99
 *               fecha_inicio:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-05-23T00:00:00.000Z"
 *               fecha_final:
 *                 type: string
 *                 format: date-time
 *                 example: "2027-05-23T23:59:59.000Z"
 *               prioridad_busqueda:
 *                 type: number
 *                 example: 3
 *               permite_favoritos:
 *                 type: boolean
 *                 example: true
 *               permite_destacado:
 *                 type: boolean
 *                 example: true
 *               permite_galeria:
 *                 type: boolean
 *                 example: true
 *               permite_promociones:
 *                 type: boolean
 *                 example: true
 *               cantidad_publicidad:
 *                 type: number
 *                 example: 10
 *           example:
 *             nombre: "Plan Corporativo Premium"
 *             descripcion: "Acceso ilimitado a galerías destacadas y mayor visibilidad en búsquedas globales."
 *             precio: 149.99
 *             fecha_inicio: "2026-05-23T00:00:00.000Z"
 *             fecha_final: "2027-05-23T23:59:59.000Z"
 *             prioridad_busqueda: 3
 *             permite_favoritos: true
 *             permite_destacado: true
 *             permite_galeria: true
 *             permite_promociones: true
 *             cantidad_publicidad: 10
 *     responses:
 *       201:
 *         description: "Plan de membresía creado y guardado satisfactoriamente (success true, data newMembership)"
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
 *                     id_membresia:
 *                       type: integer
 *                       example: 1
 *                     nombre:
 *                       type: string
 *                       example: "Plan Corporativo Premium"
 *                     descripcion:
 *                       type: string
 *                       example: "Acceso ilimitado a galerías destacadas y mayor visibilidad en búsquedas globales."
 *                     precio:
 *                       type: string
 *                       example: "149.99"
 *                     fecha_inicio:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-23T04:00:00.000Z"
 *                     fecha_final:
 *                       type: string
 *                       format: date-time
 *                       example: "2027-05-23T04:00:00.000Z"
 *                     prioridad_busqueda:
 *                       type: integer
 *                       example: 3
 *                     permite_favoritos:
 *                       type: boolean
 *                       example: true
 *                     permite_destacado:
 *                       type: boolean
 *                       example: true
 *                     permite_galeria:
 *                       type: boolean
 *                       example: true
 *                     permite_promociones:
 *                       type: boolean
 *                       example: true
 *                     cantidad_publicidad:
 *                       type: integer
 *                       example: 10
 *                     estado:
 *                       type: boolean
 *                       example: true
 *                     fecha_creacion:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *             example:
 *               success: true
 *               data:
 *                 id_membresia: 1
 *                 nombre: "Plan Corporativo Premium"
 *                 descripcion: "Acceso ilimitado a galerías destacadas y mayor visibilidad en búsquedas globales."
 *                 precio: "149.99"
 *                 fecha_inicio: "2026-05-23T04:00:00.000Z"
 *                 fecha_final: "2027-05-23T04:00:00.000Z"
 *                 prioridad_busqueda: 3
 *                 permite_favoritos: true
 *                 permite_destacado: true
 *                 permite_galeria: true
 *                 permite_promociones: true
 *                 cantidad_publicidad: 10
 *                 estado: true
 *                 fecha_creacion: null
 *       400:
 *         description: "Faltan campos obligatorios para dar de alta la membresía (nombre, precio, fecha_inicio, fecha_final, descripcion)"
 *       401:
 *         description: No autorizado
 */
router.post('/', authenticateJWT, createMembership);

/**
 * @openapi
 * /api/memberships/{id}:
 *   put:
 *     summary: Edita campos específicos o condiciones comerciales de una membresía activa
 *     tags: [Membresías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la membresía a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Plan Corporativo Premium Plus"
 *               precio:
 *                 type: number
 *                 example: 175.00
 *               cantidad_publicidad:
 *                 type: number
 *                 example: 15
 *               estado:
 *                 type: boolean
 *                 example: true
 *           example:
 *             nombre: "Plan Corporativo Premium Plus"
 *             precio: 175.00
 *             cantidad_publicidad: 15
 *             estado: true
 *     responses:
 *       200:
 *         description: "Membresía modificada y actualizada con éxito (success true, data updatedMembership)"
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
 *                     id_membresia:
 *                       type: integer
 *                       example: 3
 *                     nombre:
 *                       type: string
 *                       example: "Plan Corporativo Premium"
 *                     descripcion:
 *                       type: string
 *                       example: "Acceso ilimitado a galerías destacadas y mayor visibilidad en búsquedas globales."
 *                     precio:
 *                       type: string
 *                       example: "149.99"
 *                     fecha_inicio:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-23T04:00:00.000Z"
 *                     fecha_final:
 *                       type: string
 *                       format: date-time
 *                       example: "2027-05-23T04:00:00.000Z"
 *                     prioridad_busqueda:
 *                       type: integer
 *                       example: 3
 *                     permite_favoritos:
 *                       type: boolean
 *                       example: true
 *                     permite_destacado:
 *                       type: boolean
 *                       example: true
 *                     permite_galeria:
 *                       type: boolean
 *                       example: true
 *                     permite_promociones:
 *                       type: boolean
 *                       example: true
 *                     cantidad_publicidad:
 *                       type: integer
 *                       example: 10
 *                     estado:
 *                       type: boolean
 *                       example: true
 *                     fecha_creacion:
 *                       type: string
 *                       example: "16:59:19.330351"
 *             example:
 *               success: true
 *               data:
 *                 id_membresia: 3
 *                 nombre: "Plan Corporativo Premium"
 *                 descripcion: "Acceso ilimitado a galerías destacadas y mayor visibilidad en búsquedas globales."
 *                 precio: "149.99"
 *                 fecha_inicio: "2026-05-23T04:00:00.000Z"
 *                 fecha_final: "2027-05-23T04:00:00.000Z"
 *                 prioridad_busqueda: 3
 *                 permite_favoritos: true
 *                 permite_destacado: true
 *                 permite_galeria: true
 *                 permite_promociones: true
 *                 cantidad_publicidad: 10
 *                 estado: true
 *                 fecha_creacion: "16:59:19.330351"
 *       400:
 *         description: "Cuerpo de petición de cambio vacío o ID de ruta mal estructurado"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Membresía no encontrada para procesar la actualización
 */
router.put('/:id', authenticateJWT, updateMembership);

/**
 * @openapi
 * /api/memberships/{id}:
 *   delete:
 *     summary: Suspende lógicamente un plan de membresía alterando su estado a false
 *     tags: [Membresías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la membresía a desactivar
 *     responses:
 *       200:
 *         description: "Membresía dada de baja de manera lógica con éxito (success true, data deletedMembership)"
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
 *                     id_membresia:
 *                       type: integer
 *                       example: 3
 *                     nombre:
 *                       type: string
 *                       example: "Plan Corporativo Premium"
 *                     descripcion:
 *                       type: string
 *                       example: "Acceso ilimitado a galerías destacadas y mayor visibilidad en búsquedas globales."
 *                     precio:
 *                       type: string
 *                       example: "149.99"
 *                     fecha_inicio:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-23T04:00:00.000Z"
 *                     fecha_final:
 *                       type: string
 *                       format: date-time
 *                       example: "2027-05-23T04:00:00.000Z"
 *                     prioridad_busqueda:
 *                       type: integer
 *                       example: 3
 *                     permite_favoritos:
 *                       type: boolean
 *                       example: true
 *                     permite_destacado:
 *                       type: boolean
 *                       example: true
 *                     permite_galeria:
 *                       type: boolean
 *                       example: true
 *                     permite_promociones:
 *                       type: boolean
 *                       example: true
 *                     cantidad_publicidad:
 *                       type: integer
 *                       example: 10
 *                     estado:
 *                       type: boolean
 *                       example: false
 *                     fecha_creacion:
 *                       type: string
 *                       example: "16:59:19.330351"
 *             example:
 *               success: true
 *               data:
 *                 id_membresia: 3
 *                 nombre: "Plan Corporativo Premium"
 *                 descripcion: "Acceso ilimitado a galerías destacadas y mayor visibilidad en búsquedas globales."
 *                 precio: "149.99"
 *                 fecha_inicio: "2026-05-23T04:00:00.000Z"
 *                 fecha_final: "2027-05-23T04:00:00.000Z"
 *                 prioridad_busqueda: 3
 *                 permite_favoritos: true
 *                 permite_destacado: true
 *                 permite_galeria: true
 *                 permite_promociones: true
 *                 cantidad_publicidad: 10
 *                 estado: false
 *                 fecha_creacion: "16:59:19.330351"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Membresía no encontrada o ya inactiva dentro del sistema
 */
router.delete('/:id', authenticateJWT, deleteMembership);

export default router;