// config/passport.js

import passport from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';
import db from './db.js';

/**
 * Configuração da estratégia local de autenticação com Passport.js
 * Usa o campo "email" como nome de usuário.
 * Verifica se o usuário existe e se a senha bate com o hash no banco.
 */
passport.use("local",
  new Strategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      // Busca usuário pelo email
      const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
      const user = result.rows[0];

      // Verifica se usuário existe
      if (!user) return done(null, false, { message: "Email ou senha incorretos" });

      // Compara senha informada com o hash armazenado no banco
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) return done(null, false, { message: "Email ou senha incorretos" });

      // Autenticação bem-sucedida, retorna o usuário
      return done(null, user);

    } catch (err) {
      // Loga erro e passa para o middleware do Passport
      console.error("Erro na autenticação:", err);
      return done(err);
    }
  })
);

/**
 * Serializa o usuário para a sessão.
 * Salva apenas o ID do usuário para otimizar o armazenamento.
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/**
 * Desserializa a sessão para obter o usuário completo
 * a partir do ID salvo na sessão.
 */
passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});

// Exporta a instância configurada do Passport
export default passport;
