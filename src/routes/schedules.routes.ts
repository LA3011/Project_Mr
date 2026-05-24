import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.handler.js';
import { 
  getSchedules, 
  getScheduleById, 
  getSchedulesByBranch,
  createSchedule, 
  updateSchedule, 
  deleteSchedule 
} from '../controllers/schedules.controller.js';

const router = Router();

/**
 * @openapi
 * /api/schedules:
 *   get:
 *     summary: Obtiene la lista global de todos los horarios operativos registrados
 *     tags: [Horarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Listado de horarios globales (success true, data schedules)"
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
 *                       id_horario:
 *                         type: integer
 *                         example: 2
 *                       id_sucursal:
 *                         type: integer
 *                         example: 3
 *                       dia_semana:
 *                         type: string
 *                         example: "Lunes"
 *                       hora_apertura:
 *                         type: string
 *                         example: "09:00:00"
 *                       hora_cierre:
 *                         type: string
 *                         example: "14:30:00"
 *                       abierto:
 *                         type: boolean
 *                         example: true
 *             example:
 *               success: true
 *               data:
 *                 - id_horario: 2
 *                   id_sucursal: 3
 *                   dia_semana: "Lunes"
 *                   hora_apertura: "09:00:00"
 *                   hora_cierre: "14:30:00"
 *                   abierto: true
 *       401:
 *         description: No autorizado
 */
router.get('/', authenticateJWT, getSchedules);

/**
 * @openapi
 * /api/schedules/{id}:
 *   get:
 *     summary: Obtiene el detalle de un bloque de horario por su ID único
 *     tags: [Horarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del horario a consultar
 *     responses:
 *       200:
 *         description: "Datos del horario obtenidos con éxito (success true, data schedule)"
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
 *                     id_horario:
 *                       type: integer
 *                       example: 2
 *                     id_sucursal:
 *                       type: integer
 *                       example: 3
 *                     dia_semana:
 *                       type: string
 *                       example: "Lunes"
 *                     hora_apertura:
 *                       type: string
 *                       example: "09:00:00"
 *                     hora_cierre:
 *                       type: string
 *                       example: "14:30:00"
 *                     abierto:
 *                       type: boolean
 *                       example: true
 *             example:
 *               success: true
 *               data:
 *                 id_horario: 2
 *                 id_sucursal: 3
 *                 dia_semana: "Lunes"
 *                 hora_apertura: "09:00:00"
 *                 hora_cierre: "14:30:00"
 *                 abierto: true
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Horario no encontrado
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
 *                   example: "Horario no encontrado"
 *             example:
 *               success: false
 *               message: "Horario no encontrado"
 */
router.get('/:id', authenticateJWT, getScheduleById);

/**
 * @openapi
 * /api/schedules/branch/{id_sucursal}:
 *   get:
 *     summary: Recupera el cronograma de apertura y cierre asignado a una sucursal específica
 *     tags: [Horarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_sucursal
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la sucursal para consultar sus horarios
 *     responses:
 *       200:
 *         description: "Agenda semanal de la sucursal recuperada (success true, data schedules)"
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
 *                       id_horario:
 *                         type: integer
 *                         example: 2
 *                       id_sucursal:
 *                         type: integer
 *                         example: 3
 *                       dia_semana:
 *                         type: string
 *                         example: "Lunes"
 *                       hora_apertura:
 *                         type: string
 *                         example: "09:00:00"
 *                       hora_cierre:
 *                         type: string
 *                         example: "14:30:00"
 *                       abierto:
 *                         type: boolean
 *                         example: true
 *             example:
 *               success: true
 *               data:
 *                 - id_horario: 2
 *                   id_sucursal: 3
 *                   dia_semana: "Lunes"
 *                   hora_apertura: "09:00:00"
 *                   hora_cierre: "14:30:00"
 *                   abierto: true
 *       401:
 *         description: No autorizado
 */
router.get('/branch/:id_sucursal', authenticateJWT, getSchedulesByBranch);

