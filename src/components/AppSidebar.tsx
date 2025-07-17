
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  CreditCard, 
  PiggyBank,
  DollarSign,
  LineChart,
  User
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
  { title: "Income", url: "/income", icon: TrendingUp },
  { title: "Expenses", url: "/expenses", icon: TrendingDown },
  { title: "Savings", url: "/savings", icon: PiggyBank },
  { title: "Investment", url: "/investment", icon: LineChart },
  { title: "Debt Tracker", url: "/debt-tracker", icon: CreditCard },
  { title: "Account", url: "/account", icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-blue-100 text-blue-700 font-medium border-r-2 border-blue-500" : "hover:bg-gray-100 text-gray-700";

  const collapsed = state === "collapsed";

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} border-r border-gray-200 bg-white`}
      collapsible="icon"
    >
      <SidebarHeader className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900">BudgetApp</h2>
              <p className="text-xs text-gray-500">Financial Management</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 font-medium">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
