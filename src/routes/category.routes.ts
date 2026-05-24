import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.handler.js';
import {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/category.controller.js';

const router = Router();

/**
 * @openapi
 * /api/categories:
 *   get:
 *     summary: Obtiene la lista completa de categorías
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida con éxito (success true, data categories)
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
 *                       id_categoria:
 *                         type: integer
 *                         example: 1
 *                       nombre:
 *                         type: string
 *                         example: "Restaurantes 1"
 *                       icono:
 *                         type: string
 *                         example: "utensils-icon"
 *                       descripcion:
 *                         type: string
 *                         example: "Comercios dedicados a la venta de comida preparada y bebidas."
 *                       estado:
 *                         type: boolean
 *                         example: false
 *             example:
 *               success: true
 *               data:
 *                 - id_categoria: 1
 *                   nombre: "Restaurantes 1"
 *                   icono: "utensils-icon"
 *                   descripcion: "Comercios dedicados a la venta de comida preparada y bebidas."
 *                   estado: false
 *       401:
 *         description: No autorizado
 */
router.get('/', getCategories);

/**
 * @openapi
 * /api/categories/{id}:
 *   get:
 *     summary: Obtiene una categoría específica por su ID
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico de la categoría
 *     responses:
 *       200:
 *         description: Datos de la categoría obtenidos (success true, data category)
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
 *                     id_categoria:
 *                       type: integer
 *                       example: 1
 *                     nombre:
 *                       type: string
 *                       example: "Restaurantes 1"
 *                     icono:
 *                       type: string
 *                       example: "utensils-icon"
 *                     descripcion:
 *                       type: string
 *                       example: "Comercios dedicados a la venta de comida preparada y bebidas."
 *                     estado:
 *                       type: boolean
 *                       example: false
 *             example:
 *               success: true
 *               data:
 *                 id_categoria: 1
 *                 nombre: "Restaurantes 1"
 *                 icono: "utensils-icon"
 *                 descripcion: "Comercios dedicados a la venta de comida preparada y bebidas."
 *                 estado: false
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Categoría no encontrada
 */
router.get('/:id', getCategoryById);

/**
 * @openapi
 * /api/categories:
 *   post:
 *     summary: Crea una nueva categoría en el ecosistema
 *     tags: [Categorías]
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
 *               - icono
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Restaurantes"
 *               icono:
 *                 type: string
 *                 example: "utensils-icon"
 *               descripcion:
 *                 type: string
 *                 example: "Comercios dedicados a la venta de comida preparada y bebidas."
 *           example:
 *             nombre: "Restaurantes"
 *             icono: "utensils-icon"
 *             descripcion: "Comercios dedicados a la venta de comida preparada y bebidas."
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente (success true, data newCategory)
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
 *                     id_categoria:
 *                       type: integer
 *                       example: 1
 *                     nombre:
 *                       type: string
 *                       example: "Restaurantes"
 *                     icono:
 *                       type: string
 *                       example: "utensils-icon"
 *                     descripcion:
 *                       type: string
 *                       example: "Comercios dedicados a la venta de comida preparada y bebidas."
 *                     estado:
 *                       type: boolean
 *                       nullable: true
 *                       example: null
 *             example:
 *               success: true
 *               data:
 *                 id_categoria: 1
 *                 nombre: "Restaurantes"
 *                 icono: "utensils-icon"
 *                 descripcion: "Comercios dedicados a la venta de comida preparada y bebidas."
 *                 estado: null
 *       400:
 *         description: "Faltan campos obligatorios para generar la Categoria (nombre, descripcion)"
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
 *                   example: "Faltan campos obligatorios para generar la Categoria (nombre, descripcion)"
 *             example:
 *               success: false
 *               message: "Faltan campos obligatorios para generar la Categoria (nombre, descripcion)"
 *       401:
 *         description: No autorizado
 */
router.post('/', authenticateJWT, createCategory);

/**
 * @openapi
 * /api/categories/{id}:
 *   put:
 *     summary: Actualiza los datos de una categoría existente
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Farmacias y Salud"
 *               icono:
 *                 type: string
 *                 example: "medkit-icon"
 *               descripcion:
 *                 type: string
 *                 example: "Venta de medicamentos y productos de cuidado personal."
 *           example:
 *             nombre: "Farmacias y Salud"
 *             icono: "medkit-icon"
 *             descripcion: "Venta de medicamentos y productos de cuidado personal."
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente (success true, data updatedCategory)
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
 *                     id_categoria:
 *                       type: integer
 *                       example: 1
 *                     nombre:
 *                       type: string
 *                       example: "Restaurantes"
 *                     icono:
 *                       type: string
 *                       example: "utensils-icon"
 *                     descripcion:
 *                       type: string
 *                       example: "Comercios dedicados a la venta de comida preparada y bebidas."
 *                     estado:
 *                       type: boolean
 *                       example: true
 *             example:
 *               success: true
 *               data:
 *                 id_categoria: 1
 *                 nombre: "Restaurantes"
 *                 icono: "utensils-icon"
 *                 descripcion: "Comercios dedicados a la venta de comida preparada y bebidas."
 *                 estado: true
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Categoría no encontrada
 */
router.put('/:id', authenticateJWT, updateCategory);

/**
 * @openapi
 * /api/categories/{id}:
 *   delete:
 *     summary: Oculta temporalmente una categoría
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría a desactivar
 *     responses:
 *       200:
 *         description: Categoría desactivada exitosamente
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
 *                     id_categoria:
 *                       type: integer
 *                       example: 1
 *                     nombre:
 *                       type: string
 *                       example: "Restaurantes 1"
 *                     icono:
 *                       type: string
 *                       example: "utensils-icon"
 *                     descripcion:
 *                       type: string
 *                       example: "Comercios dedicados a la venta de comida preparada y bebidas."
 *                     estado:
 *                       type: boolean
 *                       example: false
 *             example:
 *               success: true
 *               data:
 *                 id_categoria: 1
 *                 nombre: "Restaurantes 1"
 *                 icono: "utensils-icon"
 *                 descripcion: "Comercios dedicados a la venta de comida preparada y bebidas."
 *                 estado: false
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Categoría no encontrada o ya inactiva
 */
router.delete('/:id', authenticateJWT, deleteCategory);

export default router;