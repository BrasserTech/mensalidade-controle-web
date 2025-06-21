
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X, AlertTriangle, Clock, CheckCircle, User } from "lucide-react";
import { Cliente, Mensalidade, Contrato, Servico } from "@/types";

interface DetalhesAlertProps {
  isOpen: boolean;
  onClose: () => void;
  mensalidades: Mensalidade[];
  clientes: Cliente[];
  contratos: Contrato[];
  servicos: Servico[];
}

export function DetalhesAlert({ isOpen, onClose, mensalidades, clientes, contratos, servicos }: DetalhesAlertProps) {
  if (!isOpen) return null;

  const mensalidadesVencidas = mensalidades.filter(m => m.statusPagamento === 'Vencido');

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              Mensalidades Vencidas - Detalhes
            </CardTitle>
            <CardDescription>
              {mensalidadesVencidas.length} mensalidade(s) em atraso precisam de atenção
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {mensalidadesVencidas.length === 0 ? (
              <div className="p-6 text-center">
                <CheckCircle className="mx-auto w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma mensalidade em atraso!
                </h3>
                <p className="text-gray-500">
                  Todos os pagamentos estão em dia.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {mensalidadesVencidas.map((mensalidade) => (
                  <div key={mensalidade.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <h4 className="font-medium text-gray-900">
                            {getClienteNome(mensalidade.contratoId)}
                          </h4>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><strong>Serviço:</strong> {getServicoNome(mensalidade.contratoId)}</p>
                          <p><strong>Mês de Referência:</strong> {mensalidade.mesReferencia}</p>
                          <p><strong>Valor:</strong> R$ {mensalidade.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-red-500" />
                            <span className="text-red-600 font-medium">
                              Vencimento: {mensalidade.dataVencimento.toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Vencido
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
