
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Settings, Palette, Shield, Bell, Database, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface ConfiguracoesProps {
  currentUser: { nome: string; email: string; tipo: 'Administrador' | 'Operador' } | null;
  onLogout: () => void;
}

export function Configuracoes({ currentUser, onLogout }: ConfiguracoesProps) {
  const [colors, setColors] = useState({
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#10b981',
    background: '#ffffff'
  });

  const [systemConfig, setSystemConfig] = useState({
    nomeEmpresa: 'MinhaEmpresa',
    cnpj: '00.000.000/0001-00',
    endereco: 'Rua Principal, 123',
    telefone: '(11) 99999-9999',
    email: 'contato@minhaempresa.com',
    moeda: 'BRL',
    timezone: 'America/Sao_Paulo',
    backupAutomatico: true,
    notificacoesPorEmail: true
  });

  useEffect(() => {
    // Aplicar cores ao CSS
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }, [colors]);

  const handleColorChange = (colorKey: string, value: string) => {
    setColors(prev => ({ ...prev, [colorKey]: value }));
    toast.success('Cor atualizada!');
  };

  const resetColors = () => {
    const defaultColors = {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#10b981',
      background: '#ffffff'
    };
    setColors(defaultColors);
    toast.success('Cores resetadas para o padrão!');
  };

  const handleSystemConfigChange = (key: string, value: string | boolean) => {
    setSystemConfig(prev => ({ ...prev, [key]: value }));
  };

  const saveSystemConfig = () => {
    toast.success('Configurações do sistema salvas com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie as configurações do sistema e sua conta</p>
      </div>

      <div className="grid gap-6">
        {/* Perfil do Usuário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Perfil do Usuário
            </CardTitle>
            <CardDescription>Informações da sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Nome</label>
                <Input value={currentUser?.nome || ''} readOnly className="bg-gray-50" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                <Input value={currentUser?.email || ''} readOnly className="bg-gray-50" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Tipo de Acesso</label>
                <Input value={currentUser?.tipo || ''} readOnly className="bg-gray-50" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={onLogout}>
                Sair da Conta
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Configurações do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configurações do Sistema
            </CardTitle>
            <CardDescription>Configurações gerais da aplicação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Nome da Empresa</label>
                <Input 
                  value={systemConfig.nomeEmpresa}
                  onChange={(e) => handleSystemConfigChange('nomeEmpresa', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">CNPJ</label>
                <Input 
                  value={systemConfig.cnpj}
                  onChange={(e) => handleSystemConfigChange('cnpj', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Endereço</label>
                <Input 
                  value={systemConfig.endereco}
                  onChange={(e) => handleSystemConfigChange('endereco', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Telefone</label>
                <Input 
                  value={systemConfig.telefone}
                  onChange={(e) => handleSystemConfigChange('telefone', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                <Input 
                  value={systemConfig.email}
                  onChange={(e) => handleSystemConfigChange('email', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Moeda</label>
                <select 
                  value={systemConfig.moeda}
                  onChange={(e) => handleSystemConfigChange('moeda', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="BRL">Real (BRL)</option>
                  <option value="USD">Dólar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Backup Automático</label>
                  <p className="text-xs text-gray-500">Realizar backup dos dados automaticamente</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={systemConfig.backupAutomatico}
                  onChange={(e) => handleSystemConfigChange('backupAutomatico', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Notificações por Email</label>
                  <p className="text-xs text-gray-500">Receber notificações por email</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={systemConfig.notificacoesPorEmail}
                  onChange={(e) => handleSystemConfigChange('notificacoesPorEmail', e.target.checked)}
                  className="rounded"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={saveSystemConfig}>
                Salvar Configurações
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Personalização de Cores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Personalização de Cores
            </CardTitle>
            <CardDescription>Customize as cores da interface</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(colors).map(([key, value]) => (
                <div key={key}>
                  <label className="text-sm font-medium text-gray-700 mb-1 block capitalize">
                    Cor {key === 'primary' ? 'Principal' : key === 'secondary' ? 'Secundária' : key === 'accent' ? 'Destaque' : 'Fundo'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <Input 
                      value={value}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetColors} className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Resetar Cores
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Segurança
            </CardTitle>
            <CardDescription>Configurações de segurança da conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              Alterar Senha
            </Button>
            <Button variant="outline" className="w-full">
              Configurar Autenticação em Duas Etapas
            </Button>
          </CardContent>
        </Card>

        {/* Dados e Backup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Dados e Backup
            </CardTitle>
            <CardDescription>Gerencie seus dados e backups</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                Exportar Dados
              </Button>
              <Button variant="outline" className="w-full">
                Criar Backup Manual
              </Button>
              <Button variant="outline" className="w-full">
                Restaurar Backup
              </Button>
              <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                Limpar Todos os Dados
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
