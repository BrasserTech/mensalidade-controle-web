
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Check, Clock, AlertTriangle, User, Calendar, Edit, Trash2 } from "lucide-react";
import { Mensalidade, Cliente, Contrato, Servico } from "@/types";
import { toast } from "sonner";

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
  onAddMensalidade: () => void;
  onUpdateMensalidade: (id: string, mensalidade: Partial<Mensalidade>) => void;
  onDeleteMensalidade: (id: string) => void;
}

export function Mensalidades({ 
  mensalidades, 
  clientes, 
  contratos, 
  servicos, 
  onUpdatePagamento, 
  onAddMensalidade,
  onUpdateMensalidade,
  onDeleteMensalidade 
}: MensalidadesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [showPagamentoForm, setShowPagamentoForm] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState<string | null>(null);
  const [formaPagamento, setFormaPagamento] = useState<'Pix' | 'Boleto' | 'Cartão'>('Pix');
  const [editFormData, setEditFormData] = useState({
    valor: '',
    dataVencimento: ''
  });

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

  const handleMarcarPago = (mensalidadeId: string) => {
    onUpdatePagamento(mensalidadeId, {
      statusPagamento: 'Pago',
      dataPagamento: new Date(),
      formaPagamento: formaPagamento
    });
    setShowPagamentoForm(null);
    toast.success('Pagamento registrado com sucesso!');
  };

  const handleEditMensalidade = (mensalidade: Mensalidade) => {
    setEditFormData({
      valor: mensalidade.valor.toString(),
      dataVencimento: mensalidade.dataVencimento.toISOString().split('T')[0]
    });
    setShowEditForm(mensalidade.id);
  };

  const handleUpdateMensalidade = (mensalidadeId: string) => {
    onUpdateMensalidade(mensalidadeId, {
      valor: parseFloat(editFormData.valor),
      dataVencimento: new Date(editFormData.dataVencimento)
    });
    setShowEditForm(null);
    toast.success('Mensalidade atualizada com sucesso!');
  };

  const handleDeleteMensalidade = (mensalidadeId: string) => {
    if (confirm('Tem certeza que deseja excluir esta mensalidade?')) {
      onDeleteMensalidade(mensalidadeId);
      toast.success('Mensalidade excluída com sucesso!');
    }
  };

  const filteredMensalidades = mensalidades.filter(mensalidade => {
    const clienteNome = getClienteNome(mensalidade.contratoId).toLowerCase();
    const servicoNome = getServicoNome(mensalidade.contratoId).toLowerCase();
    const matchesSearch = clienteNome.includes(searchTerm.toLowerCase()) || 
                         servicoNome.includes(searchTerm.toLowerCase()) ||
                         mensalidade.mesReferencia.includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'Todos' || mensalidade.statusPagamento === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pago':
        return 'bg-green-100 text-green-800';
      case 'Vencido':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pago':
        return <Check className="w-4 h-4" />;
      case 'Vencido':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mensalidades</h1>
          <p className="text-gray-600">Controle de pagamentos e mensalidades dos contratos</p>
        </div>
        <Button onClick={onAddMensalidade} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nova Mensalidade
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por cliente, serviço ou mês..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="Todos">Todos os Status</option>
          <option value="Em aberto">Em aberto</option>
          <option value="Pago">Pago</option>
          <option value="Vencido">Vencido</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filteredMensalidades.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <Calendar className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || statusFilter !== 'Todos' ? 'Nenhuma mensalidade encontrada' : 'Nenhuma mensalidade cadastrada'}
                </h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== 'Todos' 
                    ? 'Tente ajustar os filtros de busca' 
                    : 'As mensalidades aparecerão aqui conforme os contratos forem criados'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredMensalidades.map((mensalidade) => (
            <Card key={mensalidade.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="w-5 h-5 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getClienteNome(mensalidade.contratoId)}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(mensalidade.statusPagamento)}`}>
                        {getStatusIcon(mensalidade.statusPagamento)}
                        {mensalidade.statusPagamento}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Serviço:</strong> {getServicoNome(mensalidade.contratoId)}</p>
                      <p><strong>Mês de Referência:</strong> {mensalidade.mesReferencia}</p>
                      <p><strong>Valor:</strong> R$ {mensalidade.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      <p><strong>Vencimento:</strong> {mensalidade.dataVencimento.toLocaleDateString('pt-BR')}</p>
                      {mensalidade.dataPagamento && (
                        <>
                          <p><strong>Data de Pagamento:</strong> {mensalidade.dataPagamento.toLocaleDateString('pt-BR')}</p>
                          <p><strong>Forma de Pagamento:</strong> {mensalidade.formaPagamento}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {/* Formulário de edição */}
                    {showEditForm === mensalidade.id && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-2">
                        <div className="space-y-2">
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Valor"
                            value={editFormData.valor}
                            onChange={(e) => setEditFormData({...editFormData, valor: e.target.value})}
                            className="text-sm"
                          />
                          <Input
                            type="date"
                            value={editFormData.dataVencimento}
                            onChange={(e) => setEditFormData({...editFormData, dataVencimento: e.target.value})}
                            className="text-sm"
                          />
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={() => handleUpdateMensalidade(mensalidade.id)}
                              className="flex-1 text-xs"
                            >
                              Salvar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowEditForm(null)}
                              className="flex-1 text-xs"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Formulário de pagamento */}
                    {showPagamentoForm === mensalidade.id && mensalidade.statusPagamento !== 'Pago' && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-2">
                        <div className="space-y-2">
                          <select
                            value={formaPagamento}
                            onChange={(e) => setFormaPagamento(e.target.value as 'Pix' | 'Boleto' | 'Cartão')}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          >
                            <option value="Pix">Pix</option>
                            <option value="Boleto">Boleto</option>
                            <option value="Cartão">Cartão</option>
                          </select>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={() => handleMarcarPago(mensalidade.id)}
                              className="flex-1 text-xs"
                            >
                              Confirmar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowPagamentoForm(null)}
                              className="flex-1 text-xs"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Botões de ação */}
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditMensalidade(mensalidade)}
                        className="flex items-center gap-1 text-xs"
                      >
                        <Edit className="w-3 h-3" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteMensalidade(mensalidade.id)}
                        className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                        Excluir
                      </Button>
                    </div>

                    {mensalidade.statusPagamento !== 'Pago' && showPagamentoForm !== mensalidade.id && (
                      <Button
                        size="sm"
                        onClick={() => setShowPagamentoForm(mensalidade.id)}
                        className="flex items-center gap-1 text-xs"
                      >
                        <Check className="w-3 h-3" />
                        Marcar como Pago
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
