/*
# Create buildings table for MEES 2031 Building Finder

## Summary
Creates a `buildings` table to store UK commercial EPC (Energy Performance Certificate)
building records. This is a single-tenant application with no authentication — the data
is intentionally public/shared, so all CRUD policies allow both `anon` and `authenticated`
roles.

## New Table: `buildings`
- `id` — serial primary key
- `certificate_number` — EPC certificate reference (text, nullable, not unique due to source data)
- `name` — display name / building title (text, nullable)
- `address1`, `address2`, `address3` — address lines (text, all nullable)
- `posttown` — postal town (text, nullable)
- `postcode` — UK postcode (text, nullable)
- `constituency` — constituency code (text, nullable)
- `constituency_label` — constituency name (text, nullable)
- `local_authority` — local authority code (text, nullable)
- `sector` — property use class sector (text, nullable)
- `tenure` — ownership tenure (text, nullable)
- `epc_letter` — EPC rating letter A–G (text, not null)
- `asset_rating` — numeric asset rating score (integer, nullable)
- `epc_band` — numeric EPC band (double precision, nullable)
- `floor_area` — floor area in m² (integer, not null)
- `rank_by_area` — ranking by floor area (integer, not null)
- `rank_by_epc` — ranking by EPC rating (integer, not null)
- `inspection_date` — date of EPC inspection (date, nullable)
- `lodgement_date` — date of EPC lodgement (date, nullable)
- `lodgement_datetime` — full lodgement timestamp (text, nullable)
- `transaction_type` — transaction type description (text, nullable)
- `new_build_benchmark` — new build benchmark percentage (integer, nullable)
- `existing_stock_benchmark` — existing stock benchmark percentage (integer, nullable)
- `building_level` — building level code (integer, nullable)
- `main_heating_fuel` — primary heating fuel type (text, nullable)
- `other_fuel_desc` — other fuel description (text, nullable)
- `special_energy_uses` — special energy uses (text, nullable)
- `renewable_sources` — renewable sources description (text, nullable)
- `building_environment` — building environment type (text, nullable)
- `aircon_present` — "Yes" or "No" (text, nullable)
- `aircon_kw_rating` — AC kW rating (double precision, nullable)
- `estimated_aircon_kw_rating` — estimated AC kW rating (double precision, nullable)
- `ac_inspection_commissioned` — AC inspection status code (integer, nullable)
- `standard_emissions` — standard emissions kgCO₂/m²/yr (double precision, nullable)
- `target_emissions` — target emissions kgCO₂/m²/yr (double precision, nullable)
- `typical_emissions` — typical emissions kgCO₂/m²/yr (double precision, nullable)
- `building_emissions` — building emissions kgCO₂/m²/yr (double precision, nullable)
- `primary_energy_value` — primary energy kWh/m²/yr (double precision, nullable)
- `report_type` — report type code (integer, nullable)
- `uprn` — Unique Property Reference Number (double precision, nullable — some values exceed integer range)
- `uprn_source` — source of UPRN (text, nullable)
- `created_at` — record insertion timestamp (timestamptz, default now())

## Indexes
- `idx_buildings_epc_letter` — on `epc_letter` for EPC filter queries
- `idx_buildings_floor_area` — on `floor_area` for floor area filter/sort queries
- `idx_buildings_rank_area` — on `rank_by_area` for area-sorted listing
- `idx_buildings_rank_epc` — on `rank_by_epc` for EPC-sorted listing

## Security
- Row Level Security enabled on `buildings`.
- Four separate policies (SELECT, INSERT, UPDATE, DELETE) all scoped to
  `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)` because
  this is a single-tenant application with no sign-in screen — the data is
  intentionally public and shared.
*/
CREATE TABLE IF NOT EXISTS buildings (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  certificate_number text,
  name text,
  address1 text,
  address2 text,
  address3 text,
  posttown text,
  postcode text,
  constituency text,
  constituency_label text,
  local_authority text,
  sector text,
  tenure text,
  epc_letter text NOT NULL,
  asset_rating integer,
  epc_band double precision,
  floor_area integer NOT NULL,
  rank_by_area integer NOT NULL,
  rank_by_epc integer NOT NULL,
  inspection_date date,
  lodgement_date date,
  lodgement_datetime text,
  transaction_type text,
  new_build_benchmark integer,
  existing_stock_benchmark integer,
  building_level integer,
  main_heating_fuel text,
  other_fuel_desc text,
  special_energy_uses text,
  renewable_sources text,
  building_environment text,
  aircon_present text,
  aircon_kw_rating double precision,
  estimated_aircon_kw_rating double precision,
  ac_inspection_commissioned integer,
  standard_emissions double precision,
  target_emissions double precision,
  typical_emissions double precision,
  building_emissions double precision,
  primary_energy_value double precision,
  report_type integer,
  uprn double precision,
  uprn_source text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_buildings_epc_letter ON buildings (epc_letter);
CREATE INDEX IF NOT EXISTS idx_buildings_floor_area ON buildings (floor_area);
CREATE INDEX IF NOT EXISTS idx_buildings_rank_area ON buildings (rank_by_area);
CREATE INDEX IF NOT EXISTS idx_buildings_rank_epc ON buildings (rank_by_epc);

ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_buildings" ON buildings;
CREATE POLICY "anon_select_buildings" ON buildings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_buildings" ON buildings;
CREATE POLICY "anon_insert_buildings" ON buildings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_buildings" ON buildings;
CREATE POLICY "anon_update_buildings" ON buildings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_buildings" ON buildings;
CREATE POLICY "anon_delete_buildings" ON buildings FOR DELETE
  TO anon, authenticated USING (true);