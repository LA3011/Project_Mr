import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.handler.js';
import { getUsers, getUserById, deleteUser, updateUser } from '../controllers/user.controller.js';

const router = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Obtiene la lista de usuarios
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida (success true, data users)
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
 *                       id_usuario:
 *                         type: integer
 *                         example: 1
 *                       tipo_usuario:
 *                         type: string
 *                         example: "user"
 *                       id_estado:
 *                         type: integer
 *                         example: 4
 *                       id_municipio:
 *                         type: integer
 *                         example: 11
 *                       id_ciudad:
 *                         type: integer
 *                         example: 10
 *                       nombres:
 *                         type: string
 *                         example: "Juan"
 *                       apellidos:
 *                         type: string
 *                         example: "Pérez"
 *                       correo:
 *                         type: string
 *                         example: "juan.perez@aki.com"
 *                       password_hash:
 *                         type: string
 *                         example: "<password_hash>"
 *                       telefono:
 *                         type: string
 *                         example: "04121234567"
 *                       foto_perfil:
 *                         type: string
 *                         example: "https://example.com/avatar.jpg"
 *                       ultimo_login:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                         example: null
 *                       verificado:
 *                         type: boolean
 *                         nullable: true
 *                         example: null
 *                       estado:
 *                         type: boolean
 *                         nullable: true
 *                         example: null
 *                       fecha_registro:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-05-24T12:48:21.117Z"
 *             example:
 *               success: true
 *               data:
 *                 - id_usuario: 1
 *                   tipo_usuario: "user"
 *                   id_estado: 4
 *                   id_municipio: 11
 *                   id_ciudad: 10
 *                   nombres: "Juan"
 *                   apellidos: "Pérez"
 *                   correo: "juan.perez@aki.com"
 *                   password_hash: "<password_hash>"
 *                   telefono: "04121234567"
 *                   foto_perfil: "https://example.com/avatar.jpg"
 *                   ultimo_login: null
 *                   verificado: null
 *                   estado: null
 *                   fecha_registro: "2026-05-24T12:48:21.117Z"
 *                 - id_usuario: 2
 *                   tipo_usuario: "user"
 *                   id_estado: 4
 *                   id_municipio: 11
 *                   id_ciudad: 10
 *                   nombres: "Luis"
 *                   apellidos: "Alvarez"
 *                   correo: "luis@aki.com"
 *                   password_hash: "<password_hash>"
 *                   telefono: "04121234567"
 *                   foto_perfil: "https://example.com/avatar.jpg"
 *                   ultimo_login: null
 *                   verificado: null
 *                   estado: null
 *                   fecha_registro: "2026-05-24T12:57:14.812Z"
 *       401:
 *         description: Token inválido o expirado
 */
router.get('/', authenticateJWT, getUsers);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Obtiene un usuario específico por su ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a consultar
 *     responses:
 *       200:
 *         description: Datos del usuario obtenidos exitosamente (success true, data user)
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
 *                     id_usuario:
 *                       type: integer
 *                       example: 1
 *                     tipo_usuario:
 *                       type: string
 *                       example: "user"
 *                     id_estado:
 *                       type: integer
 *                       example: 4
 *                     id_municipio:
 *                       type: integer
 *                       example: 11
 *                     id_ciudad:
 *                       type: integer
 *                       example: 10
 *                     nombres:
 *                       type: string
 *                       example: "Juan"
 *                     apellidos:
 *                       type: string
 *                       example: "Pérez"
 *                     correo:
 *                       type: string
 *                       example: "juan.perez@aki.com"
 *                     password_hash:
 *                       type: string
 *                       example: "<password_hash>"
 *                     telefono:
 *                       type: string
 *                       example: "04121234567"
 *                     foto_perfil:
 *                       type: string
 *                       example: "https://example.com/avatar.jpg"
 *                     ultimo_login:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       example: null
 *                     verificado:
 *                       type: boolean
 *                       nullable: true
 *                       example: null
 *                     estado:
 *                       type: boolean
 *                       nullable: true
 *                       example: null
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-24T12:48:21.117Z"
 *             example:
 *               success: true
 *               data:
 *                 id_usuario: 1
 *                 tipo_usuario: "user"
 *                 id_estado: 4
 *                 id_municipio: 11
 *                 id_ciudad: 10
 *                 nombres: "Juan"
 *                 apellidos: "Pérez"
 *                 correo: "juan.perez@aki.com"
 *                 password_hash: "<password_hash>"
 *                 telefono: "04121234567"
 *                 foto_perfil: "https://example.com/avatar.jpg"
 *                 ultimo_login: null
 *                 verificado: null
 *                 estado: null
 *                 fecha_registro: "2026-05-24T12:48:21.117Z"
 *       400:
 *         description: El ID proporcionado no es Válido
 *       401:
 *         description: Token inválido o expirado
 *       404:
 *         description: Usuario no encontrado 
 */
