import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import { TourCard } from "@/components/tours/TourCard";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { cn, formatIDR } from "@/lib/utils";
import { CONTACT, MAPS_EMBED_URL, MAPS_LINK, waLink } from "@/lib/site";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgePercent,
  CarFront,
  Clock,
  Compass,
  Headset,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "react-router";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const BRIDGE_IMAGE =
  "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=2400&auto=format&fit=crop";

const DRIVER_IMAGE =
  "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1600&auto=format&fit=crop";

const FEATURES = [
  {
    icon: Compass,
    title: "Local guides",
    copy: "Real Batam locals who know every shortcut, stall and photo spot worth stopping for.",
  },
  {
    icon: BadgePercent,
    title: "Best price, no surprises",
    copy: "All-in pricing with zero hidden fees. You only pay on arrival, once the tour starts.",
  },
  {
    icon: Headset,
    title: "24/7 WhatsApp support",
    copy: "Questions before, during or after your tour? We're one message away, every day.",
  },
];

const STEPS = [
  {
    n: "01",
    icon: Compass,
    title: "Pick your tour",
    copy: "Browse the catalog, compare prices and read what other travelers loved.",
  },
  {
    n: "02",
    icon: MessageCircle,
    title: "Reserve on WhatsApp",
    copy: "Message us your date and group size. We confirm within minutes — pay on arrival.",
  },
  {
    n: "03",
    icon: CarFront,
    title: "Explore Batam",
    copy: "Your guide and private car pick you up at your hotel, exactly on time.",
  },
];

/** Daily rates (private car with driver). TODO: replace with real fleet photos. */
const FLEET = [
  {
    name: "Toyota Avanza All New",
    image:
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1200&auto=format&fit=crop",
    idr: 400000,
    rm: 115,
    sgd: 34,
  },
  {
    name: "Toyota Terios",
    image:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop",
    idr: 450000,
    rm: 130,
    sgd: 39,
  },
  {
    name: "Daihatsu Xenia",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop",
    idr: 400000,
    rm: 115,
    sgd: 34,
  },
  {
    name: "Toyota Innova",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop",
    idr: 600000,
    rm: 175,
    sgd: 52,
  },
  {
    name: "Toyota Zenix",
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1200&auto=format&fit=crop",
    idr: 750000,
    rm: 220,
    sgd: 65,
  },
];

