import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Doc } from "@/convex/_generated/dataModel";
import { cn, formatIDR } from "@/lib/utils";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  Star,
  X,
} from "lucide-react";

/** TODO: replace with the agency's real WhatsApp Business number. */
const WHATSAPP_NUMBER = "6281234567890";

function bookingLink(tour: Doc<"tours">) {
  const text = `Halo Zi Tour! Saya ingin memesan paket "${tour.name}" (${formatIDR(
    tour.price,
  )}). Mohon info ketersediaan tanggal ya.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function TourDetailDialog({
  tour,
  triggerClassName,
}: {
  tour: Doc<"tours">;
  triggerClassName?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("rounded-full px-4", triggerClassName)}
        >
          View tour
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
      >
        {/* Hero image (pinned, body scrolls below it) */}
        <div className="relative aspect-[16/9] shrink-0 bg-muted">
          <img
            src={tour.imageUrl}
            alt={tour.name}
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />
          <div className="absolute inset-x-5 bottom-4 flex flex-wrap items-center gap-2.5 text-white">
            <Badge className="border-0 bg-white/20 text-white backdrop-blur-sm">
              {tour.category}
            </Badge>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium drop-shadow-sm">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              {tour.rating.toFixed(1)} ({tour.reviewCount} reviews)
            </span>
          </div>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close tour details"
              className="absolute right-4 top-4 z-10 size-8 rounded-full border-0 bg-black/35 text-white backdrop-blur-sm hover:bg-black/50 hover:text-white"
            >
              <X className="size-4" />
            </Button>
          </DialogClose>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-6 overflow-y-auto p-6 sm:p-7">
          <div>
            <DialogHeader className="text-left">
              <DialogTitle className="text-2xl tracking-tight">
                {tour.name}
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm">
                {tour.tagline}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4 text-primary" /> {tour.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4 text-primary" /> {tour.durationHours}{" "}
                hours
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4 text-primary" />{" "}
                {tour.availableDays.join(" · ")}
              </span>
            </div>
          </div>

          <p className="text-sm leading-6 text-muted-foreground">
            {tour.description}
          </p>

          <div className="rounded-2xl border bg-muted/50 p-5">
            <h4 className="text-sm font-semibold tracking-tight">
              Tour highlights
            </h4>
            <ul className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {tour.highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-tight">
              What&apos;s included
            </h4>
            <ul className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {tour.includes.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-5 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Price per person
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight">
                {formatIDR(tour.price)}
              </p>
            </div>
            <Button asChild className="h-11 rounded-full px-6">
              <a
                href={bookingLink(tour)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle /> Book on WhatsApp
              </a>
            </Button>
          </div>

          <p className="text-xs leading-5 text-muted-foreground">
            Free cancellation up to 24 hours before the tour · Pay on arrival ·
            Confirmation within minutes on WhatsApp.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
