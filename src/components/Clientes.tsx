import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, User } from "lucide-react";
import { Cliente } from "@/types";

export function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState<Omit<Cliente, 'id' | 'dataCadastro'>>({
    nome: '',
    email: '',
    telefone: '',
    cpfCnpj: '',
    status: 'Ativo',
    observacoes: '',
  });

  useEffect(() => {
    fetch('http://localhost:3001/clientes')
      .then(res => res.json())
      .then(data => setClientes(data.map((c: any) => ({
        ...c,
        id: String(c.id),
        dataCadastro: new Date(c.data_cadastro)
      }))))
      .catch(err => console.error('Erro ao buscar clientes:', err));
  }, []);

  const onAddCliente = (cliente: Omit<Cliente, 'id' | 'dataCadastro'>) => {
    fetch('http://localhost:3001/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente),
    })
      .then(res => res.json())
      .then(novo => setClientes(prev => [...prev, {
        ...novo,
        id: String(novo.id),
        dataCadastro: new Date(novo.data_cadastro)
      }]))
      .catch(err => console.error('Erro ao adicionar cliente:', err));
  };

  const onUpdateCliente = (id: string, cliente: Partial<Cliente>) => {
    fetch(`http://localhost:3001/clientes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente),
    })
      .then(res => res.json())
      .then(atualizado => {
        setClientes(prev =>
          prev.map(c => (c.id === String(id)
            ? { ...atualizado, id: String(atualizado.id), dataCadastro: new Date(atualizado.data_cadastro) }
            : c)
          )
        );
      })
      .catch(err => console.error('Erro ao atualizar cliente:', err));
  };

  const onDeleteCliente = (id: string) => {
    fetch(`http://localhost:3001/clientes/${id}`, {
      method: 'DELETE',
    })
      .then(() => setClientes(prev => prev.filter(c => c.id !== id)))
      .catch(err => console.error('Erro ao deletar cliente:', err));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCliente) {
      onUpdateCliente(editingCliente.id, formData);
      setEditingCliente(null);
    } else {
      onAddCliente(formData);
    }
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      cpfCnpj: '',
      status: 'Ativo',
      observacoes: ''
    });
    setShowForm(false);
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      cpfCnpj: cliente.cpfCnpj,
      status: cliente.status,
      observacoes: cliente.observacoes || ''
    });
    setShowForm(true);
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cpfCnpj.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gerencie seus clientes cadastrados</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Cliente
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por nome, email ou CPF/CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingCliente ? 'Editar Cliente' : 'Novo Cliente'}</CardTitle>
            <CardDescription>
              {editingCliente ? 'Atualize as informações do cliente' : 'Preencha os dados do novo cliente'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup label="Nome Completo *" value={formData.nome} onChange={v => setFormData({ ...formData, nome: v })} />
                <InputGroup label="E-mail *" type="email" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} />
                <InputGroup label="Telefone *" value={formData.telefone} onChange={v => setFormData({ ...formData, telefone: v })} />
                <InputGroup label="CPF/CNPJ *" value={formData.cpfCnpj} onChange={v => setFormData({ ...formData, cpfCnpj: v })} />
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Ativo' | 'Inativo' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Observações</label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Observações adicionais..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => {
                  setShowForm(false);
                  setEditingCliente(null);
                  setFormData({ nome: '', email: '', telefone: '', cpfCnpj: '', status: 'Ativo', observacoes: '' });
                }}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingCliente ? 'Atualizar' : 'Cadastrar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {filteredClientes.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <User className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                </h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Tente ajustar os termos de busca' : 'Comece cadastrando seu primeiro cliente'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredClientes.map((cliente) => (
            <Card key={cliente.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{cliente.nome}</h3>
                      <Badge variant={cliente.status === 'Ativo' ? 'default' : 'secondary'}>
                        {cliente.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>E-mail:</strong> {cliente.email}</p>
                      <p><strong>Telefone:</strong> {cliente.telefone}</p>
                      <p><strong>CPF/CNPJ:</strong> {cliente.cpfCnpj}</p>
                      {cliente.observacoes && (
                        <p><strong>Observações:</strong> {cliente.observacoes}</p>
                      )}
                      <p><strong>Cadastrado em:</strong> {new Date(cliente.dataCadastro).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(cliente)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onDeleteCliente(cliente.id)}>
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

function InputGroup({
  label,
  type = 'text',
  value,
  onChange
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
      <Input type={type} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}
