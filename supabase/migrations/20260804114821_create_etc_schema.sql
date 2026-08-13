/*
# Create ETC Electromechanical Supply Database Schema

## Summary
Creates the complete database schema for the ETC (EL-Ekhlas — Trading and Engineering Company) website.
This is a B2B electromechanical supply company website with a public product catalog and quote request system.

## New Tables

### 1. `categories`
Stores product categories (Fasteners, Insulation, Electrical, Pipes & Fittings, Tools & Accessories).
- `id` (uuid, primary key)
- `slug` (text, unique, not null) — URL-friendly identifier (e.g. "fasteners")
- `name` (text, not null) — full display name (e.g. "Fasteners")
- `short_name` (text, not null) — abbreviated name for cards/footer
- `description` (text, not null) — category description shown on listing and detail pages
- `icon_name` (text, not null) — lucide-react icon name (e.g. "Nut", "Layers")
- `image_url` (text, not null) — Pexels image URL for the category
- `brands` (jsonb) — array of brand names (e.g. ["K-Flex", "IZOCAM"])
- `features` (jsonb) — array of feature strings for the Features section
- `specifications` (jsonb) — array of {label, value} objects for the Tech Specs table
- `applications` (jsonb) — array of application strings for the Applications section
- `sort_order` (int, default 0) — display ordering
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

### 2. `sub_categories`
Stores sub-categories within a category (e.g. "1 — Bolts", "2 — Screws").
- `id` (uuid, primary key)
- `category_id` (uuid, foreign key to categories.id ON DELETE CASCADE)
- `name` (text, not null) — sub-category display name
- `sort_order` (int, default 0)

### 3. `products`
Stores individual product items within sub-categories (e.g. "Hexagon Bolt", "Self Drilling Screw").
- `id` (uuid, primary key)
- `category_id` (uuid, foreign key to categories.id ON DELETE CASCADE)
- `sub_category_id` (uuid, foreign key to sub_categories.id ON DELETE SET NULL, nullable)
- `name` (text, not null) — product name
- `spec` (text, nullable) — specification string (e.g. "DIN 933 & 931, Grade 4.8 & 8.8")
- `sort_order` (int, default 0)
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

### 4. `rfq_requests`
Stores Request for Quote (RFQ) form submissions from the website.
- `id` (uuid, primary key)
- `company` (text, not null) — company name
- `contact_person` (text, not null) — contact person name
- `phone` (text, not null) — phone number
- `email` (text, not null) — email address
- `category` (text, not null) — selected product category name
- `message` (text, not null) — message/requirements
- `status` (text, default 'new') — processing status: new, reviewed, quoted, closed
- `created_at` (timestamptz, default now())

### 5. `rfq_items`
Stores individual product items attached to an RFQ request (from the quote cart).
- `id` (uuid, primary key)
- `rfq_request_id` (uuid, foreign key to rfq_requests.id ON DELETE CASCADE)
- `product_name` (text, not null) — name of the product
- `spec` (text, nullable) — specification string
- `category` (text, not null) — category name
- `quantity` (int, not null, default 1)

## Security (RLS)
- `categories`: public read (anon + authenticated), no public write. Admin writes are done via service role key server-side.
- `sub_categories`: public read, no public write.
- `products`: public read, no public write.
- `rfq_requests`: public insert (anyone can submit an RFQ), authenticated read (admin only).
- `rfq_items`: public insert (submitted with the RFQ), authenticated read (admin only).

## Important Notes
1. This is a public catalog — categories, sub-categories, and products are readable by everyone (anon + authenticated).
2. RFQ submissions can be created by anyone (public insert) but only read by authenticated users (admin).
3. Admin CRUD operations on products/categories use the service role key server-side (bypasses RLS).
4. The `updated_at` column auto-updates via trigger on row modification.
5. Seed data matches the existing brochure content exactly.
*/

-- ============================================================================
-- CATEGORIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  short_name text NOT NULL,
  description text NOT NULL,
  icon_name text NOT NULL DEFAULT 'Package',
  image_url text NOT NULL,
  brands jsonb DEFAULT '[]'::jsonb,
  features jsonb DEFAULT '[]'::jsonb,
  specifications jsonb DEFAULT '[]'::jsonb,
  applications jsonb DEFAULT '[]'::jsonb,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories"
  ON categories FOR SELECT
  TO anon, authenticated USING (true);

