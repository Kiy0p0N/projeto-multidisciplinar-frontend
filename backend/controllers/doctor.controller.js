// controllers/doctor.controller.js

import db from '../config/db.js';
import fs from 'fs';

/**
 * Busca todos os médicos com seus dados básicos e a instituição a que pertencem.
 */
export const getAllDoctors = async (req, res) => {
  try {
    const response = await db.query(`
      SELECT 
        users.name AS user_name, 
        users.email AS user_email,
        doctors.id,
        doctors.phone AS doctor_phone, 
        doctors.specialty,
        doctors.institution_id,
        doctors.image_path,
        doctors.available_days,
        doctors.schedule,
        institutions.name AS institution_name
      FROM users
      INNER JOIN doctors ON users.id = doctors.user_id
      INNER JOIN institutions ON doctors.institution_id = institutions.id 
    `);
    res.status(200).json({ message: "Médicos encontrados", doctors: response.rows });
  } catch (error) {
    console.error("Erro na busca:", error);
    res.status(500).json({ message: "Erro ao buscar os médicos", error });
  }
};

/**
 * Busca um médico pelo user_id.
 * Retorna dados detalhados do médico e nome da instituição.
 */
export const getDoctorById = async (req, res) => {
  const user_id = req.params.id;
  try {
    const result = await db.query(`
      SELECT 
        doctors.cpf,
        doctors.phone,
        doctors.gender,
        doctors.specialty, 
        institutions.name AS institution_name
      FROM doctors
      INNER JOIN institutions ON doctors.institution_id = institutions.id
      WHERE user_id = $1
    `, [user_id]);

    const doctor = result.rows[0];
    if (!doctor) return res.status(404).json({ message: "Médico não encontrado" });
    res.status(200).json({ message: "Médico encontrado", doctor });
  } catch (error) {
    console.error("Erro na busca:", error);
    res.status(500).json({ message: "Erro ao buscar médico", error });
  }
};

/**
 * Registra um novo médico com os dados enviados no corpo da requisição.
 * Recebe dados pessoais, instituição, disponibilidade e imagem (upload).
 */
export const registerDoctor = async (req, res) => {
  try {
    const {
      cpf,
      phone,
      birth,
      gender,
      institution,
      specialty,
      availableDays,
      schedule,
      user_id,
    } = req.body;

    // Ajusta o caminho da imagem para uso no backend (troca \ por /)
    const image_path = req.file ? req.file.path.replace(/\\/g, "/") : null;
    // Converte strings JSON em objetos/arrays
    const parsedAvailableDays = JSON.parse(availableDays);
    const parsedSchedule = JSON.parse(schedule);

    await db.query(
      `INSERT INTO doctors 
        (cpf, phone, birth, gender, institution_id, specialty, available_days, schedule, image_path, user_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        cpf,
        phone,
        birth,
        gender,
        parseInt(institution),
        specialty,
        parsedAvailableDays,
        parsedSchedule,
        image_path,
        parseInt(user_id)
      ]
    );

    res.status(201).json({ message: "Médico registrado com sucesso" });

  } catch (error) {
    console.error("Erro ao registrar médico:", error);
    res.status(500).json({ message: "Erro no servidor", error });
  }
};

/**
 * Deleta um médico e, caso exista, remove também sua imagem do sistema de arquivos.
 * Importante: deleta o usuário relacionado na tabela users.
 */
export const deleteDoctor = async (req, res) => {
  const doctor_id = req.params.id;
  try {
    // Busca o caminho da imagem para remoção física
    const result = await db.query(
      `SELECT doctors.image_path FROM doctors WHERE user_id = $1`,
      [doctor_id]
    );

    const imagePath = result.rows[0]?.image_path;
    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Remove o usuário associado (presumivelmente deletará também o médico via cascade)
    await db.query("DELETE FROM users WHERE id = $1", [doctor_id]);

    res.status(200).json({ message: "Médico deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar médico:", error);
    res.status(500).json({ message: "Erro no servidor ao deletar médico" });
  }
};
