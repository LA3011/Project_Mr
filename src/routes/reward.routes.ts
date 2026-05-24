import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.handler.js';
import { 
  getRewards, 
  getRewardById, 
  getRewardsByUser,
  createReward, 
  updateReward, 
  deleteReward 
} from '../controllers/reward.controller.js';

const router = Router();

/**
 * @openapi
 * /api/rewards:
 *   get:
 *     summary: Obtiene el listado histórico de todas las recompensas asignadas
 *     tags: [Recompensas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Lista de recompensas del sistema obtenida con éxito (success true, data rewards)"
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
 *                       id_recompensa:
 *                         type: integer
 *                         example: 3
 *                       id_usuario:
 *                         type: integer
 *                         example: 1
 *                       titulo:
 *                         type: string
 *                         example: "Bienvenida"
 *                       descripcion:
 *                         type: string
 *                         example: "Descuento del 15% aplicable en su primera compra de cualquier sucursal."
 *                       tipo:
 *                         type: string
 *                         example: "Aumento"
 *                       fecha_generada:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-05-24T15:21:19.839Z"
 *                       estado:
 *                         type: boolean
 *                         example: false
 *             example:
 *               success: true
 *               data:
 *                 - id_recompensa: 3
 *                   id_usuario: 1
 *                   titulo: "Bienvenida"
 *                   descripcion: "Descuento del 15% aplicable en su primera compra de cualquier sucursal."
 *                   tipo: "Aumento"
 *                   fecha_generada: "2026-05-24T15:21:19.839Z"
 *                   estado: false
 *                 - id_recompensa: 2
 *                   id_usuario: 1
 *                   titulo: "Bienvenida"
 *                   descripcion: "Descuento del 15% aplicable en su primera compra de cualquier sucursal."
 *                   tipo: "Aumento"
 *                   fecha_generada: "2026-05-24T15:15:50.542Z"
 *                   estado: false
 *       401:
 *         description: No autorizado
 */
router.get('/', authenticateJWT, getRewards);

/**
 * @openapi
 * /api/rewards/{id}:
 *   get:
 *     summary: Obtiene los detalles de una recompensa por su identificador único
 *     tags: [Recompensas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la recompensa a consultar
 *     responses:
 *       200:
 *         description: "Detalle de la recompensa recuperado satisfactoriamente (success true, data reward)"
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
 *                     id_recompensa:
 *                       type: integer
 *                       example: 2
 *                     id_usuario:
 *                       type: integer
 *                       example: 1
 *                     titulo:
 *                       type: string
 *                       example: "Bienvenida"
 *                     descripcion:
 *                       type: string
 *                       example: "Descuento del 15% aplicable en su primera compra de cualquier sucursal."
 *                     tipo:
 *                       type: string
 *                       example: "Aumento"
 *                     fecha_generada:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-24T15:15:50.542Z"
 *                     estado:
 *                       type: boolean
 *                       example: false
 *             example:
 *               success: true
 *               data:
 *                 id_recompensa: 2
 *                 id_usuario: 1
 *                 titulo: "Bienvenida"
 *                 descripcion: "Descuento del 15% aplicable en su primera compra de cualquier sucursal."
 *                 tipo: "Aumento"
 *                 fecha_generada: "2026-05-24T15:15:50.542Z"
 *                 estado: false
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Recompensa no encontrada
 */
router.get('/:id', authenticateJWT, getRewardById);

/**
 * @openapi
 * /api/rewards/user/{id_usuario}:
 *   get:
 *     summary: Obtiene todas las recompensas asignadas a un usuario en particular
 *     tags: [Recompensas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario para consultar sus recompensas
 *     responses:
 *       200:
 *         description: "Colección de recompensas asignadas al usuario recuperada (success true, data rewards)"
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
 *                       id_recompensa:
 *                         type: integer
 *                         example: 3
 *                       id_usuario:
 *                         type: integer
 *                         example: 1
 *                       titulo:
 *                         type: string
 *                         example: "Bienvenida"
 *                       descripcion:
 *                         type: string
 *                         example: "Descuento del 15% aplicable en su primera compra de cualquier sucursal."
 *                       tipo:
 *                         type: string
 *                         example: "Aumento"
 *                       fecha_generada:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-05-24T15:21:19.839Z"
 *                       estado:
 *                         type: boolean
 *                         example: false
 *             example:
 *               success: true
 *               data:
 *                 - id_recompensa: 3
 *                   id_usuario: 1
 *                   titulo: "Bienvenida"
 *                   descripcion: "Descuento del 15% aplicable en su primera compra de cualquier sucursal."
 *                   tipo: "Aumento"
 *                   fecha_generada: "2026-05-24T15:21:19.839Z"
 *                   estado: false
 *                 - id_recompensa: 2
 *                   id_usuario: 1
 *                   titulo: "Bienvenida"
 *                   descripcion: "Descuento del 15% aplicable en su primera compra de cualquier sucursal."
 *                   tipo: "Aumento"
 *                   fecha_generada: "2026-05-24T15:15:50.542Z"
 *                   estado: false
 *       401:
 *         description: No autorizado
 */
router.get('/user/:id_usuario', authenticateJWT, getRewardsByUser);

