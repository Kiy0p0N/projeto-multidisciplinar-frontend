// controllers/auth.controller.js

import bcrypt from 'bcrypt';
import db from '../config/db.js';
import passport from '../config/passport.js';

const saltRounds = 10;

/**
 * Realiza o login do usuário utilizando a estratégia local do Passport.
 * Em caso de sucesso, cria a sessão e retorna os dados do usuário.
 */
export const loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).json({ message: "Erro no servidor" });
    if (!user) return res.status(401).json({ message: info.message });

    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ message: "Erro ao criar sessão" });
      return res.status(200).json({ message: "Login bem-sucedido", user });
    });
  })(req, res, next);
};

/**
 * Realiza o logout do usuário destruindo a sessão.
 */
export const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Erro ao sair" });
    res.status(200).json({ message: "Logout realizado com sucesso" });
  });
};

/**
 * Registra um novo usuário.
 * Valida duplicidade de email e CPF.
 * Senha é armazenada de forma segura usando bcrypt.
 * Usuários do tipo 'doctor' não são automaticamente logados após cadastro.
 */
export const registerUser = async (req, res) => {
  const { name, email, cpf, password, termsAccepted } = req.body;
  let type = req.body.type === 'doctor' ? 'doctor' : 'patient';

  try {
    // Verifica se email já está cadastrado em usuários ou instituições
    const checkEmail = await db.query(`
      SELECT 1 FROM users WHERE email = $1
      UNION
      SELECT 1 FROM institutions WHERE email = $1
    `, [email]);    

    if (checkEmail.rows[0]) 
      return res.status(409).json({ message: "Email já registrado" });

    // Verifica se CPF já está cadastrado em pacientes
    const checkCPF = await db.query("SELECT * FROM patients WHERE cpf = $1", [cpf]);
    if (checkCPF.rows[0]) 
      return res.status(409).json({ message: "CPF já registrado" });

    // Criptografa a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insere o novo usuário no banco
    const newUserResult = await db.query(
      "INSERT INTO users (name, email, password, type, accepted_terms) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, email, hashedPassword, type, termsAccepted]
    );

    const newUser = newUserResult.rows[0];

    // Usuários do tipo 'doctor' não recebem sessão automaticamente
    if (newUser.type === 'doctor') 
      return res.status(201).json({ message: "Usuário registrado com sucesso", user: newUser });

    // Cria sessão para pacientes imediatamente após cadastro
    req.logIn(newUser, (err) => {
      if (err) return res.status(500).json({ message: "Erro ao criar sessão após cadastro" });
      return res.status(201).json({ message: "Usuário registrado e autenticado", user: newUser });
    });

  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ message: "Erro no servidor ao registrar usuário" });
  }
};
