// Este é o arquivo que devemos otimizar para lidar com a lógica dos contratos:
// src/routes/contratosRoutes.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Buscar todos os contratos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contratos ORDER BY dataInicio DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar contratos', details: err.message });
  }
});

// Criar novo contrato com cálculo interno de dataTermino e valorTotal
router.post('/', async (req, res) => {
  try {
    const { clienteId, servicoId, dataInicio, status } = req.body;

    // Verificar se cliente existe
    const clienteCheck = await pool.query('SELECT id FROM clientes WHERE id = $1', [clienteId]);
    if (clienteCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Cliente não encontrado' });
    }

    // Buscar dados do serviço para calcular valorTotal e dataTermino
    const servicoRes = await pool.query('SELECT valorMensal, duracaoContrato FROM servicos WHERE id = $1', [servicoId]);
    const servico = servicoRes.rows[0];
    if (!servico) {
      return res.status(400).json({ error: 'Serviço não encontrado' });
    }

    const dataInicioObj = new Date(dataInicio);
    const dataTerminoObj = new Date(dataInicioObj);
    dataTerminoObj.setMonth(dataTerminoObj.getMonth() + servico.duracaoContrato);

    const valorTotal = servico.valorMensal * servico.duracaoContrato;

    const insert = await pool.query(
      `INSERT INTO contratos (clienteId, servicoId, dataInicio, dataTermino, status, valorTotal)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [clienteId, servicoId, dataInicioObj, dataTerminoObj, status, valorTotal]
    );

    res.status(201).json(insert.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar contrato', details: err.message });
  }
});

// Atualizar contrato
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { clienteId, servicoId, dataInicio, status } = req.body;

    const servicoRes = await pool.query('SELECT valorMensal, duracaoContrato FROM servicos WHERE id = $1', [servicoId]);
    const servico = servicoRes.rows[0];
    if (!servico) return res.status(400).json({ error: 'Serviço não encontrado' });

    const dataInicioObj = new Date(dataInicio);
    const dataTerminoObj = new Date(dataInicioObj);
    dataTerminoObj.setMonth(dataTerminoObj.getMonth() + servico.duracaoContrato);
    const valorTotal = servico.valorMensal * servico.duracaoContrato;

    await pool.query(
      `UPDATE contratos SET clienteId=$1, servicoId=$2, dataInicio=$3, dataTermino=$4, status=$5, valorTotal=$6 WHERE id=$7`,
      [clienteId, servicoId, dataInicioObj, dataTerminoObj, status, valorTotal, id]
    );

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar contrato', details: err.message });
  }
});

// Deletar contrato
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM contratos WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar contrato', details: err.message });
  }
});

module.exports = router;
