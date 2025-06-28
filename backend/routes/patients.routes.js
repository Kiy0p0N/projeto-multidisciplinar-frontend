// routes/patients.routes.js

import express from 'express';
import {
  getAllPatients,
  getPatientById,
  createPatient
} from '../controllers/patient.controller.js';

const router = express.Router();

/**
 * Retorna todos os pacientes cadastrados no sistema.
 */
router.get('/patients', getAllPatients);

/**
 * Retorna as informações detalhadas de um paciente específico pelo ID do usuário.
 * Parâmetro: id do usuário/paciente.
 */
router.get('/patient/:id', getPatientById);

/**
 * Cria um novo paciente com os dados enviados no corpo da requisição.
 */
router.post('/patient', createPatient);

export default router;
