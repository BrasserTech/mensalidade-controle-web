const express = require('express');
const router = express.Router();
const pool = require('../db');

// Rota GET para listar todos os clientes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error.message);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

module.exports = router;
