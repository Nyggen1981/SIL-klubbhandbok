-- Kjør denne SQL i Neon (Console → SQL Editor) for å opprette tabell for klubbhåndboken.

CREATE TABLE IF NOT EXISTS handbook_pages (
  slug_path TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 999,
  chapter_title TEXT,
  body TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Valgfritt: indeks for sortering
CREATE INDEX IF NOT EXISTS idx_handbook_pages_sort ON handbook_pages (sort_order, slug_path);
