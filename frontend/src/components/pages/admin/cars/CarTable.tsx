import { Car } from "./type";
import { Pencil, Trash2, Fuel, Cog, ShieldCheck, ShieldAlert, Calendar, Gauge } from "lucide-react";

type Props = {
  cars: Car[];
  onEdit: (v: Car) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (car: Car) => void;
  onViewAvailability: (car: Car) => void;
};

export default function CarTable({
  cars,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewAvailability,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {cars.length === 0 && (
        <div className="bg-white rounded-2xl p-16 text-center border-2 border-dashed border-gray-100 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <ShieldAlert size={32} />
          </div>
          <p className="text-gray-900 font-bold text-xl font-outfit">No cars in your fleet</p>
          <p className="text-gray-500 mt-1 max-w-xs mx-auto">Start by adding your first vehicle to the inventory.</p>
        </div>
      )}

      {cars.map((v) => (
        <div
          key={v.id}
          className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center gap-6 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300 group"
        >
          {/* Image */}
          <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 relative">
            {v.imageUrl ? (
              <img
                src={v.imageUrl}
                alt={v.name}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-xs text-gray-400 gap-2">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Cog size={20} />
                </div>
                No Image
              </div>
            )}
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm ${v.status === 'AVAILABLE' ? 'bg-green-500 text-white' :
                v.status === 'RENTED' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
                }`}>
                {v.status}
              </span>
            </div>
          </div>

          {/* Car Info */}
          <div className="flex-1 space-y-3">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{v.brand}</span>
              <h3 className="text-xl font-black text-slate-900 font-outfit uppercase tracking-tight leading-tight group-hover:text-blue-600 transition">
                {v.name}
              </h3>
              <p className="text-blue-600 font-bold text-[10px] uppercase tracking-widest mt-2 bg-blue-50 w-fit px-2 py-0.5 rounded-full">{v.type}</p>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium bg-gray-50 px-2 py-1 rounded-lg">
                <Gauge size={14} className="text-gray-400" />
                {v.hp} HP
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium bg-gray-50 px-2 py-1 rounded-lg">
                <Cog size={14} className="text-gray-400" />
                {v.transmission}
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium bg-gray-50 px-2 py-1 rounded-lg">
                <Fuel size={14} className="text-gray-400" />
                {v.fuelCapacity}L
              </div>
              <div className="flex items-center gap-1.5 text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded-lg">
                <ShieldCheck size={14} />
                Insured
              </div>
            </div>
          </div>

          {/* Price & Actions */}
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
            <div className="text-left md:text-right">
              <p className="text-2xl font-black text-gray-900 font-outfit">
                ${v.pricePerDay}<span className="text-sm font-medium text-gray-400">/day</span>
              </p>
              <button
                onClick={() => onToggleStatus(v)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 mt-1 uppercase tracking-tighter"
              >
                Change Status
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(v)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
                title="Edit Details"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={() => onViewAvailability(v)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-green-50 hover:text-green-600 transition-all shadow-sm"
                title="View Availability"
              >
                <Calendar size={18} />
              </button>

              <button
                onClick={() => onDelete(v.id)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
                title="Delete vehicle"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
