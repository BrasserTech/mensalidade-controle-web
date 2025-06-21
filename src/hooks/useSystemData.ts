import { useState, useEffect } from 'react';
import { Cliente, Servico, Contrato, Mensalidade, DashboardStats } from '@/types';

// Dados mock para demonstração
const mockClientes: Cliente[] = [
  {
    id: '1',
    nome: 'João Silva Santos',
    email: 'joao.silva@email.com',
    telefone: '(11) 99999-9999',
    cpfCnpj: '123.456.789-00',
    status: 'Ativo',
    observacoes: 'Cliente premium',
    dataCadastro: new Date('2024-01-15')
  },
  {
    id: '2',
    nome: 'Maria Oliveira Ltda',
    email: 'contato@mariaoliveira.com.br',
    telefone: '(11) 88888-8888',
    cpfCnpj: '12.345.678/0001-90',
    status: 'Ativo',
    observacoes: 'Empresa de médio porte',
    dataCadastro: new Date('2024-02-10')
  },
  {
    id: '3',
    nome: 'Pedro Costa',
    email: 'pedro.costa@gmail.com',
    telefone: '(11) 77777-7777',
    cpfCnpj: '987.654.321-00',
    status: 'Inativo',
    observacoes: 'Cancelou o serviço em março',
    dataCadastro: new Date('2023-12-05')
  }
];

const mockServicos: Servico[] = [
  {
    id: '1',
    nome: 'Consultoria Empresarial',
    descricao: 'Serviço completo de consultoria para gestão empresarial',
    valorMensal: 2500.00,
    duracaoContrato: 12
  },
  {
    id: '2',
    nome: 'Suporte Técnico',
    descricao: 'Suporte técnico especializado 24/7',
    valorMensal: 800.00,
    duracaoContrato: 6
  },
  {
    id: '3',
    nome: 'Marketing Digital',
    descricao: 'Gestão completa de marketing digital e redes sociais',
    valorMensal: 1200.00,
    duracaoContrato: 12
  }
];

const mockContratos: Contrato[] = [
  {
    id: '1',
    clienteId: '1',
    servicoId: '1',
    dataInicio: new Date('2024-01-15'),
    dataTermino: new Date('2025-01-15'),
    status: 'Ativo',
    valorTotal: 30000.00
  },
  {
    id: '2',
    clienteId: '2',
    servicoId: '2',
    dataInicio: new Date('2024-02-10'),
    dataTermino: new Date('2024-08-10'),
    status: 'Ativo',
    valorTotal: 4800.00
  }
];

const mockMensalidades: Mensalidade[] = [
  {
    id: '1',
    contratoId: '1',
    mesReferencia: '2024-06',
    valor: 2500.00,
    statusPagamento: 'Pago',
    dataPagamento: new Date('2024-06-05'),
    formaPagamento: 'Pix',
    dataVencimento: new Date('2024-06-15')
  },
  {
    id: '2',
    contratoId: '1',
    mesReferencia: '2024-07',
    valor: 2500.00,
    statusPagamento: 'Vencido',
    dataVencimento: new Date('2024-07-15')
  },
  {
    id: '3',
    contratoId: '2',
    mesReferencia: '2024-06',
    valor: 800.00,
    statusPagamento: 'Pago',
    dataPagamento: new Date('2024-06-08'),
    formaPagamento: 'Cartão',
    dataVencimento: new Date('2024-06-10')
  }
];

