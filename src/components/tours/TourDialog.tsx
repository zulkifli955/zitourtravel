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
import { PhotoCarousel } from "@/components/PhotoCarousel";
import type { Doc } from "@/convex/_generated/dataModel";
import { Star, X } from "lucide-react";

/**
 * Popup with the tour's photos (slider) and the caption (description) of
 * the destination. Trigger is supplied by the caller so cards can open it.
 */
export function TourDialog({
  tour,
  trigger,
}: {
  tour: Doc<"tours">;
  trigger: React.ReactNode;
}) {
  // Newer tours carry a gallery; older ones fall back to the single photo.
  const photos =
    tour.gallery && tour.gallery.length > 0
      ? tour.gallery
      : [tour.imageUrl];

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
      >
        {/* Photo slider */}
        <div className="shrink-0">
          <PhotoCarousel
            photos={photos}
            alt={tour.name}
            overlay={
              <div className="absolute inset-x-4 top-4 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-card/90 px-2.5 py-0.5 text-xs font-medium text-card-foreground shadow-sm backdrop-blur-sm">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  {tour.rating.toFixed(1)} ({tour.reviewCount})
                </span>
              </div>
            }
          />
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close tour details"
              className="absolute right-4 top-4 z-20 size-8 rounded-full border-0 bg-black/35 text-white backdrop-blur-sm hover:bg-black/50 hover:text-white"
            >
              <X className="size-4" />
            </Button>
          </DialogClose>
        </div>

        {/* Caption of the destination */}
        <div className="flex min-h-0 flex-col gap-5 overflow-y-auto p-6 sm:p-7">
          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl tracking-tight">
              {tour.name}
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm">
              {tour.tagline}
            </DialogDescription>
          </DialogHeader>

          <p className="text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            {tour.description}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