/**
 * @openapi
 * /api/rewards:
 *   post:
 *     summary: Genera y adjudica una nueva recompensa a un usuario
 *     tags: [Recompensas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_usuario
 *               - titulo
 *               - tipo
 *             properties:
 *               id_usuario:
 *                 type: string
 *                 example: "1"
 *               titulo:
 *                 type: string
 *                 example: "Bono de Bienvenida"
 *               descripcion:
 *                 type: string
 *                 example: "Descuento del 15% aplicable en su primera compra de cualquier sucursal."
 *               tipo:
 *                 type: string
 *                 description: "Categoría de la recompensa (ej. Cashback, Descuento, Regalo)"
 *                 example: "Descuento"
 *               estado:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: "Recompensa generada y guardada correctamente (success true, data newReward)"
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
 *                     id_recompensa:
 *                       type: integer
 *                       example: 1
 *                     id_usuario:
 *                       type: integer
 *                       example: 1
 *                     titulo:
 *                       type: string
 *                       example: "Bono de Bienvenida"
 *                     descripcion:
 *                       type: string
 *                       example: "Descuento del 15% aplicable en su primera compra de cualquier sucursal."
 *                     tipo:
 *                       type: string
 *                       example: "Descuento"
 *                     fecha_generada:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       example: 
 *                     estado:
 *                       type: boolean
 *                       example: true
 *             example:
 *               success: true
 *               data:
 *                 id_recompensa: 1
 *                 id_usuario: 1
 *                 titulo: "Bono de Bienvenida"
 *                 descripcion: "Descuento del 15% aplicable en su primera compra de cualquier sucursal."
 *                 tipo: "Descuento"
 *                 fecha_generada: 2026-05-24T15:15:50.542Z
 *                 estado: true
 *       400:
 *         description: "Faltan campos obligatorios para emitir la recompensa (id_recompensa, id_usuario, titulo, tipo)"
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
 *                   example: "Faltan campos obligatorios para emitir la recompensa (id_usuario, titulo, tipo, descripcion)"
 *             example:
 *               success: false
 *               message: "Faltan campos obligatorios para emitir la recompensa (id_usuario, titulo, tipo, descripcion)"
 *       401:
 *         description: No autorizado
 */
router.post('/', authenticateJWT, createReward);

/**
 * @openapi
 * /api/rewards/{id}:
 *   put:
 *     summary: Realiza cambios parciales a los metadatos o estado de una recompensa
 *     tags: [Recompensas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la recompensa a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario:
 *                 type: integer
 *                 example: 1
 *               titulo:
 *                 type: string
 *                 example: "Bienvenida"
 *               descripcion:
 *                 type: string
 *                 example: "Descuento del 15% aplicable en su primera compra de cualquier sucursal."
 *               tipo:
 *                 type: string
 *                 example: "Aumento"
 *               estado:
 *                 type: boolean
 *                 description: "Permite cambiar la validez o vigencia de la recompensa"
 *                 example: false
 *           example:
 *             id_usuario: 1
 *             titulo: "Bienvenida"
 *             descripcion: "Descuento del 15% aplicable en su primera compra de cualquier sucursal."
 *             tipo: "Aumento"
 *             estado: false
 *     responses:
 *       200:
 *         description: "Información de la recompensa actualizada con éxito (success true, data updatedReward)"
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
 *                     id_recompensa:
 *                       type: integer
 *                       example: 2
 *                     id_usuario:
 *                       type: integer
 *                       example: 1
 *                     titulo:
 *                       type: string
 *                       example: "Bienvenida"
 *                     descripcion:
 *                       type: string
 *                       example: "Descuento del 15% aplicable en su primera compra de cualquier sucursal."
 *                     tipo:
 *                       type: string
 *                       example: "Aumento"
 *                     fecha_generada:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-24T15:15:50.542Z"
 *                     estado:
 *                       type: boolean
 *                       example: false
 *             example:
 *               success: true
 *               data:
 *                 id_recompensa: 2
 *                 id_usuario: 1
 *                 titulo: "Bienvenida"
 *                 descripcion: "Descuento del 15% aplicable en su primera compra de cualquier sucursal."
 *                 tipo: "Aumento"
 *                 fecha_generada: "2026-05-24T15:15:50.542Z"
 *                 estado: false
 *       400:
 *         description: "El ID de recompensa especificado en la ruta no es válido"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Recompensa no encontrada para actualizar (success false)
 */
router.put('/:id', authenticateJWT, updateReward);

/**
 * @openapi
 * /api/rewards/{id}:
 *   delete:
 *     summary: Inactiva lógicamente una recompensa (estado = false)
 *     tags: [Recompensas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la recompensa a desactivar
 *     responses:
 *       200:
 *         description: "Recompensa dada de baja de manera lógica en el sistema (success true, data deletedReward)"
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
 *                     id_recompensa:
 *                       type: integer
 *                       example: 2
 *                     id_usuario:
 *                       type: integer
 *                       example: 1
 *                     titulo:
 *                       type: string
 *                       example: "Bienvenida"
 *                     descripcion:
 *                       type: string
 *                       example: "Descuento del 15% aplicable en su primera compra de cualquier sucursal."
 *                     tipo:
 *                       type: string
 *                       example: "Aumento"
 *                     fecha_generada:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-24T15:15:50.542Z"
 *                     estado:
 *                       type: boolean
 *                       example: false
 *             example:
 *               success: true
 *               data:
 *                 id_recompensa: 2
 *                 id_usuario: 1
 *                 titulo: "Bienvenida"
 *                 descripcion: "Descuento del 15% aplicable en su primera compra de cualquier sucursal."
 *                 tipo: "Aumento"
 *                 fecha_generada: "2026-05-24T15:15:50.542Z"
 *                 estado: false
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Recompensa no encontrada o previamente inactivada
 */
router.delete('/:id', authenticateJWT, deleteReward);

export default router;