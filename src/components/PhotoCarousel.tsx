import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

/**
 * Photo slider built on the embla-based shadcn Carousel. Shows one photo
 * per slide with prev/next arrows and dot indicators. An optional overlay
 * (e.g. badges) can be rendered on top of the current photo.
 */
export function PhotoCarousel({
  photos,
  alt = "Photo",
  className,
  itemClassName,
  overlay,
}: {
  photos: string[];
  alt?: string;
  className?: string;
  itemClassName?: string;
  overlay?: React.ReactNode;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // The Carousel calls this from its own mount effect with the embla API,
  // so reading the initial snap here is safe (no cascading render).
  const registerApi = useCallback((carouselApi: CarouselApi) => {
    if (!carouselApi) return;
    setApi(carouselApi);
    setCurrent(carouselApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className={cn("relative", className)}>
      <Carousel setApi={registerApi} className="w-full">
        <CarouselContent className="-ml-0">
          {photos.map((src, index) => (
            <CarouselItem key={src} className="pl-0">
              <div
                className={cn(
                  "overflow-hidden bg-muted",
                  itemClassName ?? "aspect-[16/9]",
                )}
              >
                <img
                  src={src}
                  alt={`${alt} photo ${index + 1}`}
                  className="size-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {photos.length > 1 && (
          <>
            <CarouselPrevious
              className="left-3 top-1/2 size-9 border-0 bg-black/35 text-white shadow-md backdrop-blur-sm hover:bg-black/55 hover:text-white"
              aria-label="Previous photo"
            />
            <CarouselNext
              className="right-3 top-1/2 size-9 border-0 bg-black/35 text-white shadow-md backdrop-blur-sm hover:bg-black/55 hover:text-white"
              aria-label="Next photo"
            />
          </>
        )}
      </Carousel>

      {overlay && (
        <div className="pointer-events-none absolute inset-0 z-10">
          {overlay}
        </div>
      )}

      {photos.length > 1 && (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
          {photos.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to photo ${index + 1} of ${photos.length}`}
              aria-current={index === current}
              className={cn(
                "h-1.5 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                index === current
                  ? "w-4 bg-white"
                  : "w-1.5 bg-white/50 hover:bg-white/80",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
