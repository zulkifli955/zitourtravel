import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { ArrowRight, Compass, LogOut } from "lucide-react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const tours = useQuery(api.tours.list, {});
  const featured = (tours ?? []).filter((tour) => tour.featured).slice(0, 3);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-10">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Compass className="size-5" />
            </span>
            <div>
              <p className="text-sm font-bold tracking-tight">Zi Tour Travel</p>
              <p className="text-xs text-muted-foreground">Your Batam trips</p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </header>

        <section className="relative overflow-hidden rounded-3xl bg-primary px-8 py-12 text-primary-foreground sm:px-10">
          <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-2xl" />
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/75">
            Welcome back{user?.name ? `, ${user.name}` : ""}
          </p>
          <h1 className="mt-3 max-w-xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Your Batam trips will live here.
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-sm leading-6 text-primary-foreground/85">
            Zi Tour v1 focuses on browsing tours. Booking, itineraries and trip
            history arrive in the next release — for now, explore the catalog
            and chat with us on WhatsApp.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              asChild
              className="h-11 rounded-full bg-white px-6 text-sm text-primary shadow-sm hover:bg-white/90 hover:text-primary"
            >
              <a href="/#tours">
                Browse tours <ArrowRight />
              </a>
            </Button>
          </div>
        </section>

        {featured.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold tracking-tight">
              Popular this week
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Our most-booked tours — details live on the landing page.
            </p>
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              {featured.map((tour) => (
                <Card
                  key={tour._id}
                  className="gap-0 overflow-hidden rounded-2xl p-0 shadow-sm"
                >
                  <div className="aspect-[4/3] bg-muted">
                    <img
                      src={tour.imageUrl}
                      alt={tour.name}
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="line-clamp-1 text-sm font-semibold tracking-tight">
                      {tour.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {tour.tagline}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
