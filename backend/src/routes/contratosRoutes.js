const express = require('express');
const router = express.Router();
const pool = require('../db');

// Listar contratos com dados do cliente e serviço
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, cli.nome AS cliente_nome, s.nome AS servico_nome
      FROM contratos c
      JOIN clientes cli ON c.cliente_id = cli.id
      JOIN servicos s ON c.servico_id = s.id
      ORDER BY c.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Criar contrato
router.post('/', async (req, res) => {
  const { cliente_id, servico_id, valor, forma_pagamento, data_inicio, ativo } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO contratos (cliente_id, servico_id, valor, forma_pagamento, data_inicio, ativo)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [cliente_id, servico_id, valor, forma_pagamento, data_inicio, ativo]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Atualizar contrato
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { cliente_id, servico_id, valor, forma_pagamento, data_inicio, ativo } = req.body;
  try {
    const result = await pool.query(
      `UPDATE contratos
       SET cliente_id = $1, servico_id = $2, valor = $3, forma_pagamento = $4, data_inicio = $5, ativo = $6
       WHERE id = $7 RETURNING *`,
      [cliente_id, servico_id, valor, forma_pagamento, data_inicio, ativo, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Deletar contrato
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM contratos WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
