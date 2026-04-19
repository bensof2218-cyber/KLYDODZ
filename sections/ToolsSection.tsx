import { useRef, useEffect, useState } from 'react';
import { Calculator, MapPin, Shield, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import LoginRequiredModal from '@/components/LoginRequiredModal';
import BankVerifyModal from '@/components/BankVerifyModal';

const tools = [
  {
    id: 'calculateur',
    icon: Calculator,
    key: 'customsCalc',
    descKey: 'calcDesc',
    button: 'simulate',
    buttonStyle: 'btn-premium btn-pulse',
    borderColor: 'border-turquoise/25',
    iconColor: 'text-turquoise',
  },
  {
    id: 'tracker',
    icon: MapPin,
    key: 'trackerGPS',
    descKey: 'trackerDesc',
    button: 'track',
    buttonStyle: 'btn-gold-glow',
    borderColor: 'border-gold/20',
    iconColor: 'text-gold',
  },
  {
    id: 'coffrefort',
    icon: Shield,
    key: 'safeBox',
    descKey: 'safeDesc',
    button: 'access',
    borderColor: 'border-turquoise/25',
    iconColor: 'text-turquoise',
    buttonStyle: 'btn-premium btn-pulse',
  },
];

export default function ToolsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn } = useAuth();
  const { t } = useLang();
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [showBankVerify, setShowBankVerify] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const cards = el.querySelectorAll('.tool-card');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Array.from(cards).indexOf(entry.target as Element);
            setTimeout(() => entry.target.classList.add('visible'), idx * 120);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const handleToolClick = () => {
    if (!isLoggedIn) {
      setShowLoginRequired(true);
    } else {
      setShowBankVerify(true);
    }
  };

  return (
    <section id="outils" className="relative section-glass py-20 lg:py-[120px]">
      <div ref={sectionRef} className="container-klydo">
        {/* Section title */}
        <div className="text-center mb-16">
          <h2 className="section-title">{t('yourTools')}</h2>
          <div className="section-line bg-turquoise" />
          {!isLoggedIn && (
            <p className="text-white/50 text-sm font-inter mt-3 flex items-center justify-center gap-2">
              <Lock size={14} />
              {t('loginRequiredMsg')}
            </p>
          )}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className={`tool-card reveal relative p-10 rounded-xl bg-midnight border ${tool.borderColor} transition-all duration-300 hover:-translate-y-1 group`}
                style={{ borderWidth: '1px' }}
              >
                {/* Locked overlay */}
                {!isLoggedIn && (
                  <div className="locked-overlay z-10">
                    <Lock size={32} className="text-gold mb-3" />
                    <p className="text-white/70 text-sm font-inter mb-4 text-center px-6">
                      {t('loginRequiredMsg')}
                    </p>
                    <button
                      onClick={() => setShowLoginRequired(true)}
                      className="btn-premium btn-pulse text-sm py-2 px-5"
                    >
                      {t('ctaLogin')}
                    </button>
                  </div>
                )}

                <Icon
                  size={48}
                  className={`${tool.iconColor} transition-transform duration-300 group-hover:scale-110`}
                />
                <h3 className="font-playfair font-bold text-[22px] text-white mt-5">
                  {t(tool.key)}
                </h3>
                <p className="font-inter text-[15px] text-white/70 mt-3 leading-relaxed">
                  {t(tool.descKey)}
                </p>
                <button
                  onClick={handleToolClick}
                  className={`mt-6 ${tool.buttonStyle}`}
                >
                  {t(tool.button)}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {showLoginRequired && (
        <LoginRequiredModal onClose={() => setShowLoginRequired(false)} />
      )}
      {showBankVerify && (
        <BankVerifyModal onClose={() => setShowBankVerify(false)} />
      )}
    </section>
  );
}