export const useSystemData = () => {
  const [clientes, setClientes] = useState<Cliente[]>(mockClientes);
  const [servicos, setServicos] = useState<Servico[]>(mockServicos);
  const [contratos, setContratos] = useState<Contrato[]>(mockContratos);
  const [mensalidades, setMensalidades] = useState<Mensalidade[]>(mockMensalidades);

  const getDashboardStats = (): DashboardStats => {
    const clientesAtivos = clientes.filter(c => c.status === 'Ativo').length;
    const contratosAtivos = contratos.filter(c => c.status === 'Ativo');
    const receitaMes = mensalidades
      .filter(m => m.statusPagamento === 'Pago' && m.mesReferencia === '2024-06')
      .reduce((sum, m) => sum + m.valor, 0);
    
    const mensalidadesAtraso = mensalidades.filter(m => m.statusPagamento === 'Vencido').length;
    
    const servicosMaisContratados = servicos.map(servico => ({
      nome: servico.nome,
      quantidade: contratos.filter(c => c.servicoId === servico.id && c.status === 'Ativo').length
    })).sort((a, b) => b.quantidade - a.quantidade);

    const receitaPorMes = [
      { mes: 'Jan', valor: 15000 },
      { mes: 'Fev', valor: 18000 },
      { mes: 'Mar', valor: 22000 },
      { mes: 'Abr', valor: 25000 },
      { mes: 'Mai', valor: 28000 },
      { mes: 'Jun', valor: receitaMes }
    ];

    return {
      clientesAtivos,
      receitaMes,
      mensalidadesAtraso,
      totalContratos: contratosAtivos.length,
      servicosMaisContratados,
      receitaPorMes
    };
  };

  const addCliente = (cliente: Omit<Cliente, 'id' | 'dataCadastro'>) => {
    const newCliente: Cliente = {
      ...cliente,
      id: Date.now().toString(),
      dataCadastro: new Date()
    };
    setClientes(prev => [...prev, newCliente]);
  };

  const updateCliente = (id: string, cliente: Partial<Cliente>) => {
    setClientes(prev => prev.map(c => c.id === id ? { ...c, ...cliente } : c));
  };

  const deleteCliente = (id: string) => {
    setClientes(prev => prev.filter(c => c.id !== id));
  };

  const addServico = (servico: Omit<Servico, 'id'>) => {
    const newServico: Servico = {
      ...servico,
      id: Date.now().toString()
    };
    setServicos(prev => [...prev, newServico]);
  };

  const updateServico = (id: string, servico: Partial<Servico>) => {
    setServicos(prev => prev.map(s => s.id === id ? { ...s, ...servico } : s));
  };

  const deleteServico = (id: string) => {
    setServicos(prev => prev.filter(s => s.id !== id));
  };

  const addContrato = (contrato: Omit<Contrato, 'id'>) => {
    const newContrato: Contrato = {
      ...contrato,
      id: Date.now().toString()
    };
    setContratos(prev => [...prev, newContrato]);
  };

  const updateContrato = (id: string, contrato: Partial<Contrato>) => {
    setContratos(prev => prev.map(c => c.id === id ? { ...c, ...contrato } : c));
  };

  const deleteContrato = (id: string) => {
    setContratos(prev => prev.filter(c => c.id !== id));
  };

  const updateMensalidadePagamento = (id: string, pagamento: {
    statusPagamento: 'Pago';
    dataPagamento: Date;
    formaPagamento: 'Pix' | 'Boleto' | 'Cartão';
  }) => {
    setMensalidades(prev => 
      prev.map(m => m.id === id ? { ...m, ...pagamento } : m)
    );
  };

  const updateMensalidade = (id: string, mensalidade: Partial<Mensalidade>) => {
    setMensalidades(prev => 
      prev.map(m => m.id === id ? { ...m, ...mensalidade } : m)
    );
  };

  const deleteMensalidade = (id: string) => {
    setMensalidades(prev => prev.filter(m => m.id !== id));
  };

  const addMensalidade = (mensalidade: {
    contratoId: string;
    mesReferencia: string;
    valor: number;
    statusPagamento: 'Em aberto' | 'Pago' | 'Vencido';
    dataVencimento: Date;
    dataPagamento?: Date;
    formaPagamento?: 'Pix' | 'Boleto' | 'Cartão';
  }) => {
    const newMensalidade: Mensalidade = {
      ...mensalidade,
      id: Date.now().toString()
    };
    setMensalidades(prev => [...prev, newMensalidade]);
  };

  return {
    clientes,
    servicos,
    contratos,
    mensalidades,
    getDashboardStats,
    addCliente,
    updateCliente,
    deleteCliente,
    addServico,
    updateServico,
    deleteServico,
    addContrato,
    updateContrato,
    deleteContrato,
    updateMensalidadePagamento,
    updateMensalidade,
    deleteMensalidade,
    addMensalidade
  };
};
