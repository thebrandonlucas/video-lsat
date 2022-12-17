import dotenv from "dotenv";
dotenv.config();
const { env } = process;

const config = {
  db: {
    host: env.DB_HOST || "",
    port: env.DB_PORT || 5432,
    user: env.DB_USER || "",
    password: env.DB_PASSWORD || "",
    database: env.DB_DATABASE || "",
  },
  listPerPage: 20,
};

export default config;
