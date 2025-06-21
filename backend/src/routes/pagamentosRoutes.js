// backend/src/routes/pagamentosRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Listar pagamentos
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*, a.id AS assinatura_id, c.nome AS cliente_nome
      FROM pagamentos p
      JOIN assinaturas a ON p.assinatura_id = a.id
      JOIN clientes c ON a.cliente_id = c.id
      ORDER BY p.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Criar pagamento
router.post('/', async (req, res) => {
  const { assinatura_id, data_pagamento, valor_pago, status_pagamento, observacoes } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO pagamentos (assinatura_id, data_pagamento, valor_pago, status_pagamento, observacoes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [assinatura_id, data_pagamento, valor_pago, status_pagamento, observacoes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
