/*
# Extend products for full catalog rendering + fix admin write access

1. Purpose
- The public site currently renders its catalog from static JSON files
  (data/products.json, data/categories.json) instead of the database.
  This migration extends `products` with the fields the site actually
  needs (slug, images, features, specifications, applications, sizes,
  datasheet, featured) and backfills them from the existing static
  catalog data, so the app can be switched to read products from
  Supabase.
- It also grants `authenticated` INSERT/UPDATE/DELETE on `categories`,
  `sub_categories`, and `products`. Previously only SELECT was granted,
  so the admin product editor (lib/actions.ts createProduct/
  updateProduct/deleteProduct) was silently failing against RLS.

2. Modified tables
- `products`: new columns slug, image_url, images, features,
  specifications, applications, available_sizes, datasheet_url,
  featured; backfilled from the current static catalog; slug made
  required and unique.
- `categories`, `sub_categories`, `products`: authenticated role gains
  write access via RLS policies + grants.

3. Security
- Public (anon) access remains read-only on these tables.
- No service-role or secret key access is granted.
*/

-- ============================================================================
-- PRODUCTS: new columns for full catalog content
-- ============================================================================
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS images text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS features text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS specifications jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS applications text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS available_sizes text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS datasheet_url text,
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;

-- ============================================================================
-- BACKFILL: populate the new columns from the current static catalog data
-- ============================================================================
UPDATE products SET
  slug = 'hexagon-bolt',
  image_url = '/images/products/fasteners/hexagon-bolt.webp',
  images = ARRAY['/images/products/fasteners/hexagon-bolt.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = true
WHERE category_id = get_category_id('fasteners') AND name = 'Hexagon Bolt';

UPDATE products SET
  slug = 'hex-socket-head-cap',
  image_url = '/images/products/fasteners/hex-socket-head-cap.webp',
  images = ARRAY['/images/products/fasteners/hex-socket-head-cap.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('fasteners') AND name = 'Hex Socket Head Cap';

UPDATE products SET
  slug = 'carriage-bolts',
  image_url = '/images/products/fasteners/carriage-bolts.webp',
  images = ARRAY['/images/products/fasteners/carriage-bolts.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('fasteners') AND name = 'Carriage Bolts';

UPDATE products SET
  slug = 'wedge-anchor-bolt',
  image_url = '/images/products/fasteners/wedge-anchor-bolt.webp',
  images = ARRAY['/images/products/fasteners/wedge-anchor-bolt.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = true
WHERE category_id = get_category_id('fasteners') AND name = 'Wedge Anchor Bolt';

UPDATE products SET
  slug = 'threaded-rod',
  image_url = '/images/products/fasteners/threaded-rod.webp',
  images = ARRAY['/images/products/fasteners/threaded-rod.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = true
WHERE category_id = get_category_id('fasteners') AND name = 'Threaded Rod';

UPDATE products SET
  slug = 'pan-countersunk-bolt',
  image_url = '/images/products/fasteners/pan-countersunk-bolt.webp',
  images = ARRAY['/images/products/fasteners/pan-countersunk-bolt.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('fasteners') AND name = 'Pan & Countersunk Bolt';

UPDATE products SET
  slug = 'self-drilling-screw-csk-head',
  image_url = '/images/products/fasteners/self-drilling-screw-csk-head.webp',
  images = ARRAY['/images/products/fasteners/self-drilling-screw-csk-head.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('fasteners') AND name = 'Self Drilling Screw with CSK Head';

UPDATE products SET
  slug = 'hex-self-drill-screw',
  image_url = '/images/products/fasteners/hex-self-drill-screw.webp',
  images = ARRAY['/images/products/fasteners/hex-self-drill-screw.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('fasteners') AND name = 'Hex Self Drill Screw';

UPDATE products SET
  slug = 'self-drilling-screw-flat-head',
  image_url = '/images/products/fasteners/self-drilling-screw-flat-head.webp',
  images = ARRAY['/images/products/fasteners/self-drilling-screw-flat-head.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('fasteners') AND name = 'Self Drilling Screw with Flat Head';

UPDATE products SET
  slug = 'self-drilling-screw-pan-head',
  image_url = '/images/products/fasteners/self-drilling-screw-pan-head.webp',
  images = ARRAY['/images/products/fasteners/self-drilling-screw-pan-head.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('fasteners') AND name = 'Self Drilling Screw with Pan Head';

UPDATE products SET
  slug = 'dry-wall-screw-plain-zinc',
  image_url = '/images/products/fasteners/dry-wall-screw.webp',
  images = ARRAY['/images/products/fasteners/dry-wall-screw.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('fasteners') AND name = 'Dry Wall Screw — Plain & Zinc';

UPDATE products SET
  slug = 'chipboard-screw',
  image_url = '/images/products/fasteners/chipboard-screw.webp',
  images = ARRAY['/images/products/fasteners/chipboard-screw.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('fasteners') AND name = 'Chipboard Screw';

UPDATE products SET
  slug = 'pan-head-tapping-screw',
  image_url = '/images/products/fasteners/pan-head-tapping-screw.webp',
  images = ARRAY['/images/products/fasteners/pan-head-tapping-screw.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('fasteners') AND name = 'Pan Head Tapping Screw';

UPDATE products SET
  slug = 'nylon-insert-lock-nut',
  image_url = '/images/products/fasteners/nylon-insert-lock-nut.webp',
  images = ARRAY['/images/products/fasteners/nylon-insert-lock-nut.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('fasteners') AND name = 'Nylon Insert Lock Nut';

UPDATE products SET
  slug = 'nut-with-cap',
  image_url = '/images/products/fasteners/nut-with-cap.webp',
  images = ARRAY['/images/products/fasteners/nut-with-cap.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('fasteners') AND name = 'Nut with Cap';

UPDATE products SET
  slug = 'coupling-nut',
  image_url = '/images/products/fasteners/coupling-nut.webp',
  images = ARRAY['/images/products/fasteners/coupling-nut.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('fasteners') AND name = 'Coupling';

UPDATE products SET
  slug = 'nut-with-flange',
  image_url = '/images/products/fasteners/nut-with-flange.webp',
  images = ARRAY['/images/products/fasteners/nut-with-flange.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('fasteners') AND name = 'Nut with Flange';

UPDATE products SET
  slug = 'hex-nuts',
  image_url = '/images/products/fasteners/hex-nuts.webp',
  images = ARRAY['/images/products/fasteners/hex-nuts.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('fasteners') AND name = 'Hex Nuts';

UPDATE products SET
  slug = 'spring-lock-washer',
  image_url = '/images/products/fasteners/spring-lock-washer.webp',
  images = ARRAY['/images/products/fasteners/spring-lock-washer.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('fasteners') AND name = 'Spring Lock Washer';

UPDATE products SET
  slug = 'external-tooth-lock-washer',
  image_url = '/images/products/fasteners/external-tooth-lock-washer.webp',
  images = ARRAY['/images/products/fasteners/external-tooth-lock-washer.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('fasteners') AND name = 'External Tooth Lock';

UPDATE products SET
  slug = 'washer-hv',
  image_url = '/images/products/fasteners/washer-hv.webp',
  images = ARRAY['/images/products/fasteners/washer-hv.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('fasteners') AND name = 'Washer & H.V';

UPDATE products SET
  slug = 'nylon-frame-anchor',
  image_url = '/images/products/fasteners/nylon-frame-anchor.webp',
  images = ARRAY['/images/products/fasteners/nylon-frame-anchor.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('fasteners') AND name = 'Nylon Frame Anchor';

UPDATE products SET
  slug = 'nylon-plug',
  image_url = '/images/products/fasteners/nylon-plug.webp',
  images = ARRAY['/images/products/fasteners/nylon-plug.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('fasteners') AND name = 'Nylon Plug';

UPDATE products SET
  slug = 'drop-in-anchor',
  image_url = '/images/products/fasteners/drop-in-anchor.webp',
  images = ARRAY['/images/products/fasteners/drop-in-anchor.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('fasteners') AND name = 'Drop In Anchor';

UPDATE products SET
  slug = 'blind-rivet',
  image_url = '/images/products/fasteners/blind-rivet.webp',
  images = ARRAY['/images/products/fasteners/blind-rivet.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('fasteners') AND name = 'Blind Rivet';

UPDATE products SET
  slug = 'glass-wool-boards',
  image_url = '/images/products/insulation/glass-wool-boards.webp',
  images = ARRAY['/images/products/insulation/glass-wool-boards.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('insulation') AND sub_category_id = (SELECT id FROM sub_categories WHERE category_id = get_category_id('insulation') AND name = '1 — Glass Wool') AND name = 'Boards';

UPDATE products SET
  slug = 'glass-wool-blankets',
  image_url = '/images/products/insulation/glass-wool-blankets.webp',
  images = ARRAY['/images/products/insulation/glass-wool-blankets.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('insulation') AND sub_category_id = (SELECT id FROM sub_categories WHERE category_id = get_category_id('insulation') AND name = '1 — Glass Wool') AND name = 'Blankets';

UPDATE products SET
  slug = 'glass-wool-pipes',
  image_url = '/images/products/insulation/glass-wool-pipes.webp',
  images = ARRAY['/images/products/insulation/glass-wool-pipes.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('insulation') AND sub_category_id = (SELECT id FROM sub_categories WHERE category_id = get_category_id('insulation') AND name = '1 — Glass Wool') AND name = 'Pipes';

UPDATE products SET
  slug = 'rock-wool-boards',
  image_url = '/images/products/insulation/rock-wool-boards.webp',
  images = ARRAY['/images/products/insulation/rock-wool-boards.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = true
WHERE category_id = get_category_id('insulation') AND sub_category_id = (SELECT id FROM sub_categories WHERE category_id = get_category_id('insulation') AND name = '2 — Rock Wool') AND name = 'Boards';

UPDATE products SET
  slug = 'rock-wool-blankets',
  image_url = '/images/products/insulation/rock-wool-blankets.webp',
  images = ARRAY['/images/products/insulation/rock-wool-blankets.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = true
WHERE category_id = get_category_id('insulation') AND sub_category_id = (SELECT id FROM sub_categories WHERE category_id = get_category_id('insulation') AND name = '2 — Rock Wool') AND name = 'Blankets';

UPDATE products SET
  slug = 'rock-wool-pipes',
  image_url = '/images/products/insulation/rock-wool-pipes.webp',
  images = ARRAY['/images/products/insulation/rock-wool-pipes.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = true
WHERE category_id = get_category_id('insulation') AND sub_category_id = (SELECT id FROM sub_categories WHERE category_id = get_category_id('insulation') AND name = '2 — Rock Wool') AND name = 'Pipes';

UPDATE products SET
  slug = 'elastomeric-rubber-pipes',
  image_url = '/images/products/insulation/elastomeric-rubber-pipes.webp',
  images = ARRAY['/images/products/insulation/elastomeric-rubber-pipes.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = true
WHERE category_id = get_category_id('insulation') AND sub_category_id = (SELECT id FROM sub_categories WHERE category_id = get_category_id('insulation') AND name = '3 — Elastomeric Rubber') AND name = 'Pipes';

UPDATE products SET
  slug = 'elastomeric-rubber-blankets',
  image_url = '/images/products/insulation/elastomeric-rubber-blankets.webp',
  images = ARRAY['/images/products/insulation/elastomeric-rubber-blankets.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = true
WHERE category_id = get_category_id('insulation') AND sub_category_id = (SELECT id FROM sub_categories WHERE category_id = get_category_id('insulation') AND name = '3 — Elastomeric Rubber') AND name = 'Blankets';

UPDATE products SET
  slug = 'duct-sealant-adhesive',
  image_url = '/images/products/insulation/duct-sealant-adhesive.webp',
  images = ARRAY['/images/products/insulation/duct-sealant-adhesive.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('insulation') AND name = 'Duct Sealant and Adhesive';

UPDATE products SET
  slug = 'gasket',
  image_url = '/images/products/insulation/gasket.webp',
  images = ARRAY['/images/products/insulation/gasket.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('insulation') AND name = 'Gasket';

UPDATE products SET
  slug = 'aluminium-foil-tape',
  image_url = '/images/products/insulation/aluminium-foil-tape.webp',
  images = ARRAY['/images/products/insulation/aluminium-foil-tape.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('insulation') AND name = 'Aluminium Foil Tape';

UPDATE products SET
  slug = 'flexible-duct-connector',
  image_url = '/images/products/insulation/flexible-duct-connector.webp',
  images = ARRAY['/images/products/insulation/flexible-duct-connector.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('insulation') AND name = 'Flexible Duct Connector';

UPDATE products SET
  slug = 'flexible-connector',
  image_url = '/images/products/insulation/flexible-connector.webp',
  images = ARRAY['/images/products/insulation/flexible-connector.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('insulation') AND name = 'Flexible Connector';

UPDATE products SET
  slug = 'stick-pins',
  image_url = '/images/products/insulation/stick-pins.webp',
  images = ARRAY['/images/products/insulation/stick-pins.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('insulation') AND name = 'Stick Pins';

UPDATE products SET
  slug = 'aluminium-conduit',
  image_url = '/images/products/electric/aluminium-conduit.webp',
  images = ARRAY['/images/products/electric/aluminium-conduit.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('electrical') AND name = 'Aluminium Conduit';

UPDATE products SET
  slug = 'steel-conduit',
  image_url = '/images/products/electric/steel-conduit.webp',
  images = ARRAY['/images/products/electric/steel-conduit.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = true
WHERE category_id = get_category_id('electrical') AND name = 'Steel Conduit';

UPDATE products SET
  slug = 'pvc-conduit',
  image_url = '/images/products/electric/pvc-conduit.webp',
  images = ARRAY['/images/products/electric/pvc-conduit.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('electrical') AND name = 'PVC Conduit';

UPDATE products SET
  slug = 'hdbe-conduit',
  image_url = '/images/products/electric/hdbe-conduit.webp',
  images = ARRAY['/images/products/electric/hdbe-conduit.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('electrical') AND name = 'HDBE Conduit';

UPDATE products SET
  slug = 'control-copper-cables',
  image_url = '/images/products/electric/control-copper-cables.webp',
  images = ARRAY['/images/products/electric/control-copper-cables.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('electrical') AND name = 'Control Copper Cables';

UPDATE products SET
  slug = 'cables-fire-alarm',
  image_url = '/images/products/electric/cables-fire-alarm.webp',
  images = ARRAY['/images/products/electric/cables-fire-alarm.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = true
WHERE category_id = get_category_id('electrical') AND name = 'Cables Fire Alarm';

UPDATE products SET
  slug = 'low-voltage-wires-cables',
  image_url = '/images/products/electric/low-voltage-wires-cables.webp',
  images = ARRAY['/images/products/electric/low-voltage-wires-cables.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('electrical') AND name = 'Low Voltage Wires & Cables';

UPDATE products SET
  slug = 'cables-computer',
  image_url = '/images/products/electric/cables-computer.webp',
  images = ARRAY['/images/products/electric/cables-computer.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('electrical') AND name = 'Cables Computer';

UPDATE products SET
  slug = 'aluminium-cables',
  image_url = '/images/products/electric/aluminium-cables.webp',
  images = ARRAY['/images/products/electric/aluminium-cables.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('electrical') AND name = 'Aluminium Cables';

UPDATE products SET
  slug = 'steel-boxes',
  image_url = '/images/products/electric/steel-boxes.webp',
  images = ARRAY['/images/products/electric/steel-boxes.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('electrical') AND name = 'Steel Boxes';

UPDATE products SET
  slug = 'steel-panels',
  image_url = '/images/products/electric/steel-panels.webp',
  images = ARRAY['/images/products/electric/steel-panels.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('electrical') AND name = 'Steel Panels';

UPDATE products SET
  slug = 'plastic-boxes',
  image_url = '/images/products/electric/plastic-boxes.webp',
  images = ARRAY['/images/products/electric/plastic-boxes.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('electrical') AND name = 'Plastic Boxes';

UPDATE products SET
  slug = 'cable-ties-pvc',
  image_url = '/images/products/electric/cable-ties-pvc.webp',
  images = ARRAY['/images/products/electric/cable-ties-pvc.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('electrical') AND name = 'Cable Ties PVC';

UPDATE products SET
  slug = 'cable-ties-steel',
  image_url = '/images/products/electric/cable-ties-steel.webp',
  images = ARRAY['/images/products/electric/cable-ties-steel.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('electrical') AND name = 'Cable Ties Steel';

UPDATE products SET
  slug = 'cables-tray',
  image_url = '/images/products/electric/cable-tray.webp',
  images = ARRAY['/images/products/electric/cable-tray.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('electrical') AND name = 'Cables Tray';

UPDATE products SET
  slug = 'cable-conduit-glands-accessories',
  image_url = '/images/products/electric/cable-conduit-glands.webp',
  images = ARRAY['/images/products/electric/cable-conduit-glands.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('electrical') AND name = 'Cable & Conduit Glands and Accessories';

UPDATE products SET
  slug = 'c-channel',
  image_url = '/images/products/electric/c-channel.webp',
  images = ARRAY['/images/products/electric/c-channel.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('electrical') AND name = '{C} Channel';

UPDATE products SET
  slug = 'seamless-erw-pipes',
  image_url = '/images/products/pipes/seamless-erw-pipes.webp',
  images = ARRAY['/images/products/pipes/seamless-erw-pipes.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = true
WHERE category_id = get_category_id('pipes') AND name = 'Seamless & ERW Pipes';

UPDATE products SET
  slug = 'threaded-welded-fittings',
  image_url = '/images/products/pipes/threaded-welded-fittings.webp',
  images = ARRAY['/images/products/pipes/threaded-welded-fittings.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('pipes') AND name = 'Threaded & Welded Fittings';

UPDATE products SET
  slug = 'flanges',
  image_url = '/images/products/pipes/flanges.webp',
  images = ARRAY['/images/products/pipes/flanges.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('pipes') AND name = 'Flanges';

UPDATE products SET
  slug = 'pipe-supports',
  image_url = '/images/products/pipes/pipe-supports.webp',
  images = ARRAY['/images/products/pipes/pipe-supports.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('pipes') AND name = 'Supports';

UPDATE products SET
  slug = 'valves-gate-ball-butterfly',
  image_url = '/images/products/pipes/gate-valve.webp',
  images = ARRAY['/images/products/pipes/gate-valve.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('pipes') AND name = 'Valves — Gate / Ball / Butterfly';

UPDATE products SET
  slug = 'flexible-connection-epdm-stainless',
  image_url = '/images/products/pipes/flexible-connection.webp',
  images = ARRAY['/images/products/pipes/flexible-connection.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('pipes') AND name = 'Flexible Connection EPDM / Stainless';

UPDATE products SET
  slug = 'cutting-wheels',
  image_url = '/images/products/tools/cutting-wheels.webp',
  images = ARRAY['/images/products/tools/cutting-wheels.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('tools-accessories') AND name = 'Cutting Wheels';

UPDATE products SET
  slug = 'metal-cutting-wheels',
  image_url = '/images/products/tools/metal-cutting-wheels.webp',
  images = ARRAY['/images/products/tools/metal-cutting-wheels.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('tools-accessories') AND name = 'Metal Cutting Wheels';

UPDATE products SET
  slug = 'hammer-drill',
  image_url = '/images/products/tools/hammer-drill.webp',
  images = ARRAY['/images/products/tools/hammer-drill.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('tools-accessories') AND name = 'Hammer Drill';

UPDATE products SET
  slug = 'drill-bits',
  image_url = '/images/products/tools/drill-bits.webp',
  images = ARRAY['/images/products/tools/drill-bits.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('tools-accessories') AND name = 'Drill Bits';

UPDATE products SET
  slug = 'flap-wheels',
  image_url = '/images/products/tools/flap-wheels.webp',
  images = ARRAY['/images/products/tools/flap-wheels.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('tools-accessories') AND name = 'Flap Wheels';

UPDATE products SET
  slug = 'hand-electric-tools',
  image_url = '/images/products/tools/hand-tools.webp',
  images = ARRAY['/images/products/tools/hand-tools.webp']::text[],
  features = ARRAY[]::text[],
  specifications = '{}'::jsonb,
  applications = ARRAY[]::text[],
  available_sizes = ARRAY[]::text[],
  datasheet_url = NULL,
  featured = false
WHERE category_id = get_category_id('tools-accessories') AND name = 'Hand and Electric Tools';

-- ============================================================================
-- PRODUCTS: enforce slug now that every row has one
-- ============================================================================
ALTER TABLE products ALTER COLUMN slug SET NOT NULL;

DROP INDEX IF EXISTS products_slug_key;
CREATE UNIQUE INDEX products_slug_key ON products (slug);

CREATE INDEX IF NOT EXISTS idx_products_featured ON products (featured) WHERE featured = true;

-- ============================================================================
-- RLS + GRANTS: allow authenticated admins to manage catalog content
-- ============================================================================
DROP POLICY IF EXISTS "auth_insert_categories" ON categories;
CREATE POLICY "auth_insert_categories" ON categories FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_categories" ON categories;
CREATE POLICY "auth_update_categories" ON categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_categories" ON categories;
CREATE POLICY "auth_delete_categories" ON categories FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_sub_categories" ON sub_categories;
CREATE POLICY "auth_insert_sub_categories" ON sub_categories FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_sub_categories" ON sub_categories;
CREATE POLICY "auth_update_sub_categories" ON sub_categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_sub_categories" ON sub_categories;
CREATE POLICY "auth_delete_sub_categories" ON sub_categories FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_products" ON products;
CREATE POLICY "auth_insert_products" ON products FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_products" ON products;
CREATE POLICY "auth_update_products" ON products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_products" ON products;
CREATE POLICY "auth_delete_products" ON products FOR DELETE TO authenticated USING (true);

GRANT INSERT, UPDATE, DELETE ON TABLE public.categories TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.sub_categories TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.products TO authenticated;
