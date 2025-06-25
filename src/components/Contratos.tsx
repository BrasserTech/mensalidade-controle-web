import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, FileText } from "lucide-react";
import { Cliente, Servico, Contrato } from "@/types";

type Props = {
  contratos: Contrato[];
  clientes: Cliente[];
  servicos: Servico[];
  onAddContrato: (contrato: Omit<Contrato, 'id' | 'nome_cliente' | 'nome_servico'>) => void;
  onUpdateContrato: (id: string, contrato: Partial<Contrato>) => void;
  onDeleteContrato: (id: string) => void;
};

export function Contratos({
  contratos,
  clientes,
  servicos,
  onAddContrato,
  onUpdateContrato,
  onDeleteContrato,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingContrato, setEditingContrato] = useState<Contrato | null>(null);

  const [formData, setFormData] = useState<{
    clienteId: string;
    servicoId: string;
    dataInicio: string;
    formaPagamento: string;
    ativo: boolean;
  }>({
    clienteId: '',
    servicoId: '',
    dataInicio: '',
    formaPagamento: 'Dinheiro',
    ativo: true,
  });

  const resetForm = () => {
    setFormData({
      clienteId: '',
      servicoId: '',
      dataInicio: '',
      formaPagamento: 'Dinheiro',
      ativo: true,
    });
    setEditingContrato(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const servicoSelecionado = servicos.find(s => String(s.id) === formData.servicoId);
    if (!servicoSelecionado) {
      alert("Serviço inválido");
      return;
    }

    const contratoData: Omit<Contrato, 'id' | 'nome_cliente' | 'nome_servico'> = {
      clienteId: formData.clienteId,
      servicoId: formData.servicoId,
      dataInicio: new Date(formData.dataInicio).toISOString().split('T')[0],
      formaPagamento: formData.formaPagamento,
      ativo: formData.ativo,
      valor: servicoSelecionado.valorMensal,
    };

    if (editingContrato) {
      onUpdateContrato(editingContrato.id, contratoData);
    } else {
      onAddContrato(contratoData);
    }

    resetForm();
  };

  const filteredContratos = contratos.filter((contrato) => {
    const cliente = contrato.nome_cliente?.toLowerCase() || '';
    const servico = contrato.nome_servico?.toLowerCase() || '';
    return cliente.includes(searchTerm.toLowerCase()) || servico.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contratos</h1>
          <p className="text-gray-600">Gerencie contratos de clientes e serviços</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Contrato
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por cliente ou serviço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingContrato ? 'Editar Contrato' : 'Novo Contrato'}</CardTitle>
            <CardDescription>
              {editingContrato
                ? 'Atualize as informações do contrato'
                : 'Preencha os dados do novo contrato'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={formData.clienteId}
                  onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </option>
                  ))}
                </select>

                <select
                  value={formData.servicoId}
                  onChange={(e) => setFormData({ ...formData, servicoId: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Selecione um serviço</option>
                  {servicos.map((servico) => (
                    <option key={servico.id} value={servico.id}>
                      {servico.nome}
                    </option>
                  ))}
                </select>

                <Input
                  type="date"
                  value={formData.dataInicio}
                  onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                  required
                />

                <select
                  value={formData.formaPagamento}
                  onChange={(e) => setFormData({ ...formData, formaPagamento: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Cartão">Cartão</option>
                  <option value="PIX">PIX</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit">{editingContrato ? 'Atualizar' : 'Cadastrar'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {filteredContratos.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <FileText className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'Nenhum contrato encontrado' : 'Nenhum contrato cadastrado'}
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? 'Tente ajustar os termos de busca'
                    : 'Comece cadastrando seu primeiro contrato'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredContratos.map((contrato) => (
            <Card key={contrato.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {contrato.nome_cliente}
                      </h3>
                      <Badge variant={contrato.ativo ? 'default' : 'secondary'}>
                        {contrato.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Serviço:</strong> {contrato.nome_servico}</p>
                      <p><strong>Início:</strong> {new Date(contrato.dataInicio).toLocaleDateString('pt-BR')}</p>
                      <p><strong>Forma de Pagamento:</strong> {contrato.formaPagamento}</p>
                      <p><strong>Valor:</strong> R$ {typeof contrato.valor === 'number' ? contrato.valor.toFixed(2).replace('.', ',') : '0,00'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => {
                      setEditingContrato(contrato);
                      setFormData({
                        clienteId: String(contrato.clienteId),
                        servicoId: String(contrato.servicoId),
                        dataInicio: new Date(contrato.dataInicio).toISOString().split('T')[0],
                        formaPagamento: contrato.formaPagamento,
                        ativo: contrato.ativo,
                      });
                      setShowForm(true);
                    }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onDeleteContrato(contrato.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
