import { Building, EPC_COLORS } from '@/types';

export function EpcBadge({ letter }: { letter: string }) {
  const c = EPC_COLORS[letter] ?? EPC_COLORS['G'];
  return (
    <span
      className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-sm font-bold ${c.bg} ${c.text} ring-2 ${c.ring} tabular-nums`}
      title={`EPC Rating ${letter}`}
    >
      {letter}
    </span>
  );
}

export function BuildingCard({
  building,
  rank,
  onClick,
}: {
  building: Building;
  rank: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-4 w-full text-left p-4 rounded-xl bg-white dark:bg-teal-900/40 border border-sand-200 dark:border-teal-800/50 hover:border-teal-400 dark:hover:border-teal-500/60 hover:shadow-md transition-all duration-150 cursor-pointer"
    >
      {/* Rank */}
      <div className="flex-shrink-0 w-10 text-center">
        <span className="text-xs font-medium text-teal-600/60 dark:text-teal-200/50 tabular-nums">
          #{rank}
        </span>
      </div>

      {/* EPC badge */}
      <EpcBadge letter={building.epc_letter} />

      {/* Name + sector */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-teal-900 dark:text-sand-50 truncate group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
          {building.name}
        </p>
        <p className="text-sm text-teal-600/70 dark:text-teal-200/60 truncate">
          {building.sector}
        </p>
      </div>

      {/* Floor area */}
      <div className="flex-shrink-0 text-right">
        <p className="text-lg font-semibold text-teal-900 dark:text-sand-50 tabular-nums">
          {building.floor_area.toLocaleString('en-GB')}
        </p>
        <p className="text-xs text-teal-600/60 dark:text-teal-200/50">m²</p>
      </div>

      {/* Tenure */}
      <div className="flex-shrink-0 hidden sm:block">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-sand-100 dark:bg-teal-800/60 text-teal-700 dark:text-teal-200">
          {building.tenure}
        </span>
      </div>
    </button>
  );
}
