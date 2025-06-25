
import { 
  BarChart3, 
  Users, 
  FileText, 
  CreditCard, 
  Settings,
  Calendar,
  DollarSign
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    url: "#dashboard",
    icon: BarChart3,
    key: "dashboard"
  },
  {
    title: "Clientes",
    url: "#clientes",
    icon: Users,
    key: "clientes"
  },
  {
    title: "Serviços",
    key: "#servicos",
    icon: FileText,
    key: "serviços"
  },
  {
    title: "Contratos",
    url: "#contratos",
    icon: Calendar,
    key: "contratos"
  },
  {
    title: "Mensalidades",
    url: "#mensalidades",
    icon: CreditCard,
    key: "mensalidades"
  },
  {
    title: "Relatórios",
    url: "#relatorios",
    icon: DollarSign,
    key: "relatórios"
  },
  {
    title: "Configurações",
    url: "#configuracoes",
    icon: Settings,
    key: "configurações"
  },
]

interface AppSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AppSidebar({ activeSection, onSectionChange }: AppSidebarProps) {
  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">SisGest</h2>
            <p className="text-xs text-gray-500">Sistema de Gestão</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => onSectionChange(item.key)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-primary-50 ${
                      activeSection === item.key 
                        ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500' 
                        : 'text-gray-600 hover:text-primary-600'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Admin</p>
            <p className="text-xs text-gray-500">Administrador</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
