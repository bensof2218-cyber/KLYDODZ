import { Lock, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';

export default function LoginRequiredModal({ onClose }: { onClose: () => void }) {
  const { setShowAuthModal, setAuthMode } = useAuth();
  const { t } = useLang();

  const handleLogin = () => {
    onClose();
    setAuthMode('login');
    setShowAuthModal(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content text-center max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
          <Lock size={28} className="text-gold" />
        </div>
        <h3 className="font-playfair font-bold text-xl text-white mb-2">{t('loginRequired')}</h3>
        <p className="text-white/60 text-sm font-inter mb-6">{t('loginRequiredMsg')}</p>
        <div className="flex flex-col gap-3">
          <button onClick={handleLogin} className="btn-premium btn-pulse">
            {t('ctaLogin')} <ChevronRight size={16} />
          </button>
          <button onClick={onClose} className="text-white/50 hover:text-white text-sm font-inter transition-colors">
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}
