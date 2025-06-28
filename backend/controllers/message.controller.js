// controllers/message.controller.js

import db from '../config/db.js';

/**
 * Busca todas as mensagens associadas a uma consulta específica,
 * ordenando pela data/hora em ordem crescente.
 */
export const getMessagesByAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  try {
    // Busca mensagens juntando com dados do usuário para retorno mais rico
    const { rows } = await db.query(
      `SELECT m.id, m.message, m.timestamp, u.id AS user_id, u.name AS user_name
       FROM messages AS m
       JOIN users u ON u.id = m.user_id
       WHERE m.appointment_id = $1
       ORDER BY m.timestamp ASC`,
      [appointmentId]
    );

    // Reformata as mensagens para estrutura mais organizada no frontend
    const formattedMessages = rows.map(row => ({
      id: row.id,
      message: row.message,
      createdAt: row.timestamp,
      user: {
        id: row.user_id,
        name: row.user_name
      }
    }));

    res.status(200).json({ messages: formattedMessages });
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    res.status(500).json({ message: "Erro ao buscar mensagens", error });
  }
};

/**
 * Insere uma nova mensagem relacionada a uma consulta no banco de dados.
 */
export const postMessage = async (req, res) => {
  const { appointmentId, userId, message } = req.body;
  try {
    await db.query(
      `INSERT INTO messages (appointment_id, user_id, message)
       VALUES ($1, $2, $3)`,
      [appointmentId, userId, message]
    );
    res.status(200).json({ message: "Mensagem salva com sucesso" });
  } catch (error) {
    console.error("Erro ao salvar mensagem:", error);
    res.status(500).json({ message: "Erro no servidor", error });
  }
};
