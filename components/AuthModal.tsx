import { useState } from 'react';
import { X, User, Lock, Mail, ChevronRight, ArrowLeft, Car, Search, Building2 } from 'lucide-react';
import { useAuth, type UserRole } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';

/* ───────── Role definitions ───────── */
interface RoleOption {
  id: UserRole;
  icon: typeof Car;
  label: string;
  labelEn: string;
  labelAr: string;
  desc: string;
  descEn: string;
  descAr: string;
  color: string;
  borderColor: string;
}

const ROLES: RoleOption[] = [
  {
    id: 'seller_fr',
    icon: Building2,
    label: 'Vendeur (France)',
    labelEn: 'Seller (France)',
    labelAr: 'بائع (فرنسا)',
    desc: 'Professionnels et particuliers en France qui vendent des véhicules.',
    descEn: 'Professionals and individuals in France selling vehicles.',
    descAr: 'المحترفون والأفراد في فرنسا الذين يبيعون المركبات.',
    color: 'text-gold',
    borderColor: 'border-gold/40',
  },
  {
    id: 'buyer_dz',
    icon: Car,
    label: 'Acheteur (Algérie)',
    labelEn: 'Buyer (Algeria)',
    labelAr: 'مشتري (الجزائر)',
    desc: 'Particuliers et entreprises en Algérie souhaitant importer des véhicules.',
    descEn: 'Individuals and companies in Algeria looking to import vehicles.',
    descAr: 'الأفراد والشركات في الجزائر الراغبين في استيراد المركبات.',
    color: 'text-turquoise',
    borderColor: 'border-turquoise/40',
  },
  {
    id: 'inspector',
    icon: Search,
    label: 'Agent de Vérification',
    labelEn: 'Inspection Agent',
    labelAr: 'وكيل التفتيش',
    desc: 'Agents terrain qui vérifient l\'état des véhicules avant expédition.',
    descEn: 'Field agents who verify vehicle condition before shipping.',
    descAr: 'وكلاء الميدان الذين يتحققون من حالة المركبات قبل الشحن.',
    color: 'text-amber-400',
    borderColor: 'border-amber-400/40',
  },
];

/* ───────── Sub-type definitions ───────── */
interface SubOption {
  id: string;
  label: string;
  labelEn: string;
  labelAr: string;
  icon: typeof Car;
}

const SELLER_SUBS: SubOption[] = [
  { id: 'individual', label: 'Particulier', labelEn: 'Individual', labelAr: 'فرد', icon: User },
  { id: 'garage', label: 'Garage', labelEn: 'Garage', labelAr: 'مرآب', icon: Building2 },
];

const BUYER_SUBS: SubOption[] = [
  { id: 'individual', label: 'Particulier', labelEn: 'Individual', labelAr: 'فرد', icon: User },
  { id: 'company', label: 'Entreprise', labelEn: 'Company', labelAr: 'شركة', icon: Building2 },
];

