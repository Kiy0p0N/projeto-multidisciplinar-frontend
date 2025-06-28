// routes/auth.routes.js

import express from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * Rota para autenticar usuário.
 * Recebe email e senha via POST, retorna sessão autenticada em caso de sucesso.
 */
router.post('/login', loginUser);

/**
 * Rota para logout do usuário autenticado.
 * Limpa sessão e retorna confirmação.
 */
router.get('/logout', logoutUser);

/**
 * Rota para registrar novo usuário.
 * Recebe dados via POST e cria usuário no banco.
 */
router.post('/register-user', registerUser);

export default router;
