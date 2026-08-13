import {
  Nut,
  Wrench,
  Anchor,
  Layers,
  Zap,
  Pipette,
  Hammer,
  Sun,
  Plane,
  Building,
  Train,
  Factory,
  Hospital,
  type LucideIcon,
} from 'lucide-react';

// ─── Company ──────────────────────────────────────────────────────────────────

export const companyInfo = {
  name: 'EL-Ekhlas — ETC for Trading and Engineering Company',
  shortName: 'ETC',
  longName: 'EL-Ekhlas — ETC for Trading and Engineering Company',
  tagline: 'Supplying Electromechanical Works Since 2016',
  phone: '+20 122 726 6240',
  whatsapp: '201227266240',
  email: 'Etctrade2016@yahoo.com',
  address: 'Egypt',
  founded: '2016',
  hours: 'Saturday – Thursday, 9:00 AM – 6:00 PM (EET)',
  hoursList: [
    { day: 'Saturday', time: '9:00 AM – 6:00 PM' },
    { day: 'Sunday', time: '9:00 AM – 6:00 PM' },
    { day: 'Monday', time: '9:00 AM – 6:00 PM' },
    { day: 'Tuesday', time: '9:00 AM – 6:00 PM' },
    { day: 'Wednesday', time: '9:00 AM – 6:00 PM' },
    { day: 'Thursday', time: '9:00 AM – 6:00 PM' },
    { day: 'Friday', time: 'Closed' },
  ],
  social: {
    linkedin: 'https://www.linkedin.com',
    facebook: 'https://www.facebook.com',
    instagram: 'https://www.instagram.com',
    whatsapp: 'https://wa.me/201227266240',
  },
  mission:
    'Supplying electromechanical works in accordance with the required standards of quality and competitive prices that meet the needs of the private and public sector.',
  staffNote:
    'ETC has a staff of human resources with high efficiency and experience in completing work with the speed and quality that customers need.',
};

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/products', label: 'Products' },
  { href: '/quote', label: 'Request a Quote' },
  { href: '/contact', label: 'Contact' },
];

// ─── Product Categories (from brochure) ───────────────────────────────────────

export interface SubItem {
  name: string;
  spec?: string;
}

export interface SubCategory {
  name: string;
  items: SubItem[];
}

export interface TechSpec {
  label: string;
  value: string;
}

export interface ProductCategory {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  icon: LucideIcon;
  image: string;
  items: string[];
  subCategories?: SubCategory[];
  brands?: string[];
  features?: string[];
  specifications?: TechSpec[];
  applications?: string[];
}

