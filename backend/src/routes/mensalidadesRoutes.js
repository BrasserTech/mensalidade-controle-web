const express = require('express');
const router = express.Router();
const pool = require('../db');

// Listar todas as mensalidades com nome do cliente e serviço
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
    console.error('Erro ao listar mensalidades:', err);
    res.status(500).json({ erro: 'Erro ao listar mensalidades', detalhes: err.message });
  }
});

// Criar uma nova mensalidade
router.post('/', async (req, res) => {
  const {
    contratoId,
    mesReferencia,
    valor,
    dataVencimento,
    dataPagamento,
    formaPagamento,
    statusPagamento
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO mensalidades (
        contrato_id, mes_referencia, valor, vencimento,
        data_pagamento, forma_pagamento, status_pagamento
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        contratoId,
        mesReferencia,
        valor,
        dataVencimento,
        dataPagamento || null,
        formaPagamento || null,
        statusPagamento
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar mensalidade:', err);
    res.status(500).json({ erro: 'Erro ao criar mensalidade', detalhes: err.message });
  }
});

// Atualizar uma mensalidade (valor e vencimento)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    valor,
    dataVencimento,
    dataPagamento,
    formaPagamento,
    statusPagamento
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE mensalidades
       SET valor = $1,
           vencimento = $2,
           data_pagamento = $3,
           forma_pagamento = $4,
           status_pagamento = $5
       WHERE id = $6
       RETURNING *`,
      [
        valor,
        dataVencimento,
        dataPagamento || null,
        formaPagamento || null,
        statusPagamento,
        id
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar mensalidade:', err);
    res.status(500).json({ erro: 'Erro ao atualizar mensalidade', detalhes: err.message });
  }
});

// Marcar mensalidade como paga
router.put('/:id/pagar', async (req, res) => {
  const { id } = req.params;
  const { dataPagamento, formaPagamento } = req.body;

  try {
    const result = await pool.query(
      `UPDATE mensalidades
       SET status_pagamento = 'Pago',
           data_pagamento = $1,
           forma_pagamento = $2
       WHERE id = $3
       RETURNING *`,
      [dataPagamento, formaPagamento, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao marcar como paga:', err);
    res.status(500).json({ erro: 'Erro ao marcar como paga', detalhes: err.message });
  }
});

// Excluir mensalidade
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM mensalidades WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error('Erro ao excluir mensalidade:', err);
    res.status(500).json({ erro: 'Erro ao excluir mensalidade', detalhes: err.message });
  }
});

module.exports = router;
