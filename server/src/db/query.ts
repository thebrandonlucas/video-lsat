import pg from "pg";
import type { ClientConfig } from "pg";
import config from "./config.js";
const { Pool } = pg;

const pool = new Pool(config.db as ClientConfig);

// node-postgres tutorial from: https://geshan.com.np/blog/2021/01/nodejs-postgresql-tutorial/
/**
 * Query the database using the pool
 * @param {*} query
 * @param {*} params
 *
 * @see https://node-postgres.com/features/pooling#single-query
 */
async function query(query: any, params: any) {
  const { rows } = await pool.query(query, params);
  return rows;
}

export default query;
