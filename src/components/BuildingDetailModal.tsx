import { Building, EPC_COLORS } from '@/types';
import { X, MapPin, Building2, Gauge, Ruler, Fuel, Wind, Zap, Leaf, Calendar, FileText, Home } from 'lucide-react';
import { useEffect } from 'react';

interface BuildingDetailModalProps {
  building: Building | null;
  onClose: () => void;
}

export function BuildingDetailModal({ building, onClose }: BuildingDetailModalProps) {
  useEffect(() => {
    if (!building) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [building, onClose]);

  if (!building) return null;

  const epcColor = EPC_COLORS[building.epc_letter] ?? EPC_COLORS['G'];

  const detailRows: { icon: typeof MapPin; label: string; value: string | null | undefined }[] = [
    { icon: MapPin, label: 'Address', value: [building.address1, building.address2, building.address3].filter(Boolean).join(', ') || null },
    { icon: MapPin, label: 'Post town', value: building.posttown },
    { icon: MapPin, label: 'Postcode', value: building.postcode },
    { icon: MapPin, label: 'Constituency', value: building.constituency_label },
    { icon: Building2, label: 'Sector', value: building.sector },
    { icon: Home, label: 'Tenure', value: building.tenure },
    { icon: Ruler, label: 'Floor area', value: building.floor_area ? `${building.floor_area.toLocaleString('en-GB')} m²` : null },
    { icon: Gauge, label: 'Asset rating', value: building.asset_rating != null ? String(building.asset_rating) : null },
    { icon: Calendar, label: 'Inspection date', value: building.inspection_date },
    { icon: Calendar, label: 'Lodgement date', value: building.lodgement_date },
    { icon: FileText, label: 'Transaction type', value: building.transaction_type },
    { icon: Fuel, label: 'Main heating fuel', value: building.main_heating_fuel },
    { icon: Wind, label: 'Building environment', value: building.building_environment },
    { icon: Zap, label: 'Air conditioning', value: building.aircon_present },
    { icon: Zap, label: 'Primary energy value', value: building.primary_energy_value != null ? `${building.primary_energy_value.toFixed(2)} kWh/m²/yr` : null },
    { icon: Leaf, label: 'Building emissions', value: building.building_emissions != null ? `${building.building_emissions.toFixed(2)} kgCO₂/m²/yr` : null },
    { icon: Leaf, label: 'Standard emissions', value: building.standard_emissions != null ? `${building.standard_emissions.toFixed(2)} kgCO₂/m²/yr` : null },
    { icon: Leaf, label: 'Target emissions', value: building.target_emissions != null ? `${building.target_emissions.toFixed(2)} kgCO₂/m²/yr` : null },
    { icon: Leaf, label: 'Typical emissions', value: building.typical_emissions != null ? `${building.typical_emissions.toFixed(2)} kgCO₂/m²/yr` : null },
    { icon: FileText, label: 'Certificate number', value: building.certificate_number },
  ];

  const benchmarks = [
    { label: 'New build benchmark', value: building.new_build_benchmark },
    { label: 'Existing stock benchmark', value: building.existing_stock_benchmark },
  ].filter((b) => b.value != null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white dark:bg-teal-900 border border-sand-200 dark:border-teal-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between p-5 bg-white dark:bg-teal-900 border-b border-sand-200 dark:border-teal-800/60">
          <div className="flex items-start gap-3 pr-8">
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${epcColor.bg} ${epcColor.text} font-bold text-lg flex-shrink-0`}>
              {building.epc_letter}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-teal-900 dark:text-sand-50 leading-tight">
                {building.name}
              </h2>
              <p className="text-sm text-teal-600/70 dark:text-teal-200/60 mt-0.5">
                {building.sector}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-teal-600 dark:text-teal-300 hover:bg-sand-100 dark:hover:bg-teal-800/60 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-3 gap-3 p-5 border-b border-sand-200 dark:border-teal-800/60">
          <div className="text-center p-3 rounded-xl bg-sand-50 dark:bg-teal-950/40">
            <p className="text-xs text-teal-600/70 dark:text-teal-200/60 mb-1">Floor area</p>
            <p className="text-lg font-bold text-teal-900 dark:text-sand-50 tabular-nums">
              {building.floor_area.toLocaleString('en-GB')}
            </p>
            <p className="text-xs text-teal-600/60 dark:text-teal-200/50">m²</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-sand-50 dark:bg-teal-950/40">
            <p className="text-xs text-teal-600/70 dark:text-teal-200/60 mb-1">EPC rating</p>
            <p className="text-lg font-bold text-teal-900 dark:text-sand-50">
              {building.epc_letter}
            </p>
            <p className="text-xs text-teal-600/60 dark:text-teal-200/50">
              {building.asset_rating != null ? `Score: ${building.asset_rating}` : '—'}
            </p>
          </div>
          <div className="text-center p-3 rounded-xl bg-sand-50 dark:bg-teal-950/40">
            <p className="text-xs text-teal-600/70 dark:text-teal-200/60 mb-1">Tenure</p>
            <p className="text-sm font-bold text-teal-900 dark:text-sand-50 leading-tight mt-1">
              {building.tenure}
            </p>
          </div>
        </div>

        {/* Detail rows */}
        <div className="p-5">
          <h3 className="text-sm font-semibold text-teal-900 dark:text-sand-50 mb-3">
            Building details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {detailRows.map((row, i) => {
              if (!row.value) return null;
              const Icon = row.icon;
              return (
                <div key={i} className="flex items-start gap-2.5">
                  <Icon className="w-4 h-4 text-teal-600 dark:text-teal-300 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-teal-600/60 dark:text-teal-200/50">{row.label}</p>
                    <p className="text-sm text-teal-900 dark:text-sand-50 break-words">{row.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Benchmarks */}
          {benchmarks.length > 0 && (
            <>
              <h3 className="text-sm font-semibold text-teal-900 dark:text-sand-50 mt-5 mb-3">
                Benchmarks
              </h3>
              <div className="flex flex-col gap-2">
                {benchmarks.map((b, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-sand-50 dark:bg-teal-950/40">
                    <span className="text-sm text-teal-600/70 dark:text-teal-200/60">{b.label}</span>
                    <span className="text-sm font-semibold text-teal-900 dark:text-sand-50 tabular-nums">
                      {b.value}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