-- ============================================================================
-- SUB CATEGORIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS sub_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE sub_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_sub_categories" ON sub_categories;
CREATE POLICY "public_read_sub_categories"
  ON sub_categories FOR SELECT
  TO anon, authenticated USING (true);

-- ============================================================================
-- PRODUCTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  sub_category_id uuid REFERENCES sub_categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  spec text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products"
  ON products FOR SELECT
  TO anon, authenticated USING (true);

-- ============================================================================
-- RFQ REQUESTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS rfq_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  contact_person text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  category text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE rfq_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an RFQ
DROP POLICY IF EXISTS "public_insert_rfq_requests" ON rfq_requests;
CREATE POLICY "public_insert_rfq_requests"
  ON rfq_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Only authenticated users (admin) can read RFQs
DROP POLICY IF EXISTS "auth_read_rfq_requests" ON rfq_requests;
CREATE POLICY "auth_read_rfq_requests"
  ON rfq_requests FOR SELECT
  TO authenticated USING (true);

-- Only authenticated users (admin) can update RFQ status
DROP POLICY IF EXISTS "auth_update_rfq_requests" ON rfq_requests;
CREATE POLICY "auth_update_rfq_requests"
  ON rfq_requests FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Only authenticated users (admin) can delete RFQs
DROP POLICY IF EXISTS "auth_delete_rfq_requests" ON rfq_requests;
CREATE POLICY "auth_delete_rfq_requests"
  ON rfq_requests FOR DELETE
  TO authenticated USING (true);

-- ============================================================================
-- RFQ ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS rfq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_request_id uuid NOT NULL REFERENCES rfq_requests(id) ON DELETE CASCADE,
  product_name text NOT NULL,
  spec text,
  category text NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE rfq_items ENABLE ROW LEVEL SECURITY;

-- Anyone can insert RFQ items (submitted with the RFQ)
DROP POLICY IF EXISTS "public_insert_rfq_items" ON rfq_items;
CREATE POLICY "public_insert_rfq_items"
  ON rfq_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Only authenticated users (admin) can read RFQ items
DROP POLICY IF EXISTS "auth_read_rfq_items" ON rfq_items;
CREATE POLICY "auth_read_rfq_items"
  ON rfq_items FOR SELECT
  TO authenticated USING (true);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_sub_categories_category_id ON sub_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sub_category_id ON products(sub_category_id);
CREATE INDEX IF NOT EXISTS idx_rfq_items_rfq_request_id ON rfq_items(rfq_request_id);
CREATE INDEX IF NOT EXISTS idx_rfq_requests_status ON rfq_requests(status);
CREATE INDEX IF NOT EXISTS idx_rfq_requests_created_at ON rfq_requests(created_at DESC);

