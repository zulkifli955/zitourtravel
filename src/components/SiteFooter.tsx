import { BRAND, CONTACT, waLink } from "@/lib/site";
import { Facebook, Instagram, MapPin, MessageCircle, Users } from "lucide-react";

/** TODO: replace the Facebook placeholder with the agency's real profile URL. */
const SOCIALS = [
  {
    label: "Zi Tour Travel on Facebook",
    href: "https://www.facebook.com/",
    icon: <Facebook className="size-4" />,
  },
  {
    label: "Zi Tour Travel on Instagram",
    href: "https://www.instagram.com/zitourtravelbatam?igsh=a283bndsZTM0bzlm",
    icon: <Instagram className="size-4" />,
  },
  {
    label: "Zi Tour Travel on TikTok",
    href: "https://www.tiktok.com/@isorlee073",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
  },
];

export function SiteFooter() {
  return (
    <footer id="contact" className="scroll-mt-24 border-t bg-card">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <a href="/" aria-label="Zi Tour Travel — home">
              <img
                src="/assets/travel_logos_-_Made_with_PosterMyWall__1_.png"
                alt="Zi Tour Travel logo"
                className="h-10 w-auto object-contain"
              />
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
            <div className="mt-5 flex items-center gap-2.5">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {social.icon}
                </a>
              ))}
            </div>
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
                  Why Zi Tour Travel
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
