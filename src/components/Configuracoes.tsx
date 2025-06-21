
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Palette, Save } from "lucide-react";
import { toast } from "sonner";

export function Configuracoes() {
  const [cores, setCores] = useState({
    primary: '#3b82f6',
    secondary: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444'
  });

  const [configuracoes, setConfiguracoes] = useState({
    nomeEmpresa: 'Minha Empresa',
    emailContato: 'contato@minhaempresa.com',
    telefone: '(11) 99999-9999',
    endereco: 'Rua das Empresas, 123'
  });

  const handleCorChange = (corNome: string, valor: string) => {
    setCores(prev => ({
      ...prev,
      [corNome]: valor
    }));
  };

  const aplicarCores = () => {
    const root = document.documentElement;
    
    // Converte hex para HSL
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    root.style.setProperty('--primary', hexToHsl(cores.primary));
    root.style.setProperty('--success', hexToHsl(cores.success));
    root.style.setProperty('--warning', hexToHsl(cores.warning));
    root.style.setProperty('--destructive', hexToHsl(cores.danger));

    toast.success('Cores aplicadas com sucesso!');
  };

  const salvarConfiguracoes = () => {
    localStorage.setItem('configuracoes', JSON.stringify(configuracoes));
    localStorage.setItem('cores', JSON.stringify(cores));
    toast.success('Configurações salvas com sucesso!');
  };

  const resetarCores = () => {
    const coresOriginais = {
      primary: '#3b82f6',
      secondary: '#64748b',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444'
    };
    setCores(coresOriginais);
    
    // Aplicar cores originais
    const root = document.documentElement;
    root.style.setProperty('--primary', '217 91% 60%');
    root.style.setProperty('--success', '142 76% 36%');
    root.style.setProperty('--warning', '38 92% 50%');
    root.style.setProperty('--destructive', '0 84% 60%');
    
    toast.success('Cores resetadas para o padrão!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600">Configurações do sistema e personalização</p>
        </div>
        <Button onClick={salvarConfiguracoes} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Salvar Configurações
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Informações da Empresa
            </CardTitle>
            <CardDescription>
              Configure as informações básicas da sua empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Nome da Empresa
              </label>
              <Input
                value={configuracoes.nomeEmpresa}
                onChange={(e) => setConfiguracoes(prev => ({
                  ...prev,
                  nomeEmpresa: e.target.value
                }))}
                placeholder="Nome da sua empresa"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                E-mail de Contato
              </label>
              <Input
                type="email"
                value={configuracoes.emailContato}
                onChange={(e) => setConfiguracoes(prev => ({
                  ...prev,
                  emailContato: e.target.value
                }))}
                placeholder="contato@empresa.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Telefone
              </label>
              <Input
                value={configuracoes.telefone}
                onChange={(e) => setConfiguracoes(prev => ({
                  ...prev,
                  telefone: e.target.value
                }))}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Endereço
              </label>
              <Input
                value={configuracoes.endereco}
                onChange={(e) => setConfiguracoes(prev => ({
                  ...prev,
                  endereco: e.target.value
                }))}
                placeholder="Endereço completo"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Personalização de Cores
            </CardTitle>
            <CardDescription>
              Customize as cores da aplicação conforme sua identidade visual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Cor Primária
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={cores.primary}
                    onChange={(e) => handleCorChange('primary', e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <Input
                    value={cores.primary}
                    onChange={(e) => handleCorChange('primary', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Cor Secundária
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={cores.secondary}
                    onChange={(e) => handleCorChange('secondary', e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <Input
                    value={cores.secondary}
                    onChange={(e) => handleCorChange('secondary', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Cor de Sucesso
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={cores.success}
                    onChange={(e) => handleCorChange('success', e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <Input
                    value={cores.success}
                    onChange={(e) => handleCorChange('success', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Cor de Aviso
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={cores.warning}
                    onChange={(e) => handleCorChange('warning', e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <Input
                    value={cores.warning}
                    onChange={(e) => handleCorChange('warning', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Cor de Erro
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={cores.danger}
                    onChange={(e) => handleCorChange('danger', e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <Input
                    value={cores.danger}
                    onChange={(e) => handleCorChange('danger', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={aplicarCores} className="flex-1">
                Aplicar Cores
              </Button>
              <Button onClick={resetarCores} variant="outline" className="flex-1">
                Resetar
              </Button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Preview das Cores</h4>
              <div className="flex gap-2">
                <div 
                  className="w-8 h-8 rounded border" 
                  style={{ backgroundColor: cores.primary }}
                  title="Primária"
                />
                <div 
                  className="w-8 h-8 rounded border" 
                  style={{ backgroundColor: cores.secondary }}
                  title="Secundária"
                />
                <div 
                  className="w-8 h-8 rounded border" 
                  style={{ backgroundColor: cores.success }}
                  title="Sucesso"
                />
                <div 
                  className="w-8 h-8 rounded border" 
                  style={{ backgroundColor: cores.warning }}
                  title="Aviso"
                />
                <div 
                  className="w-8 h-8 rounded border" 
                  style={{ backgroundColor: cores.danger }}
                  title="Erro"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