-- ============================================================================
-- UPDATED_AT TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_categories_updated_at ON categories;
CREATE TRIGGER trigger_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_products_updated_at ON products;
CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED DATA: CATEGORIES
-- ============================================================================
INSERT INTO categories (slug, name, short_name, description, icon_name, image_url, brands, features, specifications, applications, sort_order)
VALUES
(
  'fasteners',
  'Fasteners',
  'Fasteners',
  'A comprehensive range of bolts, screws, nuts, washers, and anchors — supplied in DIN-certified grades to meet the demands of construction and electromechanical works.',
  'Nut',
  'https://images.pexels.com/photos/5279361/pexels-photo-5279361.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  '[]'::jsonb,
  '["DIN-certified grades (4.8, 8.8, 10.9) for consistent mechanical performance","Full size range from M4 to M48 covering most construction requirements","Zinc-plated, hot-dip galvanized, and stainless steel (A2/A4) finishes","Bulk and project packaging tailored to contractor order volumes"]'::jsonb,
  '[{"label":"Standards","value":"DIN 933, 931, 912, 975, 7504, 18182"},{"label":"Grades","value":"4.8, 8.8, 10.9, P7"},{"label":"Materials","value":"Carbon steel, stainless steel (A2/A4)"},{"label":"Finishes","value":"Zinc-plated, hot-dip galvanized, self-colour"},{"label":"Size Range","value":"M4 – M48"},{"label":"Packaging","value":"Bulk boxes, project pallets"}]'::jsonb,
  '["Structural steel connections","HVAC duct and equipment mounting","Electrical panel and cable tray fixing","Concrete anchoring and formwork"]'::jsonb,
  1
),
(
  'insulation',
  'Insulation Materials',
  'Insulation',
  'Thermal and acoustic insulation systems — Glass Wool, Rock Wool, and Elastomeric Rubber — in boards, blankets, and pipe sections, plus a full range of installation accessories.',
  'Layers',
  'https://images.pexels.com/photos/6124239/pexels-photo-6124239.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  '["K-Flex","IZOCAM","AFICO","GlassRock","Optiflex","RACKAL","TECHNOFLEX"]'::jsonb,
  '["Thermal and acoustic insulation in boards, blankets, and pipe sections","Elastomeric rubber for condensation control on chilled systems","Fire-rated and non-combustible rock wool options available","Complete accessory range — sealants, tapes, gaskets, and stick pins"]'::jsonb,
  '[{"label":"Materials","value":"Glass wool, rock wool, elastomeric rubber"},{"label":"Forms","value":"Boards, blankets, pipe sections"},{"label":"Density Range","value":"30 – 120 kg/m³"},{"label":"Temperature","value":"-50°C to +700°C (material dependent)"},{"label":"Fire Rating","value":"Non-combustible options available"},{"label":"Brands","value":"K-Flex, IZOCAM, AFICO, GlassRock"}]'::jsonb,
  '["HVAC ductwork and chilled water pipes","Industrial process piping and boiler insulation","Acoustic insulation for walls and ceilings","Cold room and refrigeration systems"]'::jsonb,
  2
),
(
  'electrical',
  'Electrical Products',
  'Electrical',
  'A complete electrical supply line covering conduits, cables, cable trays, and accessories from leading brands including Schneider Electric, ELSEWEDY, and ALEX Cable.',
  'Zap',
  'https://images.pexels.com/photos/7937305/pexels-photo-7937305.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  '["HEBEISH Group","Schneider Electric","ELSEWEDY","ALEX Cable Accessories","Engineering Home"]'::jsonb,
  '["Full conduit range — aluminium, steel, PVC, and HDBE for every environment","Control, fire alarm, low voltage, and computer cables from trusted brands","Cable trays, ties, glands, and accessories for complete installations","Steel and plastic boxes and panels for junction and distribution needs"]'::jsonb,
  '[{"label":"Conduit Types","value":"Aluminium, steel, PVC, HDBE"},{"label":"Cable Types","value":"Control, fire alarm, LV, computer, aluminium"},{"label":"Cable Trays","value":"Galvanized steel, various widths"},{"label":"Boxes & Panels","value":"Steel and plastic, surface/recessed"},{"label":"Standards","value":"IEC, BS, Egyptian standards"},{"label":"Brands","value":"Schneider, ELSEWEDY, HEBEISH, ALEX Cable"}]'::jsonb,
  '["Power distribution in commercial and residential buildings","Fire alarm and security systems","Industrial control panels and automation","Data and communication cabling infrastructure"]'::jsonb,
  3
),
(
  'pipes',
  'Pipes & Fittings',
  'Pipes',
  'Seamless and ERW steel pipes, threaded and welded fittings, flanges, valves, flexible connections, and pipe supports for industrial, mechanical, and HVAC applications.',
  'Pipette',
  'https://images.pexels.com/photos/7937292/pexels-photo-7937292.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  '[]'::jsonb,
  '["Seamless and ERW steel pipes for pressure and structural applications","Threaded and welded fittings in carbon and stainless steel","Gate, ball, and butterfly valves for flow control","Flexible EPDM and stainless connections for vibration isolation"]'::jsonb,
  '[{"label":"Pipe Types","value":"Seamless, ERW (welded)"},{"label":"Materials","value":"Carbon steel, stainless steel"},{"label":"Fitting Types","value":"Threaded, welded, flanged"},{"label":"Valve Types","value":"Gate, ball, butterfly"},{"label":"Size Range","value":"1/2\" – 24\""},{"label":"Standards","value":"ASTM, DIN, BS"}]'::jsonb,
  '["HVAC chilled and hot water systems","Industrial process piping","Fire protection sprinkler systems","Mechanical plant room connections"]'::jsonb,
  4
),
(
  'tools-accessories',
  'Tools & Accessories',
  'Tools',
  'Professional cutting wheels, hammer drills, drill bits, flap wheels, and a full range of hand and electric tools for use in construction, fabrication, and maintenance.',
  'Hammer',
  'https://images.pexels.com/photos/30413428/pexels-photo-30413428.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  '[]'::jsonb,
  '["Professional-grade cutting and grinding wheels for metal and masonry","Hammer drills and drill bits for concrete, steel, and wood","Flap wheels for surface preparation and finishing","Complete hand and electric tool range for site and workshop"]'::jsonb,
  '[{"label":"Tool Types","value":"Cutting, drilling, grinding, hand tools"},{"label":"Power Source","value":"Corded electric, battery, manual"},{"label":"Applications","value":"Metal, concrete, wood, masonry"},{"label":"Disc Sizes","value":"100mm – 230mm"},{"label":"Bit Sizes","value":"2mm – 20mm+ drill bits"},{"label":"Quality","value":"Professional / industrial grade"}]'::jsonb,
  '["On-site fabrication and installation","Duct and pipe cutting and preparation","Concrete drilling and anchoring","General maintenance and workshop use"]'::jsonb,
  5
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  image_url = EXCLUDED.image_url,
  brands = EXCLUDED.brands,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  applications = EXCLUDED.applications,
  sort_order = EXCLUDED.sort_order;

-- ============================================================================
-- SEED DATA: SUB CATEGORIES AND PRODUCTS
-- ============================================================================
-- We use a helper function to get category IDs by slug
CREATE OR REPLACE FUNCTION get_category_id(cat_slug text)
RETURNS uuid AS $$
  SELECT id FROM categories WHERE slug = cat_slug;
$$ LANGUAGE sql STABLE;

-- Fasteners sub-categories
INSERT INTO sub_categories (category_id, name, sort_order)
VALUES
  (get_category_id('fasteners'), '1 — Bolts', 1),
  (get_category_id('fasteners'), '2 — Screws', 2),
  (get_category_id('fasteners'), '3 — Nuts', 3),
  (get_category_id('fasteners'), '4 — Washers', 4),
  (get_category_id('fasteners'), '5 — Anchors & Fixings', 5)
ON CONFLICT DO NOTHING;

-- Fasteners products
INSERT INTO products (category_id, sub_category_id, name, spec, sort_order)
VALUES
  (get_category_id('fasteners'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('fasteners') AND name = '1 — Bolts'), 'Hexagon Bolt', 'DIN 933 & 931, Grade 4.8 & 8.8', 1),
  (get_category_id('fasteners'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('fasteners') AND name = '1 — Bolts'), 'Hex Socket Head Cap', 'DIN 912, Grade 10.9 & 8.8', 2),
  (get_category_id('fasteners'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('fasteners') AND name = '1 — Bolts'), 'Carriage Bolts', 'DIN 603, Grade 4.8', 3),
  (get_category_id('fasteners'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('fasteners') AND name = '1 — Bolts'), 'Wedge Anchor Bolt', 'Grade 8.8', 4),
  (get_category_id('fasteners'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('fasteners') AND name = '1 — Bolts'), 'Threaded Rod', 'DIN 975, Grade 4.8, 10.9 & P7', 5),
  (get_category_id('fasteners'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('fasteners') AND name = '1 — Bolts'), 'Pan & Countersunk Bolt', 'Grade 4.8', 6),
  (get_category_id('fasteners'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('fasteners') AND name = '2 — Screws'), 'Self Drilling Screw with CSK Head', 'DIN 7504', 1),
  (get_category_id('fasteners'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('fasteners') AND name = '2 — Screws'), 'Hex Self Drill Screw', 'DIN 7504', 2),
  (get_category_id('fasteners'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('fasteners') AND name = '2 — Screws'), 'Self Drilling Screw with Flat Head', 'DIN 7504', 3),
  (get_category_id('fasteners'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('fasteners') AND name = '2 — Screws'), 'Self Drilling Screw with Pan Head', 'DIN 7504', 4),
  (get_category_id('fasteners'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('fasteners') AND name = '2 — Screws'), 'Dry Wall Screw — Plain & Zinc', 'DIN 18182', 5),
  (get_category_id('fasteners'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('fasteners') AND name = '2 — Screws'), 'Chipboard Screw', 'DIN 7505', 6),
  (get_category_id('fasteners'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('fasteners') AND name = '2 — Screws'), 'Pan Head Tapping Screw', 'DIN 7981', 7),
  (get_category_id('fasteners'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('fasteners') AND name = '3 — Nuts'), 'Nylon Insert Lock Nut', NULL, 1),
  (get_category_id('fasteners'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('fasteners') AND name = '3 — Nuts'), 'Nut with Cap', NULL, 2),
  (get_category_id('fasteners'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('fasteners') AND name = '3 — Nuts'), 'Coupling', NULL, 3),
  (get_category_id('fasteners'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('fasteners') AND name = '3 — Nuts'), 'Nut with Flange', NULL, 4),
  (get_category_id('fasteners'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('fasteners') AND name = '3 — Nuts'), 'Hex Nuts', NULL, 5),
  (get_category_id('fasteners'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('fasteners') AND name = '4 — Washers'), 'Spring Lock Washer', NULL, 1),
  (get_category_id('fasteners'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('fasteners') AND name = '4 — Washers'), 'External Tooth Lock', NULL, 2),
  (get_category_id('fasteners'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('fasteners') AND name = '4 — Washers'), 'Washer & H.V', NULL, 3),
  (get_category_id('fasteners'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('fasteners') AND name = '5 — Anchors & Fixings'), 'Nylon Frame Anchor', NULL, 1),
  (get_category_id('fasteners'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('fasteners') AND name = '5 — Anchors & Fixings'), 'Nylon Plug', NULL, 2),
  (get_category_id('fasteners'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('fasteners') AND name = '5 — Anchors & Fixings'), 'Drop In Anchor', NULL, 3),
  (get_category_id('fasteners'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('fasteners') AND name = '5 — Anchors & Fixings'), 'Blind Rivet', NULL, 4)
ON CONFLICT DO NOTHING;

-- Insulation sub-categories
INSERT INTO sub_categories (category_id, name, sort_order)
VALUES
  (get_category_id('insulation'), '1 — Glass Wool', 1),
  (get_category_id('insulation'), '2 — Rock Wool', 2),
  (get_category_id('insulation'), '3 — Elastomeric Rubber', 3),
  (get_category_id('insulation'), '4 — Insulation Accessories', 4)
ON CONFLICT DO NOTHING;

-- Insulation products
INSERT INTO products (category_id, sub_category_id, name, spec, sort_order)
VALUES
  (get_category_id('insulation'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('insulation') AND name = '1 — Glass Wool'), 'Boards', NULL, 1),
  (get_category_id('insulation'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('insulation') AND name = '1 — Glass Wool'), 'Blankets', NULL, 2),
  (get_category_id('insulation'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('insulation') AND name = '1 — Glass Wool'), 'Pipes', NULL, 3),
  (get_category_id('insulation'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('insulation') AND name = '2 — Rock Wool'), 'Boards', NULL, 1),
  (get_category_id('insulation'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('insulation') AND name = '2 — Rock Wool'), 'Blankets', NULL, 2),
  (get_category_id('insulation'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('insulation') AND name = '2 — Rock Wool'), 'Pipes', NULL, 3),
  (get_category_id('insulation'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('insulation') AND name = '3 — Elastomeric Rubber'), 'Pipes', NULL, 1),
  (get_category_id('insulation'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('insulation') AND name = '3 — Elastomeric Rubber'), 'Blankets', NULL, 2),
  (get_category_id('insulation'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('insulation') AND name = '4 — Insulation Accessories'), 'Duct Sealant and Adhesive', NULL, 1),
  (get_category_id('insulation'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('insulation') AND name = '4 — Insulation Accessories'), 'Gasket', NULL, 2),
  (get_category_id('insulation'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('insulation') AND name = '4 — Insulation Accessories'), 'Aluminium Foil Tape', NULL, 3),
  (get_category_id('insulation'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('insulation') AND name = '4 — Insulation Accessories'), 'Flexible Duct Connector', NULL, 4),
  (get_category_id('insulation'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('insulation') AND name = '4 — Insulation Accessories'), 'Flexible Connector', NULL, 5),
  (get_category_id('insulation'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('insulation') AND name = '4 — Insulation Accessories'), 'Stick Pins', NULL, 6)
ON CONFLICT DO NOTHING;

-- Electrical sub-categories
INSERT INTO sub_categories (category_id, name, sort_order)
VALUES
  (get_category_id('electrical'), '1 — Conduit', 1),
  (get_category_id('electrical'), '2 — Cables', 2),
  (get_category_id('electrical'), '3 — Electric Accessories', 3)
ON CONFLICT DO NOTHING;

-- Electrical products
INSERT INTO products (category_id, sub_category_id, name, spec, sort_order)
VALUES
  (get_category_id('electrical'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('electrical') AND name = '1 — Conduit'), 'Aluminium Conduit', NULL, 1),
  (get_category_id('electrical'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('electrical') AND name = '1 — Conduit'), 'Steel Conduit', NULL, 2),
  (get_category_id('electrical'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('electrical') AND name = '1 — Conduit'), 'PVC Conduit', NULL, 3),
  (get_category_id('electrical'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('electrical') AND name = '1 — Conduit'), 'HDBE Conduit', NULL, 4),
  (get_category_id('electrical'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('electrical') AND name = '2 — Cables'), 'Control Copper Cables', NULL, 1),
  (get_category_id('electrical'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('electrical') AND name = '2 — Cables'), 'Cables Fire Alarm', NULL, 2),
  (get_category_id('electrical'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('electrical') AND name = '2 — Cables'), 'Low Voltage Wires & Cables', NULL, 3),
  (get_category_id('electrical'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('electrical') AND name = '2 — Cables'), 'Cables Computer', NULL, 4),
  (get_category_id('electrical'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('electrical') AND name = '2 — Cables'), 'Aluminium Cables', NULL, 5),
  (get_category_id('electrical'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('electrical') AND name = '3 — Electric Accessories'), 'Steel Boxes', NULL, 1),
  (get_category_id('electrical'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('electrical') AND name = '3 — Electric Accessories'), 'Steel Panels', NULL, 2),
  (get_category_id('electrical'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('electrical') AND name = '3 — Electric Accessories'), 'Plastic Boxes', NULL, 3),
  (get_category_id('electrical'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('electrical') AND name = '3 — Electric Accessories'), 'Cable Ties PVC', NULL, 4),
  (get_category_id('electrical'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('electrical') AND name = '3 — Electric Accessories'), 'Cable Ties Steel', NULL, 5),
  (get_category_id('electrical'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('electrical') AND name = '3 — Electric Accessories'), 'Cables Tray', NULL, 6),
  (get_category_id('electrical'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('electrical') AND name = '3 — Electric Accessories'), 'Cable & Conduit Glands and Accessories', NULL, 7),
  (get_category_id('electrical'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('electrical') AND name = '3 — Electric Accessories'), '{C} Channel', NULL, 8)
ON CONFLICT DO NOTHING;

-- Pipes sub-categories
INSERT INTO sub_categories (category_id, name, sort_order)
VALUES
  (get_category_id('pipes'), 'Pipes & Fittings', 1)
ON CONFLICT DO NOTHING;

-- Pipes products
INSERT INTO products (category_id, sub_category_id, name, spec, sort_order)
VALUES
  (get_category_id('pipes'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('pipes') AND name = 'Pipes & Fittings'), 'Seamless & ERW Pipes', NULL, 1),
  (get_category_id('pipes'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('pipes') AND name = 'Pipes & Fittings'), 'Threaded & Welded Fittings', NULL, 2),
  (get_category_id('pipes'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('pipes') AND name = 'Pipes & Fittings'), 'Flanges', NULL, 3),
  (get_category_id('pipes'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('pipes') AND name = 'Pipes & Fittings'), 'Supports', NULL, 4),
  (get_category_id('pipes'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('pipes') AND name = 'Pipes & Fittings'), 'Valves — Gate / Ball / Butterfly', NULL, 5),
  (get_category_id('pipes'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('pipes') AND name = 'Pipes & Fittings'), 'Flexible Connection EPDM / Stainless', NULL, 6)
ON CONFLICT DO NOTHING;

-- Tools sub-categories
INSERT INTO sub_categories (category_id, name, sort_order)
VALUES
  (get_category_id('tools-accessories'), 'Accessories', 1)
ON CONFLICT DO NOTHING;

-- Tools products
INSERT INTO products (category_id, sub_category_id, name, spec, sort_order)
VALUES
  (get_category_id('tools-accessories'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('tools-accessories') AND name = 'Accessories'), 'Cutting Wheels', NULL, 1),
  (get_category_id('tools-accessories'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('tools-accessories') AND name = 'Accessories'), 'Metal Cutting Wheels', NULL, 2),
  (get_category_id('tools-accessories'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('tools-accessories') AND name = 'Accessories'), 'Hammer Drill', NULL, 3),
  (get_category_id('tools-accessories'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('tools-accessories') AND name = 'Accessories'), 'Drill Bits', NULL, 4),
  (get_category_id('tools-accessories'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('tools-accessories') AND name = 'Accessories'), 'Flap Wheels', NULL, 5),
  (get_category_id('tools-accessories'), (SELECT id FROM sub_categories WHERE category_id = get_category_id('tools-accessories') AND name = 'Accessories'), 'Hand and Electric Tools', NULL, 6)
ON CONFLICT DO NOTHING;
