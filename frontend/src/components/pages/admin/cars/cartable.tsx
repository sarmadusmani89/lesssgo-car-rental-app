import { Car } from "./type";
import { Pencil, Trash2 } from "lucide-react";

type Props = {
  cars: Car[];
  onEdit: (v: Car) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
};

export default function CarTable({
  cars,
  onEdit,
  onDelete,
  onToggleStatus,
}: Props) {
  return (
    <div className="space-y-3">
      {cars.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-500 border border-gray-200">
          No cars found
        </div>
      )}

      {cars.map((v) => (
        <div
          key={v.id}
          className="bg-white border border-gray-200 rounded-2xl px-6 py-4 flex items-center gap-6 hover:shadow-md transition"
        >
          {/* Image */}
          <div className="w-32 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            {v.images && v.images.length > 0 ? (
              <img
                src={v.images[0]}
                alt={v.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* Car Info */}
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900">
              {v.name}
            </h3>

            <div className="flex items-center gap-2 mt-1 text-sm">
              {/* Brand (BLUE + PROFESSIONAL) */}
              <span className="text-blue-600 font-medium">
                {v.brand}
              </span>

              <span className="text-gray-300">•</span>

              {/* Category */}
              <span className="text-gray-500">
                {v.category}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="min-w-[140px] text-right">
            <p className="text-xs text-gray-500">Per day</p>
            <p className="text-lg font-semibold text-gray-900">
              ${v.pricePerDay}
            </p>
          </div>

          {/* Status */}
          <button
            onClick={() => onToggleStatus(v.id)}
            className={`min-w-[120px] px-4 py-1.5 rounded-full text-xs font-medium border transition ${v.status === "available"
                ? "border-green-200 text-green-700 bg-green-50 hover:bg-green-100"
                : "border-red-200 text-red-700 bg-red-50 hover:bg-red-100"
              }`}
          >
            {v.status === "available" ? "Available" : "Unavailable"}
          </button>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(v)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
              title="Edit"
            >
              <Pencil size={16} className="text-gray-700" />
            </button>

            <button
              onClick={() => onDelete(v.id)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-red-50 transition"
              title="Delete"
            >
              <Trash2 size={16} className="text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
