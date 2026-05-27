import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  ssl: { rejectUnauthorized: false }, // REQUERIDO para Neon
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  idleTimeoutMillis: 15000,
  connectionTimeoutMillis: 10000,
  max: 2,
});

// Helper (Ejecutar consultas)
export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

// Evento (monitorear conexión)
pool.on('connect', () => {
  console.log('[Postgres] Conexión a PostgreSQL establecida correctamente');
});
pool.on('error', (err) => {
  console.error('[Postgres-Error] Inesperado en el Pool de Postgres', err);
  process.exit(-1);
});

// Testing Conexión 
export const viewConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log(`[Postgres] DataBase Conectada (${res.rows[0].now})`);
  } catch (err: any) {
    console.error('[Postgres-Error] Fallo Crítico Conectividad', err.message);
  }
};

export default pool;
