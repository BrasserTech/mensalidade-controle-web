import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Package } from "lucide-react";
import { Servico } from "@/types";

interface ServicosProps {
  servicos: Servico[];
  onAddServico: (servico: Omit<Servico, 'id'>) => void;
  onUpdateServico: (id: string, servico: Partial<Servico>) => void;
  onDeleteServico: (id: string) => void;
}

export function Servicos({ servicos, onAddServico, onUpdateServico, onDeleteServico }: ServicosProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingServico, setEditingServico] = useState<Servico | null>(null);
  const [formData, setFormData] = useState<Omit<Servico, 'id'>>({
    nome: '',
    descricao: '',
    valorMensal: 0,
    duracaoContrato: 0,
    status: 'Ativo',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingServico) {
      onUpdateServico(editingServico.id, formData);
      setEditingServico(null);
    } else {
      onAddServico(formData);
    }

    setFormData({ nome: '', descricao: '', valorMensal: 0, duracaoContrato: 0, status: 'Ativo' });
    setShowForm(false);
  };

  const handleEdit = (servico: Servico) => {
    setEditingServico(servico);
    setFormData({
      nome: servico.nome,
      descricao: servico.descricao,
      valorMensal: servico.valorMensal,
      duracaoContrato: servico.duracaoContrato,
      status: servico.status,
    });
    setShowForm(true);
  };

  const filteredServicos = servicos.filter(s =>
    s.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Serviços</h1>
          <p className="text-gray-600">Gerencie os serviços cadastrados</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Serviço
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingServico ? 'Editar Serviço' : 'Novo Serviço'}</CardTitle>
            <CardDescription>
              {editingServico ? 'Atualize os dados do serviço' : 'Preencha os dados do novo serviço'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup
                  label="Nome do Serviço *"
                  value={formData.nome}
                  onChange={v => setFormData({ ...formData, nome: v })}
                />
                <InputGroup
                  label="Valor Mensal (R$) *"
                  type="number"
                  value={String(formData.valorMensal)}
                  onChange={v => setFormData({ ...formData, valorMensal: parseFloat(v) })}
                />
                <InputGroup
                  label="Duração do Contrato (meses) *"
                  type="number"
                  value={String(formData.duracaoContrato)}
                  onChange={v => setFormData({ ...formData, duracaoContrato: parseInt(v) })}
                />
                <InputGroup
                  label="Descrição *"
                  value={formData.descricao}
                  onChange={v => setFormData({ ...formData, descricao: v })}
                />
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

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingServico(null);
                    setFormData({ nome: '', descricao: '', valorMensal: 0, duracaoContrato: 0, status: 'Ativo' });
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingServico ? 'Atualizar' : 'Cadastrar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {filteredServicos.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <Package className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'Nenhum serviço encontrado' : 'Nenhum serviço cadastrado'}
                </h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Tente ajustar os termos de busca' : 'Comece cadastrando seu primeiro serviço'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredServicos.map((servico) => (
            <Card key={servico.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{servico.nome}</h3>
                      <Badge variant={servico.status === 'Ativo' ? 'default' : 'secondary'}>
                        {servico.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Descrição:</strong> {servico.descricao}</p>
                      <p><strong>Valor Mensal:</strong> R$ {servico.valorMensal.toFixed(2)}</p>
                      <p><strong>Duração do Contrato:</strong> {servico.duracaoContrato} meses</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(servico)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onDeleteServico(servico.id)}>
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
