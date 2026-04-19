import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
} from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

const navItems = [
  { path: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { path: '/admin/vehicles', label: 'Véhicules', icon: Car },
  { path: '/admin/requests', label: 'Demandes clients', icon: Users },
  { path: '/admin/settings', label: 'Paramètres', icon: Settings },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { admin, adminLogout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-deep-black flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-midnight border-r border-gold/15 transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'w-64' : 'w-20'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center gap-3 px-5 border-b border-white/10">
          <img
            src="/logo-klydo.png"
            alt="KLYDO"
            className="h-10 w-auto object-contain"
          />
          {sidebarOpen && (
            <span
              className="font-montserrat font-black text-xl tracking-wider uppercase"
              style={{
                background: 'linear-gradient(180deg, #F0D878, #C8A84B, #A0842E)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              KLYDO
            </span>
          )}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden ml-auto text-white/50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-inter font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-gold/15 text-gold border border-gold/25'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.04] border border-transparent'
                  }`
                }
              >
                <Icon size={20} className="shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
                {sidebarOpen && (
                  <ChevronRight
                    size={14}
                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom: Admin info + Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
              <span className="font-montserrat font-bold text-sm text-gold">
                {admin?.name?.charAt(0) || 'A'}
              </span>
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="text-white text-sm font-inter font-medium truncate">
                  {admin?.name || 'Admin'}
                </p>
                <p className="text-white/40 text-xs font-inter truncate">
                  {admin?.email || 'admin@klydo.com'}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400/80 hover:text-red-400 hover:bg-red-500/10 text-sm font-inter transition-all"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>

        {/* Collapse toggle (desktop) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex absolute -right-3 top-24 w-6 h-6 bg-gold rounded-full items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <ChevronRight
            size={14}
            className={`text-midnight transition-transform ${
              sidebarOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-midnight/80 backdrop-blur-lg border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-white/60 hover:text-white"
            >
              <Menu size={22} />
            </button>
            <h1 className="font-playfair font-bold text-xl text-white">
              Panneau d'administration
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-white/50 hover:text-gold transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
              <span className="font-montserrat font-bold text-xs text-gold">
                {admin?.name?.charAt(0) || 'A'}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
