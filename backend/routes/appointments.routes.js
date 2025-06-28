// routes/appointments.routes.js

import express from 'express';
import {
  getOccupiedAppointments,
  getAppointmentsByUser,
  validateAppointmentAccess,
  createAppointment,
  updateAppointmentStatus
} from '../controllers/appointment.controller.js';

const router = express.Router();

/**
 * Retorna os horários ocupados para um médico em uma data específica.
 * Parâmetro: id do médico
 */
router.get('/appointments/occupied/:id', getOccupiedAppointments);

/**
 * Busca todos os agendamentos relacionados a um usuário (paciente ou médico).
 * Parâmetro: id do usuário
 */
router.get('/appointments/user/:id', getAppointmentsByUser);

/**
 * Valida se o usuário tem permissão para acessar os detalhes de uma consulta específica.
 * Parâmetros: id da consulta e id do usuário
 */
router.get('/appointments/:appointmentId/validate-user/:userId', validateAppointmentAccess);

/**
 * Cria um novo agendamento de consulta.
 * Espera os dados do paciente, médico, instituição, data e horário no corpo da requisição.
 */
router.post('/appointments', createAppointment);

/**
 * Atualiza o status de uma consulta (ex: agendada, cancelada, concluída).
 * Parâmetro: id da consulta
 */
router.patch('/appointment/update-status/:id', updateAppointmentStatus);

export default router;
