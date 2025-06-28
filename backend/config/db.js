// config/db.js

// Importa o cliente PostgreSQL e a biblioteca para variáveis de ambiente
import pg from 'pg';
import dotenv from 'dotenv';

// Carrega as variáveis do arquivo .env para process.env
dotenv.config();

// Configura e instancia o cliente do banco de dados PostgreSQL usando variáveis de ambiente
const db = new pg.Client({
  user: process.env.PG_USER,       // Usuário do banco
  database: process.env.PG_DB,     // Nome do banco de dados
  host: process.env.PG_HOST,       // Host do servidor PostgreSQL
  password: process.env.PG_PASSWORD, // Senha do usuário
  port: process.env.PG_PORT,       // Porta do servidor
});

// Realiza a conexão com o banco e trata sucesso ou erro
db.connect()
  .then(() => console.log("Banco de dados conectado"))
  .catch((err) => console.error("Erro no banco:", err));

// Exporta a instância do cliente para uso em outros módulos
export default db;