export const productCategories: ProductCategory[] = [
  {
    slug: 'fasteners',
    name: 'Fasteners',
    shortName: 'Fasteners',
    description:
      'A comprehensive range of bolts, screws, nuts, washers, and anchors — supplied in DIN-certified grades to meet the demands of construction and electromechanical works.',
    icon: Nut,
    image:
      'https://images.pexels.com/photos/5279361/pexels-photo-5279361.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    items: [
      'Hexagon Bolts DIN 933 & 931',
      'Hex Socket Head Cap DIN 912',
      'Carriage Bolts DIN 603',
      'Wedge Anchor Bolts',
      'Threaded Rod DIN 975',
      'Pan & Countersunk Bolts',
      'Self Drilling Screws DIN 7504',
      'Dry Wall Screws DIN 18182',
      'Nylon Insert Lock Nuts',
      'Hex Nuts',
      'Spring Lock Washers',
      'Blind Rivets',
    ],
    subCategories: [
      {
        name: '1 — Bolts',
        items: [
          { name: 'Hexagon Bolt', spec: 'DIN 933 & 931, Grade 4.8 & 8.8' },
          { name: 'Hex Socket Head Cap', spec: 'DIN 912, Grade 10.9 & 8.8' },
          { name: 'Carriage Bolts', spec: 'DIN 603, Grade 4.8' },
          { name: 'Wedge Anchor Bolt', spec: 'Grade 8.8' },
          { name: 'Threaded Rod', spec: 'DIN 975, Grade 4.8, 10.9 & P7' },
          { name: 'Pan & Countersunk Bolt', spec: 'Grade 4.8' },
        ],
      },
      {
        name: '2 — Screws',
        items: [
          { name: 'Self Drilling Screw with CSK Head', spec: 'DIN 7504' },
          { name: 'Hex Self Drill Screw', spec: 'DIN 7504' },
          { name: 'Self Drilling Screw with Flat Head', spec: 'DIN 7504' },
          { name: 'Self Drilling Screw with Pan Head', spec: 'DIN 7504' },
          { name: 'Dry Wall Screw — Plain & Zinc', spec: 'DIN 18182' },
          { name: 'Chipboard Screw', spec: 'DIN 7505' },
          { name: 'Pan Head Tapping Screw', spec: 'DIN 7981' },
        ],
      },
      {
        name: '3 — Nuts',
        items: [
          { name: 'Nylon Insert Lock Nut' },
          { name: 'Nut with Cap' },
          { name: 'Coupling' },
          { name: 'Nut with Flange' },
          { name: 'Hex Nuts' },
        ],
      },
      {
        name: '4 — Washers',
        items: [
          { name: 'Spring Lock Washer' },
          { name: 'External Tooth Lock' },
          { name: 'Washer & H.V' },
        ],
      },
      {
        name: '5 — Anchors & Fixings',
        items: [
          { name: 'Nylon Frame Anchor' },
          { name: 'Nylon Plug' },
          { name: 'Drop In Anchor' },
          { name: 'Blind Rivet' },
        ],
      },
    ],
    features: [
      'DIN-certified grades (4.8, 8.8, 10.9) for consistent mechanical performance',
      'Full size range from M4 to M48 covering most construction requirements',
      'Zinc-plated, hot-dip galvanized, and stainless steel (A2/A4) finishes',
      'Bulk and project packaging tailored to contractor order volumes',
    ],
    specifications: [
      { label: 'Standards', value: 'DIN 933, 931, 912, 975, 7504, 18182' },
      { label: 'Grades', value: '4.8, 8.8, 10.9, P7' },
      { label: 'Materials', value: 'Carbon steel, stainless steel (A2/A4)' },
      { label: 'Finishes', value: 'Zinc-plated, hot-dip galvanized, self-colour' },
      { label: 'Size Range', value: 'M4 – M48' },
      { label: 'Packaging', value: 'Bulk boxes, project pallets' },
    ],
    applications: [
      'Structural steel connections',
      'HVAC duct and equipment mounting',
      'Electrical panel and cable tray fixing',
      'Concrete anchoring and formwork',
    ],
  },
  {
    slug: 'insulation',
    name: 'Insulation Materials',
    shortName: 'Insulation',
    description:
      'Thermal and acoustic insulation systems — Glass Wool, Rock Wool, and Elastomeric Rubber — in boards, blankets, and pipe sections, plus a full range of installation accessories.',
    icon: Layers,
    image:
      'https://images.pexels.com/photos/6124239/pexels-photo-6124239.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    items: [
      'Glass Wool Boards, Blankets & Pipes',
      'Rock Wool Boards, Blankets & Pipes',
      'Elastomeric Rubber Pipes & Blankets',
      'Duct Sealant and Adhesive',
      'Gaskets',
      'Aluminium Foil Tape',
      'Flexible Duct Connectors',
      'Flexible Connectors',
      'Stick Pins',
    ],
    subCategories: [
      {
        name: '1 — Glass Wool',
        items: [
          { name: 'Boards' },
          { name: 'Blankets' },
          { name: 'Pipes' },
        ],
      },
      {
        name: '2 — Rock Wool',
        items: [
          { name: 'Boards' },
          { name: 'Blankets' },
          { name: 'Pipes' },
        ],
      },
      {
        name: '3 — Elastomeric Rubber',
        items: [
          { name: 'Pipes' },
          { name: 'Blankets' },
        ],
      },
      {
        name: '4 — Insulation Accessories',
        items: [
          { name: 'Duct Sealant and Adhesive' },
          { name: 'Gasket' },
          { name: 'Aluminium Foil Tape' },
          { name: 'Flexible Duct Connector' },
          { name: 'Flexible Connector' },
          { name: 'Stick Pins' },
        ],
      },
    ],
    brands: ['K-Flex', 'IZOCAM', 'AFICO', 'GlassRock', 'Optiflex', 'RACKAL', 'TECHNOFLEX'],
    features: [
      'Thermal and acoustic insulation in boards, blankets, and pipe sections',
      'Elastomeric rubber for condensation control on chilled systems',
      'Fire-rated and non-combustible rock wool options available',
      'Complete accessory range — sealants, tapes, gaskets, and stick pins',
    ],
    specifications: [
      { label: 'Materials', value: 'Glass wool, rock wool, elastomeric rubber' },
      { label: 'Forms', value: 'Boards, blankets, pipe sections' },
      { label: 'Density Range', value: '30 – 120 kg/m³' },
      { label: 'Temperature', value: '-50°C to +700°C (material dependent)' },
      { label: 'Fire Rating', value: 'Non-combustible options available' },
      { label: 'Brands', value: 'K-Flex, IZOCAM, AFICO, GlassRock' },
    ],
    applications: [
      'HVAC ductwork and chilled water pipes',
      'Industrial process piping and boiler insulation',
      'Acoustic insulation for walls and ceilings',
      'Cold room and refrigeration systems',
    ],
  },
  {
    slug: 'electrical',
    name: 'Electrical Products',
    shortName: 'Electrical',
    description:
      'A complete electrical supply line covering conduits, cables, cable trays, and accessories from leading brands including Schneider Electric, ELSEWEDY, and ALEX Cable.',
    icon: Zap,
    image:
      'https://images.pexels.com/photos/7937305/pexels-photo-7937305.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    items: [
      'Aluminium, Steel, PVC & HDBE Conduit',
      'Control Copper Cables',
      'Fire Alarm Cables',
      'Low Voltage Wires & Cables',
      'Computer Cables',
      'Aluminium Cables',
      'Steel Boxes & Panels',
      'Cable Trays',
      'Cable Ties (PVC & Steel)',
      '{C} Channel',
    ],
    subCategories: [
      {
        name: '1 — Conduit',
        items: [
          { name: 'Aluminium Conduit' },
          { name: 'Steel Conduit' },
          { name: 'PVC Conduit' },
          { name: 'HDBE Conduit' },
        ],
      },
      {
        name: '2 — Cables',
        items: [
          { name: 'Control Copper Cables' },
          { name: 'Cables Fire Alarm' },
          { name: 'Low Voltage Wires & Cables' },
          { name: 'Cables Computer' },
          { name: 'Aluminium Cables' },
        ],
      },
      {
        name: '3 — Electric Accessories',
        items: [
          { name: 'Steel Boxes' },
          { name: 'Steel Panels' },
          { name: 'Plastic Boxes' },
          { name: 'Cable Ties PVC' },
          { name: 'Cable Ties Steel' },
          { name: 'Cables Tray' },
          { name: 'Cable & Conduit Glands and Accessories' },
          { name: '{C} Channel' },
        ],
      },
    ],
    brands: ['HEBEISH Group', 'Schneider Electric', 'ELSEWEDY', 'ALEX Cable Accessories', 'Engineering Home'],
    features: [
      'Full conduit range — aluminium, steel, PVC, and HDBE for every environment',
      'Control, fire alarm, low voltage, and computer cables from trusted brands',
      'Cable trays, ties, glands, and accessories for complete installations',
      'Steel and plastic boxes and panels for junction and distribution needs',
    ],
    specifications: [
      { label: 'Conduit Types', value: 'Aluminium, steel, PVC, HDBE' },
      { label: 'Cable Types', value: 'Control, fire alarm, LV, computer, aluminium' },
      { label: 'Cable Trays', value: 'Galvanized steel, various widths' },
      { label: 'Boxes & Panels', value: 'Steel and plastic, surface/recessed' },
      { label: 'Standards', value: 'IEC, BS, Egyptian standards' },
      { label: 'Brands', value: 'Schneider, ELSEWEDY, HEBEISH, ALEX Cable' },
    ],
    applications: [
      'Power distribution in commercial and residential buildings',
      'Fire alarm and security systems',
      'Industrial control panels and automation',
      'Data and communication cabling infrastructure',
    ],
  },
  {
    slug: 'pipes',
    name: 'Pipes & Fittings',
    shortName: 'Pipes',
    description:
      'Seamless and ERW steel pipes, threaded and welded fittings, flanges, valves, flexible connections, and pipe supports for industrial, mechanical, and HVAC applications.',
    icon: Pipette,
    image:
      'https://images.pexels.com/photos/7937292/pexels-photo-7937292.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    items: [
      'Seamless & ERW Pipes',
      'Threaded & Welded Fittings',
      'Flanges',
      'Pipe Supports',
      'Gate / Ball / Butterfly Valves',
      'Flexible Connection EPDM / Stainless',
    ],
    subCategories: [
      {
        name: 'Pipes & Fittings',
        items: [
          { name: 'Seamless & ERW Pipes' },
          { name: 'Threaded & Welded Fittings' },
          { name: 'Flanges' },
          { name: 'Supports' },
          { name: 'Valves — Gate / Ball / Butterfly' },
          { name: 'Flexible Connection EPDM / Stainless' },
        ],
      },
    ],
    features: [
      'Seamless and ERW steel pipes for pressure and structural applications',
      'Threaded and welded fittings in carbon and stainless steel',
      'Gate, ball, and butterfly valves for flow control',
      'Flexible EPDM and stainless connections for vibration isolation',
    ],
    specifications: [
      { label: 'Pipe Types', value: 'Seamless, ERW (welded)' },
      { label: 'Materials', value: 'Carbon steel, stainless steel' },
      { label: 'Fitting Types', value: 'Threaded, welded, flanged' },
      { label: 'Valve Types', value: 'Gate, ball, butterfly' },
      { label: 'Size Range', value: '1/2" – 24"' },
      { label: 'Standards', value: 'ASTM, DIN, BS' },
    ],
    applications: [
      'HVAC chilled and hot water systems',
      'Industrial process piping',
      'Fire protection sprinkler systems',
      'Mechanical plant room connections',
    ],
  },
  {
    slug: 'tools-accessories',
    name: 'Tools & Accessories',
    shortName: 'Tools',
    description:
      'Professional cutting wheels, hammer drills, drill bits, flap wheels, and a full range of hand and electric tools for use in construction, fabrication, and maintenance.',
    icon: Hammer,
    image:
      'https://images.pexels.com/photos/30413428/pexels-photo-30413428.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    items: [
      'Cutting Wheels',
      'Metal Cutting Wheels',
      'Hammer Drills',
      'Drill Bits',
      'Flap Wheels',
      'Hand and Electric Tools',
    ],
    subCategories: [
      {
        name: 'Accessories',
        items: [
          { name: 'Cutting Wheels' },
          { name: 'Metal Cutting Wheels' },
          { name: 'Hammer Drill' },
          { name: 'Drill Bits' },
          { name: 'Flap Wheels' },
          { name: 'Hand and Electric Tools' },
        ],
      },
    ],
    features: [
      'Professional-grade cutting and grinding wheels for metal and masonry',
      'Hammer drills and drill bits for concrete, steel, and wood',
      'Flap wheels for surface preparation and finishing',
      'Complete hand and electric tool range for site and workshop',
    ],
    specifications: [
      { label: 'Tool Types', value: 'Cutting, drilling, grinding, hand tools' },
      { label: 'Power Source', value: 'Corded electric, battery, manual' },
      { label: 'Applications', value: 'Metal, concrete, wood, masonry' },
      { label: 'Disc Sizes', value: '100mm – 230mm' },
      { label: 'Bit Sizes', value: '2mm – 20mm+ drill bits' },
      { label: 'Quality', value: 'Professional / industrial grade' },
    ],
    applications: [
      'On-site fabrication and installation',
      'Duct and pipe cutting and preparation',
      'Concrete drilling and anchoring',
      'General maintenance and workshop use',
    ],
  },
];

