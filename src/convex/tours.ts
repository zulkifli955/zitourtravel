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
 * Get a single tour by its slug.
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
 * Sync-style seed for the tours catalog. Inserts missing tours, backfills
 * new fields (e.g. gallery) onto older rows, and removes rows whose slug is
 * no longer part of SEED_TOURS — so the table always mirrors the catalog.
 */
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("tours").collect();
    const seedSlugs = new Set(SEED_TOURS.map((t) => t.slug));
    let seeded = 0;
    let removed = 0;

    for (const tour of SEED_TOURS) {
      const cur = existing.find((t) => t.slug === tour.slug);
      if (cur) {
        // Backfill fields added after the row was first created.
        if (!cur.gallery || cur.gallery.length === 0) {
          await ctx.db.patch(cur._id, { gallery: tour.gallery });
        }
        continue;
      }
      await ctx.db.insert("tours", tour);
      seeded += 1;
    }

    // Remove tours that are no longer part of the seed catalog so the
    // database stays in sync with SEED_TOURS.
    for (const tour of existing) {
      if (!seedSlugs.has(tour.slug)) {
        await ctx.db.delete(tour._id);
        removed += 1;
      }
    }

    return { seeded, removed };
  },
});

const img = (id: string) =>
  `https://images.unsplash.com/${id}?q=80&w=1600&auto=format&fit=crop`;

