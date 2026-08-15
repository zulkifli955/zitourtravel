import { BRAND, CONTACT, waLink } from "@/lib/site";
import { Compass, MapPin, MessageCircle, Users } from "lucide-react";

export function SiteFooter() {
  return (
    <footer id="contact" className="scroll-mt-24 border-t bg-card">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <a href="/" className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Compass className="size-5" />
              </span>
              <span className="text-lg font-bold tracking-tight">
                Zi Tour
                <span className="ml-1.5 font-medium text-muted-foreground">
                  Travel
                </span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
              Day tours and experiences across Batam — private cars, local
              guides, and booking that takes minutes, not forms.
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
                <a
                  href="/#tours"
                  className="transition-colors hover:text-foreground"
                >
                  All tours
                </a>
              </li>
              <li>
                <a
                  href="/#gallery"
                  className="transition-colors hover:text-foreground"
                >
                  Gallery
                </a>
              </li>
              <li>
                <a
                  href="/#why"
                  className="transition-colors hover:text-foreground"
                >
                  Why Zi Tour
                </a>
              </li>
              <li>
                <a
                  href="/#reviews"
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
                <a
                  href="/#how"
                  className="transition-colors hover:text-foreground"
                >
                  How it works
                </a>
              </li>
              <li>
                <a
                  href="/#contact"
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
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <p>Private tours · Local guides · Pay on arrival</p>
        </div>
      </div>
    </footer>
  );
}
