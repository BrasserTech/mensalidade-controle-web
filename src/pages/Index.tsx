
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/components/Dashboard";
import { Clientes } from "@/components/Clientes";
import { Mensalidades } from "@/components/Mensalidades";
import { useSystemData } from "@/hooks/useSystemData";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, FileText, Calendar } from "lucide-react";

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
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
    updateMensalidadePagamento
  } = useSystemData();

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard stats={getDashboardStats()} />;
      case 'clientes':
        return (
          <Clientes
            clientes={clientes}
            onAddCliente={addCliente}
            onUpdateCliente={updateCliente}
            onDeleteCliente={deleteCliente}
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
          />
        );
      case 'servicos':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Serviços</h1>
              <p className="text-gray-600">Gerencie os serviços oferecidos pela empresa</p>
            </div>
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Gestão de Serviços</h3>
                <p className="text-gray-500">Esta seção será implementada em breve.</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'contratos':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Contratos</h1>
              <p className="text-gray-600">Gerencie contratos de clientes e serviços</p>
            </div>
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Gestão de Contratos</h3>
                <p className="text-gray-500">Esta seção será implementada em breve.</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'relatórios':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Relatórios</h1>
              <p className="text-gray-600">Relatórios financeiros e exportação de dados</p>
            </div>
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Relatórios e Exportação</h3>
                <p className="text-gray-500">Funcionalidade de relatórios será implementada em breve.</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'configurações':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
              <p className="text-gray-600">Configurações do sistema e usuários</p>
            </div>
            <Card>
              <CardContent className="text-center py-12">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Configurações do Sistema</h3>
                <p className="text-gray-500">Painel de configurações será implementado em breve.</p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return <Dashboard stats={getDashboardStats()} />;
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
    </SidebarProvider>
  );
};

export default Index;
