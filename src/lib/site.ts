import { formatIDR } from "@/lib/utils";

export const BRAND = {
  name: "Zi Tour Travel",
  shortName: "Zi Tour",
  tagline: "Day tours in Batam, Indonesia",
};

/** TODO: replace with the agency's real WhatsApp Business number. */
export const WHATSAPP_NUMBER = "6281234567890";

export const CONTACT = {
  address:
    "Ruko Mega Legenda Blok F No. 12, Batam Centre, Batam, Kepulauan Riau 29444",
  phone: "+62 812-3456-7890",
  email: "hello@gematravelbatam.com",
  hours: "Mon–Sun · 08:00–21:00 WIB",
};

/** Build a WhatsApp deep link with a pre-filled booking inquiry message. */
export function waLink(tour?: { name: string; price?: number }) {
  const text = tour
    ? `Halo Zi Tour! Saya ingin memesan paket "${tour.name}"${
        tour.price ? ` (${formatIDR(tour.price)})` : ""
      }. Mohon info ketersediaan ya.`
    : "Halo Zi Tour! Saya ingin bertanya tentang paket tur di Batam.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
