import { query } from '../config/database.pg.js';
import { type Membership } from '../interfaces/membership.interface.js';

const MEMBERSHIP_FIELDS = `
  id_membresia, nombre, descripcion, precio, fecha_inicio, fecha_final, 
  prioridad_busqueda, permite_favoritos, permite_destacado, permite_galeria, 
  permite_promociones, cantidad_publicidad, estado, fecha_creacion
`;

export const MembershipRepository = {
    async findAll(): Promise<Membership[]> {
        const sql = `SELECT ${MEMBERSHIP_FIELDS} FROM public.membresias ORDER BY prioridad_busqueda DESC, fecha_creacion DESC`;
        const { rows } = await query(sql);
        return rows;
    },

    async findById(id: string): Promise<Membership | null> {
        const sql = `SELECT ${MEMBERSHIP_FIELDS} FROM public.membresias WHERE id_membresia = $1`;
        const { rows } = await query(sql, [id]);
        return rows[0] || null;
    },

    async create(data: Partial<Membership>): Promise<Membership> {
        const sql = `
            INSERT INTO public.membresias (
                nombre, descripcion, precio, fecha_inicio, fecha_final, 
                prioridad_busqueda, permite_favoritos, permite_destacado, permite_galeria, 
                permite_promociones, cantidad_publicidad, estado
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING ${MEMBERSHIP_FIELDS}
        `;
        const values = [
            data.nombre,
            data.descripcion,
            data.precio,
            data.fecha_inicio,
            data.fecha_final,
            data.prioridad_busqueda ?? 0,
            data.permite_favoritos ?? false,
            data.permite_destacado ?? false,
            data.permite_galeria ?? false,
            data.permite_promociones ?? false,
            data.cantidad_publicidad ?? 0,
            data.estado ?? true
        ];
        const { rows } = await query(sql, values);
        return rows[0];
    },

    async update(id: string, data: Partial<Membership>): Promise<Membership | null> {
        const sql = `
            UPDATE public.membresias
            SET 
                nombre = COALESCE($1, nombre),
                descripcion = COALESCE($2, descripcion),
                precio = COALESCE($3, precio),
                fecha_inicio = COALESCE($4, fecha_inicio),
                fecha_final = COALESCE($5, fecha_final),
                prioridad_busqueda = COALESCE($6, prioridad_busqueda),
                permite_favoritos = COALESCE($7, permite_favoritos),
                permite_destacado = COALESCE($8, permite_destacado),
                permite_galeria = COALESCE($9, permite_galeria),
                permite_promociones = COALESCE($10, permite_promociones),
                cantidad_publicidad = COALESCE($11, cantidad_publicidad),
                estado = COALESCE($12, estado)
            WHERE id_membresia = $13
            RETURNING ${MEMBERSHIP_FIELDS}
        `;
        const values = [
            data.nombre ?? null,
            data.descripcion ?? null,
            data.precio ?? null,
            data.fecha_inicio ?? null,
            data.fecha_final ?? null,
            data.prioridad_busqueda ?? null,
            data.permite_favoritos ?? null,
            data.permite_destacado ?? null,
            data.permite_galeria ?? null,
            data.permite_promociones ?? null,
            data.cantidad_publicidad ?? null,
            data.estado ?? null,
            id
        ];
        const { rows } = await query(sql, values);
        return rows[0] || null;
    },

    async deleteLogical(id: string): Promise<Membership | null> {
        const sql = `
            UPDATE public.membresias
            SET estado = false
            WHERE id_membresia = $1
            RETURNING ${MEMBERSHIP_FIELDS}
        `;
        const { rows } = await query(sql, [id]);
        return rows[0] || null;
    }
};