/**
 * @openapi
 * /api/schedules:
 *   post:
 *     summary: Registra un nuevo horario de operación diario para una sucursal
 *     tags: [Horarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_sucursal
 *               - dia_semana
 *               - hora_apertura
 *               - hora_cierre
 *             properties:
 *               id_sucursal:
 *                 type: string
 *                 example: "3"
 *               dia_semana:
 *                 type: string
 *                 description: "Día de la semana (ej. Lunes, Martes, etc.)"
 *                 example: "Lunes"
 *               hora_apertura:
 *                 type: string
 *                 example: "08:00:00"
 *               hora_cierre:
 *                 type: string
 *                 example: "17:30:00"
 *               abierto:
 *                 type: boolean
 *                 example: true
 *           example:
 *             id_sucursal: "3"
 *             dia_semana: "Lunes"
 *             hora_apertura: "08:00:00"
 *             hora_cierre: "17:30:00"
 *     responses:
 *       201:
 *         description: "Bloque de horario creado con éxito (success true, data newSchedule)"
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
 *                     id_horario:
 *                       type: integer
 *                       example: 1
 *                     id_sucursal:
 *                       type: integer
 *                       example: 3
 *                     dia_semana:
 *                       type: string
 *                       example: "Lunes"
 *                     hora_apertura:
 *                       type: string
 *                       example: "08:00:00"
 *                     hora_cierre:
 *                       type: string
 *                       example: "17:30:00"
 *                     abierto:
 *                       type: boolean
 *                       example: true
 *             example:
 *               success: true
 *               data:
 *                 id_horario: 1
 *                 id_sucursal: 3
 *                 dia_semana: "Lunes"
 *                 hora_apertura: "08:00:00"
 *                 hora_cierre: "17:30:00"
 *                 abierto: true
 *       400:
 *         description: "Faltan campos obligatorios para emitir el horario sucursal (id_sucursal, dia_semana, hora_apertura, hora_cierre)"
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
 *                   example: "Faltan campos obligatorios para emitir el horario sucursal (id_sucursal, dia_semana, hora_apertura, hora_cierre)"
 *             example:
 *               success: false
 *               message: "Faltan campos obligatorios para emitir el horario sucursal (id_sucursal, dia_semana, hora_apertura, hora_cierre)"
 *       401:
 *         description: No autorizado
 */
router.post('/', authenticateJWT, createSchedule);

/**
 * @openapi
 * /api/schedules/{id}:
 *   put:
 *     summary: Edita de forma parcial el estado o las horas de apertura/cierre de un horario
 *     tags: [Horarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del horario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hora_apertura:
 *                 type: string
 *                 example: "09:00:00"
 *               hora_cierre:
 *                 type: string
 *                 example: "18:00:00"
 *               abierto:
 *                 type: boolean
 *                 description: "Determina si el local abre ese día o está cerrado por feriado/descanso"
 *                 example: false
 *           example:
 *             hora_apertura: "09:00:00"
 *             hora_cierre: "18:00:00"
 *             abierto: false
 *     responses:
 *       200:
 *         description: "Horario actualizado con éxito (success true, data updatedSchedule)"
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
 *                     id_horario:
 *                       type: integer
 *                       example: 1
 *                     id_sucursal:
 *                       type: integer
 *                       example: 3
 *                     dia_semana:
 *                       type: string
 *                       example: "Lunes"
 *                     hora_apertura:
 *                       type: string
 *                       example: "08:00:00"
 *                     hora_cierre:
 *                       type: string
 *                       example: "17:30:00"
 *                     abierto:
 *                       type: boolean
 *                       example: true
 *             example:
 *               success: true
 *               data:
 *                 id_horario: 1
 *                 id_sucursal: 3
 *                 dia_semana: "Lunes"
 *                 hora_apertura: "08:00:00"
 *                 hora_cierre: "17:30:00"
 *                 abierto: true
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Horario no encontrado
 */
router.put('/:id', authenticateJWT, updateSchedule);

/**
 * @openapi
 * /api/schedules/{id}:
 *   delete:
 *     summary: Elimina físicamente un registro de horario de la base de datos
 *     tags: [Horarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del horario a eliminar
 *     responses:
 *       200:
 *         description: "Registro de horario eliminado exitosamente"
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
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Horario no encontrado para eliminar
 */
router.delete('/:id', authenticateJWT, deleteSchedule);

export default router;