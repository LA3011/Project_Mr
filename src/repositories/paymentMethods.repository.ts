import { query } from '../config/database.pg.js';
import { type PaymentMethods } from '../interfaces/paymentMethods.interface.js';

const PAYMENT_FIELDS = 'id_metodo_pago, nombre, icono, descripcion, estado';

export const PaymentMethodsRepository = {
  async findAll(): Promise<PaymentMethods[]> {
    const sql = `SELECT ${PAYMENT_FIELDS} FROM public.metodos_pago ORDER BY nombre ASC`;
    const { rows } = await query(sql);
    return rows;
  },

  async findById(id: string): Promise<PaymentMethods | null> {
    const sql = `SELECT ${PAYMENT_FIELDS} FROM public.metodos_pago WHERE id_metodo_pago = $1`;
    const { rows } = await query(sql, [id]);
    return rows[0] || null;
  },

  async create(data: Partial<PaymentMethods>): Promise<PaymentMethods> {
    const sql = `
        INSERT INTO public.metodos_pago (nombre, icono, descripcion, estado)
        VALUES ($1, $2, $3, $4)
        RETURNING ${PAYMENT_FIELDS}
    `;
    const values = [
      data.nombre,
      data.icono ?? 'none-icon',
      data.descripcion,
      data.estado ?? true
    ];
    const { rows } = await query(sql, values);
    return rows[0];
  },

  async update(id: string, data: Partial<PaymentMethods>): Promise<PaymentMethods | null> {
    const sql = `
          UPDATE public.metodos_pago
          SET 
            nombre = COALESCE($1, nombre),
            icono = COALESCE($2, icono),
            descripcion = COALESCE($3, descripcion),
            estado = COALESCE($4, estado)
          WHERE id_metodo_pago = $5
          RETURNING ${PAYMENT_FIELDS}
        `;
    const values = [
      data.nombre ?? null,
      data.icono ?? null,
      data.descripcion ?? null,
      data.estado ?? null,
      id
    ];
    const { rows } = await query(sql, values);
    return rows[0] || null;
  },

  async deleteLogical(id: string): Promise<PaymentMethods | null> {
    const sql = `
      UPDATE public.metodos_pago
      SET estado = false
      WHERE id_metodo_pago = $1
      RETURNING ${PAYMENT_FIELDS}
    `;
    const { rows } = await query(sql, [id]);
    return rows[0] || null;
  }
}; 