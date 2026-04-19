import { useState } from 'react';
import {
  Car,
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
} from 'lucide-react';

const stats = [
  { label: 'Véhicules en ligne', value: 377, change: '+12', icon: Car, color: 'text-gold', bg: 'bg-gold/10' },
  { label: 'Demandes ce mois', value: 48, change: '+8', icon: Users, color: 'text-turquoise', bg: 'bg-turquoise/10' },
  { label: 'Ventes réalisées', value: 156, change: '+23', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
  { label: 'Chiffre (k€)', value: 892, change: '+15%', icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-400/10' },
];

const recentActivity = [
  { action: 'Nouvelle demande', detail: 'Ahmed K. — BMW Série 3', time: '2 min', status: 'new' },
  { action: 'Prix modifié', detail: 'Renault Clio — 12 500€ → 11 900€', time: '15 min', status: 'edit' },
  { action: 'Véhicule vendu', detail: 'Peugeot 308 — Karim B.', time: '1h', status: 'sold' },
  { action: 'Demande traitée', detail: 'Mercedes C-Class — vérification OK', time: '2h', status: 'done' },
  { action: 'Nouvel inscrit', detail: 'Garage Dupont — Vendeur', time: '3h', status: 'new' },
];

const statusCards = [
  { label: 'En attente', count: 12, icon: Clock, color: 'text-amber-400', border: 'border-amber-400/30' },
  { label: 'En vérification', count: 8, icon: AlertCircle, color: 'text-blue-400', border: 'border-blue-400/30' },
  { label: 'Confirmés', count: 24, icon: CheckCircle, color: 'text-green-400', border: 'border-green-400/30' },
  { label: 'En transit', count: 6, icon: Package, color: 'text-purple-400', border: 'border-purple-400/30' },
];

export default function Dashboard() {
  const [period, setPeriod] = useState('month');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-playfair font-bold text-2xl text-white">
            Tableau de bord
          </h2>
          <p className="text-white/50 text-sm font-inter mt-1">
            Vue d'ensemble de votre activité
          </p>
        </div>
        <div className="flex bg-white/[0.04] rounded-lg p-1">
          {[
            { key: 'week', label: '7 jours' },
            { key: 'month', label: '30 jours' },
            { key: 'year', label: 'Année' },
          ].map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-4 py-1.5 rounded-md text-sm font-inter transition-all ${
                period === p.key
                  ? 'bg-gold/15 text-gold'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-gold/20 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon size={20} className={stat.color} />
                </div>
                <span className="text-green-400 text-xs font-inter font-medium bg-green-400/10 px-2 py-0.5 rounded">
                  {stat.change}
                </span>
              </div>
              <p className="font-roboto font-bold text-2xl text-white">
                {stat.value}
              </p>
              <p className="text-white/50 text-sm font-inter mt-0.5">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statusCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`p-4 rounded-xl border ${card.border} bg-white/[0.02] flex items-center gap-3`}
            >
              <Icon size={22} className={card.color} />
              <div>
                <p className="font-roboto font-bold text-lg text-white">
                  {card.count}
                </p>
                <p className="text-white/50 text-xs font-inter">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent activity */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="font-playfair font-bold text-lg text-white">
            Activité récente
          </h3>
          <button className="text-gold text-sm font-inter hover:underline">
            Voir tout
          </button>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {recentActivity.map((item, idx) => (
            <div
              key={idx}
              className="px-6 py-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    item.status === 'new'
                      ? 'bg-blue-400'
                      : item.status === 'edit'
                      ? 'bg-amber-400'
                      : item.status === 'sold'
                      ? 'bg-green-400'
                      : 'bg-white/30'
                  }`}
                />
                <div>
                  <p className="text-white text-sm font-inter">{item.action}</p>
                  <p className="text-white/40 text-xs font-inter">
                    {item.detail}
                  </p>
                </div>
              </div>
              <span className="text-white/30 text-xs font-inter shrink-0">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
