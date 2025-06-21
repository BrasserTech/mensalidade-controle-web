const express = require('express');
const router = express.Router();
const pool = require('../db');

// Listar todos os serviços com filtro opcional por nome
router.get('/', async (req, res) => {
  try {
    const { nome } = req.query;
    let query = 'SELECT * FROM servicos';
    const values = [];

    if (nome) {
      query += ' WHERE LOWER(nome) LIKE $1';
      values.push(`%${nome.toLowerCase()}%`);
    }

    query += ' ORDER BY nome';

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar serviços:', err);
    res.status(500).json({ erro: 'Erro ao buscar serviços', detalhes: err.message });
  }
});

// Criar novo serviço
router.post('/', async (req, res) => {
  const { nome, descricao, valorMensal, duracaoContrato } = req.body;

  if (!nome || !valorMensal || !duracaoContrato) {
    return res.status(400).json({ erro: 'Campos obrigatórios: nome, valorMensal, duracaoContrato' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO servicos (nome, descricao, valorMensal, duracaoContrato)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nome, descricao || '', valorMensal, duracaoContrato]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar serviço:', err);
    res.status(500).json({ erro: 'Erro ao criar serviço', detalhes: err.message });
  }
});

// Atualizar serviço
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, valorMensal, duracaoContrato } = req.body;

  if (!nome || !valorMensal || !duracaoContrato) {
    return res.status(400).json({ erro: 'Campos obrigatórios: nome, valorMensal, duracaoContrato' });
  }

  try {
    const result = await pool.query(
      `UPDATE servicos
       SET nome = $1, descricao = $2, valorMensal = $3, duracaoContrato = $4
       WHERE id = $5 RETURNING *`,
      [nome, descricao || '', valorMensal, duracaoContrato, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar serviço:', err);
    res.status(500).json({ erro: 'Erro ao atualizar serviço', detalhes: err.message });
  }
});

// Deletar serviço
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM servicos WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error('Erro ao deletar serviço:', err);
    res.status(500).json({ erro: 'Erro ao deletar serviço', detalhes: err.message });
  }
});

module.exports = router;
