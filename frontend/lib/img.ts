/**
 * All images stored in Supabase Storage were pre-converted to WebP (≈90% smaller
 * than the original PNG/JPEG). This swaps a stored object URL's extension to
 * `.webp`. The file dimensions are unchanged, so nothing crops - it's just a
 * smaller payload. External URLs (e.g. flagcdn) pass through untouched.
 */
export function webp(url: string): string;
export function webp(url: string | undefined): string | undefined;
export function webp(url: string | undefined): string | undefined {
  if (!url || !url.includes("/storage/v1/object/public/")) return url;
  return url.replace(/\.(png|jpe?g)$/i, ".webp");
}
