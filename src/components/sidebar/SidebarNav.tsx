import {
  BarChart3,
  Cloud,
  Database,
  Eye,
  Feather,
  Gauge,
  GaugeCircle,
  Rainbow,
  Sun,
  ThermometerSnowflake,
  Webhook,
  Wind,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";

export default function SidebarNav() {
  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <div className="px-3 py-2">
          <div className="flex items-center gap-2">
            <GaugeCircle className="h-5 w-5" />
            <span className="font-semibold">Skystat</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Aviation Weather Analytics
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <NavItem to="/dashboard" icon={BarChart3} label="Dashboard" />
            <NavItem to="/visibility" icon={Eye} label="Visibility" />
            <NavItem to="/wind" icon={Wind} label="Wind" />
            <NavItem to="/altimeter" icon={Gauge} label="Altimeter" />
            <NavItem to="/weather" icon={Sun} label="Weather" />
            <NavItem
              to="/temperature"
              icon={ThermometerSnowflake}
              label="Temperature"
            />
            <NavItem to="/windrose" icon={Feather} label="Windrose" />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
          <Database className="h-4 w-4" /> Backend: Spring Boot 3.9 (Assumed)
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function NavItem({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <SidebarMenuItem>
      {/* 버튼 외형은 유지하고, 클릭 시 해당 경로로 이동 */}
      <NavLink to={to} className="block">
        <SidebarMenuButton isActive={active}>
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </SidebarMenuButton>
      </NavLink>
    </SidebarMenuItem>
  );
}
