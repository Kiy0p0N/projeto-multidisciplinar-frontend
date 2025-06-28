// routes/institutions.routes.js

import express from 'express';
import upload from '../utils/multerConfig.js';
import {
  getAllInstitutions,
  registerInstitution,
  deleteInstitution
} from '../controllers/institution.controller.js';

const router = express.Router();

/**
 * Retorna todas as instituições cadastradas.
 */
router.get('/institutions', getAllInstitutions);

/**
 * Registra uma nova instituição.
 * Recebe dados via formulário multipart/form-data, incluindo imagem (campo 'image').
 */
router.post('/institution', upload.single('image'), registerInstitution);

/**
 * Deleta uma instituição pelo ID.
 * Remove também a imagem associada, se existir.
 */
router.delete('/institution/:id', deleteInstitution);

export default router;
