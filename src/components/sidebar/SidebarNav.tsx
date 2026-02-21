import {
  BarChart3,
  Copyright,
  Eye,
  Feather,
  Gauge,
  Info,
  LifeBuoy,
  Mail,
  ScrollText,
  ShieldCheck,
  Sun,
  ThermometerSnowflake,
  UserCircle2,
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
import { useTranslation } from "react-i18next";

export default function SidebarNav() {
  const { t } = useTranslation();

  return (
    <Sidebar
      overlay
      className="border-r border-slate-200"
      innerClassName="bg-white/95 backdrop-blur-sm"
    >
      <SidebarHeader className="border-b border-slate-200 bg-transparent">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2">
            <img src="/icon_color.png" className="h-5 w-5" />
            <span className="font-semibold text-slate-900">SkyStat</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Aviation Weather Analytics
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {t("sidebar.analysisMenu")}
          </p>
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

        <SidebarGroup className="mt-1 border-t border-slate-200 pt-2 md:hidden">
          <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {t("sidebar.infoPages")}
          </p>
          <SidebarMenu>
            <NavItem to="/about" icon={Info} label="About" />
            <NavItem to="/guide" icon={LifeBuoy} label="Guide" />
            <NavItem to="/faq" icon={UserCircle2} label="FAQ" />
            <NavItem to="/terms" icon={ScrollText} label="Terms" />
            <NavItem to="/privacy" icon={ShieldCheck} label="Privacy" />
            <NavItem to="/contact" icon={Mail} label="Contact" />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-slate-200 bg-transparent pt-2">
        <div className="flex items-center gap-2 px-3 text-xs text-slate-500">
          <Copyright className="h-3 w-3" /> Created by il-way
        </div>
        <div className="flex items-center gap-2 px-3 pb-2 text-xs text-slate-500">
          <Mail className="h-3 w-3" /> ilway5186@gmail.com
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
        <SidebarMenuButton
          isActive={active}
          className="rounded-xl text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 data-[active=true]:border data-[active=true]:border-slate-200 data-[active=true]:bg-white data-[active=true]:text-slate-900 data-[active=true]:shadow-sm"
        >
          <Icon
            className={`h-4 w-4 ${active ? "text-slate-700" : "text-slate-500"}`}
          />
          <span>{label}</span>
        </SidebarMenuButton>
      </NavLink>
    </SidebarMenuItem>
  );
}
