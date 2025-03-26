import { Pool } from "pg"; //npm i pg
import dotenv from "dotenv"; //npm i dotenv
dotenv.config();

const dbHost = process.env.POSTGRES_HOST;
const dbUser = process.env.POSTGRES_USER;
const dbPassword = process.env.POSTGRES_PASSWORD;
const dbName = process.env.POSTGRES_DB;


export const pool = new Pool({
  max: 1000,
  connectionString: `postgres://${dbUser}:${dbPassword}@${dbHost}:5432/${dbName}`,
  ssl: {
    rejectUnauthorized: false,  // Desactivar la verificación de certificados si usas el certificado de Amazon.
  },
  idleTimeoutMillis: 30000,
});

 
pool.connect()
  .then(() => console.log("✅ Conexión a PostgreSQL exitosa ✅"))
  .catch(err => {
    console.error("❌ Error conectando a la base de datos:", err);
    process.exit(1);
  });

export const executeQuery = async (sql: string, data?: any[]) => {
  console.log("⏳ Ejecutando consulta SQL:");
  console.log("📜 Query:", sql);
  console.log("📌 Valores:", data);

  const client = await pool.connect();
  try {
    const { rows } = await client.query(sql, data);
    console.log("✅ Resultado de la consulta:", rows);
    return rows;
  } catch (err) {
    console.error("❌ Error en la consulta SQL:", err);
    throw err;
  } finally {
    client.release();
  }
};

