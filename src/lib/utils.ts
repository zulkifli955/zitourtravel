import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as Indonesian Rupiah, e.g. 350000 -> "Rp 350.000". */
export function formatIDR(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}
