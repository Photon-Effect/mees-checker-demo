import { useCallback, useEffect, useMemo, useState } from 'react';
import { Building, EPC_LETTERS, FilterState, SortDirection } from '@/types';
import { FilterPanel } from '@/components/FilterPanel';
import { BuildingCard } from '@/components/EpcBadge';
import { BuildingDetailModal } from '@/components/BuildingDetailModal';
import { Building2, SlidersHorizontal } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function App() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ONE shared filter state object — every control updates exactly one field here
  const [filterState, setFilterState] = useState<FilterState>({
    minFloorArea: 0,
    activeEpcLetters: new Set<string>(EPC_LETTERS),
    rankBy: 'area',
    sortDirection: 'desc' as SortDirection,
  });

  const [isDark, setIsDark] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  const closeModal = useCallback(() => setSelectedBuilding(null), []);

  // Load data from Supabase
  useEffect(() => {
    supabase
      .from('buildings')
      .select('*')
      .order('id', { ascending: true })
      .then(({ data, error: queryError }) => {
        if (queryError) {
          setError(queryError.message);
        } else {
          setBuildings(data as Building[]);
        }
        setLoading(false);
      });
  }, []);

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const maxArea = useMemo(
    () => buildings.reduce((max, b) => Math.max(max, b.floor_area), 0),
    [buildings]
  );

  // Clamp minFloorArea when maxArea changes
  useEffect(() => {
    if (filterState.minFloorArea > maxArea && maxArea > 0) {
      setFilterState((prev) => ({ ...prev, minFloorArea: maxArea }));
    }
  }, [maxArea, filterState.minFloorArea]);

  // Every control handler does ONE thing: update its field on filterState.
  // None of them touch the results list directly.
  const updateMinFloorArea = useCallback((val: number) => {
    setFilterState((prev) => ({ ...prev, minFloorArea: val }));
  }, []);

  const toggleEpcLetter = useCallback((letter: string) => {
    setFilterState((prev) => {
      const next = new Set(prev.activeEpcLetters);
      if (next.has(letter)) next.delete(letter);
      else next.add(letter);
      return { ...prev, activeEpcLetters: next };
    });
  }, []);

  const updateRankBy = useCallback((mode: 'area' | 'epc') => {
    setFilterState((prev) => ({ ...prev, rankBy: mode }));
  }, []);

  const updateSortDirection = useCallback((dir: SortDirection) => {
    setFilterState((prev) => ({ ...prev, sortDirection: dir }));
  }, []);

  // render() — the ONLY function that reads building data, applies filters,
  // applies sort, and produces the results list + match count.
  const results = useMemo(() => {
    const { minFloorArea, activeEpcLetters, rankBy, sortDirection } = filterState;

    const filtered = buildings.filter(
      (b) => b.floor_area >= minFloorArea && activeEpcLetters.has(b.epc_letter)
    );

    // rank_by_area: 1 = largest, 1000 = smallest
    // rank_by_epc:  1 = worst (G, highest asset rating), 1000 = best (A, lowest asset rating)
    // "Highest first" (desc) = biggest area first / best EPC first
    // "Lowest first" (asc)  = smallest area first / worst EPC first
    const sorted = [...filtered].sort((a, b) => {
      const aRank = rankBy === 'area' ? a.rank_by_area : a.rank_by_epc;
      const bRank = rankBy === 'area' ? b.rank_by_area : b.rank_by_epc;

      if (rankBy === 'area') {
        // rank 1 = largest. desc = highest first = rank ascending.
        return sortDirection === 'desc' ? aRank - bRank : bRank - aRank;
      } else {
        // rank 1 = worst. desc = highest first (best, A) = rank descending.
        return sortDirection === 'desc' ? bRank - aRank : aRank - bRank;
      }
    });

    return sorted;
  }, [buildings, filterState]);

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 dark:bg-teal-950 flex items-center justify-center">
        <p className="text-teal-600 dark:text-teal-300">Loading buildings…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-sand-50 dark:bg-teal-950 flex items-center justify-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-teal-950 text-teal-900 dark:text-sand-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Mobile title */}
        <div className="lg:hidden mb-4 flex items-center gap-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-600 text-white">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight">MEES 2031 Building Finder</h1>
            <p className="text-xs text-teal-600/70 dark:text-teal-200/60 leading-tight">
              UK Commercial Property ESG
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-80 lg:flex-shrink-0 lg:sticky lg:top-6 lg:self-start">
            <FilterPanel
              minArea={filterState.minFloorArea}
              maxArea={maxArea}
              onMinAreaChange={updateMinFloorArea}
              activeEpcs={filterState.activeEpcLetters}
              onToggleEpc={toggleEpcLetter}
              rankMode={filterState.rankBy}
              onRankModeChange={updateRankBy}
              sortDirection={filterState.sortDirection}
              onSortDirectionChange={updateSortDirection}
              isDark={isDark}
              onToggleDark={() => setIsDark((d) => !d)}
            />
          </aside>

          {/* Results */}
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-teal-600 dark:text-teal-300 hidden lg:block" />
                <p className="text-sm text-teal-700 dark:text-teal-200/80">
                  <span className="font-bold tabular-nums">{results.length}</span>
                  {' of '}
                  <span className="font-bold tabular-nums">{buildings.length}</span>
                  {' buildings match'}
                </p>
              </div>
            </div>

            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="w-14 h-14 rounded-full bg-sand-200 dark:bg-teal-900/60 flex items-center justify-center mb-4">
                  <Building2 className="w-7 h-7 text-teal-600/50 dark:text-teal-300/50" />
                </div>
                <p className="text-lg font-semibold text-teal-800 dark:text-sand-100 mb-1">
                  No buildings match these filters
                </p>
                <p className="text-sm text-teal-600/70 dark:text-teal-200/60">
                  Try lowering the minimum floor area or selecting more EPC ratings.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 results-scroll">
                {results.map((building, idx) => (
                  <BuildingCard
                    key={`${building.certificate_number ?? building.name}-${idx}`}
                    building={building}
                    rank={filterState.rankBy === 'area' ? building.rank_by_area : building.rank_by_epc}
                    onClick={() => setSelectedBuilding(building)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <BuildingDetailModal
        building={selectedBuilding}
        onClose={closeModal}
      />
    </div>
  );
}
