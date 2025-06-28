// controllers/patient.controller.js

import db from '../config/db.js';

/**
 * Retorna todos os pacientes com informações básicas
 * incluindo dados do usuário associados.
 */
export const getAllPatients = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        users.id, 
        users.name, 
        users.email, 
        patients.birth_date, 
        patients.phone, 
        patients.gender
      FROM users
      INNER JOIN patients ON users.id = patients.user_id
    `);
    res.status(200).json({ message: "Pacientes encontrados", patients: result.rows });
  } catch (error) {
    console.error("Erro na busca:", error);
    res.status(500).json({ message: "Erro ao buscar pacientes", error });
  }
};

/**
 * Busca um paciente específico pelo ID do usuário.
 * Retorna erro 401 se não encontrar informações do paciente.
 */
export const getPatientById = async (req, res) => {
  const user_id = req.params.id;
  try {
    const result = await db.query("SELECT * FROM patients WHERE user_id = $1", [user_id]);
    const patient = result.rows[0];
    if (!patient) {
      return res.status(401).json({ message: "Informações do paciente não foram cadastradas" });
    }
    res.status(200).json({ message: "Paciente encontrado", patient });
  } catch (error) {
    console.error("Erro na busca:", error);
    res.status(500).json({ message: "Erro ao buscar paciente", error });
  }
};

/**
 * Cria um novo registro de paciente vinculando ao usuário.
 * Espera os dados básicos do paciente no corpo da requisição.
 */
export const createPatient = async (req, res) => {
  const { user_id, cpf, phone, gender, birth_date } = req.body;
  try {
    await db.query(
      "INSERT INTO patients (user_id, cpf, phone, gender, birth_date) VALUES ($1, $2, $3, $4, $5)",
      [user_id, cpf, phone, gender, birth_date]
    );
    res.status(201).json({ message: "Informações cadastradas com sucesso" });
  } catch (error) {
    console.error("Erro ao adicionar informações:", error);
    res.status(500).json({ message: "Erro no servidor ao adicionar informações", error });
  }
};