/** Pre-filled WhatsApp message for fleet bookings. */
const FLEET_BOOKING_MESSAGE =
  "Halo Zi Tour Travel Batam, saya tertarik dengan paket tour Anda. Mohon info paket yang tersedia beserta harga, dan apakah tersedia untuk kunjungan pada tanggal [isi tanggal]? Terima kasih";

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  copy,
  center = false,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  center?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
        <span className="text-primary/50">//&nbsp;</span>
        {eyebrow}
      </p>
      <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {copy && (
        <p className="mt-4 text-pretty text-base leading-7 text-muted-foreground">
          {copy}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section id="top" className="pt-16">
      <div className="relative overflow-hidden">
        <img
          src={BRIDGE_IMAGE}
          alt="Barelang Bridge stretching across the sea in Batam"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/75 via-black/45 to-black/70" />

        <div className="relative mx-auto flex min-h-[560px] w-full max-w-6xl flex-col justify-center px-4 pb-16 pt-12 sm:px-6 lg:min-h-[600px]">
          <div className="max-w-2xl">
            <Reveal>
              <Badge className="gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                <MapPin className="size-3.5 text-teal-300" />
                Batam, Indonesia · 45 min from Singapore
              </Badge>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.4rem] lg:leading-[1.06]">
                Batam&apos;s best day tours,{" "}
                <span className="text-teal-300">without the planning.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
                From Barelang&apos;s bridges to Nongsa&apos;s beaches — a
                catalog of private, guided day trips. Browse, pick one, and
                message us on WhatsApp.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-full bg-white px-6 text-sm text-foreground shadow-sm hover:bg-white/90 hover:text-foreground"
                >
                  <a href="#tours">
                    Browse tours <ArrowRight />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-full border-white/40 bg-transparent px-6 text-sm text-white hover:bg-white/10 hover:text-white"
                >
                  <a href={waLink()} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="text-teal-300" /> Chat on
                    WhatsApp
                  </a>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Tours                                                               */
/* ------------------------------------------------------------------ */

function TourGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border bg-card p-0 shadow-sm"
        >
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Gallery({ tours }: { tours?: Doc<"tours">[] }) {
  const featured = (tours ?? []).filter((tour) => tour.featured).slice(0, 3);
  const slides = featured.flatMap((tour) => {
    const photos =
      tour.gallery && tour.gallery.length > 0
        ? tour.gallery
        : [tour.imageUrl];
    return photos.map((src) => ({ src, label: tour.name }));
  });

  return (
    <section id="gallery" className="scroll-mt-24 py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeader eyebrow="gallery" title="Gallery" />
        </Reveal>
        <div className="mx-auto mt-10 max-w-4xl">
          {tours === undefined ? (
            <Skeleton className="aspect-[16/9] w-full rounded-3xl" />
          ) : slides.length > 0 ? (
            <Reveal>
              <PhotoCarousel
                photos={slides.map((slide) => slide.src)}
                alt="Batam destinations"
                itemClassName="aspect-[16/9] rounded-3xl border border-border/60 shadow-sm"
              />
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function BrowseTours({ tours }: { tours?: Doc<"tours">[] }) {
  return (
    <section id="tours" className="scroll-mt-24 bg-muted/50 py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeader
            eyebrow="catalog"
            title="Browse every tour we run"
            copy="Every package is private, guided and priced per person."
          />
        </Reveal>

        <div className="mt-10">
          {tours === undefined ? (
            <TourGridSkeleton />
          ) : tours.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
              <p className="text-base font-semibold tracking-tight">
                No tours yet
              </p>
              <p className="text-sm text-muted-foreground">
                Check back soon — new packages are on the way.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tours.map((tour, i) => (
                <Reveal key={tour._id} delay={(i % 3) * 0.06} className="h-full">
                  <TourCard tour={tour} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Why / How / Reviews / Location                                      */
/* ------------------------------------------------------------------ */

function WhyZiTour() {
  return (
    <section id="why" className="scroll-mt-24 py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeader
            eyebrow="why us"
            title="A local team that treats your day like their own"
            copy="Three reasons travelers keep coming back to Zi Tour."
          />
        </Reveal>
        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[1.05fr_1fr]">
          <Reveal className="h-full">
            <div className="relative h-full min-h-[320px] overflow-hidden rounded-3xl border border-border/70 shadow-sm">
              <img
                src={DRIVER_IMAGE}
                alt="Zi Tour driver at the wheel of a private car in Batam"
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-x-4 bottom-4">
                <div className="rounded-2xl border border-white/15 bg-black/55 px-5 py-4 text-white backdrop-blur-sm">
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-teal-300">
                    // your private driver
                  </p>
                  <p className="mt-1 text-sm font-medium leading-6 text-white/90">
                    Every tour comes with its own car and a driver who knows
                    Batam like the back of their hand.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
          <div className="flex flex-col gap-6">
            {FEATURES.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 0.06} className="h-full">
                <div className="flex h-full flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-start">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <feature.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {feature.copy}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-24 bg-muted/50 py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeader
            eyebrow="how it works"
            title="From browsing to beach in three steps"
            copy="No booking portals, no deposits — just a conversation and a car."
            center
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.08} className="h-full">
              <div className="relative flex h-full flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
                <span className="absolute right-5 top-4 font-mono text-4xl font-bold tracking-tight text-primary/15">
                  {step.n}
                </span>
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <step.icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {step.copy}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Fleet() {
  return (
    <section id="armada" className="scroll-mt-24 bg-muted/50 py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeader
            eyebrow="armada"
            title="Armada Zi Tour Travel"
            copy="Rent a car with a private driver for the day — fuel and pickup anywhere in Batam included. Rates shown per day."
            center
          />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FLEET.map((car, i) => (
            <Reveal key={car.name} delay={i * 0.06} className="h-full">
              <div className="flex h-full flex-col gap-5 overflow-hidden rounded-2xl border border-border/70 bg-card p-0 shadow-sm transition-shadow hover:shadow-md">
                <div className="aspect-[16/10] shrink-0 overflow-hidden bg-muted">
                  <img
                    src={car.image}
                    alt={car.name}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-5 px-6 pb-6">
                  <div>
                    <h3 className="text-base font-semibold tracking-tight">
                      {car.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Private car with driver · per day
                    </p>
                  </div>
                  <div className="mt-auto">
                  <div className="grid grid-cols-3 gap-2 rounded-xl border bg-muted/50 p-3 text-center">
                    <div>
                      <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        IDR
                      </p>
                      <p className="mt-1 text-sm font-bold tracking-tight">
                        {formatIDR(car.idr)}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        RM
                      </p>
                      <p className="mt-1 text-sm font-bold tracking-tight">
                        RM {car.rm}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        SGD
                      </p>
                      <p className="mt-1 text-sm font-bold tracking-tight">
                        SGD {car.sgd}
                      </p>
                    </div>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full rounded-full"
                  >
                    <a
                      href={waLink(undefined, FLEET_BOOKING_MESSAGE)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="size-4" /> Booking
                    </a>
                  </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Location() {
  return (
    <section id="location" className="scroll-mt-24 bg-muted/50 py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeader
            eyebrow="location"
            title="Find us in Tanjung Piayu"
            copy="Drop by our base in Batam before or after your tour — or just message us."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="relative min-h-[320px] overflow-hidden rounded-2xl border bg-muted shadow-sm lg:min-h-[420px]">
              <iframe
                src={MAPS_EMBED_URL}
                title="Map showing the Zi Tour Travel office at Buana Garden, Block Orchid No. 082, Tanjung Piayu, Batam"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full border-0"
              />
            </div>
            <div className="flex flex-col justify-center gap-6 rounded-2xl border bg-card p-7 shadow-sm">
              <div>
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="size-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">
                  Zi Tour Travel · Base
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Buana Garden, Block Orchid No. 082
                  <br />
                  Tanjung Piayu, Batam, Kepulauan Riau
                </p>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2.5">
                  <Phone className="size-4 shrink-0 text-primary" />
                  {CONTACT.phone}
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="size-4 shrink-0 text-primary" />
                  {CONTACT.hours}
                </li>
              </ul>
              <Button asChild variant="outline" className="w-fit rounded-full">
                <a
                  href={MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Google Maps <ArrowRight />
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CTA                                                                 */
/* ------------------------------------------------------------------ */

function CtaBand() {
  return (
    <section className="pb-20 lg:pb-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center sm:px-14">
            <div className="pointer-events-none absolute -left-20 -top-24 size-72 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-28 -right-16 size-80 rounded-full bg-white/10 blur-2xl" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Your next Batam day is one message away.
              </h2>
              <p className="mt-4 text-pretty text-base leading-7 text-primary-foreground/85">
                Pick a tour, tell us when you&apos;re free, and we&apos;ll
                handle the rest.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button
                  asChild
                  className="h-12 rounded-full bg-white px-6 text-sm text-primary shadow-sm hover:bg-white/90 hover:text-primary"
                >
                  <a href="#tours">
                    Browse tours <ArrowRight />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-full border-white/40 bg-transparent px-6 text-sm text-white hover:bg-white/10 hover:text-white"
                >
                  <a href={waLink()} target="_blank" rel="noopener noreferrer">
                    <MessageCircle /> Chat on WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Landing() {
  const tours = useQuery(api.tours.list, {});
  const seedTours = useMutation(api.tours.seed);
  const location = useLocation();

  // Seed the catalog (and backfill new fields) so the site works in any
  // environment, including on data seeded before newer fields existed.
  useEffect(() => {
    if (
      tours !== undefined &&
      (tours.length === 0 ||
        tours.some((tour) => !tour.gallery || tour.gallery.length === 0))
    ) {
      void seedTours();
    }
  }, [tours, seedTours]);

  // Scroll to the anchor when landing via "/#tours" style links from
  // another page (the browser can't do this before the SPA renders).
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main>
        <Hero />
        <Fleet />
        <Gallery tours={tours} />
        <BrowseTours tours={tours} />
        <WhyZiTour />
        <HowItWorks />
        <Location />
        <CtaBand />
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </div>
  );
}
