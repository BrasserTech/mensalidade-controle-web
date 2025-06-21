const express = require('express');
const router = express.Router();
const pool = require('../db');

// Listar mensalidades com nome do cliente e serviço
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, cli.nome AS cliente_nome, s.nome AS servico_nome
      FROM mensalidades m
      JOIN contratos c ON m.contrato_id = c.id
      JOIN clientes cli ON c.cliente_id = cli.id
      JOIN servicos s ON c.servico_id = s.id
      ORDER BY m.vencimento DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Criar mensalidade
router.post('/', async (req, res) => {
  const { contrato_id, mes_referencia, valor, vencimento, data_pagamento, forma_pagamento, status_pagamento } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO mensalidades (contrato_id, mes_referencia, valor, vencimento, data_pagamento, forma_pagamento, status_pagamento)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [contrato_id, mes_referencia, valor, vencimento, data_pagamento, forma_pagamento, status_pagamento]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Atualizar mensalidade
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { valor, vencimento, data_pagamento, forma_pagamento, status_pagamento } = req.body;
  try {
    const result = await pool.query(
      `UPDATE mensalidades
       SET valor = $1, vencimento = $2, data_pagamento = $3, forma_pagamento = $4, status_pagamento = $5
       WHERE id = $6 RETURNING *`,
      [valor, vencimento, data_pagamento, forma_pagamento, status_pagamento, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Deletar mensalidade
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM mensalidades WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
