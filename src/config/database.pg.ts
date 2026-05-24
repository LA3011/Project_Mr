import pg from 'pg';
import dotenv from 'dotenv';

// dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  ssl: { rejectUnauthorized: false }, // REQUERIDO para Neon
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'AKI_local',
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  max: 20,
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
