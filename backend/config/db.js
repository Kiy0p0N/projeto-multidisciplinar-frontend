// config/db.js

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const db = new pg.Client({
  connectionString: process.env.DATABASE_URL || 
    `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DB}`,
    
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

db.connect()
  .then(() => console.log("Banco de dados conectado"))
  .catch((err) => console.error("Erro na conexão com o banco:", err));

export default db;
