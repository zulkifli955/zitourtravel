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
 * Get a single tour by its slug (used by the detail page).
 * Returns null when no tour matches.
 */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("tours")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

/**
 * Idempotent seed for the tours catalog. Inserts missing tours and
 * backfills new fields (e.g. gallery) onto older rows, so it is safe to
 * call from the client on every load.
 */
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    let seeded = 0;
    for (const tour of SEED_TOURS) {
      const existing = await ctx.db
        .query("tours")
        .withIndex("by_slug", (q) => q.eq("slug", tour.slug))
        .first();
      if (existing) {
        // Backfill fields added after the row was first created.
        if (!existing.gallery || existing.gallery.length === 0) {
          await ctx.db.patch(existing._id, { gallery: tour.gallery });
        }
        continue;
      }
      await ctx.db.insert("tours", tour);
      seeded += 1;
    }
    return { seeded };
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
    gallery: [
      img("photo-1564507592333-c60657eea523"),
      img("photo-1566837945700-30057527ade0"),
      img("photo-1477959858617-67f85cf4f1df"),
    ],
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
    gallery: [
      img("photo-1502920917128-1aa500764cbd"),
      img("photo-1519452575417-564c1401ecc0"),
      img("photo-1506929562872-bb421503ef21"),
    ],
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
    gallery: [
      img("photo-1544551763-46a013bb70d5"),
      img("photo-1519046904884-53103b34b206"),
      img("photo-1540541338287-41700207dee6"),
    ],
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
    gallery: [
      img("photo-1530521954074-e64f6810b32d"),
      img("photo-1559827260-dc66d52bef19"),
      img("photo-1500375592092-40eb2168fd21"),
    ],
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
    gallery: [
      img("photo-1519677100203-a0e668c92439"),
      img("photo-1504674900247-0877df9cc836"),
      img("photo-1555396273-367ea4eb4db5"),
    ],
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
    gallery: [
      img("photo-1519452575417-564c1401ecc0"),
      img("photo-1571896349842-33c89424de2d"),
      img("photo-1544551763-46a013bb70d5"),
    ],
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
    gallery: [
      img("photo-1441986300917-64674bd600d8"),
      img("photo-1519677100203-a0e668c92439"),
      img("photo-1504674900247-0877df9cc836"),
    ],
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
    gallery: [
      img("photo-1500937386664-56d1dfef3854"),
      img("photo-1466692476868-aef1dfb1e735"),
      img("photo-1559827260-dc66d52bef19"),
    ],
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
    gallery: [
      img("photo-1476673160081-cf065607f449"),
      img("photo-1500375592092-40eb2168fd21"),
      img("photo-1530521954074-e64f6810b32d"),
    ],
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
  {
    name: "Batam Birds Park & Aviary Day",
    slug: "batam-birds-park-aviary-day",
    tagline: "Walk-in aviaries, tropical birds and feeding time at Batam's favorite family stop.",
    description:
      "A relaxed morning at Batam's bird park in Duren: stroll through walk-in aviaries, meet parrots, hornbills and peacocks, and catch the daily feeding show. A gentle outing that kids and grandparents both love.",
    category: "Family Fun",
    imageUrl: img("photo-1444464666168-49d633b86797"),
    gallery: [
      img("photo-1444464666168-49d633b86797"),
      img("photo-1500937386664-56d1dfef3854"),
      img("photo-1466692476868-aef1dfb1e735"),
    ],
    price: 300000,
    durationHours: 5,
    location: "Duren",
    rating: 4.7,
    reviewCount: 96,
    highlights: [
      "Walk-in aviaries with tropical birds",
      "Daily feeding & parrot shows",
      "Photo stops with the friendliest residents",
      "Shaded picnic area",
    ],
    includes: [
      "Bird park entrance fees",
      "English-speaking guide",
      "Hotel pickup & drop-off",
      "Bottled water",
    ],
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 10,
  },
  {
    name: "Mega Wisata Ocarina Theme Park",
    slug: "mega-wisata-ocarina-theme-park",
    tagline: "A ferris wheel, family rides and beachfront food stalls — a full day of easy fun.",
    description:
      "Spend the day at Mega Wisata Ocarina, Batam's sprawling family park by the sea: hop on the ferris wheel for skyline views, try the gentle rides, and graze the food stalls along the waterfront promenade.",
    category: "Family Fun",
    imageUrl: img("photo-1513889961551-628c1e5e2ee9"),
    gallery: [
      img("photo-1513889961551-628c1e5e2ee9"),
      img("photo-1507525428034-b723cf961d3e"),
      img("photo-1519046904884-53103b34b206"),
    ],
    price: 350000,
    durationHours: 6,
    location: "Batam Centre",
    rating: 4.6,
    reviewCount: 154,
    highlights: [
      "Ferris wheel & skyline views",
      "Family-friendly rides",
      "Beachfront food stalls",
      "Sunset photo stops",
    ],
    includes: [
      "Park entrance & rides pass",
      "Private car & driver",
      "Hotel pickup & drop-off",
      "Bottled water",
    ],
    availableDays: ["Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 11,
  },
  {
    name: "Setokok Island & Fishing Village",
    slug: "setokok-island-fishing-village",
    tagline: "A quiet islet across Barelang Bridge, where life moves at boat speed.",
    description:
      "Cross the Barelang bridges to Setokok, a small island where fishing boats bob in every cove. Walk the stilt villages, watch the day's catch come in, and swim at a calm stretch of sand before heading back.",
    category: "Island & Beach",
    imageUrl: img("photo-1473116763249-2faaef81ccda"),
    gallery: [
      img("photo-1473116763249-2faaef81ccda"),
      img("photo-1530521954074-e64f6810b32d"),
      img("photo-1500375592092-40eb2168fd21"),
    ],
    price: 550000,
    durationHours: 7,
    location: "Setokok",
    rating: 4.8,
    reviewCount: 87,
    highlights: [
      "Stilt fishing village walk",
      "See the day's catch land at the jetty",
      "Calm beach swim stop",
      "Seafood lunch at a waterside warung",
    ],
    includes: [
      "Private car & driver",
      "Island guide",
      "Lunch at local warung",
      "Hotel pickup & drop-off",
    ],
    availableDays: ["Sat", "Sun"],
    featured: false,
    sortOrder: 12,
  },
  {
    name: "Sunset Fishing & Seafood BBQ",
    slug: "sunset-fishing-seafood-bbq",
    tagline: "Cast a line as the sun drops, then eat what the sea gives you.",
    description:
      "An easy afternoon fishing trip off Batam's coast with a local boatman who knows the best spots. As the sky turns orange, pull up to a beachside grill where your catch — plus prawns and squid — becomes dinner.",
    category: "Adventure",
    imageUrl: img("photo-1524704654690-b56c05c78a00"),
    gallery: [
      img("photo-1524704654690-b56c05c78a00"),
      img("photo-1504674900247-0877df9cc836"),
      img("photo-1559827260-dc66d52bef19"),
    ],
    price: 425000,
    durationHours: 5,
    location: "Nongsa",
    rating: 4.8,
    reviewCount: 112,
    highlights: [
      "3 hours on the water with a local boatman",
      "Fishing gear & bait included",
      "Beachside seafood BBQ dinner",
      "Sunset over the strait",
    ],
    includes: [
      "Private boat & boatman",
      "Fishing gear",
      "Seafood BBQ dinner",
      "Hotel pickup & drop-off",
    ],
    availableDays: ["Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 13,
  },
  {
    name: "Bukit Senyum & City Skyline Drive",
    slug: "bukit-senyum-city-skyline-drive",
    tagline: "Batam's best viewpoint, a short drive from anywhere in the city.",
    description:
      "Drive up to Bukit Senyum — Smile Hill — for a sweeping panorama of Batam's skyline and the shipping lanes toward Singapore. A short, sweet tour that ends with coffee at a hilltop café.",
    category: "City & Culture",
    imageUrl: img("photo-1480714378408-67cf0d13bc1b"),
    gallery: [
      img("photo-1480714378408-67cf0d13bc1b"),
      img("photo-1477959858617-67f85cf4f1df"),
      img("photo-1502920917128-1aa500764cbd"),
    ],
    price: 275000,
    durationHours: 4,
    location: "Batam Centre",
    rating: 4.7,
    reviewCount: 143,
    highlights: [
      "Panoramic skyline viewpoint",
      "Harbor & shipping lane views",
      "Hilltop café coffee break",
      "Private photo stops",
    ],
    includes: [
      "Private car & driver",
      "English-speaking guide",
      "Coffee or local drink",
      "Hotel pickup & drop-off",
    ],
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 14,
  },
  {
    name: "Coffee Roastery & Local Market Walk",
    slug: "coffee-roastery-local-market-walk",
    tagline: "Fresh-roasted beans, morning market chaos and Batam's best kopi.",
    description:
      "Start at a local roastery where Batam's coffee comes from, then wander the morning market with your guide: taste tropical fruit, snack on street food, and finish with a proper cup of kopi.",
    category: "Food & Shopping",
    imageUrl: img("photo-1509042239860-f550ce710b93"),
    gallery: [
      img("photo-1509042239860-f550ce710b93"),
      img("photo-1447933601403-0c6688de566e"),
      img("photo-1519677100203-a0e668c92439"),
    ],
    price: 225000,
    durationHours: 4,
    location: "Batam Centre",
    rating: 4.6,
    reviewCount: 78,
    highlights: [
      "Roastery tour & tasting",
      "Morning market walk with a guide",
      "Tropical fruit & street snacks",
      "Proper kopi at a local stall",
    ],
    includes: [
      "Roastery tour & tasting",
      "Street food samples",
      "English-speaking guide",
      "Hotel pickup & drop-off",
    ],
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    featured: false,
    sortOrder: 15,
  },
  {
    name: "Spa & Wellness Escape",
    slug: "spa-wellness-escape",
    tagline: "A quiet hour — or three — of massages, saunas and zero plans.",
    description:
      "Check out of the sightseeing for a day. A private car takes you to a trusted Batam spa for a massage of your choice, a steam or sauna session, and plenty of time to simply do nothing. You'll leave lighter.",
    category: "Relaxation",
    imageUrl: img("photo-1600334129128-685c5582fd35"),
    gallery: [
      img("photo-1600334129128-685c5582fd35"),
      img("photo-1544161515-4ab6ce6db874"),
      img("photo-1500375592092-40eb2168fd21"),
    ],
    price: 500000,
    durationHours: 4,
    location: "Batam Centre",
    rating: 4.9,
    reviewCount: 134,
    highlights: [
      "60–120 min massage of your choice",
      "Steam or sauna session",
      "Herbal tea & lounge time",
      "Transfers in a private car",
    ],
    includes: [
      "Spa treatment package",
      "Private car & driver",
      "Hotel pickup & drop-off",
      "Bottled water",
    ],
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 16,
  },
  {
    name: "Barelang Golf & Resort Day",
    slug: "barelang-golf-resort-day",
    tagline: "Eighteen holes with sea views at one of Batam's best courses.",
    description:
      "A full day for golfers: an early tee time at a resort course overlooking the strait, a clubhouse lunch, and an optional second nine if the legs are still fresh. Caddies, cart and transfers all sorted.",
    category: "Adventure",
    imageUrl: img("photo-1535131749006-b7f58c99034b"),
    gallery: [
      img("photo-1535131749006-b7f58c99034b"),
      img("photo-1502920917128-1aa500764cbd"),
      img("photo-1510414842594-a61c69b5ae57"),
    ],
    price: 850000,
    durationHours: 8,
    location: "Barelang",
    rating: 4.8,
    reviewCount: 66,
    highlights: [
      "18 holes with sea views",
      "Clubhouse lunch",
      "Caddie & cart included",
      "Optional second nine",
    ],
    includes: [
      "Green fees & cart",
      "Caddie",
      "Clubhouse lunch",
      "Private car & driver",
    ],
    availableDays: ["Thu", "Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 17,
  },
  {
    name: "Nongsa Beach Club & Sunset Dinner",
    slug: "nongsa-beach-club-sunset-dinner",
    tagline: "Loungers by day, cocktails at golden hour, dinner over the water.",
    description:
      "The relaxed Batam classic: a day pass at a Nongsa beach club with loungers and a pool, a golden-hour cocktail as the Singapore skyline lights up, and a seafood dinner on the terrace to finish.",
    category: "Island & Beach",
    imageUrl: img("photo-1510414842594-a61c69b5ae57"),
    gallery: [
      img("photo-1510414842594-a61c69b5ae57"),
      img("photo-1507525428034-b723cf961d3e"),
      img("photo-1544551763-46a013bb70d5"),
    ],
    price: 475000,
    durationHours: 8,
    location: "Nongsa",
    rating: 4.8,
    reviewCount: 205,
    highlights: [
      "Beach club day pass & loungers",
      "Pool and shaded cabanas",
      "Sunset cocktail hour",
      "Seafood dinner with sea view",
    ],
    includes: [
      "Beach club entry",
      "1 welcome cocktail",
      "Seafood dinner",
      "Hotel pickup & drop-off",
    ],
    availableDays: ["Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 18,
  },
];
