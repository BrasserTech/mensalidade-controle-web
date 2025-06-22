const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// === MIDDLEWARES GERAIS ===
app.use(cors());
app.use(express.json());

// === FUNÇÃO DE CARREGAMENTO DE ROTAS COM LOG INTELIGENTE ===
const carregarRotas = (caminho, nome) => {
  try {
    const rota = require(caminho);
    app.use(`/${nome}`, rota);
    console.log(`✅ Rotas de /${nome} carregadas com sucesso`);
  } catch (err) {
    console.error(`❌ Falha ao carregar rotas de /${nome}: ${err.message}`);
  }
};

// === ROTAS ===
const rotas = [
  { caminho: './routes/clientesRoutes', nome: 'clientes' },
  { caminho: './routes/servicosRoutes', nome: 'servicos' },
  { caminho: './routes/contratosRoutes', nome: 'contratos' },
  { caminho: './routes/mensalidadesRoutes', nome: 'mensalidades' }
];

rotas.forEach(({ caminho, nome }) => carregarRotas(caminho, nome));

// === ROTA RAIZ PARA TESTE ===
app.get('/', (req, res) => {
  res.send('✅ API do sistema de mensalidades funcionando corretamente');
});

// === INICIALIZAÇÃO DO SERVIDOR ===
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor disponível em: http://localhost:${PORT}`);
});
