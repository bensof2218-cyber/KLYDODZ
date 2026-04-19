import { useState, useEffect } from 'react';
import { Search, Menu, X, LogOut, ShieldCheck, Building2, Car } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';

type Lang = 'fr' | 'en' | 'ar';

const langConfig: Record<Lang, { flag: string; label: string }> = {
  fr: { flag: 'FR', label: 'Fran\u00e7ais' },
  en: { flag: 'EN', label: 'English' },
  ar: { flag: 'AR', label: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629' },
};

const roleLabels: Record<string, { fr: string; en: string; ar: string; icon: typeof Car; color: string }> = {
  seller_fr: { fr: 'Vendeur', en: 'Seller', ar: '\u0628\u0627\u0626\u0639', icon: Building2, color: 'text-gold' },
  buyer_dz: { fr: 'Acheteur', en: 'Buyer', ar: '\u0645\u0634\u062a\u0631\u064a', icon: Car, color: 'text-turquoise' },
  inspector: { fr: 'Inspecteur', en: 'Inspector', ar: '\u0645\u0641\u062a\u0634', icon: ShieldCheck, color: 'text-amber-400' },
};

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isLoggedIn, user, setShowAuthModal, setAuthMode, logout } = useAuth();
  const { lang, setLang } = useLang();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const userRoleLabel = user?.role ? roleLabels[user.role] : null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled
          ? 'bg-midnight/[0.97] backdrop-blur-xl'
          : 'bg-midnight/[0.90] backdrop-blur-lg'
      }`}
      style={{ minHeight: scrolled ? '84px' : '96px' }}
    >
      <div className="container-klydo h-full flex flex-col">
        {/* Row 1: Logo + Brand + Auth (always visible) */}
        <div className="flex items-center justify-between h-[68px] shrink-0">
          {/* Logo + KLYDO */}
          <a href="#" className="flex items-center gap-3 sm:gap-4 shrink-0">
            <img
              src="/logo-klydo.png"
              alt="KLYDO"
              className={`w-auto object-contain transition-all duration-300 ${
                scrolled ? 'h-12 sm:h-14' : 'h-14 sm:h-16'
              }`}
            />
            <span
              className="font-montserrat font-black text-2xl sm:text-3xl tracking-[0.12em] uppercase hidden sm:block"
              style={{
                background: 'linear-gradient(180deg, #F0D878, #C8A84B, #A0842E)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              KLYDO
            </span>
          </a>

          {/* Right side: Language + Auth */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Switcher — FR EN AR as turquoise badges */}
            <div className="flex items-center gap-1.5">
              {(Object.keys(langConfig) as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`nav-badge nav-badge-sm ${lang === l ? 'active' : ''}`}
                  title={langConfig[l].label}
                >
                  {langConfig[l].flag}
                </button>
              ))}
            </div>

            {/* Auth buttons */}
            {isLoggedIn && userRoleLabel ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.06] rounded-lg border border-white/10">
                  <userRoleLabel.icon size={13} className={userRoleLabel.color} />
                  <span className="text-white text-xs font-inter font-medium hidden sm:inline">{user?.name}</span>
                  <span className={`text-[10px] font-montserrat font-bold uppercase px-1.5 py-0.5 rounded ${userRoleLabel.color} bg-white/5`}>
                    {lang === 'en' ? userRoleLabel.en : lang === 'ar' ? userRoleLabel.ar : userRoleLabel.fr}
                  </span>
                </div>
                <button onClick={logout} className="p-2 text-white/40 hover:text-red-400 transition-colors" title="Logout">
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                  className="nav-badge nav-badge-sm"
                >
                  {lang === 'fr' ? 'Connexion' : lang === 'en' ? 'Login' : '\u062f\u062e\u0648\u0644'}
                </button>
                <button
                  onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
                  className="nav-badge"
                >
                  {lang === 'fr' ? 'Inscription' : lang === 'en' ? 'Sign Up' : '\u062a\u0633\u062c\u064a\u0644'}
                </button>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 text-white/70 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Row 2: Navigation Links — turquoise badges with metallic gold text */}
        <div className="hidden lg:flex items-center gap-2 pb-2 overflow-x-auto no-scrollbar">
          {/* Showroom badge group */}
          <div className="flex items-center gap-2">
            <span
              className="font-montserrat font-bold text-[11px] uppercase tracking-wider mr-1"
              style={{
                background: 'linear-gradient(45deg, #D4AF37, #F1C40F, #B8860B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Showrooms
            </span>
            <a href="#showrooms" className="nav-badge nav-badge-sm">
              Luxe
            </a>
            <a href="#showrooms" className="nav-badge nav-badge-sm">
              Populaire
            </a>
            <a href="#showrooms" className="nav-badge nav-badge-sm">
              Promo
            </a>
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-white/10 mx-1" />

          {/* Other nav links */}
          <a href="#outils" className="nav-badge nav-badge-sm">
            Outils
          </a>
          <a href="#parcours" className="nav-badge nav-badge-sm">
            Parcours
          </a>
          <a href="#footer" className="nav-badge nav-badge-sm">
            Contact
          </a>

          {/* Search bar */}
          <div className="relative ml-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#00CED1' }} />
            <input
              type="text"
              placeholder={lang === 'fr' ? 'Rechercher...' : lang === 'en' ? 'Search...' : '...\u0628\u062d\u062b'}
              className="h-8 pl-9 pr-4 bg-white/[0.06] border border-white/[0.10] rounded-lg text-white text-xs font-inter placeholder:text-white/30 focus:outline-none transition-colors"
              style={{ width: '180px' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#00CED1'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; }}
            />
          </div>
        </div>
      </div>

      {/* ═══════ MOBILE MENU — V10 ═══════ */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[99] bg-[#0D0D1A]" style={{ backgroundColor: '#0D0D1A' }}>
          {/* Header bar */}
          <div
            className="flex items-center justify-between h-[56px] px-6 border-b"
            style={{ backgroundColor: '#0D0D1A', borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center gap-3">
              <img src="/logo-klydo.png" alt="KLYDO" className="h-12" />
              <span
                className="font-montserrat font-black text-2xl tracking-[0.12em] uppercase"
                style={{
                  background: 'linear-gradient(180deg, #F0D878, #C8A84B, #A0842E)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                KLYDO
              </span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 text-white/70 hover:text-white"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          {/* Scrollable content — SOLID background */}
          <div
            className="overflow-y-auto px-6 py-6 flex flex-col gap-6"
            style={{ backgroundColor: '#0D0D1A', height: 'calc(100vh - 56px)' }}
          >
            {/* Showrooms group */}
            <div className="flex flex-col gap-2">
              <span className="text-gold/70 text-[10px] font-montserrat font-bold uppercase tracking-wider px-1">Showrooms</span>
              <div className="flex flex-wrap gap-2">
                <a href="#showrooms" className="nav-badge nav-badge-sm" onClick={() => setMobileOpen(false)}>
                  Luxe
                </a>
                <a href="#showrooms" className="nav-badge nav-badge-sm" onClick={() => setMobileOpen(false)}>
                  Populaire
                </a>
                <a href="#showrooms" className="nav-badge nav-badge-sm" onClick={() => setMobileOpen(false)}>
                  Promo
                </a>
              </div>
            </div>

            {/* Other links */}
            <div className="flex flex-wrap gap-2">
              <span className="text-gold/70 text-[10px] font-montserrat font-bold uppercase tracking-wider px-1 w-full">Navigation</span>
              <a href="#outils" className="nav-badge nav-badge-sm" onClick={() => setMobileOpen(false)}>
                Outils
              </a>
              <a href="#parcours" className="nav-badge nav-badge-sm" onClick={() => setMobileOpen(false)}>
                Parcours
              </a>
              <a href="#footer" className="nav-badge nav-badge-sm" onClick={() => setMobileOpen(false)}>
                Contact
              </a>
            </div>

            {/* Language */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
              <span className="text-gold/70 text-[10px] font-montserrat font-bold uppercase tracking-wider px-1 w-full">Langue</span>
              {(Object.keys(langConfig) as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => { setLang(l); }}
                  className={`nav-badge nav-badge-sm ${lang === l ? 'active' : ''}`}
                >
                  {langConfig[l].flag}
                </button>
              ))}
            </div>

            {/* Mobile auth */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
              {isLoggedIn ? (
                <div className="flex items-center justify-between w-full px-1">
                  <span className="text-white text-sm font-inter">{user?.name}</span>
                  <button onClick={logout} className="text-red-400 text-sm font-inter">Logout</button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => { setAuthMode('login'); setShowAuthModal(true); setMobileOpen(false); }}
                    className="nav-badge nav-badge-sm flex-1"
                  >
                    {lang === 'fr' ? 'Connexion' : lang === 'en' ? 'Login' : '\u062f\u062e\u0648\u0644'}
                  </button>
                  <button
                    onClick={() => { setAuthMode('register'); setShowAuthModal(true); setMobileOpen(false); }}
                    className="nav-badge flex-1"
                  >
                    {lang === 'fr' ? 'Inscription' : lang === 'en' ? 'Sign Up' : '\u062a\u0633\u062c\u064a\u0644'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
