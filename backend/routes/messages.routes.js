// routes/messages.routes.js

import express from 'express';
import {
  getMessagesByAppointment,
  postMessage
} from '../controllers/message.controller.js';

const router = express.Router();

/**
 * Rota para obter todas as mensagens de uma consulta específica.
 * Parâmetro: appointmentId (ID da consulta)
 */
router.get('/messages/:appointmentId', getMessagesByAppointment);

/**
 * Rota para enviar e salvar uma nova mensagem em uma consulta.
 * Espera dados no corpo da requisição (appointmentId, userId, message).
 */
router.post('/message', postMessage);

export default router;
