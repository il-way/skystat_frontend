import { BarChart3, Cloud, Database,Eye, Gauge, GaugeCircle,Sun, Webhook, Wind } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

export default function SidebarNav() {
  return (
    <Sidebar className="border-r">
        <SidebarHeader>
          <div className="px-3 py-2">
            <div className="flex items-center gap-2">
              <GaugeCircle className="h-5 w-5" />
              <span className="font-semibold">Skystat</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">Aviation Weather Analytics</div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <BarChart3 className="h-4 w-4" /> Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Eye className="h-4 w-4" /> Visbility
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Wind className="h-4 w-4" /> Wind
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Cloud className="h-4 w-4" /> Cloud
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Gauge className="h-4 w-4" /> Altimeter
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Webhook className="h-4 w-4" /> Windrose
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Sun className="h-4 w-4" /> Weather
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
            <Database className="h-4 w-4" /> Backend: Spring Boot 3.9 (Assumed)
          </div>
        </SidebarFooter>
      </Sidebar>
  )
}