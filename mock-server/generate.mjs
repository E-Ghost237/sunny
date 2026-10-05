// =============================================================================
// Synthetic mock-data generator.
//
// Produces entirely original placeholder catalog / store / content data that
// matches the TypeScript model shapes in src/app/core/models/. Deterministic
// (seeded) so re-running yields a stable db. Replace with the client's real
// product export when available — see mock-server/README or the project brief.
//
//   node mock-server/generate.mjs      # rewrites mock-server/data/*.json
// =============================================================================

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DATA_DIR = join(import.meta.dirname, 'data');

// ---- seeded RNG (mulberry32) -----------------------------------------------
let _seed = 0x9e3779b9;
function rng() {
  _seed |= 0;
  _seed = (_seed + 0x6d2b79f5) | 0;
  let t = Math.imul(_seed ^ (_seed >>> 15), 1 | _seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const pick = (arr) => arr[Math.floor(rng() * arr.length)];
const int = (min, max) => Math.floor(rng() * (max - min + 1)) + min;
const chance = (p) => rng() < p;
const round2 = (n) => Math.round(n * 100) / 100;
const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// ---- placeholder brand vocabulary ----------------------------------------
// Invented names — no relation to any real cannabis brand. Client swaps these.
const HOUSE_BRAND = 'Evergreen';
const PRODUCT_BRANDS = [
  'Bloomcraft',
  'Northwind Farms',
  'Cloudline',
  'Terra Verde',
  'Half Light',
  'Copper Kettle',
  'Wildstack',
  'Moonfield',
  'Dry Creek Co.',
  'Ninebark',
  'Lantern & Leaf',
  'Understory',
];

const STRAINS = ['Indica', 'Sativa', 'Hybrid'];
const ADJ = [
  'Amber', 'Velvet', 'Midnight', 'Golden', 'Frosted', 'Cobalt', 'Crimson', 'Hazel',
  'Silver', 'Dusk', 'Sunlit', 'Quiet', 'Wandering', 'Northern', 'Coastal', 'Ember',
];
const NOUN = [
  'Haze', 'Meadow', 'Harbor', 'Lantern', 'Grove', 'Current', 'Ridge', 'Drift',
  'Bloom', 'Field', 'Hollow', 'Tide', 'Cascade', 'Orchard', 'Trail', 'Pine',
];
const TERPS = ['Myrcene', 'Limonene', 'Caryophyllene', 'Pinene', 'Linalool', 'Terpinolene', 'Humulene'];
const NOSE = ['citrus', 'pine', 'diesel', 'earth', 'berry', 'pepper', 'floral', 'herbal', 'gassy', 'sweet'];

// category -> { formats: [{size, priceRange}], pct, badgePool }
const CATEGORY_SPEC = {
  flower: { n: 26, formats: [['3.5g', 30, 60], ['7g', 55, 100], ['14g', 95, 170], ['28g', 150, 260]], pct: true },
  vapes: { n: 24, formats: [['0.5g', 25, 45], ['1g', 40, 75]], pct: true },
  edibles: { n: 24, formats: [['100mg (10-pack)', 18, 30], ['200mg (20-pack)', 28, 45]], pct: false },
  prerolls: { n: 22, formats: [['1g', 10, 18], ['5-pack (2.5g)', 30, 55], ['Infused 1g', 16, 28]], pct: true },
  concentrates: { n: 20, formats: [['1g', 30, 60], ['2g', 55, 100]], pct: true },
  topicals: { n: 10, formats: [['2oz balm', 30, 55], ['Roll-on 3oz', 35, 60]], pct: false },
  capsules: { n: 12, formats: [['10mg (30ct)', 25, 45], ['25mg (30ct)', 40, 70]], pct: false },
  tinctures: { n: 10, formats: [['30ml 500mg', 35, 60], ['30ml 1000mg', 55, 95]], pct: false },
  beverages: { n: 14, formats: [['Single 10mg', 6, 12], ['4-pack 40mg', 20, 36]], pct: false },
  accessories: { n: 16, formats: [['One size', 8, 60]], pct: null, plain: true },
};
const BADGES = ['15% Off', '20% Off', '25% Off', 'Buy 1 Get 1', 'New', 'Staff Pick', 'Low Stock'];
const ACCESSORY_TYPES = ['Grinder', 'Rolling Tray', 'Glass Pipe', 'Storage Jar', 'Odor-Proof Bag', 'Lighter Case', 'Ashtray', 'Cleaning Kit'];

const PLACEHOLDER = {
  product: '/assets/placeholder/product.svg',
  store: '/assets/placeholder/store.svg',
  content: '/assets/placeholder/content.svg',
};

// ---------------------------------------------------------------------------
// PRODUCTS
// ---------------------------------------------------------------------------
function strainName() {
  return `${pick(ADJ)} ${pick(NOUN)}`;
}
function strainBlurb(name, strain) {
  const a = pick(NOSE), b = pick(NOSE), t1 = pick(TERPS), t2 = pick(TERPS);
  const feel =
    strain === 'Indica'
      ? 'a heavy, settled body feel that suits a slow evening'
      : strain === 'Sativa'
        ? 'a bright, talkative head lift that works for daytime'
        : 'a balanced lift that stays social without much drag';
  return `${name} is a ${strain.toLowerCase()}-leaning cultivar with ${t1} and ${t2} up top. Expect ${a} on the nose rolling into ${b} on the exhale, and ${feel}. A dependable pick when you want something familiar rather than a surprise.`;
}
function productBlurb(category, format) {
  const lines = {
    flower: `Hand-trimmed ${format} jars, cured for aroma and burn. Consistent density, no shake.`,
    vapes: `${format} distillate cart with strain-specific terpenes. 510-thread, ceramic core.`,
    edibles: `Low-and-slow ${format} gummies with an even coat and a reliable onset. Vegan pectin base.`,
    prerolls: `${format} of milled whole flower in a slow-burning cone. Packed by weight, not by eye.`,
    concentrates: `${format} of solvent-free extract with a soft budder texture. Cold-cured for terpene retention.`,
    topicals: `${format} of fast-absorbing balm with menthol and arnica. Non-greasy, fragrance-light.`,
    capsules: `${format} softgels with a fixed dose per cap for easy, repeatable sessions.`,
    tinctures: `${format} MCT-oil tincture with a metered dropper. Take under the tongue or add to a drink.`,
    beverages: `${format} sparkling tonic, lightly bittered, with a five-to-fifteen minute onset.`,
    accessories: `Everyday carry gear built to last — simple, sturdy, easy to clean.`,
  };
  return lines[category];
}

let nextId = 100000;
function makeProducts() {
  const out = [];
  for (const [category, spec] of Object.entries(CATEGORY_SPEC)) {
    for (let i = 0; i < spec.n; i++) {
      const [size, lo, hi] = pick(spec.formats);
      const price = round2(int(lo, hi) - 0.05);
      const onSale = chance(0.4);
      const discountedPrice = onSale ? round2(price * (1 - int(10, 30) / 100)) : null;
      const brand = chance(0.25) ? HOUSE_BRAND : pick(PRODUCT_BRANDS);
      const isExclusive = brand === HOUSE_BRAND;

      let name, strain, sName, sDesc;
      if (spec.plain) {
        strain = null; sName = null; sDesc = null;
        name = `${brand} ${pick(ACCESSORY_TYPES)}`;
      } else {
        strain = pick(STRAINS);
        sName = strainName();
        sDesc = strainBlurb(sName, strain);
        const fmtLabel = { flower: 'Flower', vapes: 'Cart', edibles: 'Gummies', prerolls: 'Pre-Roll', concentrates: 'Concentrate', topicals: 'Balm', capsules: 'Capsules', tinctures: 'Tincture', beverages: 'Tonic' }[category];
        name = `${sName} ${fmtLabel}`;
      }

      const pctBased = spec.pct;
      let thc = null, cbd = null, cbn = null, thcRaw = null, thcaRaw = null, cbdRaw = null, cbdaRaw = null;
      if (pctBased === true) {
        const total = round2(int(180, 320) / 10);
        thc = `${total}%`;
        thcRaw = round2(total * 0.05);
        thcaRaw = round2(total - thcRaw);
        cbdRaw = 0; cbdaRaw = 0;
        if (chance(0.15)) cbd = `${round2(int(5, 20) / 10)}%`;
      } else if (pctBased === false) {
        const mg = pick([10, 25, 40, 100, 200, 500, 1000]);
        thc = `${mg}mg`;
        if (chance(0.3)) cbd = `${mg}mg`;
        if (chance(0.15)) cbn = `${pick([5, 10, 15])}mg`;
      }

      const slugBase = spec.plain ? slugify(name) : slugify(`${sName}-${category}`);
      out.push({
        id: ++nextId,
        slug: `${slugBase}-${nextId}`,
        name,
        brand,
        strain,
        strainName: sName,
        strainDescription: sDesc,
        productDescription: productBlurb(category, size),
        thc,
        cbd,
        cbn,
        thcRaw,
        thcaRaw,
        cbdRaw,
        cbdaRaw,
        isPctBased: pctBased,
        size,
        price,
        discountedPrice,
        badge: onSale ? pick(BADGES) : chance(0.15) ? pick(['New', 'Staff Pick']) : null,
        isExclusive,
        images: [PLACEHOLDER.product, PLACEHOLDER.product, PLACEHOLDER.product],
        category,
      });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// CATEGORY FILTERS  (functional taxonomy kept; brand lists = invented brands)
// ---------------------------------------------------------------------------
function makeCategoryFilters(products) {
  const brandsFor = (cat) =>
    [...new Set(products.filter((p) => p.category === cat).map((p) => p.brand))].sort();
  const base = (cat, extra = []) => ({
    category: cat,
    sections: [
      { title: 'Strain Type', type: 'pills', options: ['Sativa', 'Hybrid', 'Indica'] },
      { title: 'Brand', type: 'checkboxes', options: brandsFor(cat) },
      { title: 'THC Potency', type: 'range', unit: '%', unitPrefix: false, min: 10, max: 40, note: 'Total combined THC/THCa. Check the label for exact figures.' },
      { title: 'Price Range', type: 'range', unit: '$', unitPrefix: true, min: 0, max: 260, note: '' },
      ...extra,
    ],
  });
  return [
    base('flower', [
      { title: 'Weight', type: 'pills', options: ['3.5g', '7g', '14g', '28g'] },
      { title: 'Top Terpenes', type: 'checkboxes', options: TERPS },
    ]),
    base('vapes', [
      { title: 'Hardware', type: 'pills', options: ['510 Cartridge', 'All-in-One', 'Pod'] },
      { title: 'Extraction', type: 'checkboxes', options: ['Distillate', 'Live Resin', 'Rosin'] },
    ]),
    base('edibles', [
      { title: 'Dose', type: 'pills', options: ['5mg', '10mg', '25mg'] },
      { title: 'Type', type: 'checkboxes', options: ['Gummies', 'Chocolate', 'Mints', 'Chews'] },
    ]),
    base('prerolls', [{ title: 'Pack Size', type: 'pills', options: ['Single', '5-Pack', 'Infused'] }]),
    base('concentrates', [
      { title: 'Consistency', type: 'checkboxes', options: ['Badder', 'Sugar', 'Live Resin', 'Rosin', 'Sauce'] },
    ]),
    base('topicals', [{ title: 'Format', type: 'checkboxes', options: ['Balm', 'Roll-On', 'Lotion', 'Bath Soak'] }]),
    base('capsules', [{ title: 'Dose', type: 'pills', options: ['10mg', '25mg'] }]),
    base('tinctures', [{ title: 'Ratio', type: 'checkboxes', options: ['1:1 THC:CBD', 'THC-Dominant', 'CBD-Dominant'] }]),
    base('beverages', [{ title: 'Format', type: 'checkboxes', options: ['Seltzer', 'Tonic', 'Shot', 'Tea'] }]),
    {
      category: 'accessories',
      sections: [
        { title: 'Brand', type: 'checkboxes', options: brandsFor('accessories') },
        { title: 'Type', type: 'checkboxes', options: ACCESSORY_TYPES },
        { title: 'Price Range', type: 'range', unit: '$', unitPrefix: true, min: 0, max: 80, note: '' },
      ],
    },
  ];
}

// ---------------------------------------------------------------------------
// STORES  (6 states the client is licensed in)
// ---------------------------------------------------------------------------
const STORE_SEED = [
  ['Riverbend', 'IL', 'Naperville', '60540', 41.7508, -88.1535],
  ['Lakeshore', 'IL', 'Evanston', '60201', 42.0451, -87.6877],
  ['Prairie Gate', 'IL', 'Springfield', '62704', 39.7817, -89.6501],
  ['Maple Row', 'OH', 'Columbus', '43215', 39.9612, -82.9988],
  ['Great Miami', 'OH', 'Dayton', '45402', 39.7589, -84.1916],
  ['Cuyahoga', 'OH', 'Cleveland', '44113', 41.4993, -81.6944],
  ['Keystone', 'PA', 'Pittsburgh', '15222', 40.4406, -79.9959],
  ['Liberty Bell', 'PA', 'Philadelphia', '19107', 39.9526, -75.1652],
  ['Chesapeake', 'MD', 'Baltimore', '21201', 39.2904, -76.6122],
  ['Potomac', 'MD', 'Rockville', '20850', 39.084, -77.1528],
  ['Bayfront', 'FL', 'Tampa', '33602', 27.9506, -82.4572],
  ['Palmetto', 'FL', 'Orlando', '32801', 28.5383, -81.3792],
  ['Bluegrass', 'KY', 'Louisville', '40202', 38.2527, -85.7585],
];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const REVIEW_LINES = [
  'Quick pickup and the staff knew the menu cold. Easy trip.',
  'Clean store, fair prices, and the online order was ready when it said it would be.',
  'Helpful budtender walked me through a few options without any pressure.',
  'Good rotating selection. The deals section is worth checking before you go.',
  'In and out in five minutes. Order matched the site exactly.',
  'Friendly team and a well-organized floor. Parking is easy too.',
];
function makeStores() {
  return STORE_SEED.map(([name, region, city, zip, lat, lng], i) => {
    const tz = ['FL', 'OH', 'KY'].includes(region) ? 'America/New_York' : region === 'IL' ? 'America/Chicago' : 'America/New_York';
    const medOnly = region === 'FL'; // FL is medical-only in this placeholder set
    const reviewCount = int(3, 5);
    return {
      slug: `${slugify(name)}-${region.toLowerCase()}`,
      name: `${name}, ${region}`,
      image: PLACEHOLDER.store,
      phone: `${int(200, 989)}${int(200, 989)}${int(1000, 9999)}`,
      lat,
      lng,
      timezone: tz,
      brands: [HOUSE_BRAND.toLowerCase()],
      address: {
        streetAddress: `${int(100, 4999)} ${pick(['Main St', 'Market St', 'Commerce Dr', 'Union Ave', 'Harbor Blvd', 'Elm St'])}`,
        addressLocality: city,
        addressRegion: region,
        postalCode: zip,
        addressCountry: 'US',
      },
      openingHours: DAYS.map((day) => ({
        day,
        opens: day === 'Sunday' ? '10:00' : '9:00',
        closes: day === 'Sunday' ? '18:00' : '21:00',
      })),
      capabilities: {
        recPickup: !medOnly,
        recDelivery: false,
        medPickup: true,
        medDelivery: false,
        recComingSoon: false,
        medComingSoon: false,
      },
      aggregateRating: { ratingValue: round2(int(43, 50) / 10), reviewCount },
      reviews: Array.from({ length: reviewCount }, (_, r) => ({
        author: `Verified Customer #${r + 1}`,
        rating: int(4, 5),
        text: pick(REVIEW_LINES),
      })),
    };
  });
}

// ---------------------------------------------------------------------------
// CONTENT  (original short-form educational + promo copy)
// ---------------------------------------------------------------------------
const P = (text) => ({ type: 'paragraph', data: { text } });
const H = (level, text) => ({ type: 'heading', data: { level, text } });
const IMG = (alt) => ({ type: 'image', data: { src: PLACEHOLDER.content, alt } });
const LIST = (ordered, items) => ({ type: 'list', data: { ordered, items } });
const CTA = (label) => ({ type: 'cta-banner', data: { label } });

const ARTICLES = [
  {
    slug: 'indica-sativa-hybrid',
    title: 'Indica, Sativa, Hybrid: What the Labels Really Tell You',
    description: 'The three-bucket system is a rough guide, not a rule. Here is how to read it.',
    tags: ['basics'],
    blocks: [
      P('Most menus sort flower into indica, sativa, and hybrid. It is a useful shorthand for browsing, but the effect you feel has more to do with a product’s cannabinoid and terpene mix than the bucket it lands in.'),
      H(4, 'A quick rule of thumb'),
      LIST(false, [
        'Indica-labeled products are often chosen for evenings and rest.',
        'Sativa-labeled products are often chosen for daytime and activity.',
        'Hybrids sit somewhere in between, leaning one way or the other.',
      ]),
      P('Two plants with the same label can feel different. If a specific product worked for you, note the brand, the strain name, and the terpene list — that combination is a better predictor than the category alone.'),
    ],
  },
  {
    slug: 'reading-a-coa',
    title: 'How to Read a Certificate of Analysis',
    description: 'Every batch is lab-tested. Here is what the numbers on the COA mean.',
    tags: ['basics'],
    blocks: [
      P('A Certificate of Analysis, or COA, is the lab report for a specific batch. Licensed products carry one, and it is worth a glance before you buy.'),
      H(4, 'What to look at first'),
      LIST(false, [
        'Total THC and total CBD — the potency you are actually paying for.',
        'Pass/fail on pesticides, heavy metals, and residual solvents.',
        'Batch date — fresher flower generally tastes better.',
      ]),
      P('If a percentage on the shelf tag looks far off from the COA, ask staff. The batch report is the source of truth.'),
    ],
  },
  {
    slug: 'terpenes-101',
    title: 'Terpenes 101: The Part of the Plant You Can Smell',
    description: 'Terpenes shape aroma and may nudge the overall experience.',
    tags: ['basics'],
    blocks: [
      P('Terpenes are aromatic compounds found across the plant world — in citrus peel, pine sap, lavender, and black pepper, among many others. Cannabis makes a lot of them, and they are why two jars can smell nothing alike.'),
      H(4, 'Common ones you will see on labels'),
      LIST(false, [
        'Myrcene — earthy, musky; often in products marketed for rest.',
        'Limonene — bright, citrus; often in daytime products.',
        'Caryophyllene — peppery; the one that also acts on the body’s CB2 receptors.',
      ]),
      P('If you keep gravitating toward the same smell, look for that terpene at the top of the list on your next visit.'),
    ],
  },
  {
    slug: 'edibles-start-low',
    title: 'Edibles: Start Low, Go Slow',
    description: 'Onset is slow and the dose is easy to misjudge. A simple approach.',
    tags: ['edibles'],
    blocks: [
      P('Eaten cannabis is processed by the liver before it reaches you, which is why it can take one to two hours to feel and why it often feels stronger than the same dose inhaled.'),
      H(4, 'A safe first session'),
      LIST(true, [
        'Take 2.5 to 5mg and set a timer for two hours.',
        'Do not add more until the timer is up.',
        'Have plain snacks and water on hand.',
      ]),
      P('If you take too much, it is uncomfortable but not dangerous. Find a calm spot, hydrate, and wait it out.'),
    ],
  },
  {
    slug: 'storing-cannabis',
    title: 'Storing Cannabis So It Lasts',
    description: 'Light, air, and heat are what degrade flower. Slow them down.',
    tags: ['basics'],
    blocks: [
      P('Cannabinoids and terpenes break down over time. You cannot stop it, but good storage buys you months.'),
      LIST(false, [
        'Keep flower in an airtight glass jar, not a plastic bag.',
        'Store it somewhere cool, dark, and dry — a drawer, not a windowsill.',
        'Skip the freezer; it makes trichomes brittle.',
      ]),
      P('Gummies and tinctures are more forgiving, but still keep them out of direct sun and away from heat.'),
    ],
  },
  {
    slug: 'first-dispensary-visit',
    title: 'Your First Dispensary Visit: What to Expect',
    description: 'Bring ID, know roughly what you want, and ask questions.',
    tags: ['basics'],
    blocks: [
      P('Order online ahead of time and pickup is usually a few minutes. Walking in works too — staff can point you in the right direction.'),
      H(4, 'Bring'),
      LIST(false, ['A valid, unexpired government photo ID.', 'A medical card, if you are shopping the medical menu.', 'A rough budget and format in mind.']),
      P('Prices on the menu include what you will pay at the counter unless your state adds tax at checkout. Staff can tell you which applies.'),
    ],
  },
];

function makeArticles() {
  const start = new Date('2025-01-06T09:00:00Z').getTime();
  return ARTICLES.map((a, i) => ({
    slug: a.slug,
    title: a.title,
    description: a.description,
    heroImage: PLACEHOLDER.content,
    tags: a.tags,
    publishedDate: new Date(start + i * 12 * 24 * 3600 * 1000).toISOString(),
    blocks: a.blocks,
  }));
}

function makePages() {
  return [
    {
      slug: 'summer-rewards-bonus',
      title: 'Summer Rewards Bonus',
      blocks: [
        H(2, 'Earn double points all season'),
        P('Through the end of summer, every online pickup order earns twice the usual rewards points. No code needed — the bonus is applied automatically at checkout for signed-in members.'),
        IMG('Summer promo'),
        H(4, 'How it works'),
        LIST(true, ['Sign in or create a rewards account.', 'Place a pickup order on the site.', 'Points post to your account when you pick up.']),
        CTA('Join Rewards'),
      ],
    },
    {
      slug: 'new-customer-offer',
      title: 'New Customer Offer',
      blocks: [
        H(2, 'First order? Here is 20% off'),
        P('New rewards members get 20% off their first online pickup order, up to a $30 discount. The offer applies once per person and cannot be combined with other promotions.'),
        P('Some brands and doorbuster items are excluded. Staff can confirm eligibility at pickup.'),
        CTA('Start Shopping'),
      ],
    },
    {
      slug: 'weekly-deals',
      title: 'Weekly Deals',
      blocks: [
        H(2, 'This week on the menu'),
        P('Deals refresh every Monday morning. Look for the discount badge on product cards throughout the shop, or filter any category by "On Sale".'),
        LIST(false, ['Flower: rotating 15–25% off select eighths.', 'Vapes: buy two carts, save on the second.', 'Edibles: mix-and-match gummy multipacks.']),
        CTA('See Deals'),
      ],
    },
    {
      slug: 'pickup-how-it-works',
      title: 'Online Pickup: How It Works',
      blocks: [
        H(2, 'Order online, pick up in store'),
        P('Browse the menu for your closest store, add items to your cart, and check out. You pay in store when you collect the order. We hold pickup orders until close on the day they are placed.'),
        H(4, 'At the store'),
        LIST(true, ['Bring the ID you ordered with.', 'Check in at the pickup counter.', 'Pay by the methods your store accepts and you are done.']),
      ],
    },
    {
      slug: 'refer-a-friend',
      title: 'Refer a Friend',
      blocks: [
        H(2, 'Give $10, get $10'),
        P('Share your referral link from your account page. When a new customer places their first pickup order, they get $10 off and you get $10 in rewards credit.'),
        P('Referral credit has no cash value and expires 90 days after it posts.'),
        CTA('Get Your Link'),
      ],
    },
  ];
}

function makeCorePages() {
  return [
    {
      slug: 'about',
      title: 'About',
      blocks: [
        H(4, 'Who we are'),
        P('Evergreen is a small group of licensed dispensaries built around a simple idea: shopping for cannabis should be clear, unhurried, and free of judgement. Our menus are lab-tested, our staff are trained to answer questions plainly, and our prices are what you see on the shelf.'),
        IMG('Store interior'),
        H(4, 'What we care about'),
        LIST(false, [
          'Honest labeling — potency and terpene info you can actually use.',
          'A calm floor with room to ask questions.',
          'A rotating menu that makes room for small local growers.',
        ]),
        P('This site is a placeholder build. Copy, branding, and imagery are stand-ins to be replaced with the client’s own.'),
      ],
    },
    {
      slug: 'faq',
      title: 'Frequently Asked Questions',
      blocks: [
        H(4, 'Do I need a medical card?'),
        P('Not for the adult-use menu if you are 21 or older with a valid photo ID. The medical menu requires a current state medical card.'),
        H(4, 'How long are pickup orders held?'),
        P('Until close on the day you place the order. If you cannot make it, the order is cancelled and nothing is charged.'),
        H(4, 'Can I pay online?'),
        P('Not yet. Pickup orders are paid in store. Accepted payment methods vary by location — check your store’s page.'),
        H(4, 'Are the menu prices final?'),
        P('Shelf prices are what you pay unless your state adds tax at the counter. Staff will tell you which applies at your location.'),
      ],
    },
    {
      slug: 'medical',
      title: 'Medical Program',
      blocks: [
        H(4, 'Shopping the medical menu'),
        P('If you hold a current medical card in a state where we operate, you can shop the medical menu, which may include higher purchase limits, medical-only products, and reduced tax depending on the state.'),
        H(4, 'What to bring'),
        LIST(false, ['Your unexpired medical card.', 'A matching government photo ID.', 'Any caregiver documentation, if applicable.']),
        P('Program rules differ by state. Your store can walk you through what applies locally.'),
      ],
    },
  ];
}

// ---------------------------------------------------------------------------
// WRITE
// ---------------------------------------------------------------------------
function write(name, data) {
  writeFileSync(join(DATA_DIR, `${name}.json`), JSON.stringify(data, null, 2) + '\n');
  const count = Array.isArray(data) ? data.length : Object.keys(data).length;
  console.log(`  data/${name}.json  (${count})`);
}

const products = makeProducts();
console.log('Generating synthetic mock data:');
write('products', products);
write('category-filters', makeCategoryFilters(products));
write('stores', makeStores());
write('articles', makeArticles());
write('pages', makePages());
write('core-pages', makeCorePages());
console.log('Done. Run `npm run mock-api` to serve it.');
