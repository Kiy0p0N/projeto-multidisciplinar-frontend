// controllers/appointment.controller.js

import db from '../config/db.js';

/**
 * Retorna os horários ocupados para um médico específico.
 * Considera apenas consultas não canceladas.
 */
export const getOccupiedAppointments = async (req, res) => {
  const doctor_id = req.params.id;
  try {
    const result = await db.query(
      `SELECT appointment_time, appointment_date
       FROM appointments
       WHERE doctor_id = $1 AND status != 'cancelada'`,
      [doctor_id]
    );
    res.status(200).json({ occupiedTimes: result.rows });
  } catch (error) {
    console.error("Erro ao buscar horários ocupados:", error);
    res.status(500).json({ message: "Erro no servidor ao buscar horários ocupados" });
  }
};

/**
 * Busca todos os agendamentos relacionados a um usuário (paciente ou médico).
 * Ordena por status e data/hora da consulta.
 */
export const getAppointmentsByUser = async (req, res) => {
  const user_id = req.params.id;
  try {
    const result = await db.query(
      `SELECT 
         appointments.id,
         appointments.appointment_date,
         appointments.appointment_time,
         appointments.status,
         patient_users.name AS patient_name,
         doctor_users.name AS doctor_name,
         institutions.name AS institution_name
       FROM appointments
       INNER JOIN patients ON appointments.patient_id = patients.id
       INNER JOIN users AS patient_users ON patients.user_id = patient_users.id
       INNER JOIN doctors ON appointments.doctor_id = doctors.id
       INNER JOIN users AS doctor_users ON doctors.user_id = doctor_users.id
       INNER JOIN institutions ON appointments.institution_id = institutions.id
       WHERE (patients.user_id = $1 OR doctors.user_id = $1)
       ORDER BY 
         CASE 
           WHEN appointments.status = 'disponivel' THEN 1
           WHEN appointments.status = 'agendada' THEN 2
           WHEN appointments.status = 'concluida' THEN 3
           WHEN appointments.status = 'cancelada' THEN 4
           ELSE 5
         END,
         appointments.appointment_date ASC,
         appointments.appointment_time ASC;`,
      [user_id]
    );
    res.status(200).json({ appointments: result.rows });
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    res.status(500).json({ message: "Erro no servidor ao buscar agendamentos" });
  }
};

/**
 * Valida se o usuário tem acesso a uma consulta específica.
 * Permite acesso se for paciente ou médico da consulta.
 */
export const validateAppointmentAccess = async (req, res) => {
  const { appointmentId, userId } = req.params;
  try {
    const result = await db.query(
      `SELECT * FROM appointments
       WHERE id = $1
       AND (
         patient_id = (SELECT id FROM patients WHERE user_id = $2)
         OR doctor_id = (SELECT id FROM doctors WHERE user_id = $2)
       )`,
      [appointmentId, userId]
    );

    if (result.rows.length > 0) {
      res.json({ valid: true });
    } else {
      res.status(403).json({ valid: false, message: 'Acesso negado a esta consulta' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

/**
 * Cria um novo agendamento de consulta.
 * Recebe dados do paciente, médico, instituição, data e hora.
 */
export const createAppointment = async (req, res) => {
  const { patient_id, doctor_id, institution_id, date, time } = req.body;
  try {
    await db.query(
      `INSERT INTO appointments (patient_id, doctor_id, institution_id, appointment_date, appointment_time, status)
       VALUES ($1, $2, $3, $4, $5, 'agendada')`,
      [patient_id, doctor_id, institution_id, date, time]
    );
    res.status(201).json({ message: "Consulta agendada com sucesso" });
  } catch (error) {
    console.error("Erro ao agendar consulta:", error);
    res.status(500).json({ message: "Erro no servidor ao agendar consulta" });
  }
};

/**
 * Atualiza o status de uma consulta.
 * Parâmetros: id da consulta na URL e status no corpo da requisição.
 */
export const updateAppointmentStatus = async (req, res) => {
  const appointment_id = req.params.id;
  const appointment_status = req.body.status;
  try {
    await db.query(
      `UPDATE appointments SET status=$1 WHERE id=$2`,
      [appointment_status, appointment_id]
    );
    res.status(200).json({ message: "Status alterado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error });
  }
};
