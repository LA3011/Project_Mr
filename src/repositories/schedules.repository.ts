import { query } from '../config/database.pg.js';
import { type Schedules } from '../interfaces/schedules.interface.js';

const SCHEDULE_FIELDS = `
  id_horario, id_sucursal, dia_semana, hora_apertura, hora_cierre, abierto
`;

export const SchedulesRepository = {
    async findAll(): Promise<Schedules[]> {
        const sql = `SELECT ${SCHEDULE_FIELDS} FROM public.horarios ORDER BY id_sucursal, dia_semana ASC`;
        const { rows } = await query(sql);
        return rows;
    },

    async findById(id: string): Promise<Schedules | null> {
        const sql = `SELECT ${SCHEDULE_FIELDS} FROM public.horarios WHERE id_horario = $1`;
        const { rows } = await query(sql, [id]);
        return rows[0] || null;
    },

    async findByBranch(idSucursal: string): Promise<Schedules[]> {
        const sql = `SELECT ${SCHEDULE_FIELDS} FROM public.horarios WHERE id_sucursal = $1 ORDER BY dia_semana ASC`;
        const { rows } = await query(sql, [idSucursal]);
        return rows;
    },

    async create(data: Partial<Schedules>): Promise<Schedules> {
        const sql = `
            INSERT INTO public.horarios (
                id_sucursal, dia_semana, hora_apertura, hora_cierre, abierto
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING ${SCHEDULE_FIELDS}
        `;
        const values = [
            data.id_sucursal,
            data.dia_semana,
            data.hora_apertura,
            data.hora_cierre,
            data.abierto ?? true
        ];
        const { rows } = await query(sql, values);
        return rows[0];
    },

    async update(id: string, data: Partial<Schedules>): Promise<Schedules | null> {
        const sql = `
            UPDATE public.horarios
            SET 
                id_sucursal = COALESCE($1, id_sucursal),
                dia_semana = COALESCE($2, dia_semana),
                hora_apertura = COALESCE($3, hora_apertura),
                hora_cierre = COALESCE($4, hora_cierre),
                abierto = COALESCE($5, abierto)
            WHERE id_horario = $6
            RETURNING ${SCHEDULE_FIELDS}
        `;
        const values = [
            data.id_sucursal ?? null,
            data.dia_semana ?? null,
            data.hora_apertura ?? null,
            data.hora_cierre ?? null,
            data.abierto ?? null,
            id
        ];
        const { rows } = await query(sql, values);
        return rows[0] || null;
    },

    async delete(id: string): Promise<boolean> {
        const sql = `DELETE FROM public.horarios WHERE id_horario = $1`;
        const { rowCount } = await query(sql, [id]);
        return (rowCount ?? 0) > 0;
    }
};