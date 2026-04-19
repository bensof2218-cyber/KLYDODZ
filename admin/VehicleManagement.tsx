import { useState } from 'react';
import {
  Car,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Filter,
} from 'lucide-react';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  price: number;
  priceDZD: number;
  km: number;
  fuel: string;
  status: 'available' | 'reserved' | 'sold';
  image: string;
}

const INITIAL_VEHICLES: Vehicle[] = [
  { id: '1', brand: 'BMW', model: 'Série 3 320d', year: 2024, category: 'Luxe', price: 38500, priceDZD: 6750000, km: 12000, fuel: 'Diesel', status: 'available', image: '/showroom-luxe.jpg' },
  { id: '2', brand: 'Mercedes', model: 'Classe C 220d', year: 2023, category: 'Luxe', price: 42000, priceDZD: 7370000, km: 8500, fuel: 'Diesel', status: 'available', image: '/showroom-luxe.jpg' },
  { id: '3', brand: 'Renault', model: 'Clio V 1.0 TCe', year: 2024, category: 'Populaire', price: 18900, priceDZD: 3317000, km: 5000, fuel: 'Essence', status: 'available', image: '/showroom-populaire.jpg' },
  { id: '4', brand: 'Peugeot', model: '308 1.5 BlueHDi', year: 2023, category: 'Populaire', price: 24500, priceDZD: 4300000, km: 18000, fuel: 'Diesel', status: 'reserved', image: '/showroom-populaire.jpg' },
  { id: '5', brand: 'Dacia', model: 'Duster 1.0 TCe', year: 2024, category: 'Promo', price: 21400, priceDZD: 3755000, km: 8000, fuel: 'Essence', status: 'available', image: '/showroom-promo.jpg' },
  { id: '6', brand: 'Audi', model: 'A4 35 TDI', year: 2023, category: 'Luxe', price: 39800, priceDZD: 6988000, km: 15000, fuel: 'Diesel', status: 'sold', image: '/showroom-luxe.jpg' },
  { id: '7', brand: 'Toyota', model: 'Yaris 1.5 Hybrid', year: 2024, category: 'Populaire', price: 22800, priceDZD: 4000000, km: 3000, fuel: 'Hybride', status: 'available', image: '/showroom-populaire.jpg' },
  { id: '8', brand: 'Citroën', model: 'C5 Aircross 1.5 HDi', year: 2023, category: 'Promo', price: 28900, priceDZD: 5070000, km: 22000, fuel: 'Diesel', status: 'available', image: '/showroom-promo.jpg' },
];

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  available: { label: 'Disponible', color: 'text-green-400', bg: 'bg-green-400/10' },
  reserved: { label: 'Réservé', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  sold: { label: 'Vendu', color: 'text-white/40', bg: 'bg-white/5' },
};

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    brand: '', model: '', year: 2024, category: 'Populaire', price: '', km: '', fuel: 'Essence', status: 'available' as const,
  });

  const filtered = vehicles.filter((v) => {
    const matchesSearch =
      `${v.brand} ${v.model}`.toLowerCase().includes(search.toLowerCase()) ||
      v.id.includes(search);
    const matchesCat = categoryFilter === 'all' || v.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const startEdit = (v: Vehicle) => {
    setEditingId(v.id);
    setEditPrice(String(v.price));
  };

  const saveEdit = (id: string) => {
    const price = parseInt(editPrice);
    if (isNaN(price) || price <= 0) return;
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, price, priceDZD: Math.round(price * 175.5) }
          : v
      )
    );
    setEditingId(null);
  };

  const deleteVehicle = (id: string) => {
    if (confirm('Supprimer ce véhicule ?')) {
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    }
  };

  const addVehicle = () => {
    const price = parseInt(newVehicle.price);
    if (!newVehicle.brand || !newVehicle.model || isNaN(price)) return;
    const v: Vehicle = {
      id: String(vehicles.length + 1),
      brand: newVehicle.brand,
      model: newVehicle.model,
      year: newVehicle.year,
      category: newVehicle.category,
      price,
      priceDZD: Math.round(price * 175.5),
      km: parseInt(newVehicle.km) || 0,
      fuel: newVehicle.fuel,
      status: newVehicle.status,
      image: '/showroom-populaire.jpg',
    };
    setVehicles((prev) => [v, ...prev]);
    setShowAddModal(false);
    setNewVehicle({ brand: '', model: '', year: 2024, category: 'Populaire', price: '', km: '', fuel: 'Essence', status: 'available' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-playfair font-bold text-2xl text-white">
            Gestion des véhicules
          </h2>
          <p className="text-white/50 text-sm font-inter mt-1">
            {vehicles.length} véhicules enregistrés
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-premium btn-pulse text-sm py-2.5 px-5"
        >
          <Plus size={16} className="mr-1.5" />
          Ajouter
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un véhicule..."
            className="w-full h-10 pl-10 pr-4 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm font-inter placeholder:text-white/30 focus:border-gold"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-white/30" />
          {['all', 'Luxe', 'Populaire', 'Promo'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-inter font-medium transition-all ${
                categoryFilter === cat
                  ? 'bg-gold/15 text-gold border border-gold/25'
                  : 'text-white/50 hover:text-white border border-transparent'
              }`}
            >
              {cat === 'all' ? 'Tous' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-5 py-3 text-white/50 text-xs font-inter font-medium uppercase tracking-wider">Véhicule</th>
                <th className="px-5 py-3 text-white/50 text-xs font-inter font-medium uppercase tracking-wider">Catégorie</th>
                <th className="px-5 py-3 text-white/50 text-xs font-inter font-medium uppercase tracking-wider">Prix (€)</th>
                <th className="px-5 py-3 text-white/50 text-xs font-inter font-medium uppercase tracking-wider">Prix (DZD)</th>
                <th className="px-5 py-3 text-white/50 text-xs font-inter font-medium uppercase tracking-wider">Statut</th>
                <th className="px-5 py-3 text-white/50 text-xs font-inter font-medium uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((v) => {
                const st = STATUS_LABELS[v.status];
                const isEditing = editingId === v.id;
                return (
                  <tr key={v.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                          <Car size={18} className="text-gold/70" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-inter font-medium">
                            {v.brand} {v.model}
                          </p>
                          <p className="text-white/40 text-xs font-inter">
                            {v.year} · {v.km.toLocaleString('fr')} km · {v.fuel}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-white/70 text-sm font-inter">{v.category}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-24 h-8 px-2 bg-white/[0.06] border border-gold/30 rounded text-white text-sm font-inter"
                            autoFocus
                          />
                          <button
                            onClick={() => saveEdit(v.id)}
                            className="p-1 text-green-400 hover:text-green-300"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 text-red-400 hover:text-red-300"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-white text-sm font-roboto">
                          {v.price.toLocaleString('fr')} €
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-white/60 text-sm font-roboto">
                        {v.priceDZD.toLocaleString('fr')} DZD
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-inter font-medium ${st.bg} ${st.color}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => startEdit(v)}
                          className="p-2 text-white/30 hover:text-gold transition-colors rounded-lg hover:bg-white/[0.04]"
                          title="Modifier le prix"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deleteVehicle(v.id)}
                          className="p-2 text-white/30 hover:text-red-400 transition-colors rounded-lg hover:bg-white/[0.04]"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Car size={32} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm font-inter">Aucun véhicule trouvé</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: 'rgba(13,13,26,0.9)', backdropFilter: 'blur(8px)' }}>
          <div className="relative w-full max-w-md bg-midnight border border-gold/30 rounded-2xl p-6" style={{ boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}>
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-white/40 hover:text-gold">
              <X size={20} />
            </button>
            <h3 className="font-playfair font-bold text-xl text-white mb-5">Ajouter un véhicule</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/60 text-xs font-inter mb-1 block">Marque</label>
                  <input value={newVehicle.brand} onChange={(e) => setNewVehicle({...newVehicle, brand: e.target.value})} className="w-full h-10 px-3 bg-white/[0.06] border border-white/[0.12] rounded-lg text-white text-sm font-inter focus:border-gold" placeholder="BMW" />
                </div>
                <div>
                  <label className="text-white/60 text-xs font-inter mb-1 block">Modèle</label>
                  <input value={newVehicle.model} onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})} className="w-full h-10 px-3 bg-white/[0.06] border border-white/[0.12] rounded-lg text-white text-sm font-inter focus:border-gold" placeholder="Série 3" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-white/60 text-xs font-inter mb-1 block">Année</label>
                  <input type="number" value={newVehicle.year} onChange={(e) => setNewVehicle({...newVehicle, year: parseInt(e.target.value)})} className="w-full h-10 px-3 bg-white/[0.06] border border-white/[0.12] rounded-lg text-white text-sm font-inter focus:border-gold" />
                </div>
                <div>
                  <label className="text-white/60 text-xs font-inter mb-1 block">Prix €</label>
                  <input value={newVehicle.price} onChange={(e) => setNewVehicle({...newVehicle, price: e.target.value})} className="w-full h-10 px-3 bg-white/[0.06] border border-white/[0.12] rounded-lg text-white text-sm font-inter focus:border-gold" placeholder="25000" />
                </div>
                <div>
                  <label className="text-white/60 text-xs font-inter mb-1 block">Km</label>
                  <input value={newVehicle.km} onChange={(e) => setNewVehicle({...newVehicle, km: e.target.value})} className="w-full h-10 px-3 bg-white/[0.06] border border-white/[0.12] rounded-lg text-white text-sm font-inter focus:border-gold" placeholder="15000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/60 text-xs font-inter mb-1 block">Catégorie</label>
                  <select value={newVehicle.category} onChange={(e) => setNewVehicle({...newVehicle, category: e.target.value})} className="w-full h-10 px-3 bg-white/[0.06] border border-white/[0.12] rounded-lg text-white text-sm font-inter focus:border-gold">
                    <option value="Luxe">Luxe</option>
                    <option value="Populaire">Populaire</option>
                    <option value="Promo">Promo</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/60 text-xs font-inter mb-1 block">Carburant</label>
                  <select value={newVehicle.fuel} onChange={(e) => setNewVehicle({...newVehicle, fuel: e.target.value})} className="w-full h-10 px-3 bg-white/[0.06] border border-white/[0.12] rounded-lg text-white text-sm font-inter focus:border-gold">
                    <option>Essence</option>
                    <option>Diesel</option>
                    <option>Hybride</option>
                    <option>Électrique</option>
                  </select>
                </div>
              </div>
              <button onClick={addVehicle} className="w-full btn-premium btn-pulse mt-2 py-3">
                <Plus size={16} className="mr-1.5" /> Ajouter le véhicule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
