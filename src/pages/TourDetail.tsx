import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { TourCard } from "@/components/tours/TourCard";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { formatIDR } from "@/lib/utils";
import { waLink } from "@/lib/site";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  Star,
} from "lucide-react";
import { useMemo } from "react";
import { Link, useParams } from "react-router";

function DetailSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="aspect-[16/9] rounded-3xl sm:aspect-[21/9]" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="mx-auto mt-20 max-w-md rounded-2xl border border-dashed bg-card p-10 text-center">
      <p className="font-mono text-sm text-primary">// 404</p>
      <h1 className="mt-3 text-2xl font-bold tracking-tight">Tour not found</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        The tour you&apos;re looking for doesn&apos;t exist or has been
        unpublished.
      </p>
      <Button asChild className="mt-6 rounded-full">
        <Link to="/#tours">Back to the catalog</Link>
      </Button>
    </div>
  );
}

export default function TourDetail() {
  const { slug } = useParams();
  const tour = useQuery(api.tours.getBySlug, { slug: slug ?? "" });
  const allTours = useQuery(api.tours.list, {});

  const related = useMemo(() => {
    if (!tour || !allTours) return [];
    return allTours
      .filter((item) => item.slug !== tour.slug && item.category === tour.category)
      .slice(0, 3);
  }, [tour, allTours]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-24 sm:px-6">
        <Link
          to="/#tours"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> back to /catalog
        </Link>

        {tour === undefined ? (
          <div className="mt-6">
            <DetailSkeleton />
          </div>
        ) : tour === null ? (
          <NotFound />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mt-6"
          >
            {/* Hero image */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-border/60 bg-muted sm:aspect-[21/9]">
              <img
                src={tour.imageUrl}
                alt={tour.name}
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/15 to-transparent" />
              <div className="absolute inset-x-5 bottom-4 flex flex-wrap items-center gap-2.5">
                <Badge className="border-0 bg-card/90 text-card-foreground shadow-sm backdrop-blur-sm">
                  {tour.category}
                </Badge>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1 text-xs font-medium text-card-foreground shadow-sm backdrop-blur-sm">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  {tour.rating.toFixed(1)} ({tour.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Title block */}
            <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
                  <span className="text-primary/50">//&nbsp;</span>
                  tour — {tour.category}
                </p>
                <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                  {tour.name}
                </h1>
                <p className="mt-3 text-pretty text-base leading-7 text-muted-foreground">
                  {tour.tagline}
                </p>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-primary" /> {tour.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5 text-primary" />{" "}
                    {tour.durationHours}h
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-3.5 text-primary" />{" "}
                    {tour.availableDays.join(" · ")}
                  </span>
                </div>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-mono text-[11px] font-medium text-emerald-400">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
                accepting bookings
              </span>
            </div>

            {/* Body + booking card */}
            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
              <div className="min-w-0 space-y-8">
                <p className="max-w-2xl text-pretty text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                  {tour.description}
                </p>

                <section className="rounded-2xl border bg-card p-6">
                  <h2 className="text-sm font-semibold tracking-tight">
                    Highlights
                  </h2>
                  <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                    {tour.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-muted-foreground"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-sm font-semibold tracking-tight">
                    What&apos;s included
                  </h2>
                  <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                    {tour.includes.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <aside className="h-fit lg:sticky lg:top-24">
                <div className="rounded-2xl border bg-card p-6 shadow-md">
                  <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
                    <span className="text-primary/50">//&nbsp;</span>
                    booking
                  </p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tight">
                      {formatIDR(tour.price)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      / person
                    </span>
                  </div>
                  <Button asChild className="mt-5 h-11 w-full rounded-full">
                    <a
                      href={waLink(tour)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle /> Book on WhatsApp
                    </a>
                  </Button>
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    Pay on arrival · Free cancellation up to 24 hours
                  </p>

                  <dl className="mt-6 space-y-4 border-t pt-5 text-sm">
                    <div className="flex items-start justify-between gap-4">
                      <dt className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="size-4 text-primary" /> Duration
                      </dt>
                      <dd className="text-right font-medium">
                        {tour.durationHours} hours
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="size-4 text-primary" /> Area
                      </dt>
                      <dd className="text-right font-medium">
                        {tour.location}
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="flex items-center gap-2 text-muted-foreground">
                        <CalendarDays className="size-4 text-primary" />{" "}
                        Availability
                      </dt>
                      <dd className="flex flex-wrap justify-end gap-1.5">
                        {tour.availableDays.map((day) => (
                          <span
                            key={day}
                            className="rounded-md border bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted-foreground"
                          >
                            {day}
                          </span>
                        ))}
                      </dd>
                    </div>
                  </dl>

                  <p className="mt-6 border-t pt-4 font-mono text-[11px] text-muted-foreground/70">
                    id: {tour.slug}
                  </p>
                </div>
              </aside>
            </div>

            {/* Related tours */}
            {related.length > 0 && (
              <section className="mt-16">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
                  <span className="text-primary/50">//&nbsp;</span>
                  more like this
                </p>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((item) => (
                    <TourCard key={item._id} tour={item} />
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        )}
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </div>
  );
}
