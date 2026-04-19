import { useState } from 'react';
import { ShieldCheck, Bell, Globe, Save, CheckCircle } from 'lucide-react';

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'KLYDO',
    contactEmail: 'contact@klydo.com',
    phoneFr: '+33 1 23 45 67 89',
    phoneDz: '+213 23 45 67 89',
    commissionRate: '5',
    defaultLang: 'fr',
    notifications: true,
    autoApprove: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="font-playfair font-bold text-2xl text-white">
          Paramètres
        </h2>
        <p className="text-white/50 text-sm font-inter mt-1">
          Configuration générale de la plateforme
        </p>
      </div>

      {/* General */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <Globe size={18} className="text-gold" />
          <h3 className="font-playfair font-bold text-lg text-white">
            Informations générales
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-white/60 text-sm font-inter mb-1 block">
              Nom du site
            </label>
            <input
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full h-10 px-3 bg-white/[0.06] border border-white/[0.12] rounded-lg text-white text-sm font-inter focus:border-gold"
            />
          </div>
          <div>
            <label className="text-white/60 text-sm font-inter mb-1 block">
              Email de contact
            </label>
            <input
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full h-10 px-3 bg-white/[0.06] border border-white/[0.12] rounded-lg text-white text-sm font-inter focus:border-gold"
            />
          </div>
          <div>
            <label className="text-white/60 text-sm font-inter mb-1 block">
              Téléphone France
            </label>
            <input
              value={settings.phoneFr}
              onChange={(e) => setSettings({ ...settings, phoneFr: e.target.value })}
              className="w-full h-10 px-3 bg-white/[0.06] border border-white/[0.12] rounded-lg text-white text-sm font-inter focus:border-gold"
            />
          </div>
          <div>
            <label className="text-white/60 text-sm font-inter mb-1 block">
              Téléphone Algérie
            </label>
            <input
              value={settings.phoneDz}
              onChange={(e) => setSettings({ ...settings, phoneDz: e.target.value })}
              className="w-full h-10 px-3 bg-white/[0.06] border border-white/[0.12] rounded-lg text-white text-sm font-inter focus:border-gold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-white/60 text-sm font-inter mb-1 block">
              Commission (%)
            </label>
            <input
              type="number"
              value={settings.commissionRate}
              onChange={(e) => setSettings({ ...settings, commissionRate: e.target.value })}
              className="w-full h-10 px-3 bg-white/[0.06] border border-white/[0.12] rounded-lg text-white text-sm font-inter focus:border-gold"
            />
          </div>
          <div>
            <label className="text-white/60 text-sm font-inter mb-1 block">
              Langue par défaut
            </label>
            <select
              value={settings.defaultLang}
              onChange={(e) => setSettings({ ...settings, defaultLang: e.target.value })}
              className="w-full h-10 px-3 bg-white/[0.06] border border-white/[0.12] rounded-lg text-white text-sm font-inter focus:border-gold"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Bell size={18} className="text-gold" />
          <h3 className="font-playfair font-bold text-lg text-white">
            Notifications
          </h3>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-white text-sm font-inter">Notifications email</p>
            <p className="text-white/40 text-xs font-inter">
              Recevoir un email pour chaque nouvelle demande
            </p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
            className={`w-12 h-6 rounded-full transition-all relative ${
              settings.notifications ? 'bg-gold' : 'bg-white/10'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                settings.notifications ? 'left-6' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-white text-sm font-inter">Approbation automatique</p>
            <p className="text-white/40 text-xs font-inter">
              Approuver automatiquement les demandes vérifiées
            </p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, autoApprove: !settings.autoApprove })}
            className={`w-12 h-6 rounded-full transition-all relative ${
              settings.autoApprove ? 'bg-gold' : 'bg-white/10'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
                settings.autoApprove ? 'left-6' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck size={18} className="text-gold" />
          <h3 className="font-playfair font-bold text-lg text-white">
            Sécurité
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-white/60 text-sm font-inter mb-1 block">
              Ancien mot de passe
            </label>
            <input
              type="password"
              className="w-full h-10 px-3 bg-white/[0.06] border border-white/[0.12] rounded-lg text-white text-sm font-inter focus:border-gold"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="text-white/60 text-sm font-inter mb-1 block">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              className="w-full h-10 px-3 bg-white/[0.06] border border-white/[0.12] rounded-lg text-white text-sm font-inter focus:border-gold"
              placeholder="••••••••"
            />
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button onClick={handleSave} className="btn-gold-solid py-3 px-8">
          <Save size={16} className="mr-2" />
          Enregistrer les modifications
        </button>
        {saved && (
          <div className="flex items-center gap-2 text-green-400 text-sm font-inter">
            <CheckCircle size={16} />
            Paramètres sauvegardés
          </div>
        )}
      </div>
    </div>
  );
}
