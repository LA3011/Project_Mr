import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.handler.js';
import {
  getProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile
} from '../controllers/profile.controller.js';

const router = Router();

/**
 * @openapi
 * /api/profiles:
 *   get:
 *     summary: Obtiene todos los perfiles de acceso ordenados por jerarquía
 *     tags: [Perfiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Lista de perfiles obtenida (success true, data profiles)"
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
 *                       id_perfil:
 *                         type: integer
 *                         example: 4
 *                       nombre:
 *                         type: string
 *                         example: "Supervisor de IT"
 *                       descripcion:
 *                         type: string
 *                         example: "Encargado de gestionar incidencias y moderación intermedia."
 *                       nivel_acceso:
 *                         type: integer
 *                         example: 50
 *                       estado:
 *                         type: boolean
 *                         example: false
 *             example:
 *               success: true
 *               data:
 *                 - id_perfil: 4
 *                   nombre: "Supervisor de IT"
 *                   descripcion: "Encargado de gestionar incidencias y moderación intermedia."
 *                   nivel_acceso: 50
 *                   estado: false
 *       401:
 *         description: No autorizado
 */
router.get('/', authenticateJWT, getProfiles);

/**
 * @openapi
 * /api/profiles/{id}:
 *   get:
 *     summary: Obtiene la información de un perfil específico
 *     tags: [Perfiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del perfil a consultar
 *     responses:
 *       200:
 *         description: "Datos del perfil obtenidos (success true, data profile)"
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
 *                     id_perfil:
 *                       type: integer
 *                       example: 4
 *                     nombre:
 *                       type: string
 *                       example: "Supervisor de IT"
 *                     descripcion:
 *                       type: string
 *                       example: "Encargado de gestionar incidencias y moderación intermedia."
 *                     nivel_acceso:
 *                       type: integer
 *                       example: 50
 *                     estado:
 *                       type: boolean
 *                       example: false
 *             example:
 *               success: true
 *               data:
 *                 id_perfil: 4
 *                 nombre: "Supervisor de IT"
 *                 descripcion: "Encargado de gestionar incidencias y moderación intermedia."
 *                 nivel_acceso: 50
 *                 estado: false
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Perfil no encontrado
 */
router.get('/:id', authenticateJWT, getProfileById);

/**
 * @openapi
 * /api/profiles:
 *   post:
 *     summary: Crea un nuevo rol o perfil de acceso en el sistema
 *     tags: [Perfiles]
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
 *               - descripcion
 *               - nivel_acceso
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Supervisor de Soporte"
 *               descripcion:
 *                 type: string
 *                 example: "Encargado de gestionar incidencias y moderación intermedia."
 *               nivel_acceso:
 *                 type: integer
 *                 example: 50
 *           example:
 *             nombre: "Supervisor de Soporte"
 *             descripcion: "Encargado de gestionar incidencias y moderación intermedia."
 *             nivel_acceso: 50
 *     responses:
 *       201:
 *         description: "Perfil creado exitosamente (success: true, data: newProfile)"
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
 *                     id_perfil:
 *                       type: integer
 *                       example: 2
 *                     nombre:
 *                       type: string
 *                       example: "Supervisor de Soporte"
 *                     descripcion:
 *                       type: string
 *                       example: "Encargado de gestionar incidencias y moderación intermedia."
 *                     nivel_acceso:
 *                       type: integer
 *                       example: 50
 *                     estado:
 *                       type: boolean
 *                       nullable: true
 *                       example: null
 *             example:
 *               success: true
 *               data:
 *                 id_perfil: 2
 *                 nombre: "Supervisor de Soporte"
 *                 descripcion: "Encargado de gestionar incidencias y moderación intermedia."
 *                 nivel_acceso: 50
 *                 estado: true
 *       400:
 *         description: "Faltan campos obligatorios para generar el Perfil (nombre, descripcion, nivel_acceso)"
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
 *                   example: "Faltan campos obligatorios para generar el Perfil (nombre, descripcion, nivel_acceso)"
 *             example:
 *               success: false
 *               message: "Faltan campos obligatorios para generar el Perfil (nombre, descripcion, nivel_acceso)"
 *       401:
 *         description: No autorizado
 */
router.post('/', authenticateJWT, createProfile);

/**
 * @openapi
 * /api/profiles/{id}:
 *   put:
 *     summary: Modifica las propiedades o el nivel de jerarquía de un perfil
 *     tags: [Perfiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del perfil a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Supervisor Senior"
 *               descripcion:
 *                 type: string
 *                 example: "Gestión global de moderadores y auditorías del sistema."
 *               nivel_acceso:
 *                 type: integer
 *                 example: 60
 *           example:
 *             nombre: "Supervisor Senior"
 *             descripcion: "Gestión global de moderadores y auditorías del sistema."
 *             nivel_acceso: 60
 *     responses:
 *       200:
 *         description: "Perfil actualizado exitosamente (success true, data updatedProfile)"
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
 *                     id_perfil:
 *                       type: integer
 *                       example: 4
 *                     nombre:
 *                       type: string
 *                       example: "Supervisor de Soporte"
 *                     descripcion:
 *                       type: string
 *                       example: "Encargado de gestionar incidencias y moderación intermedia."
 *                     nivel_acceso:
 *                       type: integer
 *                       example: 50
 *                     estado:
 *                       type: boolean
 *                       example: true
 *             example:
 *               success: true
 *               data:
 *                 id_perfil: 4
 *                 nombre: "Supervisor de Soporte"
 *                 descripcion: "Encargado de gestionar incidencias y moderación intermedia."
 *                 nivel_acceso: 50
 *                 estado: true
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Perfil no encontrado
 */
router.put('/:id', authenticateJWT, updateProfile);

/**
 * @openapi
 * /api/profiles/{id}:
 *   delete:
 *     summary: Realiza la desactivación lógica de un perfil de usuario
 *     tags: [Perfiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del perfil a desactivar
 *     responses:
 *       200:
 *         description: Perfil desactivado correctamente (success true, data deletedProfile)
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
 *                     id_perfil:
 *                       type: integer
 *                       example: 4
 *                     nombre:
 *                       type: string
 *                       example: "Supervisor de IT"
 *                     descripcion:
 *                       type: string
 *                       example: "Encargado de gestionar incidencias y moderación intermedia."
 *                     nivel_acceso:
 *                       type: integer
 *                       example: 50
 *                     estado:
 *                       type: boolean
 *                       example: false
 *             example:
 *               success: true
 *               data:
 *                 id_perfil: 4
 *                 nombre: "Supervisor de IT"
 *                 descripcion: "Encargado de gestionar incidencias y moderación intermedia."
 *                 nivel_acceso: 50
 *                 estado: false
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Perfil no encontrado
 */
router.delete('/:id', authenticateJWT, deleteProfile);

export default router; 