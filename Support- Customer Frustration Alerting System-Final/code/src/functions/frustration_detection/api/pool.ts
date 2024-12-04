import { Pool } from "pg";

export async function aiven(event: any) {
  const config = event.input_data.keyrings.aiven_db;

  const pool = new Pool({
    connectionString: config,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  return pool;
}
