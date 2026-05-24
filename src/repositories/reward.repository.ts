import { query } from '../config/database.pg.js';
import { type Reward } from '../interfaces/reward.interface.js';

const REWARD_FIELDS = `
  id_recompensa, id_usuario, titulo, descripcion, tipo, fecha_generada, estado
`;

export const RewardRepository = {
    async findAll(): Promise<Reward[]> {
        const sql = `SELECT ${REWARD_FIELDS} FROM public.recompensas ORDER BY fecha_generada DESC`;
        const { rows } = await query(sql);
        return rows;
    },

    async findById(id: string): Promise<Reward | null> {
        const sql = `SELECT ${REWARD_FIELDS} FROM public.recompensas WHERE id_recompensa = $1`;
        const { rows } = await query(sql, [id]);
        return rows[0] || null;
    },

    async findByUser(idUsuario: string): Promise<Reward[]> {
        const sql = `SELECT ${REWARD_FIELDS} FROM public.recompensas WHERE id_usuario = $1 ORDER BY fecha_generada DESC`;
        const { rows } = await query(sql, [idUsuario]);
        return rows;
    },

    async create(data: Partial<Reward>): Promise<Reward> {
        const sql = `
            INSERT INTO public.recompensas (id_usuario, titulo, descripcion, tipo, estado)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING ${REWARD_FIELDS}
        `;
        const values = [
            data.id_usuario,
            data.titulo,
            data.descripcion,
            data.tipo,
            data.estado ?? true
        ];
        const { rows } = await query(sql, values);
        return rows[0];
    },

    async update(id: string, data: Partial<Reward>): Promise<Reward | null> {
        const sql = `
            UPDATE public.recompensas
            SET 
                id_usuario = COALESCE($1, id_usuario),
                titulo = COALESCE($2, titulo),
                descripcion = COALESCE($3, descripcion),
                tipo = COALESCE($4, tipo),
                estado = COALESCE($5, estado)
            WHERE id_recompensa = $6
            RETURNING ${REWARD_FIELDS}
        `;
        const values = [
            data.id_usuario ?? null,
            data.titulo ?? null,
            data.descripcion ?? null,
            data.tipo ?? null,
            data.estado ?? null,
            id
        ];
        const { rows } = await query(sql, values);
        return rows[0] || null;
    },

    async deleteLogical(id: string): Promise<Reward | null> {
        const sql = `
            UPDATE public.recompensas
            SET estado = false
            WHERE id_recompensa = $1
            RETURNING ${REWARD_FIELDS}
        `;
        const { rows } = await query(sql, [id]);
        return rows[0] || null;
    }
};