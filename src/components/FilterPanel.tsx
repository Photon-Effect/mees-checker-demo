import { EPC_LETTERS, RankMode, SortDirection } from '@/types';
import { Ruler, Gauge, ArrowUpDown, Sun, Moon, ArrowUp, ArrowDown } from 'lucide-react';

interface FilterPanelProps {
  minArea: number;
  maxArea: number;
  onMinAreaChange: (val: number) => void;
  activeEpcs: Set<string>;
  onToggleEpc: (letter: string) => void;
  rankMode: RankMode;
  onRankModeChange: (mode: RankMode) => void;
  sortDirection: SortDirection;
  onSortDirectionChange: (dir: SortDirection) => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export function FilterPanel({
  minArea,
  maxArea,
  onMinAreaChange,
  activeEpcs,
  onToggleEpc,
  rankMode,
  onRankModeChange,
  sortDirection,
  onSortDirectionChange,
  isDark,
  onToggleDark,
}: FilterPanelProps) {
  const clamp = (val: number) => Math.max(0, Math.min(maxArea, val));

  return (
    <div className="flex flex-col gap-6 p-5 bg-white dark:bg-teal-900/60 rounded-2xl border border-sand-200 dark:border-teal-800/60 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-600 text-white">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-teal-900 dark:text-sand-50 leading-tight">
              MEES 2031
            </h1>
            <p className="text-xs text-teal-600/70 dark:text-teal-200/60 leading-tight">
              Building Finder
            </p>
          </div>
        </div>
        <button
          onClick={onToggleDark}
          className="p-2 rounded-lg text-teal-600 dark:text-teal-300 hover:bg-sand-100 dark:hover:bg-teal-800/60 transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Min floor area */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Ruler className="w-4 h-4 text-teal-600 dark:text-teal-300" />
          <label className="text-sm font-semibold text-teal-900 dark:text-sand-50">
            Minimum floor area
          </label>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={maxArea}
            step={50}
            value={minArea}
            onChange={(e) => onMinAreaChange(Number(e.target.value))}
            className="flex-1 bg-sand-200 dark:bg-teal-800"
          />
          <div className="flex items-center gap-1 flex-shrink-0">
            <input
              type="number"
              min={0}
              max={maxArea}
              step={50}
              value={minArea}
              onChange={(e) => onMinAreaChange(clamp(Number(e.target.value) || 0))}
              className="w-24 px-2 py-1.5 text-sm rounded-lg border border-sand-200 dark:border-teal-800 bg-sand-50 dark:bg-teal-950/50 text-teal-900 dark:text-sand-50 tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <span className="text-sm text-teal-600/70 dark:text-teal-200/60">m²</span>
          </div>
        </div>
        <p className="text-xs text-teal-600/70 dark:text-teal-200/60">
          Showing buildings {minArea.toLocaleString('en-GB')} m² and above
        </p>
      </div>

      {/* EPC rating */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-teal-600 dark:text-teal-300" />
          <label className="text-sm font-semibold text-teal-900 dark:text-sand-50">
            EPC rating
          </label>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {EPC_LETTERS.map((letter) => {
            const active = activeEpcs.has(letter);
            return (
              <button
                key={letter}
                onClick={() => onToggleEpc(letter)}
                className={`flex items-center justify-center h-10 rounded-lg text-sm font-bold transition-all duration-150 ${
                  active
                    ? 'bg-teal-600 text-white shadow-sm scale-100'
                    : 'bg-sand-100 dark:bg-teal-950/50 text-teal-600/40 dark:text-teal-200/40 hover:bg-sand-200 dark:hover:bg-teal-900 scale-95'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-teal-600/70 dark:text-teal-200/60">
          {activeEpcs.size} of {EPC_LETTERS.length} ratings selected
        </p>
      </div>

      {/* Rank by */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-teal-600 dark:text-teal-300" />
          <label className="text-sm font-semibold text-teal-900 dark:text-sand-50">
            Rank by
          </label>
        </div>
        <div className="grid grid-cols-2 gap-2 p-1 bg-sand-100 dark:bg-teal-950/50 rounded-xl">
          <button
            onClick={() => onRankModeChange('area')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              rankMode === 'area'
                ? 'bg-white dark:bg-teal-700 text-teal-900 dark:text-sand-50 shadow-sm'
                : 'text-teal-600/60 dark:text-teal-200/50 hover:text-teal-700 dark:hover:text-teal-200'
            }`}
          >
            Floor area
          </button>
          <button
            onClick={() => onRankModeChange('epc')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              rankMode === 'epc'
                ? 'bg-white dark:bg-teal-700 text-teal-900 dark:text-sand-50 shadow-sm'
                : 'text-teal-600/60 dark:text-teal-200/50 hover:text-teal-700 dark:hover:text-teal-200'
            }`}
          >
            EPC rating
          </button>
        </div>
        {/* Sort direction toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-sand-100 dark:bg-teal-950/50 rounded-xl">
          <button
            onClick={() => onSortDirectionChange('desc')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              sortDirection === 'desc'
                ? 'bg-white dark:bg-teal-700 text-teal-900 dark:text-sand-50 shadow-sm'
                : 'text-teal-600/60 dark:text-teal-200/50 hover:text-teal-700 dark:hover:text-teal-200'
            }`}
          >
            <ArrowUp className="w-4 h-4" />
            Highest first
          </button>
          <button
            onClick={() => onSortDirectionChange('asc')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              sortDirection === 'asc'
                ? 'bg-white dark:bg-teal-700 text-teal-900 dark:text-sand-50 shadow-sm'
                : 'text-teal-600/60 dark:text-teal-200/50 hover:text-teal-700 dark:hover:text-teal-200'
            }`}
          >
            <ArrowDown className="w-4 h-4" />
            Lowest first
          </button>
        </div>
      </div>
    </div>
  );
}