export default function AuthModal() {
  const { showAuthModal, setShowAuthModal, authMode, setAuthMode, login, register, selectedRole, setSelectedRole, setSelectedSubType } = useAuth();
  const { lang } = useLang();

  type Step = 'mode' | 'role' | 'subtype' | 'form';
  const [step, setStep] = useState<Step>('mode');
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!showAuthModal) return null;

  const handleClose = () => {
    setShowAuthModal(false);
    setStep('mode');
    setSelectedRole(null);
    setActiveSub(null);
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleSelectMode = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setStep(mode === 'register' ? 'role' : 'form');
  };

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'seller_fr' || role === 'buyer_dz') {
      setStep('subtype');
    } else {
      setStep('form');
    }
  };

  const handleSelectSub = (subId: string) => {
    setActiveSub(subId);
    setSelectedSubType(subId);
    setStep('form');
  };

  const handleBack = () => {
    if (step === 'form' && activeSub) {
      setActiveSub(null);
      setStep('subtype');
    } else if (step === 'subtype') {
      setSelectedRole(null);
      setActiveSub(null);
      setStep('role');
    } else if (step === 'form' && !activeSub && authMode === 'register') {
      setSelectedRole(null);
      setStep('role');
    } else {
      setStep('mode');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (authMode === 'login') {
      await login(email, password);
    } else if (selectedRole) {
      await register(name, email, password, selectedRole, activeSub || undefined);
    }
    setLoading(false);
  };

  const getRoleLabel = (r: RoleOption) => lang === 'en' ? r.labelEn : lang === 'ar' ? r.labelAr : r.label;
  const getRoleDesc = (r: RoleOption) => lang === 'en' ? r.descEn : lang === 'ar' ? r.descAr : r.desc;
  const getSubLabel = (s: SubOption) => lang === 'en' ? s.labelEn : lang === 'ar' ? s.labelAr : s.label;

  const currentRole = ROLES.find((r) => r.id === selectedRole);
  const subOptions = selectedRole === 'seller_fr' ? SELLER_SUBS : selectedRole === 'buyer_dz' ? BUYER_SUBS : [];

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="relative bg-midnight border border-gold/30 rounded-2xl p-6 sm:p-8 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto no-scrollbar"
        style={{ boxShadow: '0 0 60px rgba(0,0,0,0.6), 0 0 30px rgba(200,168,75,0.15)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={handleClose} className="absolute top-4 right-4 text-white/40 hover:text-gold transition-colors z-10">
          <X size={20} />
        </button>

        {/* Logo + KLYDO */}
        <div className="flex items-center gap-3 mb-6">
          <img src="/logo-klydo.png" alt="KLYDO" className="h-14 w-auto object-contain" />
          <span
            className="font-montserrat font-black text-3xl tracking-[0.12em] uppercase"
            style={{
              background: 'linear-gradient(180deg, #F0D878 0%, #C8A84B 40%, #A0842E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            KLYDO
          </span>
        </div>

        {/* ───── STEP 1: Login or Register ───── */}
        {step === 'mode' && (
          <div className="space-y-4">
            <h3 className="font-playfair font-bold text-2xl text-white text-center mb-1">
              {lang === 'fr' ? 'Bienvenue' : lang === 'en' ? 'Welcome' : 'أهلاً'}
            </h3>
            <p className="text-white/50 text-sm text-center font-inter mb-6">
              {lang === 'fr' ? 'Choisissez une option pour continuer' : lang === 'en' ? 'Choose an option to continue' : 'اختر خياراً للمتابعة'}
            </p>
            <button onClick={() => handleSelectMode('login')} className="w-full btn-premium btn-pulse py-4 text-base">
              {lang === 'fr' ? 'Se connecter' : lang === 'en' ? 'Sign In' : 'تسجيل الدخول'}
            </button>
            <button onClick={() => handleSelectMode('register')} className="w-full btn-gold-solid py-4 text-base">
              {lang === 'fr' ? 'Créer un compte' : lang === 'en' ? 'Create Account' : 'إنشاء حساب'}
            </button>
          </div>
        )}

        {/* ───── STEP 2: Select Role ───── */}
        {step === 'role' && (
          <div>
            <button onClick={handleBack} className="flex items-center gap-1 text-white/50 hover:text-gold text-sm mb-4 transition-colors">
              <ArrowLeft size={16} /> {lang === 'fr' ? 'Retour' : lang === 'en' ? 'Back' : 'رجوع'}
            </button>
            <h3 className="font-playfair font-bold text-xl text-white mb-1">
              {lang === 'fr' ? 'Votre profil' : lang === 'en' ? 'Your Profile' : 'ملفك الشخصي'}
            </h3>
            <p className="text-white/50 text-sm font-inter mb-5">
              {lang === 'fr' ? 'Sélectionnez votre type de compte' : lang === 'en' ? 'Select your account type' : 'اختر نوع حسابك'}
            </p>
            <div className="space-y-3">
              {ROLES.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => handleSelectRole(role.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border ${role.borderColor} bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 text-left group`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon size={24} className={role.color} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-montserrat font-bold text-sm ${role.color}`}>
                        {getRoleLabel(role)}
                      </h4>
                      <p className="text-white/50 text-xs font-inter mt-0.5 leading-relaxed">
                        {getRoleDesc(role)}
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-white/20 group-hover:text-white/60 transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ───── STEP 2.5: Select Sub-Type ───── */}
        {step === 'subtype' && currentRole && (
          <div>
            <button onClick={handleBack} className="flex items-center gap-1 text-white/50 hover:text-gold text-sm mb-4 transition-colors">
              <ArrowLeft size={16} /> {lang === 'fr' ? 'Retour' : lang === 'en' ? 'Back' : 'رجوع'}
            </button>

            {/* Parent role badge */}
            <div className={`flex items-center gap-3 mb-5 p-3 rounded-lg bg-white/[0.03] border ${currentRole.borderColor}`}>
              <currentRole.icon size={20} className={currentRole.color} />
              <span className={`font-montserrat font-bold text-sm ${currentRole.color}`}>
                {getRoleLabel(currentRole)}
              </span>
            </div>

            <h3 className="font-playfair font-bold text-lg text-white mb-1">
              {selectedRole === 'seller_fr'
                ? (lang === 'fr' ? 'Type de vendeur' : lang === 'en' ? 'Seller Type' : 'نوع البائع')
                : (lang === 'fr' ? 'Type d\'acheteur' : lang === 'en' ? 'Buyer Type' : 'نوع المشتري')}
            </h3>
            <p className="text-white/50 text-sm font-inter mb-5">
              {lang === 'fr' ? 'Précisez votre profil' : lang === 'en' ? 'Specify your profile' : 'حدد ملفك الشخصي'}
            </p>

            <div className="grid grid-cols-2 gap-3">
              {subOptions.map((sub) => {
                const SubIcon = sub.icon;
                return (
                  <button
                    key={sub.id}
                    onClick={() => handleSelectSub(sub.id)}
                    className={`flex flex-col items-center gap-3 p-6 rounded-xl border transition-all duration-300 text-center group ${
                      activeSub === sub.id
                        ? `${currentRole.borderColor} bg-white/[0.06]`
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${activeSub === sub.id ? 'bg-gold/15' : 'bg-white/5 group-hover:bg-white/10'}`}>
                      <SubIcon size={26} className={activeSub === sub.id ? 'text-gold' : 'text-white/60 group-hover:text-white/80'} />
                    </div>
                    <span className={`font-montserrat font-bold text-sm ${activeSub === sub.id ? 'text-gold' : 'text-white/80'}`}>
                      {getSubLabel(sub)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ───── STEP 3: Form ───── */}
        {step === 'form' && (
          <div>
            <button onClick={handleBack} className="flex items-center gap-1 text-white/50 hover:text-gold text-sm mb-4 transition-colors">
              <ArrowLeft size={16} /> {lang === 'fr' ? 'Retour' : lang === 'en' ? 'Back' : 'رجوع'}
            </button>

            {/* Selected role badge */}
            {currentRole && (
              <div className={`flex items-center gap-3 mb-5 p-3 rounded-lg bg-white/[0.03] border ${currentRole.borderColor}`}>
                <currentRole.icon size={20} className={currentRole.color} />
                <div>
                  <span className={`font-montserrat font-bold text-sm ${currentRole.color}`}>
                    {getRoleLabel(currentRole)}
                  </span>
                  {activeSub && (
                    <span className="text-white/40 text-xs font-inter ml-2">
                      — {subOptions.find((s) => s.id === activeSub) ? getSubLabel(subOptions.find((s) => s.id === activeSub)!) : activeSub}
                    </span>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-white/70 text-sm mb-1.5 font-inter">
                    {lang === 'fr' ? 'Nom complet' : lang === 'en' ? 'Full Name' : 'الاسم الكامل'}
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 bg-white/[0.06] border border-white/[0.12] rounded-lg text-white text-sm font-inter placeholder:text-white/30 focus:border-gold"
                      placeholder={lang === 'fr' ? 'Jean Dupont' : 'John Doe'}
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-white/70 text-sm mb-1.5 font-inter">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 bg-white/[0.06] border border-white/[0.12] rounded-lg text-white text-sm font-inter placeholder:text-white/30 focus:border-gold"
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1.5 font-inter">
                  {lang === 'fr' ? 'Mot de passe' : lang === 'en' ? 'Password' : 'كلمة المرور'}
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 bg-white/[0.06] border border-white/[0.12] rounded-lg text-white text-sm font-inter placeholder:text-white/30 focus:border-gold"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-2 ${authMode === 'login' ? 'btn-premium' : 'btn-gold-solid'} ${!loading ? 'btn-pulse' : ''} ${loading ? 'opacity-70 cursor-wait' : ''}`}
              >
                {loading ? (
                  <span className="animate-pulse">...</span>
                ) : authMode === 'login' ? (
                  <>
                    {lang === 'fr' ? 'Se connecter' : lang === 'en' ? 'Sign In' : 'دخول'}
                    <ChevronRight size={16} className="ml-1" />
                  </>
                ) : (
                  <>
                    {lang === 'fr' ? 'Créer mon compte' : lang === 'en' ? 'Create Account' : 'إنشاء حساب'}
                    <ChevronRight size={16} className="ml-1" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-white/50 text-sm mt-4 font-inter">
              {authMode === 'login' ? (
                <>
                  {lang === 'fr' ? 'Pas encore de compte ?' : lang === 'en' ? 'No account yet?' : 'ليس لديك حساب؟'}{' '}
                  <button onClick={() => handleSelectMode('register')} className="text-gold hover:underline">
                    {lang === 'fr' ? "S'inscrire" : lang === 'en' ? 'Sign Up' : 'تسجيل'}
                  </button>
                </>
              ) : (
                <>
                  {lang === 'fr' ? 'Déjà un compte ?' : lang === 'en' ? 'Already have an account?' : 'لديك حساب؟'}{' '}
                  <button onClick={() => handleSelectMode('login')} className="text-gold hover:underline">
                    {lang === 'fr' ? 'Se connecter' : lang === 'en' ? 'Sign In' : 'دخول'}
                  </button>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
