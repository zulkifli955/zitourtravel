import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * List all tour packages, ordered by sortOrder.
 * Optional category filter is applied server-side via the by_category index.
 */
export const list = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, { category }) => {
    const tours =
      category && category !== "all"
        ? await ctx.db
            .query("tours")
            .withIndex("by_category", (q) => q.eq("category", category))
            .collect()
        : await ctx.db.query("tours").collect();
    return tours.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

/**
 * Idempotent seed for the tours catalog. Only inserts when the table is
 * empty, so it is safe to call from the client on first load.
 */
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("tours").first();
    if (existing) {
      return { seeded: 0 };
    }
    for (const tour of SEED_TOURS) {
      await ctx.db.insert("tours", tour);
    }
    return { seeded: SEED_TOURS.length };
  },
});

const img = (id: string) =>
  `https://images.unsplash.com/${id}?q=80&w=1600&auto=format&fit=crop`;

const SEED_TOURS = [
  {
    name: "Batam Heritage & Temple Tour",
    slug: "batam-heritage-temple-tour",
    tagline: "Temples, town squares and the stories behind Batam's past.",
    description:
      "Spend a day exploring Batam's most storied landmarks with a local guide: the vast Maha Vihara Duta Maitreya temple, the historic Tua Pek Kong shrine, and the miniature Indonesia park at Mega Legenda. Round-trip hotel pickup and a private car keep the pace yours.",
    category: "City & Culture",
    imageUrl: img("photo-1564507592333-c60657eea523"),
    price: 350000,
    durationHours: 6,
    location: "Batam Centre",
    rating: 4.9,
    reviewCount: 312,
    highlights: [
      "Visit Southeast Asia's largest Buddhist temple",
      "See the 108 Buddha statues at Maha Vihara",
      "Walk Batam's old-town heritage quarter",
      "Photo stops at Mega Legenda's mini landmarks",
    ],
    includes: [
      "Private air-conditioned car",
      "English-speaking guide",
      "Hotel pickup & drop-off (Batam Centre)",
      "Bottled water",
      "Temple entrance fees",
    ],
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    featured: true,
    sortOrder: 1,
  },
  {
    name: "Barelang Bridge & Coastal Drive",
    slug: "barelang-bridge-coastal-drive",
    tagline: "Six bridges, one skyline — Batam's most photographed drive.",
    description:
      "Cross the iconic Barelang bridge chain that links Batam to its southern islets, stop at the famous viewpoint over the Riau Strait, and end at a breezy coastal café. The classic Batam postcard, minus the planning.",
    category: "City & Culture",
    imageUrl: img("photo-1502920917128-1aa500764cbd"),
    price: 300000,
    durationHours: 5,
    location: "Barelang",
    rating: 4.8,
    reviewCount: 428,
    highlights: [
      "Cross all six Barelang bridges",
      "Panoramic viewpoint over the Riau Strait",
      "Beach-side café stop",
      "Private photo stops at your pace",
    ],
    includes: [
      "Private car & driver",
      "English-speaking guide",
      "Hotel pickup & drop-off",
      "Bottled water",
    ],
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    featured: true,
    sortOrder: 2,
  },
  {
    name: "Nongsa Beach & Water Sports",
    slug: "nongsa-beach-water-sports",
    tagline: "Jet skis, banana boats and beach-club vibes on Batam's best shore.",
    description:
      "A full day at Nongsa's white-sand coast with time on the water: choose jet-skiing, banana boats or simply a sun lounger with a cold drink. Lunch at a beachfront restaurant overlooking the Singapore skyline.",
    category: "Island & Beach",
    imageUrl: img("photo-1544551763-46a013bb70d5"),
    price: 450000,
    durationHours: 7,
    location: "Nongsa",
    rating: 4.9,
    reviewCount: 517,
    highlights: [
      "2 hours of water sports (jet ski / banana boat)",
      "Beach club access with loungers",
      "Seafood lunch with sea view",
      "Shaded cabanas for non-swimmers",
    ],
    includes: [
      "Water sports package",
      "Beach club entry",
      "Lunch at beachfront restaurant",
      "Hotel pickup & drop-off",
      "Towels & lockers",
    ],
    availableDays: ["Fri", "Sat", "Sun", "Mon"],
    featured: true,
    sortOrder: 3,
  },
  {
    name: "Pulau Abang Island Escape",
    slug: "pulau-abang-island-escape",
    tagline: "Turquoise water, coral gardens and a seafood feast on a private islet.",
    description:
      "Take a fast boat from Batam's east coast to the quiet islets off Pulau Abang. Snorkel coral gardens, wade on sandbanks, and sit down to a grilled seafood lunch cooked on the beach.",
    category: "Island & Beach",
    imageUrl: img("photo-1530521954074-e64f6810b32d"),
    price: 650000,
    durationHours: 10,
    location: "Pulau Abang",
    rating: 5.0,
    reviewCount: 198,
    highlights: [
      "Speedboat transfers & island hopping",
      "Snorkeling gear + guide",
      "Grilled seafood beach lunch",
      "Sandbank & lagoon photo stops",
    ],
    includes: [
      "Speedboat round-trip",
      "Snorkeling equipment",
      "Beach lunch (seafood)",
      "Local island guide",
      "Hotel pickup & drop-off (Nongsa side)",
    ],
    availableDays: ["Sat", "Sun"],
    featured: false,
    sortOrder: 4,
  },
  {
    name: "Marina City Night Market Food Tour",
    slug: "marina-city-night-market-food-tour",
    tagline: "Eat your way through Batam's buzziest night market.",
    description:
      "When the sun goes down, Marina City comes alive. Wander the neon-lit market with your guide, snack on sate, nasi padang and durian treats, and browse duty-free shops on the way back.",
    category: "Food & Shopping",
    imageUrl: img("photo-1519677100203-a0e668c92439"),
    price: 200000,
    durationHours: 4,
    location: "Marina City",
    rating: 4.7,
    reviewCount: 264,
    highlights: [
      "Guided street-food crawl (8+ tastings)",
      "Duty-free shopping stop",
      "Local drink included",
      "Evening hotel pickup",
    ],
    includes: [
      "English-speaking food guide",
      "8–10 food tastings",
      "1 local drink",
      "Hotel pickup & drop-off",
    ],
    availableDays: ["Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 5,
  },
  {
    name: "Galang Island & Vietnamese Village",
    slug: "galang-island-vietnamese-village",
    tagline: "A quiet chapter of Southeast Asian history, an hour from Batam.",
    description:
      "Cross the Barelang bridges to Galang Island, where a former Vietnamese refugee camp now stands as a moving museum. A thoughtful, guided half-day for history-minded travelers.",
    category: "City & Culture",
    imageUrl: img("photo-1519452575417-564c1401ecc0"),
    price: 400000,
    durationHours: 8,
    location: "Galang Island",
    rating: 4.8,
    reviewCount: 143,
    highlights: [
      "Vietnamese refugee camp museum",
      "Galang's beaches & pine groves",
      "Local lunch at a seaside warung",
      "Guided commentary throughout",
    ],
    includes: [
      "Private car & driver",
      "English-speaking guide",
      "Museum entrance",
      "Lunch",
      "Hotel pickup & drop-off",
    ],
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 6,
  },
  {
    name: "Kepri Mall & Factory Outlet Shopping",
    slug: "kepri-mall-factory-outlet-shopping",
    tagline: "Duty-free bargains and factory outlets, door to door.",
    description:
      "A private shopping run with the places locals actually use: Kepri Mall, Grand Batam's outlet stores, and a coffee-and-snack pit stop. Plenty of boot space in the car for everything you pick up.",
    category: "Food & Shopping",
    imageUrl: img("photo-1441986300917-64674bd600d8"),
    price: 250000,
    durationHours: 5,
    location: "Batam Centre",
    rating: 4.6,
    reviewCount: 231,
    highlights: [
      "Kepri Mall duty-free shopping",
      "Factory outlet stops (Grand Batam)",
      "Coffee & local snack break",
      "Flexible itinerary — shop at your pace",
    ],
    includes: [
      "Private car & driver",
      "Shopping guide on request",
      "Hotel pickup & drop-off",
      "Bottled water",
    ],
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 7,
  },
  {
    name: "Farm & Local Flavors Tour",
    slug: "farm-local-flavors-tour",
    tagline: "Aloe farms, local fruit and hands-on Batam countryside life.",
    description:
      "A gentle, family-friendly day in Batam's green belt: tour an aloe vera farm, taste tropical fruit straight from the tree, and meet friendly farm animals. Kids and grandparents included.",
    category: "Family Fun",
    imageUrl: img("photo-1500937386664-56d1dfef3854"),
    price: 275000,
    durationHours: 5,
    location: "Sei Beduk",
    rating: 4.8,
    reviewCount: 176,
    highlights: [
      "Aloe vera farm tour + tasting",
      "Tropical fruit sampling (seasonal)",
      "Mini farm animals & feeding",
      "Lunch with local dishes",
    ],
    includes: [
      "Private car & driver",
      "Farm entrance fees",
      "Fruit tasting",
      "Lunch",
      "Hotel pickup & drop-off",
    ],
    availableDays: ["Sat", "Sun"],
    featured: false,
    sortOrder: 8,
  },
  {
    name: "Mangrove Kayak & Eco Adventure",
    slug: "mangrove-kayak-eco-adventure",
    tagline: "Paddle silent waterways through Batam's green lungs.",
    description:
      "Kayak through sheltered mangrove channels with a certified eco guide, spot monitor lizards and kingfishers, and finish with a coconut on a quiet boardwalk. Minimal effort, maximum calm.",
    category: "Adventure",
    imageUrl: img("photo-1476673160081-cf065607f449"),
    price: 320000,
    durationHours: 4,
    location: "Nongsa",
    rating: 4.9,
    reviewCount: 122,
    highlights: [
      "Guided mangrove kayaking (2h)",
      "Wildlife spotting (monitors, kingfishers)",
      "Boardwalk & coconut break",
      "Small groups (max 8)",
    ],
    includes: [
      "Kayak & safety gear",
      "Certified eco guide",
      "Waterproof pouch",
      "Bottled water & coconut",
      "Hotel pickup & drop-off",
    ],
    availableDays: ["Thu", "Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 9,
  },
];
