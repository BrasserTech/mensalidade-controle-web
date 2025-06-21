// backend/src/routes/clientesRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Listar todos os clientes
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM clientes ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Criar novo cliente
router.post('/', async (req, res) => {
  const { nome, email, telefone } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO clientes (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, telefone]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
