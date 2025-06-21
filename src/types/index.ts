
export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpfCnpj: string;
  status: 'Ativo' | 'Inativo';
  observacoes?: string;
  dataCadastro: Date;
}

export interface Servico {
  id: string;
  nome: string;
  descricao: string;
  valorMensal: number;
  duracaoContrato: number; // em meses
}

export interface Contrato {
  id: string;
  clienteId: string;
  servicoId: string;
  dataInicio: Date;
  dataTermino: Date;
  status: 'Ativo' | 'Finalizado';
  valorTotal: number;
}

export interface Mensalidade {
  id: string;
  contratoId: string;
  mesReferencia: string; // formato: "YYYY-MM"
  valor: number;
  statusPagamento: 'Pago' | 'Em aberto' | 'Vencido';
  dataPagamento?: Date;
  formaPagamento?: 'Pix' | 'Boleto' | 'Cartão';
  dataVencimento: Date;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  tipoAcesso: 'Administrador' | 'Operador';
}

export interface DashboardStats {
  clientesAtivos: number;
  receitaMes: number;
  mensalidadesAtraso: number;
  totalContratos: number;
  servicosMaisContratados: Array<{
    nome: string;
    quantidade: number;
  }>;
  receitaPorMes: Array<{
    mes: string;
    valor: number;
  }>;
}
