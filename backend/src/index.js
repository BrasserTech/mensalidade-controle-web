const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas com tratamento de erro para facilitar debug
const carregarRotas = (caminho, nome) => {
  try {
    const rota = require(caminho);
    app.use(`/${nome}`, rota);
    console.log(`✔️  Rotas de ${nome} carregadas com sucesso`);
  } catch (err) {
    console.error(`❌ Erro ao carregar rotas de ${nome}:`, err.message);
  }
};

// Carregamento das rotas
carregarRotas('./routes/clientesRoutes', 'clientes');
carregarRotas('./routes/servicosRoutes', 'servicos');
carregarRotas('./routes/contratosRoutes', 'contratos');
carregarRotas('./routes/mensalidadesRoutes', 'mensalidades');

// Rota raiz (opcional para testes rápidos)
app.get('/', (req, res) => {
  res.send('API do sistema de mensalidades funcionando');
});

// Inicialização do servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
