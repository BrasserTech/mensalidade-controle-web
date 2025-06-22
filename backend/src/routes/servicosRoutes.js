const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET - Listar todos os serviços, com filtro opcional por nome
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
    console.error('Erro ao buscar serviços:', err);
    res.status(500).json({ erro: 'Erro ao buscar serviços', detalhes: err.message });
  }
});

// POST - Criar novo serviço
router.post('/', async (req, res) => {
  const { nome, descricao, valor_mensal, duracao_contrato } = req.body;

  if (!nome || valor_mensal == null || duracao_contrato == null) {
    return res.status(400).json({
      erro: 'Campos obrigatórios: nome, valor_mensal, duracao_contrato',
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO servicos (nome, descricao, valor_mensal, duracao_contrato)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nome, descricao || '', valor_mensal, duracao_contrato]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar serviço:', err);
    res.status(500).json({ erro: 'Erro ao criar serviço', detalhes: err.message });
  }
});

// PUT - Atualizar serviço existente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, valor_mensal, duracao_contrato } = req.body;

  if (!nome || valor_mensal == null || duracao_contrato == null) {
    return res.status(400).json({
      erro: 'Campos obrigatórios: nome, valor_mensal, duracao_contrato',
    });
  }

  try {
    const result = await pool.query(
      `UPDATE servicos
       SET nome = $1, descricao = $2, valor_mensal = $3, duracao_contrato = $4
       WHERE id = $5
       RETURNING *`,
      [nome, descricao || '', valor_mensal, duracao_contrato, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Serviço não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar serviço:', err);
    res.status(500).json({ erro: 'Erro ao atualizar serviço', detalhes: err.message });
  }
});

// DELETE - Excluir serviço
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM servicos WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Serviço não encontrado' });
    }

    res.sendStatus(204);
  } catch (err) {
    console.error('Erro ao deletar serviço:', err);
    res.status(500).json({ erro: 'Erro ao deletar serviço', detalhes: err.message });
  }
});

module.exports = router;
