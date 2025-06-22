import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, Check, Clock, AlertTriangle, User, Calendar, Edit, Trash2 } from "lucide-react";
import { Mensalidade, Cliente, Contrato, Servico } from "@/types";
import { toast } from "sonner";

export function Mensalidades() {
  const [mensalidades, setMensalidades] = useState<Mensalidade[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [showPagamentoForm, setShowPagamentoForm] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState<string | null>(null);
  const [formaPagamento, setFormaPagamento] = useState<'Pix' | 'Boleto' | 'Cartão'>('Pix');
  const [editFormData, setEditFormData] = useState({ valor: '', dataVencimento: '' });

  const fetchAllData = async () => {
    try {
      const [m, c, s, ct] = await Promise.all([
        fetch('http://localhost:3001/mensalidades').then(res => res.json()),
        fetch('http://localhost:3001/clientes').then(res => res.json()),
        fetch('http://localhost:3001/servicos').then(res => res.json()),
        fetch('http://localhost:3001/contratos').then(res => res.json()),
      ]);
      setMensalidades(m);
      setClientes(c);
      setServicos(s);
      setContratos(ct);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  useEffect(() => { fetchAllData(); }, []);

  const getClienteNome = (contratoId: string) => {
    const contrato = contratos.find(c => c.id === contratoId);
    const cliente = clientes.find(c => c.id === contrato?.clienteId);
    return cliente?.nome || 'Cliente não encontrado';
  };

  const getServicoNome = (contratoId: string) => {
    const contrato = contratos.find(c => c.id === contratoId);
    const servico = servicos.find(s => s.id === contrato?.servicoId);
    return servico?.nome || 'Serviço não encontrado';
  };

  const marcarComoPago = async (id: string) => {
    try {
      await fetch(`http://localhost:3001/mensalidades/${id}/pagar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          statusPagamento: 'Pago',
          dataPagamento: new Date(),
          formaPagamento,
        }),
      });
      toast.success("Pagamento registrado com sucesso");
      setShowPagamentoForm(null);
      fetchAllData();
    } catch (error) {
      toast.error("Erro ao marcar pagamento");
    }
  };

  const salvarEdicao = async (id: string) => {
    try {
      await fetch(`http://localhost:3001/mensalidades/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          valor: parseFloat(editFormData.valor),
          dataVencimento: new Date(editFormData.dataVencimento)
        })
      });
      toast.success("Mensalidade atualizada");
      setShowEditForm(null);
      fetchAllData();
    } catch (err) {
      toast.error("Erro ao editar");
    }
  };

  const excluirMensalidade = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    try {
      await fetch(`http://localhost:3001/mensalidades/${id}`, { method: 'DELETE' });
      toast.success("Mensalidade excluída");
      fetchAllData();
    } catch (err) {
      toast.error("Erro ao excluir");
    }
  };

  const adicionarMensalidade = async () => {
    const contratoId = contratos[0]?.id;
    if (!contratoId) return toast.error("Nenhum contrato disponível");

    try {
      await fetch('http://localhost:3001/mensalidades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contratoId,
          mesReferencia: '06/2025',
          valor: 100,
          dataVencimento: new Date(),
          statusPagamento: 'Em aberto'
        })
      });
      toast.success("Mensalidade adicionada");
      fetchAllData();
    } catch (err) {
      toast.error("Erro ao adicionar");
    }
  };

  const mensalidadesFiltradas = mensalidades.filter(m => {
    const nomeCliente = getClienteNome(m.contratoId).toLowerCase();
    const nomeServico = getServicoNome(m.contratoId).toLowerCase();
    const termo = searchTerm.toLowerCase();
    const porNome = nomeCliente.includes(termo) || nomeServico.includes(termo) || m.mesReferencia.includes(termo);
    const porStatus = statusFilter === 'Todos' || m.statusPagamento === statusFilter;
    return porNome && porStatus;
  });

  const getStatusColor = (status: string) => {
    if (status === 'Pago') return 'bg-green-100 text-green-800';
    if (status === 'Vencido') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Pago') return <Check className="w-4 h-4" />;
    if (status === 'Vencido') return <AlertTriangle className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mensalidades</h1>
          <p className="text-gray-600">Gerencie pagamentos mensais de contratos</p>
        </div>
        <Button onClick={adicionarMensalidade}><Plus className="mr-1 h-4 w-4" />Nova Mensalidade</Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar mensalidade..." />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border p-2 rounded-md">
          <option>Todos</option>
          <option>Em aberto</option>
          <option>Pago</option>
          <option>Vencido</option>
        </select>
      </div>

      <div className="grid gap-4">
        {mensalidadesFiltradas.map((m) => (
          <Card key={m.id}>
            <CardContent className="p-4 flex justify-between items-start">
              <div className="space-y-1 text-sm">
                <div className="flex gap-2 items-center">
                  <User className="w-4 h-4 text-gray-500" />
                  <h3 className="font-medium">{getClienteNome(m.contratoId)}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(m.statusPagamento)}`}>
                    {getStatusIcon(m.statusPagamento)} {m.statusPagamento}
                  </span>
                </div>
                <p><strong>Serviço:</strong> {getServicoNome(m.contratoId)}</p>
                <p><strong>Mês:</strong> {m.mesReferencia}</p>
                <p><strong>Valor:</strong> R$ {m.valor.toFixed(2)}</p>
                <p><strong>Vencimento:</strong> {new Date(m.dataVencimento).toLocaleDateString()}</p>
                {m.statusPagamento === 'Pago' && (
                  <>
                    <p><strong>Pago em:</strong> {new Date(m.dataPagamento!).toLocaleDateString()}</p>
                    <p><strong>Forma:</strong> {m.formaPagamento}</p>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {showEditForm === m.id ? (
                  <>
                    <Input type="number" value={editFormData.valor} onChange={(e) => setEditFormData({ ...editFormData, valor: e.target.value })} />
                    <Input type="date" value={editFormData.dataVencimento} onChange={(e) => setEditFormData({ ...editFormData, dataVencimento: e.target.value })} />
                    <Button size="sm" onClick={() => salvarEdicao(m.id)}>Salvar</Button>
                    <Button size="sm" variant="outline" onClick={() => setShowEditForm(null)}>Cancelar</Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="outline" onClick={() => {
                      setEditFormData({
                        valor: m.valor.toString(),
                        dataVencimento: new Date(m.dataVencimento).toISOString().split('T')[0]
                      });
                      setShowEditForm(m.id);
                    }}><Edit className="w-3 h-3" /> Editar</Button>

                    <Button size="sm" variant="outline" className="text-red-600" onClick={() => excluirMensalidade(m.id)}>
                      <Trash2 className="w-3 h-3" /> Excluir
                    </Button>

                    {m.statusPagamento !== 'Pago' && showPagamentoForm !== m.id && (
                      <Button size="sm" onClick={() => setShowPagamentoForm(m.id)}>
                        <Check className="w-3 h-3" /> Marcar como Pago
                      </Button>
                    )}

                    {showPagamentoForm === m.id && (
                      <>
                        <select value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value as any)} className="text-sm border rounded px-2 py-1">
                          <option value="Pix">Pix</option>
                          <option value="Boleto">Boleto</option>
                          <option value="Cartão">Cartão</option>
                        </select>
                        <Button size="sm" onClick={() => marcarComoPago(m.id)}>Confirmar</Button>
                        <Button size="sm" variant="outline" onClick={() => setShowPagamentoForm(null)}>Cancelar</Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
