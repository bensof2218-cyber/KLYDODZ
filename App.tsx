import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { LangProvider } from '@/context/LangContext';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import TunnelBackground from '@/components/TunnelBackground';
import Navigation from '@/sections/Navigation';
import HeroSection from '@/sections/HeroSection';
import ShowroomsSection from '@/sections/ShowroomsSection';
import ParcoursSplitSection from '@/sections/ParcoursSplitSection';
import ToolsSection from '@/sections/ToolsSection';
import StatsSection from '@/sections/StatsSection';
import FooterSection from '@/sections/FooterSection';
import AuthModal from '@/components/AuthModal';
import ChatWidget from '@/components/ChatWidget';
import AdminLayout from '@/admin/AdminLayout';
import AdminLogin from '@/admin/AdminLogin';
import Dashboard from '@/admin/Dashboard';
import VehicleManagement from '@/admin/VehicleManagement';
import ClientRequests from '@/admin/ClientRequests';
import AdminSettings from '@/admin/AdminSettings';

/* Protected admin route wrapper */
function AdminProtected({ children }: { children: React.ReactNode }) {
  const { isAdminLoggedIn } = useAdminAuth();
  return isAdminLoggedIn ? <>{children}</> : <Navigate to="/admin/login" replace />;
}

/* Main website layout */
function MainSite() {
  return (
    <>
      <TunnelBackground />
      <div className="relative z-10">
        <Navigation />
        <HeroSection />
        <ShowroomsSection />
        <ParcoursSplitSection />
        <ToolsSection />
        <StatsSection />
        <FooterSection />
      </div>
      <AuthModal />
      <ChatWidget />
    </>
  );
}

/* Admin routes */
function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route
        path="*"
        element={
          <AdminProtected>
            <AdminLayout />
          </AdminProtected>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="vehicles" element={<VehicleManagement />} />
        <Route path="requests" element={<ClientRequests />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LangProvider>
        <AuthProvider>
          <AdminAuthProvider>
            <Routes>
              <Route path="/*" element={<MainSite />} />
              <Route path="/admin/*" element={<AdminRoutes />} />
            </Routes>
          </AdminAuthProvider>
        </AuthProvider>
      </LangProvider>
    </BrowserRouter>
  );
}
