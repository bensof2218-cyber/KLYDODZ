import { useState } from 'react';
import { X, Building2, CreditCard, CheckCircle, ChevronRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';

const BANKS = [
  { id: 'bea', name: 'BEA - Banque Ext\u00e9rieure d\'Alg\u00e9rie' },
  { id: 'bna', name: 'BNA - Banque Nationale d\'Alg\u00e9rie' },
  { id: 'badr', name: 'BADR - Banque de l\'Agriculture' },
  { id: 'cpa', name: 'CPA - Cr\u00e9dit Populaire d\'Alg\u00e9rie' },
  { id: 'bdl', name: 'BDL - Banque de D\u00e9veloppement Local' },
];

export default function BankVerifyModal({ onClose }: { onClose: () => void }) {
  const { bankVerify, user } = useAuth();
  const { t } = useLang();
  const [step, setStep] = useState(1);
  const [bank, setBank] = useState('');
  const [accountNum, setAccountNum] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Skip verification for sellers
  if (user?.role === 'seller_fr') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content text-center max-w-sm" onClick={(e) => e.stopPropagation()}>
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} className="text-green-400" />
          </div>
          <h4 className="font-playfair font-bold text-xl text-white mb-2">
            Compte Vendeur
          </h4>
          <p className="text-white/60 text-sm font-inter mb-6">
            Votre profil est d&eacute;j&agrave; v&eacute;rifi&eacute;. Aucune v&eacute;rification bancaire n&apos;est requise.
          </p>
          <button onClick={onClose} className="btn-premium btn-pulse">Continuer</button>
        </div>
      </div>
    );
  }

  const handleVerify = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    if (step < 3) {
      setStep(step + 1);
    } else {
      bankVerify();
      setStep(4);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-lg" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-gold transition-colors">
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
            <Building2 size={20} className="text-gold" />
          </div>
          <div>
            <h3 className="font-playfair font-bold text-xl text-white">{t('bankVerify')}</h3>
            <p className="text-white/50 text-sm font-inter">{t('bankVerifyDesc')}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${s <= step ? 'bg-gold text-midnight' : 'bg-white/10 text-white/40'}`}>
                {s < step ? <CheckCircle size={14} /> : s}
              </div>
              {s < 3 && <div className={`flex-1 h-[2px] rounded ${s < step ? 'bg-gold' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <label className="block text-white/70 text-sm font-inter">{t('selectBank')}</label>
            <div className="space-y-2">
              {BANKS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBank(b.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left ${
                    bank === b.id ? 'border-gold bg-gold/10 text-gold' : 'border-white/10 bg-white/[0.04] text-white/70 hover:border-white/20'
                  }`}
                >
                  <Building2 size={16} />
                  <span className="font-inter text-sm">{b.name}</span>
                </button>
              ))}
            </div>
            <button onClick={handleVerify} disabled={!bank || loading} className={`w-full btn-premium ${!bank ? 'opacity-50 cursor-not-allowed' : 'btn-pulse'}`}>
              {loading ? '...' : <>{t('verify')} <ChevronRight size={16} /></>}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <label className="block text-white/70 text-sm font-inter">{t('accountNumber')}</label>
            <div className="relative">
              <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="text" value={accountNum} onChange={(e) => setAccountNum(e.target.value)} className="w-full h-11 pl-10 pr-4 bg-white/[0.06] border border-white/[0.12] rounded-lg text-white text-sm font-inter" placeholder="00123 04567 89012 345" />
            </div>
            <p className="text-white/40 text-xs font-inter">Un code de v\u00e9rification sera envoy\u00e9 \u00e0 votre num\u00e9ro.</p>
            <button onClick={handleVerify} disabled={accountNum.length < 10 || loading} className={`w-full btn-premium ${accountNum.length < 10 ? 'opacity-50' : 'btn-pulse'}`}>
              {loading ? '...' : <>{t('verify')} <ChevronRight size={16} /></>}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <label className="block text-white/70 text-sm font-inter">Code de v\u00e9rification</label>
            <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="w-full h-11 px-4 bg-white/[0.06] border border-white/[0.12] rounded-lg text-white text-sm font-inter text-center tracking-[8px] text-lg" placeholder="• • • • • •" maxLength={6} />
            <p className="text-white/40 text-xs font-inter text-center">Code envoy\u00e9 au +213 5XX XX XX XX</p>
            <button onClick={handleVerify} disabled={code.length < 4 || loading} className={`w-full btn-gold-solid ${code.length < 4 ? 'opacity-50' : ''}`}>
              {loading ? '...' : <>{t('verify')} <ChevronRight size={16} /></>}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-400" />
            </div>
            <h4 className="font-playfair font-bold text-xl text-white mb-2">V\u00e9rification r\u00e9ussie !</h4>
            <p className="text-white/60 text-sm font-inter mb-6">Votre compte bancaire est v\u00e9rifi\u00e9.</p>
            <button onClick={onClose} className="btn-premium btn-pulse">Continuer</button>
          </div>
        )}
      </div>
    </div>
  );
}
