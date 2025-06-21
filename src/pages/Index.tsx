
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/components/Dashboard";
import { Clientes } from "@/components/Clientes";
import { Servicos } from "@/components/Servicos";
import { Contratos } from "@/components/Contratos";
import { Mensalidades } from "@/components/Mensalidades";
import { Relatorios } from "@/components/Relatorios";
import { Configuracoes } from "@/components/Configuracoes";
import { Auth } from "@/components/Auth";
import { DetalhesAlert } from "@/components/DetalhesAlert";
import { AdicionarMensalidade } from "@/components/AdicionarMensalidade";
import { useSystemData } from "@/hooks/useSystemData";
import { Toaster } from "@/components/ui/sonner";

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ nome: string; email: string; tipo: 'Administrador' | 'Operador' } | null>(null);
  const [showDetalhesAlert, setShowDetalhesAlert] = useState(false);
  const [showAdicionarMensalidade, setShowAdicionarMensalidade] = useState(false);
  
  const {
    clientes,
    servicos,
    contratos,
    mensalidades,
    getDashboardStats,
    addCliente,
    updateCliente,
    deleteCliente,
    addServico,
    updateServico,
    deleteServico,
    addContrato,
    updateContrato,
    deleteContrato,
    updateMensalidadePagamento,
    addMensalidade
  } = useSystemData();

  const handleLogin = (user: { nome: string; email: string; tipo: 'Administrador' | 'Operador' }) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setActiveSection('dashboard');
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <Dashboard 
            stats={getDashboardStats()} 
            onVerDetalhes={() => setShowDetalhesAlert(true)}
          />
        );
      case 'clientes':
        return (
          <Clientes
            clientes={clientes}
            onAddCliente={addCliente}
            onUpdateCliente={updateCliente}
            onDeleteCliente={deleteCliente}
          />
        );
      case 'servicos':
        return (
          <Servicos
            servicos={servicos}
            onAddServico={addServico}
            onUpdateServico={updateServico}
            onDeleteServico={deleteServico}
          />
        );
      case 'contratos':
        return (
          <Contratos
            contratos={contratos}
            clientes={clientes}
            servicos={servicos}
            onAddContrato={addContrato}
            onUpdateContrato={updateContrato}
            onDeleteContrato={deleteContrato}
          />
        );
      case 'mensalidades':
        return (
          <Mensalidades
            mensalidades={mensalidades}
            clientes={clientes}
            contratos={contratos}
            servicos={servicos}
            onUpdatePagamento={updateMensalidadePagamento}
            onAddMensalidade={() => setShowAdicionarMensalidade(true)}
          />
        );
      case 'relatórios':
        return (
          <Relatorios
            clientes={clientes}
            contratos={contratos}
            mensalidades={mensalidades}
            servicos={servicos}
          />
        );
      case 'configurações':
        return <Configuracoes currentUser={currentUser} onLogout={handleLogout} />;
      default:
        return <Dashboard stats={getDashboardStats()} onVerDetalhes={() => setShowDetalhesAlert(true)} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 overflow-auto">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
            <SidebarTrigger className="lg:hidden" />
          </div>
          <div className="p-6 animate-fade-in">
            {renderContent()}
          </div>
        </main>
      </div>
      
      <DetalhesAlert
        isOpen={showDetalhesAlert}
        onClose={() => setShowDetalhesAlert(false)}
        mensalidades={mensalidades}
        clientes={clientes}
        contratos={contratos}
        servicos={servicos}
      />
      
      <AdicionarMensalidade
        isOpen={showAdicionarMensalidade}
        onClose={() => setShowAdicionarMensalidade(false)}
        contratos={contratos}
        clientes={clientes}
        servicos={servicos}
        onAddMensalidade={addMensalidade}
      />
      
      <Toaster />
    </SidebarProvider>
  );
};

export default Index;