router.get('/:id', authenticateJWT, getUserById);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Actualiza los datos de un usuario existente
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a actualizar
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
 *               tipo_usuario:
 *                 type: string
 *                 example: "admin"
 *               id_estado:
 *                 type: integer
 *                 example: 4
 *               id_municipio:
 *                 type: integer
 *                 example: 11
 *               id_ciudad:
 *                 type: integer
 *                 example: 10
 *               nombres:
 *                 type: string
 *                 example: "San"
 *               apellidos:
 *                 type: string
 *                 example: "Alberto"
 *               correo:
 *                 type: string
 *                 example: "San.Albert@aki.com"
 *               password_hash:
 *                 type: string
 *                 example: "<password_hash>"
 *               telefono:
 *                 type: string
 *                 example: "04141234567"
 *               foto_perfil:
 *                 type: string
 *                 example: "https://example.com/avatar.png"
 *               ultimo_login:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 example: null
 *               verificado:
 *                 type: boolean
 *                 nullable: true
 *                 example: null
 *               estado:
 *                 type: boolean
 *                 nullable: true
 *                 example: null
 *           example:
 *             id_usuario: 1
 *             tipo_usuario: "admin"
 *             id_estado: 4
 *             id_municipio: 11
 *             id_ciudad: 10
 *             nombres: "San"
 *             apellidos: "Alberto"
 *             correo: "San.Albert@aki.com"
 *             password_hash: "<password_hash>"
 *             telefono: "04141234567"
 *             foto_perfil: "https://example.com/avatar.png"
 *             ultimo_login: null
 *             verificado: null
 *             estado: null
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente (success true, data user)
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
 *                     id_usuario:
 *                       type: integer
 *                       example: 1
 *                     tipo_usuario:
 *                       type: string
 *                       example: "admin"
 *                     id_estado:
 *                       type: integer
 *                       example: 4
 *                     id_municipio:
 *                       type: integer
 *                       example: 11
 *                     id_ciudad:
 *                       type: integer
 *                       example: 10
 *                     nombres:
 *                       type: string
 *                       example: "San"
 *                     apellidos:
 *                       type: string
 *                       example: "Alberto"
 *                     correo:
 *                       type: string
 *                       example: "San.Albert@aki.com"
 *                     telefono:
 *                       type: string
 *                       example: "04141234567"
 *                     foto_perfil:
 *                       type: string
 *                       example: "https://example.com/avatar.png"
 *                     ultimo_login:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       example: null
 *                     verificado:
 *                       type: boolean
 *                       nullable: true
 *                       example: null
 *                     estado:
 *                       type: boolean
 *                       nullable: true
 *                       example: null
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-24T12:48:21.117Z"
 *             example:
 *               success: true
 *               data:
 *                 id_usuario: 1
 *                 tipo_usuario: "admin"
 *                 id_estado: 4
 *                 id_municipio: 11
 *                 id_ciudad: 10
 *                 nombres: "San"
 *                 apellidos: "Alberto"
 *                 correo: "San.Albert@aki.com"
 *                 telefono: "04141234567"
 *                 foto_perfil: "https://example.com/avatar.png"
 *                 ultimo_login: null
 *                 verificado: null
 *                 estado: null
 *                 fecha_registro: "2026-05-24T12:48:21.117Z"
 *       400:
 *         description: El ID proporcionado no es válido
 *       401:
 *         description: Token inválido o expirado
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/:id', authenticateJWT, updateUser);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Elimina lógicamente un usuario cambiando su estado a false
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a desactivar
 *     responses:
 *       200:
 *         description: Usuario desactivado exitosamente
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
 *                     id_usuario:
 *                       type: integer
 *                       example: 1
 *                     tipo_usuario:
 *                       type: string
 *                       example: "admin"
 *                     id_estado:
 *                       type: integer
 *                       example: 4
 *                     id_municipio:
 *                       type: integer
 *                       example: 11
 *                     id_ciudad:
 *                       type: integer
 *                       example: 10
 *                     nombres:
 *                       type: string
 *                       example: "San"
 *                     apellidos:
 *                       type: string
 *                       example: "Alberto"
 *                     correo:
 *                       type: string
 *                       example: "juan.perez@aki.com"
 *                     password_hash:
 *                       type: string
 *                       example: "<password_hash>"
 *                     telefono:
 *                       type: string
 *                       example: "04141234567"
 *                     foto_perfil:
 *                       type: string
 *                       example: "https://example.com/avatar.png"
 *                     ultimo_login:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       example: null
 *                     verificado:
 *                       type: boolean
 *                       nullable: true
 *                       example: null
 *                     estado:
 *                       type: boolean
 *                       example: false
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-24T12:48:21.117Z"
 *             example:
 *               success: true
 *               data:
 *                 id_usuario: 1
 *                 tipo_usuario: "admin"
 *                 id_estado: 4
 *                 id_municipio: 11
 *                 id_ciudad: 10
 *                 nombres: "San"
 *                 apellidos: "Alberto"
 *                 correo: "juan.perez@aki.com"
 *                 password_hash: "<password_hash>"
 *                 telefono: "04141234567"
 *                 foto_perfil: "https://example.com/avatar.png"
 *                 ultimo_login: null
 *                 verificado: null
 *                 estado: false
 *                 fecha_registro: "2026-05-24T12:48:21.117Z"
 *       400:
 *         description: El ID proporcionado no es Válido
 *       401:
 *         description: Token inválido o expirado
 *       404:
 *         description: Usuario no encontrado o ya inactivo 
 */
router.delete('/:id', authenticateJWT, deleteUser);

export default router;