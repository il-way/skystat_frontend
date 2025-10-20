import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "./components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { Separator } from "./components/ui/separator";
import {
  BarChart3,
  Cloud,
  GaugeCircle,
  MapPin,
  Settings,
  Wind,
  Search,
  Database,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { KpiCardGrid } from "./components/kpi/KpiGrid";
import type { KpiValues } from "./types/components/kpi/KpiValues";
import Topbar from "./components/topbar/Topbar";
import WindLineChart from "./components/chart/WindLineChart";
import ResultsTable from "./components/table/DashboardTable";
import SidebarNav from "./components/sidebar/SidebarNav";
import { localInputToISO, toLocalInput } from "./lib/date";
import Dashboard from "./pages/Dashboard";



// React Query: client & env
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      placeholderData: keepPreviousData,
    },
  },
});


// ================================
// Root → Providers → Dashboard
// ================================
export default function App() {
  // Top-level provider to guarantee React Query context is available
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <Dashboard />
      </SidebarProvider>
    </QueryClientProvider>
  );
}


