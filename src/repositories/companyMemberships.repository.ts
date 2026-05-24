import { query } from '../config/database.pg.js';
import { type CompanyMemberships } from '../interfaces/companyMemberships.interface.js';

const FIELDS = `
  id_empresa_membresia, id_empresa, id_membresia, fecha_inicio, fecha_fin, 
  estado_pago, estado, renovacion_automatica, fecha_registro
`;

export const CompanyMembershipsRepository = {
    async findAll(): Promise<CompanyMemberships[]> {
        const sql = `SELECT ${FIELDS} FROM public.empresa_membresias ORDER BY fecha_registro DESC`;
        const { rows } = await query(sql);
        return rows;
    },

    async findById(id: string): Promise<CompanyMemberships | null> {
        const sql = `SELECT ${FIELDS} FROM public.empresa_membresias WHERE id_empresa_membresia = $1`;
        const { rows } = await query(sql, [id]);
        return rows[0] || null;
    },

    async findByCompany(idEmpresa: string): Promise<CompanyMemberships[]> {
        const sql = `SELECT ${FIELDS} FROM public.empresa_membresias WHERE id_empresa = $1 ORDER BY fecha_inicio DESC`;
        const { rows } = await query(sql, [idEmpresa]);
        return rows;
    },

    async create(data: Partial<CompanyMemberships>): Promise<CompanyMemberships> {
        const sql = `
            INSERT INTO public.empresa_membresias (
                id_empresa, id_membresia, fecha_inicio, fecha_fin, 
                estado_pago, estado, renovacion_automatica
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING ${FIELDS}
        `;
        const values = [
            data.id_empresa,
            data.id_membresia,
            data.fecha_inicio,
            data.fecha_fin,
            data.estado_pago, 
            data.estado ?? true,
            data.renovacion_automatica ?? false
        ];
        const { rows } = await query(sql, values);
        return rows[0];
    },

    async update(id: string, data: Partial<CompanyMemberships>): Promise<CompanyMemberships | null> {
        const sql = `
            UPDATE public.empresa_membresias
            SET 
                id_empresa = COALESCE($1, id_empresa),
                id_membresia = COALESCE($2, id_membresia),
                fecha_inicio = COALESCE($3, fecha_inicio),
                fecha_fin = COALESCE($4, fecha_fin),
                estado_pago = COALESCE($5, estado_pago),
                estado = COALESCE($6, estado),
                renovacion_automatica = COALESCE($7, renovacion_automatica)
            WHERE id_empresa_membresia = $8
            RETURNING ${FIELDS}
        `;
        const values = [
            data.id_empresa ?? null,
            data.id_membresia ?? null,
            data.fecha_inicio ?? null,
            data.fecha_fin ?? null,
            data.estado_pago ?? null,
            data.estado ?? null,
            data.renovacion_automatica ?? null,
            id
        ];
        const { rows } = await query(sql, values);
        return rows[0] || null;
    },

    async deleteLogical(id: string): Promise<CompanyMemberships | null> {
        const sql = `
            UPDATE public.empresa_membresias
            SET estado = false
            WHERE id_empresa_membresia = $1
            RETURNING ${FIELDS}
        `;
        const { rows } = await query(sql, [id]);
        return rows[0] || null;
    }
};