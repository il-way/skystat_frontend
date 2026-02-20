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
import Temperature from "./pages/temperature/Temperature";

// ✅ public pages / layout
import PublicLayout from "./layouts/PublicLayout";
import HomePage from "./pages/public/HomePage";
import ReportPage from "./pages/public/ReportPage";
import GuidePage from "./pages/public/GuidePage";
import FaqPage from "./pages/public/FaqPage";
import PrivacyPage from "./pages/public/PrivacyPage";
import ContactPage from "./pages/public/ContactPage";
import TermsPage from "./pages/public/TermsPage";
import AboutPage from "./pages/public/AboutPage";

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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* ✅ Public 영역: SidebarProvider 절대 적용하지 않음 */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/report/:icao" element={<ReportPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Route>

        {/* ✅ App 영역: SidebarProvider는 여기서만 적용 */}
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/visibility" element={<Visibility />} />
          <Route path="/wind" element={<Wind />} />
          <Route path="/altimeter" element={<Altimeter />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/temperature" element={<Temperature />} />
          <Route path="/windrose" element={<Windrose />} />
        </Route>

        {/* ✅ catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </QueryClientProvider>
  );
}

function AppShell() {
  return (
    <SidebarProvider>
      <AppLayout />
    </SidebarProvider>
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
