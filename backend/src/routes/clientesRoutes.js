const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /clientes - Lista todos os clientes, com filtros opcionais por nome e status
router.get('/', async (req, res) => {
  try {
    const { nome, status } = req.query;
    let query = 'SELECT * FROM clientes WHERE 1=1';
    const values = [];
    let idx = 1;

    if (status) {
      query += ` AND status = $${idx++}`;
      values.push(status);
    }

    if (nome) {
      query += ` AND LOWER(nome) LIKE $${idx++}`;
      values.push(`%${nome.toLowerCase()}%`);
    }

    query += ' ORDER BY nome';

    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (err) {
    console.error('Erro ao listar clientes:', err);
    res.status(500).json({ erro: 'Erro ao buscar clientes', detalhes: err.message });
  }
});

// POST /clientes - Cria novo cliente
router.post('/', async (req, res) => {
  try {
    const { nome, email, telefone, cpfCnpj, observacoes } = req.body;

    if (!nome || !email || !telefone) {
      return res.status(400).json({ erro: 'Campos obrigatórios: nome, email, telefone' });
    }

    const result = await pool.query(
      `INSERT INTO clientes (nome, email, telefone, cpf_cnpj, observacoes, status, data_cadastro)
       VALUES ($1, $2, $3, $4, $5, 'Ativo', CURRENT_TIMESTAMP)
       RETURNING *`,
      [nome, email, telefone, cpfCnpj || null, observacoes || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar cliente:', err);
    res.status(500).json({ erro: 'Erro ao criar cliente', detalhes: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM clientes ORDER BY nome');
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar clientes:', err);
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});

// PUT /clientes/:id - Atualiza um cliente existente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone, cpfCnpj, observacoes, status } = req.body;

    const result = await pool.query(
      `UPDATE clientes
       SET nome = $1,
           email = $2,
           telefone = $3,
           cpf_cnpj = $4,
           observacoes = $5,
           status = $6
       WHERE id = $7
       RETURNING *`,
      [nome, email, telefone, cpfCnpj || null, observacoes || null, status || 'Ativo', id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar cliente:', err);
    res.status(500).json({ erro: 'Erro ao atualizar cliente', detalhes: err.message });
  }
});

// DELETE /clientes/:id - Deleta fisicamente o cliente (ou substitua por exclusão lógica se preferir)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM clientes WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }

    res.status(204).send(); // Sucesso sem conteúdo
  } catch (err) {
    console.error('Erro ao deletar cliente:', err);
    res.status(500).json({ erro: 'Erro ao deletar cliente', detalhes: err.message });
  }
});

module.exports = router;
