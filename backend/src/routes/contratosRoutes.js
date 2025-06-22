const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET - Listar contratos com nomes de cliente e serviço
router.get('/', async (req, res) => {
  const { search } = req.query;

  try {
    let query = `
      SELECT c.*, cli.nome AS nome_cliente, s.nome AS nome_servico
      FROM contratos c
      JOIN clientes cli ON cli.id = c.cliente_id
      JOIN servicos s ON s.id = c.servico_id
    `;
    const params = [];

    if (search) {
      query += ` WHERE LOWER(cli.nome) LIKE $1 OR LOWER(s.nome) LIKE $1`;
      params.push(`%${search.toLowerCase()}%`);
    }

    query += ` ORDER BY c.data_inicio DESC`;

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar contratos:', err);
    res.status(500).json({ error: 'Erro ao buscar contratos', details: err.message });
  }
});

// POST - Criar contrato
router.post('/', async (req, res) => {
  try {
    const { cliente_id, servico_id, data_inicio, forma_pagamento, ativo } = req.body;

    // Verifica se cliente existe
    const cliente = await pool.query('SELECT id FROM clientes WHERE id = $1', [cliente_id]);
    if (cliente.rows.length === 0) {
      return res.status(400).json({ error: 'Cliente não encontrado' });
    }

    // Busca dados do serviço
    const servicoRes = await pool.query(
      'SELECT valor_mensal, duracao_contrato FROM servicos WHERE id = $1',
      [servico_id]
    );
    const servico = servicoRes.rows[0];
    if (!servico) {
      return res.status(400).json({ error: 'Serviço não encontrado' });
    }

    // Calcula valor total
    const valorTotal = servico.valor_mensal * servico.duracao_contrato;

    // Prepara datas
    const dataInicioObj = new Date(data_inicio);

    // Insere contrato
    const insert = await pool.query(
      `INSERT INTO contratos 
        (cliente_id, servico_id, valor, forma_pagamento, data_inicio, ativo)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [cliente_id, servico_id, valorTotal, forma_pagamento, dataInicioObj, ativo]
    );

    res.status(201).json(insert.rows[0]);
  } catch (err) {
    console.error('Erro ao criar contrato:', err);
    res.status(500).json({ error: 'Erro ao criar contrato', details: err.message });
  }
});

// PUT - Atualizar contrato
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { cliente_id, servico_id, data_inicio, ativo, forma_pagamento } = req.body;

    const servicoRes = await pool.query(
      'SELECT valor_mensal, duracao_contrato FROM servicos WHERE id = $1',
      [servico_id]
    );
    const servico = servicoRes.rows[0];
    if (!servico) return res.status(400).json({ error: 'Serviço não encontrado' });

    const dataInicioObj = new Date(data_inicio);
    const valorTotal = servico.valor_mensal * servico.duracao_contrato;

    await pool.query(
      `UPDATE contratos 
       SET cliente_id = $1, servico_id = $2, valor = $3, forma_pagamento = $4, data_inicio = $5, ativo = $6
       WHERE id = $7`,
      [cliente_id, servico_id, valorTotal, forma_pagamento, dataInicioObj, ativo, id]
    );

    res.sendStatus(204);
  } catch (err) {
    console.error('Erro ao atualizar contrato:', err);
    res.status(500).json({ error: 'Erro ao atualizar contrato', details: err.message });
  }
});

// DELETE - Excluir contrato
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM contratos WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error('Erro ao deletar contrato:', err);
    res.status(500).json({ error: 'Erro ao deletar contrato', details: err.message });
  }
});

module.exports = router;
