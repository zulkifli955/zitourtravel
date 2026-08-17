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
 * Sync-style seed for the tours catalog. Inserts missing tours, updates the
 * photo/caption fields on existing rows, and removes rows whose slug is no
 * longer part of SEED_TOURS — so the table always mirrors the catalog.
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
        // Keep photos and captions in sync with the latest seed data.
        if (
          cur.imageUrl !== tour.imageUrl ||
          cur.gallery?.join("|") !== tour.gallery.join("|") ||
          cur.description !== tour.description
        ) {
          await ctx.db.patch(cur._id, {
            imageUrl: tour.imageUrl,
            gallery: tour.gallery,
            description: tour.description,
          });
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

const asset = (name: string) => `/assets/${name}`;

/** 21 attractions, sorted alphabetically by name. */
const SEED_TOURS = [
  {
    name: "Barelang Bridge",
    slug: "barelang-bridge",
    tagline: "Six bridges link Batam to its southern islets — Batam's most photographed drive.",
    description:
      "Salah satu ikon Batam yang wajib dikunjungi. Nikmati panorama laut dan pemandangan khas kepulauan sambil mengabadikan momen perjalanan.",
    category: "City & Culture",
    imageUrl: asset("barelang1.webp"),
    gallery: [asset("barelang1.webp"), asset("barelang2.webp"), asset("barelang3.webp")],
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
    sortOrder: 1,
  },
  {
    name: "Batam Zoo Paradise",
    slug: "batam-zoo-paradise",
    tagline: "Tigers, birds and big cats in a shady zoo that kids never want to leave.",
    description:
      "Destinasi wisata keluarga yang cocok untuk mengenal berbagai jenis satwa sekaligus menikmati waktu santai bersama keluarga.",
    category: "Family Fun",
    imageUrl: asset("batamzoo1.webp"),
    gallery: [asset("batamzoo1.webp"), asset("batamzoo2.webp"), asset("batamzoo3.webp")],
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
    sortOrder: 2,
  },
  {
    name: "Bluefire Beach Club Batam",
    slug: "bluefire-beach-club-batam",
    tagline: "The full Bluefire experience — infinity pool, beachfront dining and live music.",
    description:
      "Destinasi dengan suasana unik dan menarik untuk dikunjungi, cocok untuk bersantai, berfoto, dan menikmati pengalaman berbeda selama berada di Batam.",
    category: "Island & Beach",
    imageUrl: asset("blufire1.webp"),
    gallery: [asset("blufire1.webp"), asset("blufire2.webp"), asset("blufire3.webp")],
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
    sortOrder: 3,
  },
  {
    name: "Dino's Gate",
    slug: "dinos-gate",
    tagline: "Walk among roaring dinosaurs at Batam's prehistoric theme park.",
    description:
      "Tempat wisata bertema dinosaurus yang cocok untuk keluarga, terutama anak-anak. Nikmati suasana seru sambil mengabadikan berbagai momen menarik.",
    category: "Family Fun",
    imageUrl: asset("dino1.webp"),
    gallery: [asset("dino1.webp"), asset("dino2.webp"), asset("dino3.webp")],
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
    sortOrder: 4,
  },
  {
    name: "Gocart",
    slug: "gocart",
    tagline: "Put your foot down on Batam's go-kart track — laps, helmets and bragging rights.",
    description:
      "Rasakan keseruan memacu adrenalin di lintasan go-kart. Pilihan yang tepat untuk Anda yang ingin menambahkan aktivitas seru bersama teman atau keluarga.",
    category: "Adventure",
    imageUrl: asset("gocart1.jpg"),
    gallery: [asset("gocart1.jpg"), asset("gocart2.jpg"), asset("gocart3.jpg")],
    price: 350000,
    durationHours: 2,
    location: "Batam",
    rating: 4.6,
    reviewCount: 96,
    highlights: [
      "Go-kart racing laps",
      "Safety briefing & helmet",
      "Karts for kids & adults",
      "Race results & bragging rights",
    ],
    includes: [
      "Kart rental & fuel",
      "Helmet & safety gear",
      "Race briefing",
      "Hotel pickup & drop-off",
    ],
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 5,
  },
  {
    name: "Grand Mall Nagoya Hill & Nagoya Thamrin",
    slug: "grand-mall-nagoya-hill-nagoya-thamrin",
    tagline: "Two of Nagoya's biggest malls — duty-free shopping, food courts and bargain hunting.",
    description:
      "Grand Mall Batam\nSalah satu pusat perbelanjaan yang cocok untuk melengkapi perjalanan wisata di Batam. Nikmati berbagai pilihan toko, kuliner, dan hiburan dalam suasana yang nyaman bersama keluarga maupun teman.\n\nNagoya Hill Shopping Mall\nDestinasi favorit untuk berbelanja dan menikmati kuliner di pusat kota Batam. Dengan pilihan toko dan tempat makan yang beragam, Nagoya Hill cocok menjadi tempat untuk bersantai sekaligus mencari oleh-oleh.\n\nNagoya Thamrin\nKawasan yang berada di jantung Kota Batam dengan suasana perkotaan yang ramai. Cocok untuk menikmati kuliner, berbelanja, dan merasakan atmosfer pusat kota Batam.",
    category: "City & Culture",
    imageUrl: asset("mall1.jpg"),
    gallery: [asset("mall1.jpg"), asset("mall2.jpg"), asset("mall3.jpg")],
    price: 250000,
    durationHours: 4,
    location: "Nagoya",
    rating: 4.6,
    reviewCount: 118,
    highlights: [
      "Grand Mall Nagoya Hill shopping",
      "Nagoya Thamrin City & food court",
      "Duty-free & souvenir hunting",
      "Local snack & coffee break",
    ],
    includes: [
      "Private car & driver",
      "English-speaking guide",
      "Hotel pickup & drop-off",
      "Bottled water",
    ],
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 6,
  },
  {
    name: "Infinity Beach Club",
    slug: "infinity-beach-club",
    tagline: "An infinity pool that melts into the sea, plus beach service all day.",
    description:
      "Nikmati suasana pantai yang santai dengan pemandangan laut dan udara terbuka. Tempat yang pas untuk melepas penat dan menikmati waktu bersama orang terdekat.",
    category: "Island & Beach",
    imageUrl: asset("infinity1.webp"),
    gallery: [asset("infinity1.webp"), asset("infinity2.webp"), asset("infinity3.webp")],
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
    sortOrder: 7,
  },
  {
    name: "Jet Ski Barelang/GP",
    slug: "jet-ski-barelang-gp",
    tagline: "Ride the waves beneath Barelang's bridges — jet ski thrills with sea views.",
    description:
      "Tambahkan keseruan perjalanan dengan aktivitas air yang memacu adrenalin. Rasakan sensasi mengendarai jet ski sambil menikmati pemandangan laut Batam.",
    category: "Adventure",
    imageUrl: asset("jetski1.webp"),
    gallery: [asset("jetski1.webp"), asset("jetski2.webp"), asset("jetski3.webp")],
    price: 500000,
    durationHours: 2,
    location: "Barelang",
    rating: 4.7,
    reviewCount: 74,
    highlights: [
      "Jet ski session on the bay",
      "Life jacket & safety briefing",
      "Beginner lesson included",
      "Barelang bridge views",
    ],
    includes: [
      "Jet ski rental",
      "Life jacket & safety gear",
      "Instructor & briefing",
      "Hotel pickup & drop-off",
    ],
    availableDays: ["Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 8,
  },
  {
    name: "Kampung Sawah",
    slug: "kampung-sawah",
    tagline: "Green rice paddies, water buffalo and village calm just outside the city.",
    description:
      "Hadirkan suasana pedesaan di tengah perjalanan Anda. Nuansa hijau dan lingkungan yang santai menjadikannya tempat yang menarik untuk berfoto dan bersantai.",
    category: "Family Fun",
    imageUrl: asset("kampung1.webp"),
    gallery: [asset("kampung1.webp"), asset("kampung2.webp"), asset("kampung3.webp")],
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
    sortOrder: 9,
  },
  {
    name: "Lagoi Bay",
    slug: "lagoi-bay",
    tagline: "Golden sand and calm bays on Bintan's resort coast, an hour from Batam.",
    description:
      "Nikmati pesona kawasan wisata Lagoi dengan suasana tropis, pantai, dan berbagai pilihan aktivitas yang cocok untuk liburan maupun staycation.",
    category: "Island & Beach",
    imageUrl: asset("lagoi1.webp"),
    gallery: [asset("lagoi1.webp"), asset("lagoi2.webp"), asset("lagoi3.webp")],
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
    sortOrder: 10,
  },
  {
    name: "Masjid Agung Raja Batam",
    slug: "masjid-agung-raja-batam",
    tagline: "Batam's grand mosque, with its soaring dome and waterfront setting.",
    description:
      "Salah satu landmark penting Batam dengan arsitektur yang menarik. Cocok menjadi bagian dari perjalanan wisata religi sekaligus mengenal sisi ikonik kota Batam.",
    category: "City & Culture",
    imageUrl: asset("masjidagung1.webp"),
    gallery: [asset("masjidagung1.webp"), asset("masjidagung2.webp"), asset("masjidagung3.webp")],
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
    sortOrder: 11,
  },
  {
    name: "Masjid Raja Sultan",
    slug: "masjid-raja-sultan",
    tagline: "A regal mosque and a lesson in Batam's royal heritage.",
    description:
      "Masjid megah dengan arsitektur yang mengesankan dan menjadi salah satu destinasi wisata religi yang menarik untuk dikunjungi di Batam.",
    category: "City & Culture",
    imageUrl: asset("masjidraya1.webp"),
    gallery: [asset("masjidraya1.webp"), asset("masjidraya2.webp"), asset("masjidraya3.webp")],
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
    sortOrder: 12,
  },
  {
    name: "Masjid Tancak",
    slug: "masjid-tancak",
    tagline: "A waterside mosque rising from the ponds of Tembesi — one of Batam's most photographed sights.",
    description:
      "Memiliki desain arsitektur yang khas dan unik, menjadikannya salah satu ikon wisata religi sekaligus spot foto menarik di Batam.",
    category: "City & Culture",
    imageUrl: asset("tanjak1.webp"),
    gallery: [asset("tanjak1.webp"), asset("tanjak2.webp"), asset("tanjak3.webp")],
    price: 200000,
    durationHours: 3,
    location: "Tembesi",
    rating: 4.7,
    reviewCount: 88,
    highlights: [
      "Iconic waterside setting",
      "Dome & minaret photo stops",
      "Sunset reflections on the pond",
      "Respectful guided visit",
    ],
    includes: [
      "Private car & driver",
      "English-speaking guide",
      "Hotel pickup & drop-off",
      "Bottled water",
    ],
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 13,
  },
  {
    name: "Patung Seribu",
    slug: "patung-seribu",
    tagline: "A thousand serene statues at Batam's grandest temple complex.",
    description:
      "Destinasi dengan suasana yang unik dan berbeda. Deretan patung serta lingkungan sekitarnya menawarkan pengalaman wisata yang menarik bagi para pengunjung.",
    category: "City & Culture",
    imageUrl: asset("patun1.webp"),
    gallery: [asset("patun1.webp"), asset("patun2.webp"), asset("patun3.webp")],
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
    sortOrder: 14,
  },
  {
    name: "Pulau Penyengat",
    slug: "pulau-penyengat",
    tagline: "A historic island of yellow mosques and royal tombs, across the strait.",
    description:
      "Jelajahi pulau yang kaya akan sejarah dan budaya Melayu. Temukan berbagai peninggalan bersejarah sekaligus menikmati suasana khas Pulau Penyengat.",
    category: "Island & Beach",
    imageUrl: asset("pulau1.webp"),
    gallery: [asset("pulau1.webp"), asset("pulau2.webp"), asset("pulau3.webp")],
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
    sortOrder: 15,
  },
  {
    name: "Puncak Beliung",
    slug: "puncak-beliung",
    tagline: "A gentle climb to Batam's best hilltop panorama.",
    description:
      "Nikmati panorama Batam dari ketinggian. Suasana yang sejuk dan pemandangan alam menjadikannya pilihan menarik untuk bersantai dan menikmati matahari terbenam.",
    category: "Adventure",
    imageUrl: asset("puncak1.webp"),
    gallery: [asset("puncak1.webp"), asset("puncak2.webp"), asset("puncak3.webp")],
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
    sortOrder: 16,
  },
  {
    name: "Saung Budaya",
    slug: "saung-budaya",
    tagline: "Malay music, dance and craft — Batam's culture under one roof.",
    description:
      "Tempat yang cocok untuk mengenal lebih dekat budaya dan tradisi lokal. Nikmati pengalaman wisata yang berbeda sambil mengenal kekayaan budaya Kepulauan Riau.",
    category: "City & Culture",
    imageUrl: asset("saung1.webp"),
    gallery: [asset("saung1.webp"), asset("saung2.webp"), asset("saung3.webp")],
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
    sortOrder: 17,
  },
  {
    name: "Telaga Biru dan Gurun Pasir",
    slug: "telaga-biru-dan-gurun-pasir",
    tagline: "A surreal blue lake ringed by white sand dunes.",
    description:
      "Saksikan perpaduan pemandangan yang unik antara telaga dengan warna air yang menarik dan hamparan pasir yang memberikan nuansa seperti gurun.",
    category: "Adventure",
    imageUrl: asset("telaga1.webp"),
    gallery: [asset("telaga1.webp"), asset("telaga2.webp"), asset("telaga3.webp")],
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
    sortOrder: 18,
  },
  {
    name: "Tepi Danau",
    slug: "tepi-danau",
    tagline: "Relax by the lake — cool breezes, calm water and easy photo stops.",
    description:
      "Tempat yang cocok bagi Anda yang ingin menikmati suasana santai dan pemandangan danau. Nikmati udara terbuka, suasana yang tenang, serta momen berkumpul bersama keluarga atau orang terdekat.",
    category: "City & Culture",
    imageUrl: asset("tepi1.jpg"),
    gallery: [asset("tepi1.jpg"), asset("tepi2.jpg")],
    price: 200000,
    durationHours: 3,
    location: "Batam",
    rating: 4.6,
    reviewCount: 87,
    highlights: [
      "Lakeside stroll & photo stops",
      "Cool breezes by the water",
      "Family-friendly walkways",
      "Sunset views",
    ],
    includes: [
      "Private car & driver",
      "English-speaking guide",
      "Hotel pickup & drop-off",
      "Bottled water",
    ],
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 19,
  },
  {
    name: "Treasure Bay",
    slug: "treasure-bay",
    tagline: "Asia's biggest crystal lagoon, with slides, kayaks and poolside lounging.",
    description:
      "Destinasi wisata tropis dengan kawasan luas dan berbagai aktivitas rekreasi. Cocok untuk menikmati liburan bersama keluarga, pasangan, maupun teman.",
    category: "Island & Beach",
    imageUrl: asset("trea1.webp"),
    gallery: [asset("trea1.webp"), asset("trea2.webp"), asset("trea3.webp")],
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
    sortOrder: 20,
  },
  {
    name: "Welcome To Batam",
    slug: "welcome-to-batam",
    tagline: "The perfect first day — city icons, culture and sea views in one easy loop.",
    description:
      "Salah satu ikon kota Batam yang wajib dikunjungi. Abadikan momen dengan latar tulisan Welcome to Batam dan nikmati suasana kawasan sekitarnya.",
    category: "City & Culture",
    imageUrl: asset("wtb1.webp"),
    gallery: [asset("wtb1.webp"), asset("wtb2.webp"), asset("wtb3.webp")],
    price: 350000,
    durationHours: 6,
    location: "Batam Centre",
    rating: 4.8,
    reviewCount: 212,
    highlights: [
      "City landmark photo stops",
      "Temple & mosque visits",
      "Sunset sea viewpoint",
      "Local snack break",
    ],
    includes: [
      "Private car & driver",
      "English-speaking guide",
      "Hotel pickup & drop-off",
      "Bottled water",
    ],
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    featured: false,
    sortOrder: 21,
  },
];
