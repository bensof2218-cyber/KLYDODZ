import { useRef, useEffect } from 'react';
import { Diamond, Star, Flame, ArrowRight, Car } from 'lucide-react';
import { useLang } from '@/context/LangContext';

const showrooms = [
  {
    id: 'luxe',
    title: 'Showroom Luxe',
    titleEn: 'Luxury Showroom',
    titleAr: 'المعرض الفاخر',
    description:
      'Véhicules premium de plus de 30 000€. BMW, Mercedes, Audi, Porsche et plus.',
    descriptionEn: 'Premium vehicles over €30,000. BMW, Mercedes, Audi, Porsche and more.',
    descriptionAr: 'مركبات فاخرة بأكثر من 30,000 يورو. بي إم دبليو، مرسيدس، أودي، بورش.',
    brands: ['BMW', 'Mercedes', 'Audi', 'Porsche', 'Lexus', 'Jaguar'],
    count: '+47',
    countLabel: 'véhicules disponibles',
    image: '/showroom-luxe.jpg',
    badge: 'PREMIUM',
    badgeIcon: Diamond,
    badgeColor: 'bg-gold/90 text-midnight',
    accentColor: 'text-gold',
    borderColor: 'border-gold/30',
    gradient: 'linear-gradient(135deg, rgba(201,168,75,0.1) 0%, rgba(26,26,46,0.95) 50%, rgba(13,13,26,0.98) 100%)',
    buttonStyle: 'btn-gold-glow',
    priceFrom: '30 000 €',
  },
  {
    id: 'populaire',
    title: 'Showroom Populaire',
    titleEn: 'Popular Showroom',
    titleAr: 'المعرض الشعبي',
    description:
      'Véhicules fiables entre 8 000€ et 30 000€. Renault, Peugeot, Citroën, Dacia, Toyota.',
    descriptionEn: 'Reliable vehicles between €8,000 and €30,000. Renault, Peugeot, Citroën, Dacia, Toyota.',
    descriptionAr: 'مركبات موثوقة بين 8,000 و 30,000 يورو. رينو، بيجو، ستروين، داسيا، تويوتا.',
    brands: ['Renault', 'Peugeot', 'Citroën', 'Dacia', 'Toyota', 'Hyundai'],
    count: '+312',
    countLabel: 'véhicules disponibles',
    image: '/showroom-populaire.jpg',
    badge: 'FIABLE',
    badgeIcon: Star,
    badgeColor: 'bg-turquoise text-white',
    accentColor: 'text-turquoise',
    borderColor: 'border-turquoise/30',
    gradient: 'linear-gradient(135deg, rgba(14,124,125,0.12) 0%, rgba(26,26,46,0.95) 50%, rgba(13,13,26,0.98) 100%)',
    buttonStyle: 'btn-premium',
    priceFrom: '8 000 €',
  },
  {
    id: 'promo',
    title: 'Promotions',
    titleEn: 'Promotions',
    titleAr: 'العروض',
    description:
      "Véhicules en offre spéciale avec remises exclusives. Profitez-en avant qu'il ne soit trop tard !",
    descriptionEn: 'Vehicles on special offer with exclusive discounts. Grab them before it\'s too late!',
    descriptionAr: 'مركبات بعروض خاصة مع خصومات حصرية. استفد منها قبل فوات الأوان!',
    brands: ['Toutes marques', 'Remises jusqu\'à -25%'],
    count: '+18',
    countLabel: 'véhicules en promo',
    image: '/showroom-promo.jpg',
    badge: '-25%',
    badgeIcon: Flame,
    badgeColor: 'bg-red-600 text-white',
    accentColor: 'text-gold',
    borderColor: 'border-red-500/30',
    gradient: 'linear-gradient(135deg, rgba(220,38,38,0.08) 0%, rgba(26,26,46,0.95) 50%, rgba(13,13,26,0.98) 100%)',
    buttonStyle: 'btn-gold-solid',
    oldPrice: '28 500 €',
    newPrice: '21 400 €',
  },
];

