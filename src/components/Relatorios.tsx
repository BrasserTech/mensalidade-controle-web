
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Filter, Calendar } from "lucide-react";
import { Cliente, Contrato, Mensalidade, Servico } from "@/types";

interface RelatoriosProps {
  clientes: Cliente[];
  contratos: Contrato[];
  mensalidades: Mensalidade[];
  servicos: Servico[];
}

export function Relatorios({ clientes, contratos, mensalidades, servicos }: RelatoriosProps) {
  const [activeTab, setActiveTab] = useState('inadimplentes');

  const getClienteNome = (clienteId: string) => {
    return clientes.find(c => c.id === clienteId)?.nome || 'Cliente não encontrado';
  };

  const getServicoNome = (servicoId: string) => {
    return servicos.find(s => s.id === servicoId)?.nome || 'Serviço não encontrado';
  };

  const getContratoByMensalidade = (mensalidade: Mensalidade) => {
    return contratos.find(c => c.id === mensalidade.contratoId);
  };

  const inadimplentes = mensalidades.filter(m => m.statusPagamento === 'Vencido');
  const pagamentosRecentes = mensalidades.filter(m => m.statusPagamento === 'Pago').slice(0, 10);
  const contratosAtivos = contratos.filter(c => c.status === 'Ativo');

  const exportarRelatorio = (tipo: string) => {
    console.log(`Exportando relatório: ${tipo}`);
    // Aqui seria implementada a lógica de exportação
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600">Relatórios financeiros e exportação de dados</p>
        </div>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <Button
          variant={activeTab === 'inadimplentes' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('inadimplentes')}
          className="flex-1"
        >
          Inadimplentes
        </Button>
        <Button
          variant={activeTab === 'pagamentos' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('pagamentos')}
          className="flex-1"
        >
          Pagamentos
        </Button>
        <Button
          variant={activeTab === 'contratos' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('contratos')}
          className="flex-1"
        >
          Contratos Ativos
        </Button>
      </div>

      {activeTab === 'inadimplentes' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Mensalidades em Atraso
                </CardTitle>
                <CardDescription>
                  Lista de mensalidades vencidas e não pagas
                </CardDescription>
              </div>
              <Button onClick={() => exportarRelatorio('inadimplentes')} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {inadimplentes.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sem inadimplência</h3>
                <p className="text-gray-500">Não há mensalidades em atraso no momento.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Mês/Ano</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inadimplentes.map((mensalidade) => {
                    const contrato = getContratoByMensalidade(mensalidade);
                    return (
                      <TableRow key={mensalidade.id}>
                        <TableCell className="font-medium">
                          {contrato ? getClienteNome(contrato.clienteId) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {contrato ? getServicoNome(contrato.servicoId) : 'N/A'}
                        </TableCell>
                        <TableCell>{mensalidade.mesReferencia}</TableCell>
                        <TableCell>R$ {mensalidade.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{mensalidade.dataVencimento.toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">Vencido</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'pagamentos' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Pagamentos Realizados
                </CardTitle>
                <CardDescription>
                  Histórico de pagamentos recebidos
                </CardDescription>
              </div>
              <Button onClick={() => exportarRelatorio('pagamentos')} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {pagamentosRecentes.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sem pagamentos</h3>
                <p className="text-gray-500">Não há pagamentos registrados.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Mês/Ano</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data Pagamento</TableHead>
                    <TableHead>Forma Pagamento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagamentosRecentes.map((mensalidade) => {
                    const contrato = getContratoByMensalidade(mensalidade);
                    return (
                      <TableRow key={mensalidade.id}>
                        <TableCell className="font-medium">
                          {contrato ? getClienteNome(contrato.clienteId) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {contrato ? getServicoNome(contrato.servicoId) : 'N/A'}
                        </TableCell>
                        <TableCell>{mensalidade.mesReferencia}</TableCell>
                        <TableCell>R$ {mensalidade.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>
                          {mensalidade.dataPagamento?.toLocaleDateString('pt-BR') || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{mensalidade.formaPagamento || 'N/A'}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'contratos' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Contratos Ativos
                </CardTitle>
                <CardDescription>
                  Lista de contratos em andamento
                </CardDescription>
              </div>
              <Button onClick={() => exportarRelatorio('contratos')} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {contratosAtivos.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sem contratos ativos</h3>
                <p className="text-gray-500">Não há contratos ativos no momento.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Data Início</TableHead>
                    <TableHead>Data Término</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contratosAtivos.map((contrato) => (
                    <TableRow key={contrato.id}>
                      <TableCell className="font-medium">
                        {getClienteNome(contrato.clienteId)}
                      </TableCell>
                      <TableCell>{getServicoNome(contrato.servicoId)}</TableCell>
                      <TableCell>{contrato.dataInicio.toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{contrato.dataTermino.toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>R$ {contrato.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>
                        <Badge variant="default">Ativo</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
