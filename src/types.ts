export interface Building {
  name: string;
  sector: string;
  floor_area: number;
  epc_letter: string;
  tenure: string;
  rank_by_area: number;
  rank_by_epc: number;
  certificate_number?: string;
  address1?: string | null;
  address2?: string | null;
  address3?: string | null;
  posttown?: string | null;
  postcode?: string;
  constituency_label?: string;
  asset_rating?: number;
  inspection_date?: string;
  lodgement_date?: string;
  transaction_type?: string;
  main_heating_fuel?: string;
  building_environment?: string;
  aircon_present?: string;
  primary_energy_value?: number;
  building_emissions?: number;
  standard_emissions?: number;
  target_emissions?: number;
  typical_emissions?: number;
  new_build_benchmark?: number;
  existing_stock_benchmark?: number;
  renewable_sources?: string | null;
}

export type RankMode = 'area' | 'epc';
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  minFloorArea: number;
  activeEpcLetters: Set<string>;
  rankBy: RankMode;
  sortDirection: SortDirection;
}

export const EPC_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;

export const EPC_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  A: { bg: 'bg-emerald-500', text: 'text-white', ring: 'ring-emerald-500/30' },
  B: { bg: 'bg-green-500', text: 'text-white', ring: 'ring-green-500/30' },
  C: { bg: 'bg-yellow-400', text: 'text-yellow-950', ring: 'ring-yellow-400/30' },
  D: { bg: 'bg-lime-600', text: 'text-white', ring: 'ring-lime-600/30' },
  E: { bg: 'bg-orange-500', text: 'text-white', ring: 'ring-orange-500/30' },
  F: { bg: 'bg-orange-600', text: 'text-white', ring: 'ring-orange-600/30' },
  G: { bg: 'bg-red-600', text: 'text-white', ring: 'ring-red-600/30' },
};
