import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { jwtVerify } from "jose";
import { jwtDecode } from "jwt-decode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const formatCurrency = (amount: number, currency: 'NGN' | 'USD' = 'NGN') => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return formatter.format(amount);
}

export function formatNumber(value: number | string): string {
  const number = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(number)) return '0';

  const rounded = Math.round(number);

  return new Intl.NumberFormat('en-US').format(rounded);
}


export function disableConsoleLogsInProduction() {
  if (process.env.NODE_ENV === "production") {
    for (const method of ["log", "debug", "info", "warn"] as const) {
      console[method] = () => { };
    }
  }
}

export function extractPlainText(content: string, wordLimit = 6) {
  // Step 1: Remove HTML tags using a regular expression
  const plainText = content.replace(/<\/?[^>]+(>|$)/g, "");

  // Step 2: Replace HTML entity codes like `&nbsp;` with a space
  const cleanedText = plainText.replace(/&nbsp;/g, " ").trim();

  // Step 3: Split the cleaned text into words
  const words = cleanedText.split(/\s+/);

  // Step 4: Extract the first 'wordLimit' words
  return words.slice(0, wordLimit).join(" ");
}


const JWT_SECRET = process.env.JWT_SECRET!;

export async function verifyToken(token: string | Uint8Array<ArrayBufferLike>) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
}


export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    if (!decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
};
