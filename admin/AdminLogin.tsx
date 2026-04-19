import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldAlert, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await adminLogin(email, password);
    setLoading(false);
    if (success) {
      navigate('/admin');
    } else {
      setError('Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="min-h-screen bg-deep-black flex items-center justify-center p-4">
      <div
        className="w-full max-w-md bg-midnight border border-gold/25 rounded-2xl p-8"
        style={{ boxShadow: '0 0 60px rgba(0,0,0,0.5), 0 0 20px rgba(200,168,75,0.1)' }}
      >
        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/logo-klydo.png"
              alt="KLYDO"
              className="h-14 w-auto"
            />
            <span
              className="font-montserrat font-black text-2xl tracking-wider uppercase"
              style={{
                background: 'linear-gradient(180deg, #F0D878, #C8A84B, #A0842E)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              KLYDO
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldAlert size={18} className="text-gold" />
            <h2 className="font-playfair font-bold text-xl text-white">
              Espace Administrateur
            </h2>
          </div>
          <p className="text-white/50 text-sm font-inter">
            Accès sécurisé au panneau de gestion
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm font-inter text-center">
            {error}
          </div>
        )}

        {/* Hint */}
        <div className="mb-6 p-3 bg-gold/5 border border-gold/15 rounded-lg">
          <p className="text-gold/70 text-xs font-inter text-center">
            Demo : <strong className="text-gold">admin@klydo.com</strong> / <strong className="text-gold">klydo2026</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-1.5 font-inter">
              Email
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-white/[0.06] border border-white/[0.12] rounded-lg text-white text-sm font-inter placeholder:text-white/30 focus:border-gold"
                placeholder="admin@klydo.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-1.5 font-inter">
              Mot de passe
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-10 bg-white/[0.06] border border-white/[0.12] rounded-lg text-white text-sm font-inter placeholder:text-white/30 focus:border-gold"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full btn-gold-solid mt-2 ${loading ? 'opacity-70 cursor-wait' : ''}`}
          >
            {loading ? (
              <span className="animate-pulse">Connexion en cours...</span>
            ) : (
              <>
                Se connecter
                <ChevronRight size={16} className="ml-1" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-white/40 hover:text-gold text-sm font-inter transition-colors"
          >
            ← Retour au site
          </a>
        </div>
      </div>
    </div>
  );
}
