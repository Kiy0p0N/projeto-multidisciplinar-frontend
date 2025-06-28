// routes/users.routes.js

import express from 'express';
import { getLoggedUser } from '../controllers/user.controller.js';

const router = express.Router();

/**
 * Rota para retornar os dados do usuário atualmente autenticado.
 * Retorna 401 caso o usuário não esteja autenticado.
 */
router.get('/user', getLoggedUser);

export default router;