/** 27 attractions, sorted alphabetically by name. */
const SEED_TOURS = [
  {
    name: "70 Fahrenheit Coffie Factory Batam",
    slug: "70-fahrenheit-coffie-factory-batam",
    tagline:
      "A roastery-factory café where Batam's coffee gets its start — tours, tastings and flat whites.",
    description:
      "Peek behind the counter at 70 Fahrenheit, a Batam coffee factory that roasts, brews and serves its own beans. Tour the roasting floor, taste single-origin pours, and linger over cake in the café.",
    category: "Food & Shopping",
    imageUrl: img("photo-1509042239860-f550ce710b93"),
    gallery: [
      img("photo-1509042239860-f550ce710b93"),
      img("photo-1447933601403-0c6688de566e"),
      img("photo-1555396273-367ea4eb4db5"),
    ],
    price: 175000,
    durationHours: 3,
    location: "Batam Centre",
    rating: 4.7,
    reviewCount: 84,
    highlights: [
      "Roastery tour & tasting",
      "Single-origin tasting flight",
      "Café & cake break",
      "Beans to take home",
    ],
    includes: [
      "Roastery tour & tasting",
      "1 coffee + pastry",
      "Private car & driver",
      "Hotel pickup & drop-off",
    ],
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 1,
  },
  {
    name: "Barelang Bridge",
    slug: "barelang-bridge",
    tagline: "Six bridges link Batam to its southern islets — Batam's most photographed drive.",
    description:
      "Cross the iconic Barelang bridge chain and stop at the famous viewpoint over the Riau Strait. The classic Batam postcard, with as many photo stops as you like.",
    category: "City & Culture",
    imageUrl: img("photo-1502920917128-1aa500764cbd"),
    gallery: [
      img("photo-1502920917128-1aa500764cbd"),
      img("photo-1519452575417-564c1401ecc0"),
      img("photo-1506929562872-bb421503ef21"),
    ],
    price: 300000,
    durationHours: 4,
    location: "Barelang",
    rating: 4.8,
    reviewCount: 428,
    highlights: [
      "Cross all six Barelang bridges",
      "Viewpoint over the Riau Strait",
      "Private photo stops",
      "Breeze at the coastal end",
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
    name: "Batam Zoo Paradise",
    slug: "batam-zoo-paradise",
    tagline: "Tigers, birds and big cats in a shady zoo that kids never want to leave.",
    description:
      "A relaxed day at Batam Zoo Paradise in Bengkong: see tigers, lions, birds and reptiles up close, catch feeding time, and let the kids burn off energy in the playground.",
    category: "Family Fun",
    imageUrl: img("photo-1444464666168-49d633b86797"),
    gallery: [
      img("photo-1444464666168-49d633b86797"),
      img("photo-1500937386664-56d1dfef3854"),
      img("photo-1466692476868-aef1dfb1e735"),
    ],
    price: 275000,
    durationHours: 5,
    location: "Bengkong",
    rating: 4.7,
    reviewCount: 156,
    highlights: [
      "Big cats & exotic birds",
      "Daily feeding shows",
      "Children's playground",
      "Shaded walkways",
    ],
    includes: [
      "Zoo entrance",
      "English-speaking guide",
      "Hotel pickup & drop-off",
      "Bottled water",
    ],
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    featured: true,
    sortOrder: 3,
  },
  {
    name: "Blue Fire Beach Club",
    slug: "blue-fire-beach-club",
    tagline: "Loungers, cocktails and sunset over the strait at Nongsa's liveliest beach club.",
    description:
      "A day pass at Blue Fire Beach Club: claim a lounger, dip in the pool, and order from the beach bar while the Singapore skyline glitters across the water at golden hour.",
    category: "Island & Beach",
    imageUrl: img("photo-1510414842594-a61c69b5ae57"),
    gallery: [
      img("photo-1510414842594-a61c69b5ae57"),
      img("photo-1507525428034-b723cf961d3e"),
      img("photo-1544551763-46a013bb70d5"),
    ],
    price: 450000,
    durationHours: 6,
    location: "Nongsa",
    rating: 4.8,
    reviewCount: 178,
    highlights: [
      "Beach club day pass",
      "Pool & loungers",
      "Beach bar & cocktails",
      "Sunset over the strait",
    ],
    includes: [
      "Day pass",
      "Welcome drink",
      "Private car & driver",
      "Hotel pickup & drop-off",
    ],
    availableDays: ["Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 4,
  },
  {
    name: "Bluefire Beach Club Batam",
    slug: "bluefire-beach-club-batam",
    tagline: "The full Bluefire experience — infinity pool, beachfront dining and live music.",
    description:
      "Bluefire Beach Club Batam brings the full beach-club package: an infinity pool facing the sea, a long white-sand stretch, and a menu that runs from grilled seafood to sunset cocktails.",
    category: "Island & Beach",
    imageUrl: img("photo-1544551763-46a013bb70d5"),
    gallery: [
      img("photo-1544551763-46a013bb70d5"),
      img("photo-1540541338287-41700207dee6"),
      img("photo-1519046904884-53103b34b206"),
    ],
    price: 450000,
    durationHours: 6,
    location: "Nongsa",
    rating: 4.8,
    reviewCount: 169,
    highlights: [
      "Infinity pool with sea view",
      "Beachfront dining",
      "Sunset cocktails",
      "Live music on weekends",
    ],
    includes: [
      "Day pass",
      "1 cocktail",
      "Lunch or dinner option",
      "Private car & driver",
    ],
    availableDays: ["Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 5,
  },
  {
    name: "Desa Ekang Wisata Sari",
    slug: "desa-ekang-wisata-sari",
    tagline: "Traditional Malay houses, paddy fields and village life an hour from the city.",
    description:
      "Step into Desa Ekang Wisata Sari, a living cultural village in Bengkong: wander the replica Malay houses, walk the paddy fields, and join a hands-on workshop before a home-style lunch.",
    category: "Family Fun",
    imageUrl: img("photo-1500937386664-56d1dfef3854"),
    gallery: [
      img("photo-1500937386664-56d1dfef3854"),
      img("photo-1466692476868-aef1dfb1e735"),
      img("photo-1559827260-dc66d52bef19"),
    ],
    price: 250000,
    durationHours: 4,
    location: "Bengkong",
    rating: 4.7,
    reviewCount: 92,
    highlights: [
      "Traditional Malay architecture",
      "Paddy-field walk",
      "Hands-on village workshop",
      "Home-style lunch",
    ],
    includes: [
      "Village entrance & guide",
      "Workshop",
      "Lunch",
      "Hotel pickup & drop-off",
    ],
    availableDays: ["Sat", "Sun"],
    featured: false,
    sortOrder: 6,
  },
  {
    name: "Dino's Gate",
    slug: "dinos-gate",
    tagline: "Walk among roaring dinosaurs at Batam's prehistoric theme park.",
    description:
      "Dino's Gate brings the Jurassic to Batam: life-size animatronic dinosaurs that roar and move, a fossil dig for kids, and plenty of photo moments with your favorite reptiles.",
    category: "Family Fun",
    imageUrl: img("photo-1476673160081-cf065607f449"),
    gallery: [
      img("photo-1476673160081-cf065607f449"),
      img("photo-1500375592092-40eb2168fd21"),
      img("photo-1444464666168-49d633b86797"),
    ],
    price: 250000,
    durationHours: 4,
    location: "Batu Aji",
    rating: 4.6,
    reviewCount: 121,
    highlights: [
      "Life-size animatronic dinosaurs",
      "Fossil dig for kids",
      "Dino photo spots",
      "Family-friendly walkways",
    ],
    includes: [
      "Park entrance",
      "Guide on request",
      "Hotel pickup & drop-off",
      "Bottled water",
    ],
    availableDays: ["Sat", "Sun"],
    featured: false,
    sortOrder: 7,
  },
  {
    name: "Elyora Beach",
    slug: "elyora-beach",
    tagline: "A quieter Nongsa shore: clear shallows, beach games and a sunset BBQ.",
    description:
      "Elyora Beach keeps things easy — soft sand, calm shallow water for swimming, volleyball and kayaks on hand, and a barbecue that fires up as the sun goes down.",
    category: "Island & Beach",
    imageUrl: img("photo-1507525428034-b723cf961d3e"),
    gallery: [
      img("photo-1507525428034-b723cf961d3e"),
      img("photo-1540541338287-41700207dee6"),
      img("photo-1519046904884-53103b34b206"),
    ],
    price: 425000,
    durationHours: 6,
    location: "Nongsa",
    rating: 4.8,
    reviewCount: 133,
    highlights: [
      "Calm shallow swim area",
      "Beach games & kayaks",
      "Sunset barbecue",
      "Quiet stretch of sand",
    ],
    includes: [
      "Beach day pass",
      "Kayak & games",
      "Sunset BBQ dinner",
      "Hotel pickup & drop-off",
    ],
    availableDays: ["Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 8,
  },
  {
    name: "Gedung Gonggong",
    slug: "gedung-gonggong",
    tagline: "Batam's famous gonggong-shaped landmark, right by the ferry terminal.",
    description:
      "The Gedung Gonggong — a building shaped like the giant sea snail Batam is famous for — is the city's most photographed landmark. Snap the angles, browse the souvenir arcade, and grab a coffee at the waterfront.",
    category: "City & Culture",
    imageUrl: img("photo-1477959858617-67f85cf4f1df"),
    gallery: [
      img("photo-1477959858617-67f85cf4f1df"),
      img("photo-1480714378408-67cf0d13bc1b"),
      img("photo-1519677100203-a0e668c92439"),
    ],
    price: 200000,
    durationHours: 3,
    location: "Batam Centre",
    rating: 4.6,
    reviewCount: 108,
    highlights: [
      "The iconic gonggong-shaped building",
      "Waterfront photo stops",
      "Souvenir arcade",
      "Coffee break",
    ],
    includes: [
      "Private car & driver",
      "English-speaking guide",
      "Hotel pickup & drop-off",
      "Bottled water",
    ],
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 9,
  },
  {
    name: "Infinity Beach Club",
    slug: "infinity-beach-club",
    tagline: "An infinity pool that melts into the sea, plus beach service all day.",
    description:
      "Infinity Beach Club's pool really does look endless — it meets the horizon over the strait. Spend the day between lounger, pool and bar, with the Singapore skyline as the backdrop.",
    category: "Island & Beach",
    imageUrl: img("photo-1544551763-46a013bb70d5"),
    gallery: [
      img("photo-1544551763-46a013bb70d5"),
      img("photo-1510414842594-a61c69b5ae57"),
      img("photo-1507525428034-b723cf961d3e"),
    ],
    price: 475000,
    durationHours: 6,
    location: "Nongsa",
    rating: 4.8,
    reviewCount: 187,
    highlights: [
      "Infinity pool with sea views",
      "Loungers & cabanas",
      "Poolside bar service",
      "Sunset cocktail hour",
    ],
    includes: [
      "Day pass",
      "1 welcome drink",
      "Private car & driver",
      "Hotel pickup & drop-off",
    ],
    availableDays: ["Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 10,
  },
  {
    name: "Kampung Sawah",
    slug: "kampung-sawah",
    tagline: "Green rice paddies, water buffalo and village calm just outside the city.",
    description:
      "Kampung Sawah is Batam's slice of countryside: terraced paddies, water buffalo, and friendly farmers who'll show you how rice goes from field to plate.",
    category: "Family Fun",
    imageUrl: img("photo-1500937386664-56d1dfef3854"),
    gallery: [
      img("photo-1500937386664-56d1dfef3854"),
      img("photo-1466692476868-aef1dfb1e735"),
      img("photo-1500375592092-40eb2168fd21"),
    ],
    price: 250000,
    durationHours: 4,
    location: "Sekupang",
    rating: 4.7,
    reviewCount: 74,
    highlights: [
      "Rice-paddy walk",
      "Water buffalo sightings",
      "Farmer meet & greet",
      "Local snack break",
    ],
    includes: [
      "Village guide",
      "Local snack",
      "Private car & driver",
      "Hotel pickup & drop-off",
    ],
    availableDays: ["Sat", "Sun"],
    featured: false,
    sortOrder: 11,
  },
  {
    name: "Lagoi Bay",
    slug: "lagoi-bay",
    tagline: "Golden sand and calm bays on Bintan's resort coast, an hour from Batam.",
    description:
      "Cross to Bintan for Lagoi Bay's long stretches of golden sand and calm, shallow water — resorts, beach clubs and a chilled-out pace that's a world away from the city.",
    category: "Island & Beach",
    imageUrl: img("photo-1507525428034-b723cf961d3e"),
    gallery: [
      img("photo-1507525428034-b723cf961d3e"),
      img("photo-1473116763249-2faaef81ccda"),
      img("photo-1530521954074-e64f6810b32d"),
    ],
    price: 700000,
    durationHours: 8,
    location: "Lagoi, Bintan",
    rating: 4.7,
    reviewCount: 65,
    highlights: [
      "Golden-sand beaches",
      "Calm swimming bays",
      "Beach club day pass",
      "Resort grounds wander",
    ],
    includes: [
      "Ferry transfers",
      "Beach club pass",
      "Lunch",
      "Guide escort",
    ],
    availableDays: ["Sat", "Sun"],
    featured: false,
    sortOrder: 12,
  },
  {
    name: "Maru Cafe",
    slug: "maru-cafe",
    tagline: "Batam's coffee-and-cake hangout, one sip at a time.",
    description:
      "A relaxed stop at Maru Cafe, a favorite Batam hangout for its strong coffee, generous cake slices and easygoing playlist. The perfect midday pause between sights.",
    category: "Food & Shopping",
    imageUrl: img("photo-1509042239860-f550ce710b93"),
    gallery: [
      img("photo-1509042239860-f550ce710b93"),
      img("photo-1555396273-367ea4eb4db5"),
      img("photo-1447933601403-0c6688de566e"),
    ],
    price: 150000,
    durationHours: 3,
    location: "Batam Centre",
    rating: 4.6,
    reviewCount: 58,
    highlights: [
      "Signature coffee flight",
      "Fresh-baked cake",
      "Cozy café corner",
      "Take-home beans",
    ],
    includes: [
      "2 drinks + pastry",
      "Private car & driver",
      "Hotel pickup & drop-off",
    ],
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 13,
  },
  {
    name: "Masjid Agung Raja Batam",
    slug: "masjid-agung-raja-batam",
    tagline: "Batam's grand mosque, with its soaring dome and waterfront setting.",
    description:
      "Masjid Agung Raja Batam is the island's landmark place of worship. Visit between prayer times, admire the architecture and the peaceful waterfront grounds, and learn about its role in the community.",
    category: "City & Culture",
    imageUrl: img("photo-1564507592333-c60657eea523"),
    gallery: [
      img("photo-1564507592333-c60657eea523"),
      img("photo-1571896349842-33c89424de2d"),
      img("photo-1477959858617-67f85cf4f1df"),
    ],
    price: 200000,
    durationHours: 3,
    location: "Batam Centre",
    rating: 4.8,
    reviewCount: 143,
    highlights: [
      "Grand dome & minaret",
      "Waterfront grounds",
      "Guided visit (respectful dress)",
      "Architecture photo stops",
    ],
    includes: [
      "Private car & driver",
      "English-speaking guide",
      "Hotel pickup & drop-off",
      "Bottled water",
    ],
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 14,
  },
  {
    name: "Masjid Jabal Arafah",
    slug: "masjid-jabal-arafah",
    tagline: "A striking mosque perched above the strait near Nongsa.",
    description:
      "Rising over the water near Nongsa, Masjid Jabal Arafah is one of Batam's most photographed mosques. Visit respectfully between prayer times and take in the sea views from its grounds.",
    category: "City & Culture",
    imageUrl: img("photo-1571896349842-33c89424de2d"),
    gallery: [
      img("photo-1571896349842-33c89424de2d"),
      img("photo-1564507592333-c60657eea523"),
      img("photo-1519452575417-564c1401ecc0"),
    ],
    price: 200000,
    durationHours: 3,
    location: "Nongsa",
    rating: 4.7,
    reviewCount: 112,
    highlights: [
      "Stunning seaside setting",
      "Architecture photo stops",
      "Respectful guided visit",
      "Nearby coastal drive",
    ],
    includes: [
      "Private car & driver",
      "Guide",
      "Hotel pickup & drop-off",
      "Bottled water",
    ],
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 15,
  },
  {
    name: "Masjid Raja Sultan",
    slug: "masjid-raja-sultan",
    tagline: "A regal mosque and a lesson in Batam's royal heritage.",
    description:
      "Masjid Raja Sultan honors Batam's sultanate heritage with stately architecture and a serene courtyard. A quiet, thoughtful stop for travelers interested in the island's culture.",
    category: "City & Culture",
    imageUrl: img("photo-1564507592333-c60657eea523"),
    gallery: [
      img("photo-1564507592333-c60657eea523"),
      img("photo-1571896349842-33c89424de2d"),
      img("photo-1480714378408-67cf0d13bc1b"),
    ],
    price: 200000,
    durationHours: 3,
    location: "Batam Centre",
    rating: 4.6,
    reviewCount: 97,
    highlights: [
      "Regal mosque architecture",
      "Serene courtyard",
      "Heritage storytelling",
      "Respectful photo stops",
    ],
    includes: [
      "Private car & driver",
      "English-speaking guide",
      "Hotel pickup & drop-off",
    ],
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 16,
  },
  {
    name: "Nongsa Point Marina",
    slug: "nongsa-point-marina",
    tagline: "Yachts, waterfront dining and sea breezes at Batam's marina.",
    description:
      "Wander the pontoons at Nongsa Point Marina, watch the yachts come and go, and settle in at a waterside restaurant with a view of the Singapore skyline.",
    category: "Island & Beach",
    imageUrl: img("photo-1519452575417-564c1401ecc0"),
    gallery: [
      img("photo-1519452575417-564c1401ecc0"),
      img("photo-1506929562872-bb421503ef21"),
      img("photo-1502920917128-1aa500764cbd"),
    ],
    price: 300000,
    durationHours: 4,
    location: "Nongsa",
    rating: 4.7,
    reviewCount: 124,
    highlights: [
      "Marina & yacht stroll",
      "Waterfront dining",
      "Skyline views",
      "Photo stops",
    ],
    includes: [
      "Private car & driver",
      "Guide",
      "Hotel pickup & drop-off",
      "Bottled water",
    ],
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 17,
  },
  {
    name: "Ocarina Batam",
    slug: "ocarina-batam",
    tagline: "Ferris wheel, family rides and beachfront food stalls — a full day of easy fun.",
    description:
      "Spend the day at Mega Wisata Ocarina, Batam's sprawling family park by the sea: hop on the ferris wheel for skyline views, try the gentle rides, and graze the food stalls along the promenade.",
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
    featured: true,
    sortOrder: 18,
  },
  {
    name: "Panbil Nature Reserve",
    slug: "panbil-nature-reserve",
    tagline: "Jungle trails, a waterfall and wildlife in Batam's green heart.",
    description:
      "Panbil Nature Reserve is Batam's wild backyard: shaded jungle trails, a waterfall to cool off in, and a good chance of spotting monkeys and monitor lizards. Wear shoes you don't mind getting muddy.",
    category: "Adventure",
    imageUrl: img("photo-1476673160081-cf065607f449"),
    gallery: [
      img("photo-1476673160081-cf065607f449"),
      img("photo-1500375592092-40eb2168fd21"),
      img("photo-1530521954074-e64f6810b32d"),
    ],
    price: 350000,
    durationHours: 5,
    location: "Muka Kuning",
    rating: 4.8,
    reviewCount: 138,
    highlights: [
      "Guided jungle trek",
      "Waterfall swim stop",
      "Wildlife spotting",
      "Shaded picnic spot",
    ],
    includes: [
      "Reserve entrance",
      "Eco guide",
      "Picnic snack & water",
      "Hotel pickup & drop-off",
    ],
    availableDays: ["Thu", "Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 19,
  },
  {
    name: "Patung Seribu",
    slug: "patung-seribu",
    tagline: "A thousand serene statues at Batam's grandest temple complex.",
    description:
      "Walk the terraces of the Maha Vihara Duta Maitreya temple complex, where a thousand Buddha statues sit in quiet rows. A peaceful, photogenic visit to Southeast Asia's largest Buddhist temple.",
    category: "City & Culture",
    imageUrl: img("photo-1564507592333-c60657eea523"),
    gallery: [
      img("photo-1564507592333-c60657eea523"),
      img("photo-1566837945700-30057527ade0"),
      img("photo-1477959858617-67f85cf4f1df"),
    ],
    price: 250000,
    durationHours: 4,
    location: "Bengkong",
    rating: 4.7,
    reviewCount: 106,
    highlights: [
      "1,000 Buddha statues",
      "Grand temple terraces",
      "Serene gardens",
      "Photography paradise",
    ],
    includes: [
      "Temple entrance",
      "English-speaking guide",
      "Hotel pickup & drop-off",
      "Bottled water",
    ],
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 20,
  },
  {
    name: "Pulau Penyengat",
    slug: "pulau-penyengat",
    tagline: "A historic island of yellow mosques and royal tombs, across the strait.",
    description:
      "Ferry to Pulau Penyengat, the tiny island that was the heart of the Riau-Lingga sultanate. Climb to the iconic yellow mosque, visit the royal tombs, and soak up 300 years of history in one morning.",
    category: "Island & Beach",
    imageUrl: img("photo-1530521954074-e64f6810b32d"),
    gallery: [
      img("photo-1530521954074-e64f6810b32d"),
      img("photo-1519452575417-564c1401ecc0"),
      img("photo-1473116763249-2faaef81ccda"),
    ],
    price: 750000,
    durationHours: 8,
    location: "Tanjungpinang, Bintan",
    rating: 4.8,
    reviewCount: 89,
    highlights: [
      "Historic yellow mosque",
      "Royal tombs & palace ruins",
      "Island walking tour",
      "Ferry ride across the strait",
    ],
    includes: [
      "Ferry transfers",
      "Island guide",
      "Local lunch",
      "Hotel pickup & drop-off",
    ],
    availableDays: ["Sat", "Sun"],
    featured: false,
    sortOrder: 21,
  },
  {
    name: "Puncak Beliung",
    slug: "puncak-beliung",
    tagline: "A gentle climb to Batam's best hilltop panorama.",
    description:
      "Hike up Puncak Beliung through cool jungle shade and emerge above the canopy for a 360° view of Batam's coast and islands. A short, rewarding trek for every fitness level.",
    category: "Adventure",
    imageUrl: img("photo-1500375592092-40eb2168fd21"),
    gallery: [
      img("photo-1500375592092-40eb2168fd21"),
      img("photo-1476673160081-cf065607f449"),
      img("photo-1480714378408-67cf0d13bc1b"),
    ],
    price: 300000,
    durationHours: 5,
    location: "Beliung",
    rating: 4.7,
    reviewCount: 118,
    highlights: [
      "Hilltop 360° panorama",
      "Guided jungle trail",
      "Sunrise or sunset option",
      "Photo stops at the summit",
    ],
    includes: [
      "Trekking guide",
      "Drinking water",
      "Private car & driver",
      "Hotel pickup & drop-off",
    ],
    availableDays: ["Thu", "Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 22,
  },
  {
    name: "Putri Island",
    slug: "putri-island",
    tagline: "A private-island feel — white sand, clear water and a seafood lunch.",
    description:
      "A short boat ride from Batam delivers you to Putri Island's white-sand coves. Snorkel the shallows, doze under a palm, and sit down to a fresh seafood lunch by the water.",
    category: "Island & Beach",
    imageUrl: img("photo-1473116763249-2faaef81ccda"),
    gallery: [
      img("photo-1473116763249-2faaef81ccda"),
      img("photo-1530521954074-e64f6810b32d"),
      img("photo-1507525428034-b723cf961d3e"),
    ],
    price: 650000,
    durationHours: 7,
    location: "Putri Island",
    rating: 4.9,
    reviewCount: 167,
    highlights: [
      "White-sand coves",
      "Snorkeling in clear shallows",
      "Seafood beach lunch",
      "Boat transfers",
    ],
    includes: [
      "Boat transfers",
      "Snorkeling gear",
      "Seafood lunch",
      "Island guide",
    ],
    availableDays: ["Sat", "Sun"],
    featured: false,
    sortOrder: 23,
  },
  {
    name: "Saung Budaya",
    slug: "saung-budaya",
    tagline: "Malay music, dance and craft — Batam's culture under one roof.",
    description:
      "Saung Budaya showcases the best of Malay culture: live music and dance performances, traditional houses and crafts, and a chance to try your hand at a local instrument.",
    category: "City & Culture",
    imageUrl: img("photo-1466692476868-aef1dfb1e735"),
    gallery: [
      img("photo-1466692476868-aef1dfb1e735"),
      img("photo-1500937386664-56d1dfef3854"),
      img("photo-1519677100203-a0e668c92439"),
    ],
    price: 250000,
    durationHours: 4,
    location: "Batam",
    rating: 4.6,
    reviewCount: 71,
    highlights: [
      "Live Malay music & dance",
      "Traditional house exhibits",
      "Craft demonstrations",
      "Try-a-tool workshop",
    ],
    includes: [
      "Cultural show entry",
      "Guided visit",
      "Local drink",
      "Hotel pickup & drop-off",
    ],
    availableDays: ["Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 24,
  },
  {
    name: "Telaga Biru dan Gurun Pasir",
    slug: "telaga-biru-dan-gurun-pasir",
    tagline: "A surreal blue lake ringed by white sand dunes.",
    description:
      "Once a sand quarry, now one of Batam's most surreal sights: a vivid blue lake cupped by white dunes that feels more like a desert than an island. A photographer's dream, especially at golden hour.",
    category: "Adventure",
    imageUrl: img("photo-1559827260-dc66d52bef19"),
    gallery: [
      img("photo-1559827260-dc66d52bef19"),
      img("photo-1500375592092-40eb2168fd21"),
      img("photo-1519452575417-564c1401ecc0"),
    ],
    price: 275000,
    durationHours: 4,
    location: "Sekupang",
    rating: 4.8,
    reviewCount: 146,
    highlights: [
      "Surreal blue lake",
      "White sand dunes",
      "Golden-hour photography",
      "Easy walking paths",
    ],
    includes: [
      "Private car & driver",
      "English-speaking guide",
      "Hotel pickup & drop-off",
      "Bottled water",
    ],
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 25,
  },
  {
    name: "Treasure Bay",
    slug: "treasure-bay",
    tagline: "Asia's biggest crystal lagoon, with slides, kayaks and poolside lounging.",
    description:
      "Treasure Bay Bintan is a giant man-made crystal lagoon: swim in the impossibly clear water, ride the inflatable obstacle course, paddle a kayak, or simply float with a drink in hand.",
    category: "Island & Beach",
    imageUrl: img("photo-1540541338287-41700207dee6"),
    gallery: [
      img("photo-1540541338287-41700207dee6"),
      img("photo-1507525428034-b723cf961d3e"),
      img("photo-1519046904884-53103b34b206"),
    ],
    price: 800000,
    durationHours: 8,
    location: "Lagoi, Bintan",
    rating: 4.8,
    reviewCount: 152,
    highlights: [
      "Crystal Lagoon swim",
      "Inflatable obstacle course",
      "Kayaks & paddleboards",
      "Poolside lounging",
    ],
    includes: [
      "Lagoon day pass",
      "Kayak rental",
      "Ferry transfers",
      "Lunch",
    ],
    availableDays: ["Sat", "Sun"],
    featured: false,
    sortOrder: 26,
  },
  {
    name: "Viovio Beach",
    slug: "viovio-beach",
    tagline: "A breezy Nongsa beach club for easy days and golden sunsets.",
    description:
      "Viovio Beach keeps it simple and sunny: soft sand, beach beds, a bar that does cold drinks and grilled snacks, and front-row seats for the sunset over the strait.",
    category: "Island & Beach",
    imageUrl: img("photo-1510414842594-a61c69b5ae57"),
    gallery: [
      img("photo-1510414842594-a61c69b5ae57"),
      img("photo-1544551763-46a013bb70d5"),
      img("photo-1506929562872-bb421503ef21"),
    ],
    price: 400000,
    durationHours: 6,
    location: "Nongsa",
    rating: 4.7,
    reviewCount: 129,
    highlights: [
      "Beach beds & loungers",
      "Beach bar & snacks",
      "Sunset front-row seats",
      "Calm swimming water",
    ],
    includes: [
      "Beach day pass",
      "1 welcome drink",
      "Private car & driver",
      "Hotel pickup & drop-off",
    ],
    availableDays: ["Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 27,
  },
];
