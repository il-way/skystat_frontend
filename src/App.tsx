import { SidebarProvider } from "./components/ui/sidebar";
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
} from "@tanstack/react-query";
import Dashboard from "./pages/dashboard/Dashboard";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Visibility from "./pages/threshold/Visibility";
import Weather from "./pages/weather/Weather";
import Altimeter from "./pages/threshold/Altimeter";
import SidebarNav from "./components/sidebar/SidebarNav";
import Wind from "./pages/threshold/Wind";
import Windrose from "./pages/windrose/Windrose";
import Temperature from "./pages/temperature/temperature";

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
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/visibility" element={<Visibility />} />
              <Route path="/wind" element={<Wind />} />
              <Route path="/altimeter" element={<Altimeter />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/temperature" element={<Temperature />} />
              <Route path="/windrose" element={<Windrose />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
      </SidebarProvider>
    </QueryClientProvider>
  );
}

function AppLayout() {
  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <SidebarNav />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}
