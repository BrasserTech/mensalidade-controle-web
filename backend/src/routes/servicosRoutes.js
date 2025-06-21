const express = require('express');
const router = express.Router();
const pool = require('../db');

// Listar todos os serviços
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM servicos ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Criar novo serviço
router.post('/', async (req, res) => {
  const { nome, descricao } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO servicos (nome, descricao) VALUES ($1, $2) RETURNING *',
      [nome, descricao]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Atualizar serviço
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, descricao } = req.body;
  try {
    const result = await pool.query(
      'UPDATE servicos SET nome = $1, descricao = $2 WHERE id = $3 RETURNING *',
      [nome, descricao, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Deletar serviço
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM servicos WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
