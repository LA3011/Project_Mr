import { query } from '../config/database.pg.js';
import { type CompanyAdministrator } from '../interfaces/companyAdministrator.interface.js';

const FIELDS = 'id_administrador_empresa, id_administrador, id_empresa, fecha_asignacion, estado';

export const CompanyAdministratorRepository = {
    async findAll(): Promise<CompanyAdministrator[]> {
        const sql = `SELECT ${FIELDS} FROM public.administradores_empresas WHERE estado = true ORDER BY fecha_asignacion DESC`;
        const { rows } = await query(sql);
        return rows;
    },

    async findById(id: string): Promise<CompanyAdministrator | null> {
        const sql = `SELECT ${FIELDS} FROM public.administradores_empresas WHERE id_administrador_empresa = $1`;
        const { rows } = await query(sql, [id]);
        return rows[0] || null;
    },

    async findByCompany(idEmpresa: string): Promise<CompanyAdministrator[]> {
        const sql = `SELECT ${FIELDS} FROM public.administradores_empresas WHERE id_empresa = $1 AND estado = true`;
        const { rows } = await query(sql, [idEmpresa]);
        return rows;
    },

    async findByAdministrator(idAdministrador: string): Promise<CompanyAdministrator[]> {
        const sql = `SELECT ${FIELDS} FROM public.administradores_empresas WHERE id_administrador = $1 AND estado = true`;
        const { rows } = await query(sql, [idAdministrador]);
        return rows;
    },

    async create(data: Partial<CompanyAdministrator>): Promise<CompanyAdministrator> {
        const sql = `
            INSERT INTO public.administradores_empresas (id_administrador, id_empresa, fecha_asignacion, estado)
            VALUES ($1, $2, $3, $4)
            RETURNING ${FIELDS}
        `;
        const values = [
            data.id_administrador,
            data.id_empresa,
            data.fecha_asignacion ?? new Date(),
            data.estado ?? true
        ];
        const { rows } = await query(sql, values);
        return rows[0];
    },

    async update(id: string, data: Partial<CompanyAdministrator>): Promise<CompanyAdministrator | null> {
        const sql = `
            UPDATE public.administradores_empresas
            SET 
                id_administrador = COALESCE($1, id_administrador),
                id_empresa = COALESCE($2, id_empresa),
                fecha_asignacion = COALESCE($3, fecha_asignacion),
                estado = COALESCE($4, estado)
            WHERE id_administrador_empresa = $5
            RETURNING ${FIELDS}
        `;
        const values = [
            data.id_administrador ?? null,
            data.id_empresa ?? null,
            data.fecha_asignacion ?? null,
            data.estado ?? null,
            id
        ];
        const { rows } = await query(sql, values);
        return rows[0] || null;
    },

    async deleteLogical(id: string): Promise<boolean> {
        const sql = `UPDATE public.administradores_empresas SET estado = false WHERE id_administrador_empresa = $1`;
        const { rowCount } = await query(sql, [id]);
        return (rowCount ?? 0) > 0;
    }
};