import { useRef, useEffect } from 'react';
import AnimatedCounter from '@/components/AnimatedCounter';
import { useLang } from '@/context/LangContext';

const partners = [{ abbr: 'BEA' }, { abbr: 'BNA' }, { abbr: 'BADR' }, { abbr: 'CPA' }];

const stats = [
  { value: 500, prefix: '+', key: 'vehiclesImported' },
  { value: 98, suffix: '%', key: 'satisfaction' },
  { value: 45, prefix: '', key: 'daysAvg' },
  { value: 12, prefix: '', key: 'partners' },
  { value: 8, prefix: '', key: 'yearsExp' },
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLang();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const items = el.querySelectorAll('.reveal-item');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative section-glass-light py-20">
      <div ref={sectionRef} className="container-klydo">
        <h2 className="reveal-item reveal font-playfair font-bold text-[36px] text-midnight text-center mb-12">
          {t('trustUs')}
        </h2>

        <div className="reveal-item reveal flex flex-wrap items-center justify-center gap-8 lg:gap-12 mb-16">
          {partners.map((partner) => (
            <div
              key={partner.abbr}
              className="group flex items-center justify-center w-[160px] h-[60px] bg-white rounded-lg shadow-sm grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
            >
              <span className="font-montserrat font-bold text-xl text-midnight/80 group-hover:text-midnight transition-colors">
                {partner.abbr}
              </span>
            </div>
          ))}
        </div>

        <div className="reveal-item reveal bg-white rounded-xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={stat.key}
                className={`text-center ${
                  idx < stats.length - 1 ? 'md:border-r md:border-gray-200' : ''
                }`}
              >
                <div className="font-roboto font-bold text-[32px] text-turquoise">
                  <AnimatedCounter
                    target={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    duration={1500}
                  />
                </div>
                <div className="font-inter text-[13px] text-midnight/70 mt-1">
                  {t(stat.key)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
