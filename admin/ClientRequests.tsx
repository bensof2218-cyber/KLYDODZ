import { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  Car,
  ChevronDown,
} from 'lucide-react';

interface ClientRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  type: 'purchase' | 'inspection' | 'quote' | 'support';
  status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'completed';
  date: string;
  message: string;
}

const INITIAL_REQUESTS: ClientRequest[] = [
  { id: 'REQ-001', name: 'Ahmed K.', email: 'ahmed.k@email.dz', phone: '+213 550 12 34 56', vehicle: 'BMW Série 3 320d', type: 'purchase', status: 'pending', date: '2026-04-19', message: 'Je souhaite acheter ce véhicule. Mon compte BEA est prêt.' },
  { id: 'REQ-002', name: 'Karim B.', email: 'karim.b@email.dz', phone: '+213 661 23 45 67', vehicle: 'Renault Clio V', type: 'inspection', status: 'in_progress', date: '2026-04-18', message: 'Demande de vérification terrain avant achat.' },
  { id: 'REQ-003', name: 'Fatima Z.', email: 'fatima.z@email.dz', phone: '+213 770 34 56 78', vehicle: 'Peugeot 308', type: 'quote', status: 'approved', date: '2026-04-17', message: 'Demande de devis complet avec frais de douane.' },
  { id: 'REQ-004', name: 'Mohamed L.', email: 'mohamed.l@email.dz', phone: '+213 555 45 67 89', vehicle: 'Mercedes Classe C', type: 'purchase', status: 'pending', date: '2026-04-16', message: 'Intéressé par ce modèle. Budget 45 000€.' },
  { id: 'REQ-005', name: 'Amina D.', email: 'amina.d@email.dz', phone: '+213 662 56 78 90', vehicle: 'Dacia Duster', type: 'support', status: 'completed', date: '2026-04-15', message: 'Question sur les délais de livraison. Répondu.' },
  { id: 'REQ-006', name: 'Youssef R.', email: 'youssef.r@email.dz', phone: '+213 771 67 89 01', vehicle: 'Toyota Yaris Hybrid', type: 'purchase', status: 'rejected', date: '2026-04-14', message: 'Compte devise non vérifié. Demande rejetée.' },
  { id: 'REQ-007', name: 'Sofia M.', email: 'sofia.m@email.dz', phone: '+213 556 78 90 12', vehicle: 'Audi A4 35 TDI', type: 'quote', status: 'pending', date: '2026-04-13', message: 'Demande de simulation de coût total en DZD.' },
  { id: 'REQ-008', name: 'Omar T.', email: 'omar.t@email.dz', phone: '+213 663 89 01 23', vehicle: 'Citroën C5 Aircross', type: 'inspection', status: 'in_progress', date: '2026-04-12', message: 'Inspection programmée pour le 22 avril.' },
];

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  purchase: { label: 'Achat', color: 'text-gold' },
  inspection: { label: 'Inspection', color: 'text-blue-400' },
  quote: { label: 'Devis', color: 'text-purple-400' },
  support: { label: 'Support', color: 'text-white/60' },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'En attente', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  in_progress: { label: 'En cours', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  approved: { label: 'Approuvée', color: 'text-green-400', bg: 'bg-green-400/10' },
  rejected: { label: 'Rejetée', color: 'text-red-400', bg: 'bg-red-400/10' },
  completed: { label: 'Terminée', color: 'text-white/40', bg: 'bg-white/5' },
};

