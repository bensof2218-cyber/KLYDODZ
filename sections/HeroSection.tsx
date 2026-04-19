import { useEffect, useState } from 'react';
import ParticleCanvas from '@/components/ParticleCanvas';
import AnimatedCounter from '@/components/AnimatedCounter';
import { useLang } from '@/context/LangContext';

export default function HeroSection() {
  const { t, isRTL } = useLang();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-28 pb-40"
      style={{
        background: 'linear-gradient(180deg, rgba(26,26,46,0.85) 0%, rgba(13,13,26,0.75) 50%, rgba(13,13,26,0.6) 100%)',
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      {/* Particle canvas */}
      <ParticleCanvas />

      {/* Content — vertically centered in available space above stats */}
      <div className="relative z-10 text-center px-6 max-w-[900px] mx-auto flex flex-col items-center justify-center flex-1">
        {/* Headline */}
        <h1
          className={`font-playfair font-bold text-white leading-[1.1] transition-all duration-700 ease-out ${
            loaded
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
          style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
        >
          {t('heroTitle')}{' '}
          <span className="text-gold">{t('heroTitleAccent')}</span>
        </h1>

        {/* Subtitle */}
        <p
          className={`font-inter text-white/70 mt-6 max-w-[600px] mx-auto transition-all duration-600 ease-out ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            transitionDelay: loaded ? '300ms' : '0ms',
          }}
        >
          {t('heroSubtitle')}
        </p>

        {/* CTAs with generous margin */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 mb-16 transition-all duration-500 ease-out ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: loaded ? '500ms' : '0ms' }}
        >
          <a href="#showrooms" className="btn-premium btn-pulse">
            {t('exploreVehicles')}
          </a>
          <a href="#parcours" className="btn-gold-glow">
            {t('howItWorks')}
          </a>
        </div>
      </div>

      {/* Stats — anchored at bottom with clear separation */}
      <div
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-10 w-full max-w-[800px] px-6 transition-all duration-500 ease-out ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: loaded ? '700ms' : '0ms' }}
      >
        {/* Separator line above stats */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-6" />

        <div className="flex items-center justify-center divide-x divide-white/20">
          <div className="flex-1 text-center px-4">
            <div className="font-roboto font-bold text-gold text-[clamp(24px,3vw,36px)]">
              <AnimatedCounter target={500} prefix="+" />
            </div>
            <div className="font-inter text-white/60 text-sm mt-1">
              {t('vehiclesImported')}
            </div>
          </div>
          <div className="flex-1 text-center px-4">
            <div className="font-roboto font-bold text-gold text-[clamp(24px,3vw,36px)]">
              <AnimatedCounter target={1200} prefix="+" />
            </div>
            <div className="font-inter text-white/70 text-sm mt-1">
              {t('satisfiedClients')}
            </div>
          </div>
          <div className="flex-1 text-center px-4">
            <div className="font-roboto font-bold text-gold text-[clamp(24px,3vw,36px)]">
              <AnimatedCounter target={45} />
            </div>
            <div className="font-inter text-white/70 text-sm mt-1">
              {t('avgDelivery')}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-gold rounded-full" />
        </div>
      </div>
    </section>
  );
}
