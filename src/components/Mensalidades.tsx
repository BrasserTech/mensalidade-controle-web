
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, CreditCard, Calendar, AlertTriangle, CheckCircle } from "lucide-react";
import { Mensalidade, Cliente, Contrato, Servico } from "@/types";

interface MensalidadesProps {
  mensalidades: Mensalidade[];
  clientes: Cliente[];
  contratos: Contrato[];
  servicos: Servico[];
  onUpdatePagamento: (id: string, pagamento: {
    statusPagamento: 'Pago';
    dataPagamento: Date;
    formaPagamento: 'Pix' | 'Boleto' | 'Cartão';
  }) => void;
}

export function Mensalidades({ mensalidades, clientes, contratos, servicos, onUpdatePagamento }: MensalidadesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pago' | 'Em aberto' | 'Vencido'>('all');
  const [selectedMensalidade, setSelectedMensalidade] = useState<Mensalidade | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState<'Pix' | 'Boleto' | 'Cartão'>('Pix');

  const getClienteNome = (contratoId: string) => {
    const contrato = contratos.find(c => c.id === contratoId);
    if (!contrato) return 'Cliente não encontrado';
    const cliente = clientes.find(c => c.id === contrato.clienteId);
    return cliente?.nome || 'Cliente não encontrado';
  };

  const getServicoNome = (contratoId: string) => {
    const contrato = contratos.find(c => c.id === contratoId);
    if (!contrato) return 'Serviço não encontrado';
    const servico = servicos.find(s => s.id === contrato.servicoId);
    return servico?.nome || 'Serviço não encontrado';
  };

  const filteredMensalidades = mensalidades.filter(mensalidade => {
    const clienteNome = getClienteNome(mensalidade.contratoId);
    const servicoNome = getServicoNome(mensalidade.contratoId);
    
    const matchesSearch = clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         servicoNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mensalidade.mesReferencia.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || mensalidade.statusPagamento === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRegistrarPagamento = () => {
    if (selectedMensalidade) {
      onUpdatePagamento(selectedMensalidade.id, {
        statusPagamento: 'Pago',
        dataPagamento: new Date(),
        formaPagamento
      });
      setIsDialogOpen(false);
      setSelectedMensalidade(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pago':
        return <Badge className="bg-success text-white">✓ Pago</Badge>;
      case 'Vencido':
        return <Badge variant="destructive">⚠ Vencido</Badge>;
      case 'Em aberto':
        return <Badge variant="secondary">⏳ Em aberto</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatarMesReferencia = (mesRef: string) => {
    const [ano, mes] = mesRef.split('-');
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${meses[parseInt(mes) - 1]} ${ano}`;
  };

  const totalRecebido = mensalidades
    .filter(m => m.statusPagamento === 'Pago')
    .reduce((sum, m) => sum + m.valor, 0);

  const totalPendente = mensalidades
    .filter(m => m.statusPagamento !== 'Pago')
    .reduce((sum, m) => sum + m.valor, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mensalidades</h1>
        <p className="text-gray-600">Controle de pagamentos e mensalidades dos contratos</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Recebido</CardTitle>
            <CheckCircle className="w-5 h-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              R$ {totalRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-500">Mensalidades pagas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Pendente</CardTitle>
            <AlertTriangle className="w-5 h-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              R$ {totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-500">Em aberto + vencidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Mensalidades</CardTitle>
            <CreditCard className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{mensalidades.length}</div>
            <p className="text-xs text-gray-500">Todos os períodos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por cliente, serviço ou período..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value: 'all' | 'Pago' | 'Em aberto' | 'Vencido') => setStatusFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Pago">Pago</SelectItem>
                <SelectItem value="Em aberto">Em aberto</SelectItem>
                <SelectItem value="Vencido">Vencido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Mensalidades */}
      <div className="space-y-4">
        {filteredMensalidades.map((mensalidade) => (
          <Card key={mensalidade.id} className={`hover:shadow-md transition-shadow duration-200 ${
            mensalidade.statusPagamento === 'Vencido' ? 'border-l-4 border-l-red-500' : ''
          }`}>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getClienteNome(mensalidade.contratoId)}
                    </h3>
                    {getStatusBadge(mensalidade.statusPagamento)}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      <span>{getServicoNome(mensalidade.contratoId)}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatarMesReferencia(mensalidade.mesReferencia)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">
                        Vencimento: {mensalidade.dataVencimento.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  {mensalidade.statusPagamento === 'Pago' && mensalidade.dataPagamento && (
                    <div className="text-sm text-success">
                      Pago em {mensalidade.dataPagamento.toLocaleDateString('pt-BR')} via {mensalidade.formaPagamento}
                    </div>
                  )}
                </div>
                <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-3 lg:space-y-0 lg:space-x-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      R$ {mensalidade.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  {mensalidade.statusPagamento !== 'Pago' && (
                    <Dialog open={isDialogOpen && selectedMensalidade?.id === mensalidade.id} onOpenChange={(open) => {
                      setIsDialogOpen(open);
                      if (!open) setSelectedMensalidade(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          onClick={() => setSelectedMensalidade(mensalidade)}
                          className="bg-success hover:bg-success-600"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Registrar Pagamento
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Registrar Pagamento</DialogTitle>
                          <DialogDescription>
                            Confirme o pagamento da mensalidade de {getClienteNome(mensalidade.contratoId)}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Cliente:</span>
                                <p>{getClienteNome(mensalidade.contratoId)}</p>
                              </div>
                              <div>
                                <span className="font-medium">Serviço:</span>
                                <p>{getServicoNome(mensalidade.contratoId)}</p>
                              </div>
                              <div>
                                <span className="font-medium">Período:</span>
                                <p>{formatarMesReferencia(mensalidade.mesReferencia)}</p>
                              </div>
                              <div>
                                <span className="font-medium">Valor:</span>
                                <p className="text-lg font-bold text-success">
                                  R$ {mensalidade.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Forma de Pagamento
                            </label>
                            <Select value={formaPagamento} onValueChange={(value: 'Pix' | 'Boleto' | 'Cartão') => setFormaPagamento(value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pix">Pix</SelectItem>
                                <SelectItem value="Boleto">Boleto</SelectItem>
                                <SelectItem value="Cartão">Cartão</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                              Cancelar
                            </Button>
                            <Button onClick={handleRegistrarPagamento} className="bg-success hover:bg-success-600">
                              Registrar Pagamento
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMensalidades.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma mensalidade encontrada</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca.' 
                : 'As mensalidades serão geradas automaticamente com base nos contratos.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
