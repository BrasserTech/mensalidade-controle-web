
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Edit, Trash2, Settings } from "lucide-react";
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

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    valorMensal: '',
    duracaoContrato: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const servicoData = {
      nome: formData.nome,
      descricao: formData.descricao,
      valorMensal: parseFloat(formData.valorMensal),
      duracaoContrato: parseInt(formData.duracaoContrato)
    };

    if (editingServico) {
      onUpdateServico(editingServico.id, servicoData);
      setEditingServico(null);
    } else {
      onAddServico(servicoData);
    }
    
    setFormData({
      nome: '',
      descricao: '',
      valorMensal: '',
      duracaoContrato: ''
    });
    setShowForm(false);
  };

  const handleEdit = (servico: Servico) => {
    setEditingServico(servico);
    setFormData({
      nome: servico.nome,
      descricao: servico.descricao,
      valorMensal: servico.valorMensal.toString(),
      duracaoContrato: servico.duracaoContrato.toString()
    });
    setShowForm(true);
  };

  const filteredServicos = servicos.filter(servico =>
    servico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servico.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Serviços</h1>
          <p className="text-gray-600">Gerencie os serviços oferecidos pela empresa</p>
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
              {editingServico ? 'Atualize as informações do serviço' : 'Preencha os dados do novo serviço'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Nome do Serviço *
                  </label>
                  <Input
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="Digite o nome do serviço"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Valor Mensal (R$) *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.valorMensal}
                    onChange={(e) => setFormData({...formData, valorMensal: e.target.value})}
                    placeholder="0,00"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Duração do Contrato (meses) *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.duracaoContrato}
                    onChange={(e) => setFormData({...formData, duracaoContrato: e.target.value})}
                    placeholder="12"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Descrição *
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Descreva o serviço..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingServico(null);
                    setFormData({
                      nome: '',
                      descricao: '',
                      valorMensal: '',
                      duracaoContrato: ''
                    });
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
                <Settings className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'Nenhum serviço encontrado' : 'Nenhum serviço cadastrado'}
                </h3>
                <p className="text-gray-500">
                  {searchTerm 
                    ? 'Tente ajustar os termos de busca' 
                    : 'Comece cadastrando seu primeiro serviço'
                  }
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
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Descrição:</strong> {servico.descricao}</p>
                      <p><strong>Valor Mensal:</strong> R$ {servico.valorMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      <p><strong>Duração do Contrato:</strong> {servico.duracaoContrato} meses</p>
                      <p><strong>Valor Total:</strong> R$ {(servico.valorMensal * servico.duracaoContrato).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(servico)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteServico(servico.id)}
                    >
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
