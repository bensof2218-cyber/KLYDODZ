import { Facebook, Instagram, Linkedin, Phone, MapPin, Mail, Lock } from 'lucide-react';
import { useLang } from '@/context/LangContext';

export default function FooterSection() {
  const { t } = useLang();

  return (
    <footer id="footer" className="relative section-glass pt-20 pb-8">
      <div className="container-klydo">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div>
            <img
              src="/logo-klydo.png"
              alt="KLYDO AUTO IMPORT"
              className="h-12 w-auto object-contain logo-klydo"
              style={{ filter: 'drop-shadow(0 0 6px rgba(30,100,220,0.3))' }}
            />
            <p className="font-inter text-[14px] text-white/60 mt-4 max-w-[280px] leading-relaxed">
              Votre partenaire de confiance pour l&apos;importation de v&eacute;hicules de
              France vers l&apos;Alg&eacute;rie. V&eacute;rifi&eacute;, s&eacute;curis&eacute;, livr&eacute;.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[Facebook, Instagram, Linkedin, Phone].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-white/50 hover:text-gold transition-colors duration-300"
                  aria-label="social"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-montserrat font-semibold text-sm text-white uppercase tracking-[1px]">
              {t('navigation')}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {['Accueil', 'Showroom Luxe', 'Showroom Populaire', 'Promotions', 'Outils'].map(
                (label) => (
                  <li key={label}>
                    <a href="#" className="font-inter text-[14px] text-white/60 hover:text-gold transition-colors">
                      {label}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-montserrat font-semibold text-sm text-white uppercase tracking-[1px]">
              {t('services')}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {['V\u00e9rification terrain', 'Transitaire', 'Assurance DZ', 'Calculateur', 'Tracker GPS'].map(
                (label) => (
                  <li key={label}>
                    <a href="#" className="font-inter text-[14px] text-white/60 hover:text-gold transition-colors">
                      {label}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-montserrat font-semibold text-sm text-white uppercase tracking-[1px]">
              {t('contact')}
            </h4>
            <div className="mt-4 space-y-3">
              {[
                { icon: MapPin, text: '12 Rue de la Paix, 75002 Paris, France' },
                { icon: MapPin, text: '45 Boulevard Mohamed VI, Alger, Alg\u00e9rie' },
                { icon: Phone, text: '+33 1 23 45 67 89' },
                { icon: Phone, text: '+213 23 45 67 89' },
                { icon: Mail, text: 'contact@klydo.com' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <item.icon size={16} className="text-gold mt-0.5 shrink-0" />
                  <p className="font-inter text-[14px] text-white/60">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-inter text-[13px] text-white/40">
            &copy; 2026 Klydo. {t('allRights')}.
          </p>
          <div className="flex items-center gap-2 font-inter text-[13px] text-white/40">
            <a href="#" className="hover:text-gold transition-colors">CGV</a>
            <span>&middot;</span>
            <a href="#" className="hover:text-gold transition-colors">{t('privacyPolicy')}</a>
            <span>&middot;</span>
            <a href="#" className="hover:text-gold transition-colors">{t('legalMentions')}</a>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gold/10 rounded text-gold">
            <Lock size={14} />
            <span className="font-inter font-medium text-[12px]">{t('paymentSecure')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
