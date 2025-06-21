
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { Contrato, Cliente, Servico } from "@/types";
import { toast } from "sonner";

interface AdicionarMensalidadeProps {
  isOpen: boolean;
  onClose: () => void;
  contratos: Contrato[];
  clientes: Cliente[];
  servicos: Servico[];
  onAddMensalidade: (mensalidade: {
    contratoId: string;
    mesReferencia: string;
    valor: number;
    statusPagamento: 'Em aberto' | 'Pago' | 'Vencido';
    dataVencimento: Date;
    dataPagamento?: Date;
    formaPagamento?: 'Pix' | 'Boleto' | 'Cartão';
  }) => void;
}

export function AdicionarMensalidade({ 
  isOpen, 
  onClose, 
  contratos, 
  clientes, 
  servicos, 
  onAddMensalidade 
}: AdicionarMensalidadeProps) {
  const [formData, setFormData] = useState({
    contratoId: '',
    mesReferencia: '',
    statusPagamento: 'Em aberto' as 'Em aberto' | 'Pago' | 'Vencido',
    dataVencimento: '',
    dataPagamento: '',
    formaPagamento: '' as '' | 'Pix' | 'Boleto' | 'Cartão'
  });

  if (!isOpen) return null;

  const contratosAtivos = contratos.filter(c => c.status === 'Ativo');

  const getClienteNome = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nome || 'Cliente não encontrado';
  };

  const getServicoNome = (servicoId: string) => {
    const servico = servicos.find(s => s.id === servicoId);
    return servico?.nome || 'Serviço não encontrado';
  };

  const getValorContrato = (contratoId: string) => {
    const contrato = contratos.find(c => c.id === contratoId);
    if (!contrato) return 0;
    const servico = servicos.find(s => s.id === contrato.servicoId);
    return servico?.valorMensal || 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.contratoId || !formData.mesReferencia || !formData.dataVencimento) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const mensalidadeData = {
      contratoId: formData.contratoId,
      mesReferencia: formData.mesReferencia,
      valor: getValorContrato(formData.contratoId),
      statusPagamento: formData.statusPagamento,
      dataVencimento: new Date(formData.dataVencimento),
      ...(formData.statusPagamento === 'Pago' && formData.dataPagamento && {
        dataPagamento: new Date(formData.dataPagamento),
        formaPagamento: formData.formaPagamento as 'Pix' | 'Boleto' | 'Cartão'
      })
    };

    onAddMensalidade(mensalidadeData);
    
    setFormData({
      contratoId: '',
      mesReferencia: '',
      statusPagamento: 'Em aberto',
      dataVencimento: '',
      dataPagamento: '',
      formaPagamento: ''
    });
    
    onClose();
    toast.success('Mensalidade adicionada com sucesso!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Nova Mensalidade
            </CardTitle>
            <CardDescription>
              Adicione uma nova mensalidade ao sistema
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Contrato *
              </label>
              <select
                value={formData.contratoId}
                onChange={(e) => setFormData({...formData, contratoId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Selecione um contrato</option>
                {contratosAtivos.map((contrato) => (
                  <option key={contrato.id} value={contrato.id}>
                    {getClienteNome(contrato.clienteId)} - {getServicoNome(contrato.servicoId)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Mês de Referência *
              </label>
              <Input
                type="month"
                value={formData.mesReferencia}
                onChange={(e) => setFormData({...formData, mesReferencia: e.target.value})}
                required
              />
            </div>

            {formData.contratoId && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Valor:</strong> R$ {getValorContrato(formData.contratoId).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Status de Pagamento *
              </label>
              <select
                value={formData.statusPagamento}
                onChange={(e) => setFormData({...formData, statusPagamento: e.target.value as 'Em aberto' | 'Pago' | 'Vencido'})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="Em aberto">Em aberto</option>
                <option value="Pago">Pago</option>
                <option value="Vencido">Vencido</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Data de Vencimento *
              </label>
              <Input
                type="date"
                value={formData.dataVencimento}
                onChange={(e) => setFormData({...formData, dataVencimento: e.target.value})}
                required
              />
            </div>

            {formData.statusPagamento === 'Pago' && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Data de Pagamento *
                  </label>
                  <Input
                    type="date"
                    value={formData.dataPagamento}
                    onChange={(e) => setFormData({...formData, dataPagamento: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Forma de Pagamento *
                  </label>
                  <select
                    value={formData.formaPagamento}
                    onChange={(e) => setFormData({...formData, formaPagamento: e.target.value as 'Pix' | 'Boleto' | 'Cartão'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Selecione a forma</option>
                    <option value="Pix">Pix</option>
                    <option value="Boleto">Boleto</option>
                    <option value="Cartão">Cartão</option>
                  </select>
                </div>
              </>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                Adicionar Mensalidade
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