export default function ShowroomsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { lang } = useLang();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const cards = el.querySelectorAll('.showroom-row');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Array.from(cards).indexOf(entry.target as Element);
            setTimeout(() => entry.target.classList.add('visible'), idx * 200);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const getTitle = (s: typeof showrooms[0]) =>
    lang === 'en' ? s.titleEn : lang === 'ar' ? s.titleAr : s.title;

  const getDesc = (s: typeof showrooms[0]) =>
    lang === 'en' ? s.descriptionEn : lang === 'ar' ? s.descriptionAr : s.description;

  return (
    <section id="showrooms" className="relative section-glass py-20 lg:py-[120px]">
      <div ref={sectionRef} className="container-klydo space-y-10">
        {/* Section title */}
        <div className="text-center mb-12">
          <h2 className="section-title">
            {lang === 'fr' ? 'Nos Showrooms' : lang === 'en' ? 'Our Showrooms' : 'معارضنا'}
          </h2>
          <div className="section-line" />
        </div>

        {/* Horizontal full-width showroom rows */}
        {showrooms.map((showroom, idx) => {
          const BadgeIcon = showroom.badgeIcon;
          const isEven = idx % 2 === 0;
          return (
            <div
              key={showroom.id}
              className={`showroom-row reveal group cursor-pointer rounded-2xl border ${showroom.borderColor} overflow-hidden transition-all duration-500 hover:shadow-gold`}
              style={{
                background: showroom.gradient,
                borderWidth: '1px',
              }}
            >
              <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                {/* Image - takes 55% on large screens */}
                <div className="relative lg:w-[55%] aspect-[16/9] lg:aspect-auto overflow-hidden">
                  <img
                    src={showroom.image}
                    alt={getTitle(showroom)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: isEven
                        ? 'linear-gradient(to right, transparent 40%, rgba(13,13,26,0.95))'
                        : 'linear-gradient(to left, transparent 40%, rgba(13,13,26,0.95))',
                    }}
                  />
                  {/* Badge */}
                  <div
                    className={`absolute top-5 left-5 flex items-center gap-2 px-4 py-2 rounded-lg ${showroom.badgeColor}`}
                  >
                    <BadgeIcon size={16} />
                    <span className="font-montserrat font-bold text-sm uppercase tracking-wider">
                      {showroom.badge}
                    </span>
                  </div>
                  {/* Price overlay */}
                  <div className="absolute bottom-5 left-5">
                    {showroom.oldPrice ? (
                      <div className="flex items-center gap-3">
                        <span className="font-roboto text-white/50 line-through text-lg">
                          {showroom.oldPrice}
                        </span>
                        <span className="font-roboto font-bold text-3xl text-gold">
                          {showroom.newPrice}
                        </span>
                      </div>
                    ) : (
                      <span className={`font-roboto font-bold text-2xl ${showroom.accentColor}`}>
                        Dès {showroom.priceFrom}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content - takes 45% */}
                <div className="lg:w-[45%] p-8 lg:p-12 flex flex-col justify-center">
                  <h3 className="font-playfair font-bold text-3xl lg:text-4xl text-white mb-4">
                    {getTitle(showroom)}
                  </h3>
                  <p className="font-inter text-base text-white/70 leading-relaxed mb-6">
                    {getDesc(showroom)}
                  </p>

                  {/* Brand tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {showroom.brands.map((brand) => (
                      <span
                        key={brand}
                        className={`px-3 py-1 rounded-full text-xs font-montserrat font-semibold border ${showroom.accentColor} border-current/30`}
                      >
                        {brand}
                      </span>
                    ))}
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-6 mb-8">
                    <div className="flex items-center gap-2">
                      <Car size={18} className={showroom.accentColor} />
                      <span className={`font-roboto font-bold text-lg ${showroom.accentColor}`}>
                        {showroom.count}
                      </span>
                      <span className="text-white/50 text-sm font-inter">
                        {showroom.countLabel}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button className={`${showroom.buttonStyle} self-start`}>
                    {lang === 'fr' ? 'Découvrir' : lang === 'en' ? 'Discover' : 'اكتشف'}
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
