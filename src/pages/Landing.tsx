import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TourCard } from "@/components/tours/TourCard";
import { useAuth } from "@/hooks/use-auth";
import { cn, formatIDR } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgePercent,
  CarFront,
  Compass,
  Headset,
  MapPin,
  Menu,
  MessageCircle,
  Search,
  Ship,
  Star,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

/** TODO: replace with the agency's real WhatsApp Business number. */
const WHATSAPP_NUMBER = "6281234567890";

const CONTACT = {
  address:
    "Ruko Mega Legenda Blok F No. 12, Batam Centre, Batam, Kepulauan Riau 29444",
  phone: "+62 812-3456-7890",
  email: "hello@gematravelbatam.com",
  hours: "Mon–Sun · 08:00–21:00 WIB",
};

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1800&auto=format&fit=crop";

const STATS = [
  { value: "12+", label: "Years guiding Batam" },
  { value: "10,000+", label: "Travelers hosted" },
  { value: "30+", label: "Tours & experiences" },
  { value: "4.9/5", label: "Average rating" },
];

const FEATURES = [
  {
    icon: Compass,
    title: "Local guides",
    copy: "Real Batam locals who know every shortcut, stall and photo spot worth stopping for.",
  },
  {
    icon: CarFront,
    title: "Private & flexible",
    copy: "Your own car, your own pace. Swap stops, linger longer, or add one on the fly.",
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

const REVIEWS = [
  {
    initials: "SL",
    name: "Sarah Lim",
    origin: "Singapore",
    quote:
      "Booking took two minutes on WhatsApp and our guide was waiting at the hotel on time. The temple tour was the highlight of our Batam trip.",
  },
  {
    initials: "BS",
    name: "Budi Santoso",
    origin: "Jakarta",
    quote:
      "We took the Barelang bridge drive with the kids — private car, patient driver, great photo stops. Exactly what we wanted, zero hassle.",
  },
  {
    initials: "MC",
    name: "Mei Chen",
    origin: "Kuala Lumpur",
    quote:
      "The Nongsa water sports day was flawless: gear, lunch, transfers, all organized. We're already planning Pulau Abang next.",
  },
];

const AVATAR_TINTS = [
  "bg-primary text-primary-foreground",
  "bg-accent text-accent-foreground",
  "bg-secondary text-secondary-foreground",
  "bg-primary/60 text-primary-foreground",
];

function waLink(tour?: { name: string; price?: number }) {
  const text = tour
    ? `Halo Zi Tour! Saya ingin memesan paket "${tour.name}"${
        tour.price ? ` (${formatIDR(tour.price)})` : ""
      }. Mohon info ketersediaan ya.`
    : "Halo Zi Tour! Saya ingin bertanya tentang paket tur di Batam.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

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
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
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

function Stars({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      aria-label="Rated 5 out of 5 stars"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Navbar                                                              */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { label: "Tours", href: "#tours" },
  { label: "Featured", href: "#featured" },
  { label: "Why Zi Tour", href: "#why" },
  { label: "Reviews", href: "#reviews" },
];

function Navbar() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Compass className="size-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">Zi Tour</span>
          <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
            · Batam
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard">My dashboard</Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
          <Button asChild size="sm" className="rounded-full px-4">
            <a href="#tours">Browse tours</a>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader className="border-b">
              <SheetTitle>Zi Tour · Batam</SheetTitle>
              <SheetDescription>
                Day tours & experiences across Batam, Indonesia.
              </SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-4 flex flex-col gap-2 border-t pt-4">
                {isAuthenticated ? (
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link to="/dashboard">My dashboard</Link>
                  </Button>
                ) : (
                  <Button asChild variant="outline" onClick={() => setOpen(false)}>
                    <Link to="/auth">Sign in</Link>
                  </Button>
                )}
                <Button asChild onClick={() => setOpen(false)}>
                  <a href="#tours">Browse tours</a>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-16">
      <div className="pointer-events-none absolute -top-24 right-[-8%] size-[26rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute left-[-10%] top-48 size-96 rounded-full bg-accent/60 blur-3xl" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:pb-20 lg:pt-20">
        <div>
          <Reveal>
            <Badge
              variant="secondary"
              className="gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
            >
              <MapPin className="size-3.5 text-primary" />
              Batam, Indonesia · 45 min from Singapore
            </Badge>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.4rem] lg:leading-[1.06]">
              Your Batam adventure,{" "}
              <span className="text-primary">sorted in minutes.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              From Barelang&apos;s bridges to Nongsa&apos;s beaches — handpicked
              day tours, private cars and local guides. Pick a package, message
              us on WhatsApp, and you&apos;re set.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="h-12 rounded-full px-6 text-sm">
                <a href="#tours">
                  Browse tours <ArrowRight />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 rounded-full px-6 text-sm"
              >
                <a href={waLink()} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="text-primary" /> Chat on WhatsApp
                </a>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-9 flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {["SL", "BS", "MC", "AR"].map((initials, i) => (
                  <span
                    key={initials}
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full border-2 border-background text-[11px] font-semibold",
                      AVATAR_TINTS[i % AVATAR_TINTS.length],
                    )}
                  >
                    {initials}
                  </span>
                ))}
              </div>
              <div className="text-sm">
                <Stars />
                <p className="mt-0.5 text-muted-foreground">
                  <span className="font-semibold text-foreground">4.9/5</span>{" "}
                  from 2,300+ travelers
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-border/60 bg-muted shadow-lg">
              <img
                src={HERO_IMAGE}
                alt="Tropical beach on Batam island"
                className="size-full object-cover"
              />
            </div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute -bottom-7 -left-3 w-60 rounded-2xl border border-border/70 bg-card/95 p-4 shadow-md backdrop-blur sm:-left-8 sm:w-64"
            >
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Most booked this week
              </p>
              <p className="mt-1.5 text-sm font-semibold leading-snug tracking-tight">
                Barelang Bridge &amp; Coastal Drive
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">4.8</span>
                  <span className="text-muted-foreground">(428)</span>
                </span>
                <span className="text-sm font-bold tracking-tight">
                  {formatIDR(300000)}
                </span>
              </div>
            </motion.div>

            <div className="absolute -top-4 right-4 flex items-center gap-2 rounded-full border border-border/70 bg-card/95 px-3.5 py-2 text-xs font-medium shadow-sm backdrop-blur">
              <Ship className="size-4 text-primary" />
              Island &amp; beach tours
            </div>
          </div>
        </Reveal>
      </div>

      {/* Stats strip */}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border md:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1 bg-card px-4 py-6 text-center"
              >
                <span className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {stat.value}
                </span>
                <span className="text-xs font-medium text-muted-foreground sm:text-sm">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
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

function FeaturedTours({ tours }: { tours?: Doc<"tours">[] }) {
  const featured = (tours ?? []).filter((tour) => tour.featured).slice(0, 3);

  return (
    <section id="featured" className="scroll-mt-24 py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow="Featured"
              title="Our most-loved Batam experiences"
              copy="The tours travelers keep booking, again and again."
            />
            <Button asChild variant="outline" className="w-fit rounded-full">
              <a href="#tours">
                View all tours <ArrowRight />
              </a>
            </Button>
          </div>
        </Reveal>
        <div className="mt-10">
          {tours === undefined ? (
            <TourGridSkeleton />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((tour, i) => (
                <Reveal key={tour._id} delay={i * 0.06} className="h-full">
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

function BrowseTours({ tours }: { tours?: Doc<"tours">[] }) {
  const categories = useMemo(
    () => Array.from(new Set((tours ?? []).map((tour) => tour.category))),
    [tours],
  );
  const [active, setActive] = useState("all");
  const visible = useMemo(
    () =>
      (tours ?? []).filter(
        (tour) => active === "all" || tour.category === active,
      ),
    [tours, active],
  );

  return (
    <section id="tours" className="scroll-mt-24 bg-card/60 py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeader
            eyebrow="Browse tours"
            title="Every Batam day trip, in one place"
            copy="Pick a category or scroll the full catalog. Every package is private, guided and priced per person."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActive("all")}
              aria-pressed={active === "all"}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                active === "all"
                  ? "border-transparent bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-border hover:bg-accent hover:text-foreground",
              )}
            >
              All tours
              <span className="ml-1.5 text-xs opacity-70">
                {tours?.length ?? 0}
              </span>
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActive(category)}
                aria-pressed={active === category}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  active === category
                    ? "border-transparent bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-border hover:bg-accent hover:text-foreground",
                )}
              >
                {category}
                <span className="ml-1.5 text-xs opacity-70">
                  {
                    (tours ?? []).filter((tour) => tour.category === category)
                      .length
                  }
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        <p
          className="mt-5 text-sm text-muted-foreground"
          aria-live="polite"
        >
          {tours !== undefined &&
            `${visible.length} tour${visible.length === 1 ? "" : "s"}${
              active === "all" ? " · all categories" : ` · ${active}`
            }`}
        </p>

        <div className="mt-6">
          {tours === undefined ? (
            <TourGridSkeleton />
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <Search className="size-6" />
              </span>
              <div>
                <p className="text-base font-semibold tracking-tight">
                  No tours in this category yet
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try another category, or reset the filter.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => setActive("all")}
              >
                Show all tours
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((tour, i) => (
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
/* Why / How / Reviews                                                 */
/* ------------------------------------------------------------------ */

function WhyZiTour() {
  return (
    <section id="why" className="scroll-mt-24 py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeader
            eyebrow="Why Zi Tour"
            title="A local team that treats your day like their own"
            center
          />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.06} className="h-full">
              <div className="flex h-full flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
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
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-24 bg-card/60 py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeader
            eyebrow="How it works"
            title="From browsing to beach in three steps"
            center
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.08} className="h-full">
              <div className="relative flex h-full flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
                <span className="absolute right-5 top-4 text-4xl font-bold tracking-tight text-primary/15">
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

function Reviews() {
  return (
    <section id="reviews" className="scroll-mt-24 py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeader
            eyebrow="Reviews"
            title="Travelers who came, saw, and came back"
            copy="Real reviews from guests across Singapore, Malaysia and Indonesia."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((review, i) => (
            <Reveal key={review.name} delay={i * 0.08} className="h-full">
              <figure className="flex h-full flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
                <Stars />
                <blockquote className="text-sm leading-6 text-muted-foreground">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3 border-t pt-4">
                  <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {review.initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold tracking-tight">
                      {review.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {review.origin}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CTA + Footer                                                        */
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
                Your Batam day trip starts here.
              </h2>
              <p className="mt-4 text-pretty text-base leading-7 text-primary-foreground/85">
                Pick a tour, message us on WhatsApp, and be on the water by
                tomorrow.
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

function Footer() {
  return (
    <footer id="contact" className="scroll-mt-24 border-t bg-card">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Compass className="size-5" />
              </span>
              <span className="text-lg font-bold tracking-tight">Zi Tour</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
              Day tours &amp; experiences across Batam, run by the Gema Travel
              Batam team since 2014.
            </p>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
            >
              <MessageCircle className="size-4" /> Chat on WhatsApp
            </a>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-tight">Explore</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#tours" className="transition-colors hover:text-foreground">
                  All tours
                </a>
              </li>
              <li>
                <a
                  href="#featured"
                  className="transition-colors hover:text-foreground"
                >
                  Featured tours
                </a>
              </li>
              <li>
                <a href="#why" className="transition-colors hover:text-foreground">
                  Why Zi Tour
                </a>
              </li>
              <li>
                <a
                  href="#reviews"
                  className="transition-colors hover:text-foreground"
                >
                  Traveler reviews
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-tight">Company</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#how" className="transition-colors hover:text-foreground">
                  How it works
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="transition-colors hover:text-foreground"
                >
                  Contact us
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="transition-colors hover:text-foreground"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT.phone.replace(/[^+\d]/g, "")}`}
                  className="transition-colors hover:text-foreground"
                >
                  {CONTACT.phone}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-tight">Visit us</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                {CONTACT.address}
              </li>
              <li className="flex items-center gap-2.5">
                <Users className="size-4 shrink-0 text-primary" />
                {CONTACT.hours}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} Zi Tour Travel Batam · Gema Travel
            Batam. All rights reserved.
          </p>
          <p>Private tours · Local guides · Pay on arrival</p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Landing() {
  const tours = useQuery(api.tours.list, {});
  const seedTours = useMutation(api.tours.seed);

  // Seed the catalog on first load so the site works in any environment.
  useEffect(() => {
    if (tours !== undefined && tours.length === 0) {
      void seedTours();
    }
  }, [tours, seedTours]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <FeaturedTours tours={tours} />
        <BrowseTours tours={tours} />
        <WhyZiTour />
        <HowItWorks />
        <Reviews />
        <CtaBand />
      </main>
      <Footer />
    </div>
  );
}
