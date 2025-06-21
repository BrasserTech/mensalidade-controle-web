// backend/src/routes/assinaturasRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Listar assinaturas
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT a.*, c.nome AS cliente_nome, p.nome AS plano_nome
      FROM assinaturas a
      JOIN clientes c ON a.cliente_id = c.id
      JOIN planos p ON a.plano_id = p.id
      ORDER BY a.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Criar assinatura
router.post('/', async (req, res) => {
  const { cliente_id, plano_id, data_inicio, data_fim, ativo } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO assinaturas (cliente_id, plano_id, data_inicio, data_fim, ativo)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [cliente_id, plano_id, data_inicio, data_fim, ativo]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
