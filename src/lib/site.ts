import { formatIDR } from "@/lib/utils";

export const BRAND = {
  name: "Zi Tour Travel",
  shortName: "Zi Tour",
  tagline: "Day tours in Batam, Indonesia",
};

/** WhatsApp Business number (country code + number, no symbols). */
export const WHATSAPP_NUMBER = "6281276178884";

export const CONTACT = {
  address:
    "Buana Garden, Block Orchid No. 082, Tanjung Piayu, Batam, Kepulauan Riau",
  phone: "+62 812-7617-8884",
  email: "hello@gematravelbatam.com",
  hours: "Mon–Sun · 08:00–21:00 WIB",
};

const MAPS_QUERY = encodeURIComponent(
  "Buana Garden, Block Orchid No. 082, Tanjung Piayu, Batam",
);

/** Keyless Google Maps embed for the office location. */
export const MAPS_EMBED_URL = `https://maps.google.com/maps?q=${MAPS_QUERY}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

/** "Open in Google Maps" deep link for the same location. */
export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;

/**
 * Build a WhatsApp deep link with a pre-filled message.
 * Without a tour, uses the general inquiry message asking for available
 * packages, prices and the visit date.
 */
export function waLink(tour?: { name: string; price?: number }) {
  const text = tour
    ? `Halo Zi Tour Travel Batam, saya tertarik dengan paket tour "${tour.name}"${
        tour.price ? ` (${formatIDR(tour.price)})` : ""
      }. Mohon info ketersediaan untuk kunjungan pada tanggal [isi tanggal]? Terima kasih`
    : "Halo Zi Tour Travel Batam, saya tertarik dengan paket tour Anda. Mohon info paket yang tersedia beserta harga, dan apakah tersedia untuk kunjungan pada tanggal [isi tanggal]? Terima kasih";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
