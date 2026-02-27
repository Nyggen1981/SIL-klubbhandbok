/**
 * Vasker filnavn og titler for trygg bruk i URL-er (Vercel og andre).
 * Erstatt norske tegn og normaliserer til lowercase med bindestrek.
 * Eksempel: "6.0 Økonomi og støtteordninger" → "6-0-okonomi-og-stotteordninger"
 */
const NORWEGIAN_MAP: Record<string, string> = {
  æ: 'e',
  ø: 'o',
  å: 'a',
  Æ: 'e',
  Ø: 'o',
  Å: 'a',
};

export function slugify(value: string): string {
  if (!value || typeof value !== 'string') return '';
  let s = value.trim();
  for (const [from, to] of Object.entries(NORWEGIAN_MAP)) {
    s = s.split(from).join(to);
  }
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
