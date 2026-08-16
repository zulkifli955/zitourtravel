import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Doc } from "@/convex/_generated/dataModel";
import { Sparkles, Star } from "lucide-react";
import { TourDialog } from "./TourDialog";

export function TourCard({ tour }: { tour: Doc<"tours"> }) {
  return (
    <Card className="group flex h-full flex-col gap-0 overflow-hidden rounded-2xl border-border/70 p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Clicking the photo opens the caption popup */}
      <TourDialog
        tour={tour}
        trigger={
          <button
            type="button"
            aria-label={`View ${tour.name}`}
            className="relative block aspect-[16/10] w-full cursor-pointer overflow-hidden bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <img
              src={tour.imageUrl}
              alt={tour.name}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
            {tour.featured && (
              <Badge className="absolute right-3 top-3 border-0 bg-primary text-primary-foreground shadow-sm">
                <Sparkles className="size-3" /> Featured
              </Badge>
            )}
          </button>
        }
      />

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-foreground">
            {tour.rating.toFixed(1)}
          </span>
        </div>

        <h3 className="text-base font-semibold leading-snug tracking-tight">
          {tour.name}
        </h3>
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          {tour.tagline}
        </p>
      </div>
    </Card>
  );
}