// ─── Featured Products ────────────────────────────────────────────────────────

export interface FeaturedProduct {
  name: string;
  spec: string;
  category: string;
  image: string;
}

export const featuredProducts: FeaturedProduct[] = [
  {
    name: 'Hexagon Bolt',
    spec: 'DIN 933 & 931 — Grade 4.8 & 8.8',
    category: 'Fasteners',
    image:
      'https://images.pexels.com/photos/17373000/pexels-photo-17373000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    name: 'Threaded Rod',
    spec: 'DIN 975 — Grade 4.8, 10.9 & P7',
    category: 'Fasteners',
    image:
      'https://images.pexels.com/photos/5279361/pexels-photo-5279361.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    name: 'Rock Wool',
    spec: 'Boards, Blankets & Pipes',
    category: 'Insulation',
    image:
      'https://images.pexels.com/photos/6124239/pexels-photo-6124239.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    name: 'Elastomeric Rubber',
    spec: 'Pipes & Blankets',
    category: 'Insulation',
    image:
      'https://images.pexels.com/photos/5511085/pexels-photo-5511085.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    name: 'Steel Conduit',
    spec: 'Aluminium · Steel · PVC · HDBE',
    category: 'Electrical',
    image:
      'https://images.pexels.com/photos/7937305/pexels-photo-7937305.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    name: 'Seamless & ERW Pipes',
    spec: 'Threaded & Welded Fittings · Flanges',
    category: 'Pipes & Fittings',
    image:
      'https://images.pexels.com/photos/7937292/pexels-photo-7937292.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    name: 'Fire Alarm Cables',
    spec: 'Low Voltage · Control Copper · Computer',
    category: 'Electrical',
    image:
      'https://images.pexels.com/photos/8961701/pexels-photo-8961701.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    name: 'Wedge Anchor Bolt',
    spec: 'Grade 8.8 — Nylon Frame · Drop In · Blind Rivet',
    category: 'Fasteners',
    image:
      'https://images.pexels.com/photos/38575500/pexels-photo-38575500.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
];

// ─── Featured Projects ────────────────────────────────────────────────────────

export interface Project {
  name: string;
  client: string;
  location: string;
  sector: string;
  image: string;
}

export const featuredProjects: Project[] = [
  {
    name: 'Benban Solar Power Station',
    client: 'Global Energy · TSK · Voltalia',
    location: 'Benban, Aswan Governorate',
    sector: 'Renewable Energy',
    image:
      'https://images.pexels.com/photos/9229392/pexels-photo-9229392.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    name: 'Sphinx International Airport',
    client: 'Kortec — Hassan Allam Technology',
    location: 'Greater Cairo',
    sector: 'Aviation Infrastructure',
    image:
      'https://images.pexels.com/photos/19190599/pexels-photo-19190599.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    name: 'New Administrative Capital — Power Station & Capital Towers',
    client: 'SIMCO · Hassan Allam Construction',
    location: 'New Administrative Capital, Egypt',
    sector: 'Urban Development',
    image:
      'https://images.pexels.com/photos/8373204/pexels-photo-8373204.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    name: 'Bashteel Train Station',
    client: 'Kortec · Hassan Allam Construction',
    location: 'Giza Governorate',
    sector: 'Transport Infrastructure',
    image:
      'https://images.pexels.com/photos/12896225/pexels-photo-12896225.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    name: 'Monorail Project',
    client: 'SIMCO — Specialized Contracting Company',
    location: 'New Administrative Capital, Egypt',
    sector: 'Mass Transit',
    image:
      'https://images.pexels.com/photos/11233573/pexels-photo-11233573.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    name: 'Towers of Alamein',
    client: 'Hassan Allam Construction',
    location: 'Alamein City',
    sector: 'Mixed-Use High-Rise',
    image:
      'https://images.pexels.com/photos/5504725/pexels-photo-5504725.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
];

// ─── Industries We Serve ──────────────────────────────────────────────────────

export interface Industry {
  name: string;
  icon: LucideIcon;
  description: string;
}

export const industries: Industry[] = [
  {
    name: 'Renewable Energy',
    icon: Sun,
    description:
      'Supplying fasteners, cables, and insulation to solar power stations and renewable energy projects across Egypt.',
  },
  {
    name: 'Aviation & Airports',
    icon: Plane,
    description:
      'Electromechanical supply for airport terminals and aviation infrastructure developments.',
  },
  {
    name: 'Urban Development',
    icon: Building,
    description:
      'Comprehensive supply for new city developments, government buildings, and ministry districts.',
  },
  {
    name: 'Transport Infrastructure',
    icon: Train,
    description:
      'Fasteners, pipes, and electrical products for train stations, monorail systems, and bridges.',
  },
  {
    name: 'Industrial & Manufacturing',
    icon: Factory,
    description:
      'Supplying factories and industrial facilities with insulation, piping, and electrical systems.',
  },
  {
    name: 'Healthcare Facilities',
    icon: Hospital,
    description:
      'Specialized electromechanical supply for hospitals and healthcare construction projects.',
  },
];

// ─── All Projects ─────────────────────────────────────────────────────────────

export const allProjects = [
  // SIMCO
  {
    name: 'Power Station Project (New Administrative Capital & New Damietta)',
    client: 'Specialized Contracting Company (SIMCO)',
  },
  { name: 'Engineering Warehouses Project', client: 'Specialized Contracting Company (SIMCO)' },
  { name: 'Monorail Project', client: 'Specialized Contracting Company (SIMCO)' },
  { name: 'High One Project', client: 'Specialized Contracting Company (SIMCO)', location: 'Sheikh Zayed' },
  // Kortec
  { name: 'Ministry District', client: 'Kortec — Hassan Allam Technology', location: 'New Administrative Capital' },
  { name: 'Zewail City', client: 'Kortec — Hassan Allam Technology', location: '6th of October City' },
  { name: 'Bashteel Train Station', client: 'Kortec — Hassan Allam Technology', location: 'Giza Governorate' },
  { name: 'Suez Stadium', client: 'Kortec — Hassan Allam Technology', location: 'Saint Catherine' },
  { name: 'Sphinx International Airport', client: 'Kortec — Hassan Allam Technology' },
  // Hassan Allam Construction
  { name: 'Towers of Alamein', client: 'Hassan Allam Construction', location: 'Alamein City' },
  { name: 'Bashteel Train Station', client: 'Hassan Allam Construction', location: 'Giza Governorate' },
  // El Saadaa
  { name: 'Al-Zomor Bridge', client: 'El Saadaa Company' },
  { name: 'Al-Khayala Bridge', client: 'El Saadaa Company' },
  { name: 'Al-Zeitoun Bridge', client: 'El Saadaa Company' },
  // Solar
  { name: 'Benban Solar Power Station', client: 'Global Energy', location: 'Aswan Governorate' },
  { name: 'Benban Solar Power Station', client: 'TSK', location: 'Aswan Governorate' },
  { name: 'Benban Solar Power Station', client: 'Voltalia', location: 'Aswan Governorate' },
  // ICPM
  { name: 'Business District (Palm Hills)', client: 'ICPM', location: 'New Administrative Capital' },
  { name: 'British School', client: 'ICPM', location: 'October City' },
  { name: 'Ministry District', client: 'ICPM', location: 'New Administrative Capital' },
  // Industrial
  { name: 'Cairo Foam Factory — Cold Room Manufacturing', client: 'Cairo Foam' },
  { name: 'Volta Misr Factory', client: 'Volta Misr' },
  { name: 'Eva Pharma Pharmaceutical Factory', client: 'Eva Pharma' },
  { name: 'Hospital Works', client: 'AMCO' },
];
