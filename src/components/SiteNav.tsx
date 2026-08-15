import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { BRAND } from "@/lib/site";
import { Compass, Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

/** Landing-page anchors, prefixed with "/" so they work from any page. */
const NAV_LINKS = [
  { label: "Tours", href: "/#tours" },
  { label: "Featured", href: "/#featured" },
  { label: "Why Zi Tour", href: "/#why" },
  { label: "Reviews", href: "/#reviews" },
];

export function SiteNav() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Compass className="size-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            Zi Tour
            <span className="ml-1.5 font-medium text-muted-foreground">
              Travel
            </span>
          </span>
        </Link>

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
            <a href="/#tours">Browse tours</a>
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
              <SheetTitle>{BRAND.name}</SheetTitle>
              <SheetDescription>{BRAND.tagline}</SheetDescription>
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
                  <Button
                    asChild
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    <Link to="/auth">Sign in</Link>
                  </Button>
                )}
                <Button asChild onClick={() => setOpen(false)}>
                  <a href="/#tours">Browse tours</a>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
