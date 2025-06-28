// controllers/institution.controller.js

import db from '../config/db.js';
import fs from 'fs';

/**
 * Busca todas as instituições ordenadas por nome em ordem alfabética.
 */
export const getAllInstitutions = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM institutions ORDER BY name ASC");
    res.status(200).json({ message: "Instituições encontradas", institutions: result.rows });
  } catch (error) {
    console.error("Erro na busca:", error);
    res.status(500).json({ message: "Erro ao buscar as instituições", error });
  }
};

/**
 * Registra uma nova instituição.
 * Verifica se o email ou CNPJ já estão cadastrados para evitar duplicidade.
 * Remove arquivo de imagem enviado caso haja erro para evitar lixo no servidor.
 */
export const registerInstitution = async (req, res) => {
  const { name, cnpj, email, phone, address, city, state, zip_code } = req.body;
  const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

  try {
    // Validação para email duplicado, checando tanto em users quanto em institutions
    const checkEmail = await db.query(
      `SELECT 1 FROM users WHERE email = $1
       UNION
       SELECT 1 FROM institutions WHERE email = $1`,
      [email]
    );

    if (checkEmail.rows[0]) {
      if (req.file) fs.unlinkSync(req.file.path); // Remove a imagem salva se existir
      return res.status(401).json({ message: "Email já cadastrado" });
    }

    // Validação para CNPJ duplicado
    const checkCNPJ = await db.query("SELECT 1 FROM institutions WHERE cnpj = $1", [cnpj]);

    if (checkCNPJ.rows[0]) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(401).json({ message: "CNPJ já cadastrado" });
    }

    // Inserção dos dados da instituição na base
    await db.query(
      `INSERT INTO institutions (name, cnpj, email, phone, address, city, state, zip_code, image_path)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [name, cnpj, email, phone, address, city, state, zip_code, imagePath]
    );

    res.status(201).json({ message: "Instituição registrada com sucesso" });
  } catch (error) {
    console.error("Erro ao registrar instituição:", error);
    res.status(500).json({ message: "Erro no servidor", error });
  }
};

/**
 * Deleta uma instituição pelo ID.
 * Caso exista, remove a imagem associada do sistema de arquivos para evitar arquivos órfãos.
 */
export const deleteInstitution = async (req, res) => {
  const inst_id = req.params.id;
  try {
    // Consulta o caminho da imagem para remoção física
    const result = await db.query(
      `SELECT image_path FROM institutions WHERE id = $1`,
      [inst_id]
    );

    const imagePath = result.rows[0]?.image_path;
    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Remove a instituição da base de dados
    await db.query("DELETE FROM institutions WHERE id = $1", [inst_id]);
    res.status(200).json({ message: "Instituição deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar instituição:", error);
    res.status(500).json({ message: "Erro no servidor ao deletar instituição" });
  }
};
