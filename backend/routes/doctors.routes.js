// routes/doctors.routes.js

import express from 'express';
import upload from '../utils/multerConfig.js';
import {
  getAllDoctors,
  getDoctorById,
  registerDoctor,
  deleteDoctor
} from '../controllers/doctor.controller.js';

const router = express.Router();

/**
 * Retorna todos os médicos cadastrados.
 */
router.get('/doctors', getAllDoctors);

/**
 * Retorna os dados de um médico específico pelo ID.
 * Parâmetro: id do médico.
 */
router.get('/doctor/:id', getDoctorById);

/**
 * Registra um novo médico.
 * Usa multer para upload de imagem (campo 'image').
 */
router.post('/doctor', upload.single('image'), registerDoctor);

/**
 * Deleta um médico pelo ID.
 * Também remove a imagem associada ao médico.
 */
router.delete('/doctor/:id', deleteDoctor);

export default router;