export default function ClientRequests() {
  const [requests, setRequests] = useState<ClientRequest[]>(INITIAL_REQUESTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = requests.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id: string, newStatus: ClientRequest['status']) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    in_progress: requests.filter((r) => r.status === 'in_progress').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
    completed: requests.filter((r) => r.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-playfair font-bold text-2xl text-white">
            Demandes clients
          </h2>
          <p className="text-white/50 text-sm font-inter mt-1">
            {requests.length} demandes · {counts.pending} en attente
          </p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {([
          { key: 'all', label: 'Toutes', count: counts.all },
          { key: 'pending', label: 'En attente', count: counts.pending },
          { key: 'in_progress', label: 'En cours', count: counts.in_progress },
          { key: 'approved', label: 'Approuvées', count: counts.approved },
          { key: 'rejected', label: 'Rejetées', count: counts.rejected },
          { key: 'completed', label: 'Terminées', count: counts.completed },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-inter font-medium transition-all ${
              statusFilter === tab.key
                ? 'bg-gold/15 text-gold border border-gold/25'
                : 'text-white/50 hover:text-white border border-transparent'
            }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded ${statusFilter === tab.key ? 'bg-gold/20' : 'bg-white/5'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom, véhicule, n°..."
          className="w-full h-10 pl-10 pr-4 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm font-inter placeholder:text-white/30 focus:border-gold"
        />
      </div>

      {/* Requests list */}
      <div className="space-y-3">
        {filtered.map((req) => {
          const st = STATUS_CONFIG[req.status];
          const tp = TYPE_LABELS[req.type];
          const isExpanded = expandedId === req.id;
          return (
            <div
              key={req.id}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-white/[0.1] transition-all"
            >
              {/* Main row */}
              <div
                className="px-5 py-4 flex items-center gap-4 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : req.id)}
              >
                <div className={`w-10 h-10 rounded-lg ${st.bg} flex items-center justify-center shrink-0`}>
                  <Users size={18} className={st.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white text-sm font-inter font-medium">
                      {req.name}
                    </span>
                    <span className={`text-xs font-inter ${tp.color}`}>
                      {tp.label}
                    </span>
                    <span className="text-white/20 text-xs font-roboto">
                      {req.id}
                    </span>
                  </div>
                  <p className="text-white/40 text-xs font-inter truncate">
                    {req.vehicle} · {req.date}
                  </p>
                </div>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-inter font-medium ${st.bg} ${st.color} shrink-0`}>
                  {st.label}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-white/20 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-5 pb-4 border-t border-white/[0.04] pt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-white/60 text-sm font-inter">
                        <Mail size={14} className="text-gold/60" />
                        {req.email}
                      </div>
                      <div className="flex items-center gap-2 text-white/60 text-sm font-inter">
                        <Phone size={14} className="text-gold/60" />
                        {req.phone}
                      </div>
                      <div className="flex items-center gap-2 text-white/60 text-sm font-inter">
                        <Car size={14} className="text-gold/60" />
                        {req.vehicle}
                      </div>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs font-inter mb-1">Message</p>
                      <p className="text-white/70 text-sm font-inter leading-relaxed bg-white/[0.03] p-3 rounded-lg">
                        {req.message}
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2">
                    {req.status === 'pending' && (
                      <>
                        <button onClick={() => updateStatus(req.id, 'approved')} className="flex items-center gap-1.5 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm font-inter hover:bg-green-500/20 transition-all">
                          <CheckCircle size={14} /> Approuver
                        </button>
                        <button onClick={() => updateStatus(req.id, 'rejected')} className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm font-inter hover:bg-red-500/20 transition-all">
                          <XCircle size={14} /> Rejeter
                        </button>
                        <button onClick={() => updateStatus(req.id, 'in_progress')} className="flex items-center gap-1.5 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 text-sm font-inter hover:bg-blue-500/20 transition-all">
                          <Clock size={14} /> En cours
                        </button>
                      </>
                    )}
                    {req.status === 'in_progress' && (
                      <>
                        <button onClick={() => updateStatus(req.id, 'approved')} className="flex items-center gap-1.5 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm font-inter hover:bg-green-500/20 transition-all">
                          <CheckCircle size={14} /> Valider
                        </button>
                        <button onClick={() => updateStatus(req.id, 'completed')} className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60 text-sm font-inter hover:bg-white/10 transition-all">
                          <CheckCircle size={14} /> Terminer
                        </button>
                      </>
                    )}
                    {req.status === 'approved' && (
                      <button onClick={() => updateStatus(req.id, 'completed')} className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60 text-sm font-inter hover:bg-white/10 transition-all">
                        <CheckCircle size={14} /> Marquer terminée
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center">
          <Users size={32} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm font-inter">Aucune demande trouvée</p>
        </div>
      )}
    </div>
  );
}
