import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, FileText } from "lucide-react";
import { Contrato, Cliente, Servico } from "@/types";

export function Contratos() {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [clienteFiltro, setClienteFiltro] = useState('');
  const [servicoFiltro, setServicoFiltro] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingContrato, setEditingContrato] = useState<Contrato | null>(null);

  const [formData, setFormData] = useState({
    clienteId: '',
    servicoId: '',
    dataInicio: '',
    status: 'Ativo' as 'Ativo' | 'Finalizado'
  });

  const API = 'http://localhost:3000';

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resContratos, resClientes, resServicos] = await Promise.all([
        fetch(`${API}/contratos`),
        fetch(`${API}/clientes`),
        fetch(`${API}/servicos`)
      ]);

      const contratosData = await resContratos.json();
      const clientesData = await resClientes.json();
      const servicosData = await resServicos.json();

      const contratosConvertidos = contratosData.map((c: any) => ({
        ...c,
        dataInicio: new Date(c.dataInicio),
        dataTermino: new Date(c.dataTermino),
      }));

      setContratos(contratosConvertidos);
      setClientes(clientesData);
      setServicos(servicosData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const servico = servicos.find(s => s.id === formData.servicoId);
    if (!servico) return;

    const dataInicio = new Date(formData.dataInicio);
    const dataTermino = new Date(dataInicio);
    dataTermino.setMonth(dataTermino.getMonth() + servico.duracaoContrato);

    const contratoData = {
      clienteId: Number(formData.clienteId),
      servicoId: Number(formData.servicoId),
      dataInicio,
      dataTermino,
      status: formData.status,
      valorTotal: servico.valorMensal * servico.duracaoContrato
      };

    try {
      if (editingContrato) {
        await fetch(`${API}/contratos/${editingContrato.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contratoData)
        });

        setContratos(prev =>
          prev.map(c =>
            c.id === editingContrato.id
              ? {
                  ...c,
                  ...contratoData,
                  clienteId: String(contratoData.clienteId),
                  servicoId: String(contratoData.servicoId),
                }
              : c
          )
        );

        setEditingContrato(null);
      } else {
        const res = await fetch(`${API}/contratos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contratoData)
        });

        const novo = await res.json();
        setContratos(prev => [
          ...prev,
          { ...novo, dataInicio: new Date(novo.dataInicio), dataTermino: new Date(novo.dataTermino) }
        ]);
      }

      setFormData({ clienteId: '', servicoId: '', dataInicio: '', status: 'Ativo' });
      setShowForm(false);
    } catch (error) {
      console.error("Erro ao salvar contrato:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API}/contratos/${id}`, { method: 'DELETE' });
      setContratos(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error("Erro ao excluir contrato:", error);
    }
  };

  const handleEdit = (contrato: Contrato) => {
    setEditingContrato(contrato);
    setFormData({
      clienteId: contrato.clienteId,
      servicoId: contrato.servicoId,
      dataInicio: contrato.dataInicio.toISOString().split('T')[0],
      status: contrato.status
    });
    setShowForm(true);
  };

  const getClienteNome = (clienteId: string) => {
    return clientes.find(c => c.id === clienteId)?.nome || 'Cliente não encontrado';
  };

  const getServicoNome = (servicoId: string) => {
    return servicos.find(s => s.id === servicoId)?.nome || 'Serviço não encontrado';
  };

  const filteredContratos = contratos.filter(contrato => {
    const clienteNome = getClienteNome(contrato.clienteId).toLowerCase();
    const servicoNome = getServicoNome(contrato.servicoId).toLowerCase();
    return clienteNome.includes(searchTerm.toLowerCase()) ||
           servicoNome.includes(searchTerm.toLowerCase());
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
              {editingContrato ? 'Atualize as informações do contrato' : 'Preencha os dados do novo contrato'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Cliente *</label>
                  <select
                    value={formData.clienteId}
                    onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Selecione um cliente</option>
                    {clientes.filter(c => c.status === 'Ativo').map(cliente => (
                      <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Serviço *</label>
                  <select
                    value={formData.servicoId}
                    onChange={(e) => setFormData({ ...formData, servicoId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Selecione um serviço</option>
                    {servicos.map(servico => (
                      <option key={servico.id} value={servico.id}>
                        {servico.nome} - R$ {servico.valorMensal}/mês
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Data de Início *</label>
                  <Input
                    type="date"
                    value={formData.dataInicio}
                    onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Ativo' | 'Finalizado' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingContrato(null);
                    setFormData({ clienteId: '', servicoId: '', dataInicio: '', status: 'Ativo' });
                  }}
                >
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
                  {searchTerm ? 'Tente ajustar os termos de busca' : 'Comece cadastrando seu primeiro contrato'}
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
                        {getClienteNome(contrato.clienteId)}
                      </h3>
                      <Badge variant={contrato.status === 'Ativo' ? 'default' : 'secondary'}>
                        {contrato.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Serviço:</strong> {getServicoNome(contrato.servicoId)}</p>
                      <p><strong>Início:</strong> {contrato.dataInicio.toLocaleDateString('pt-BR')}</p>
                      <p><strong>Término:</strong> {contrato.dataTermino.toLocaleDateString('pt-BR')}</p>
                      <p><strong>Valor Total:</strong> R$ {contrato.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(contrato)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(contrato.id)}>
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
