# Klubbhåndbok – Sauda IL

Online klubbhåndbok bygget med Next.js (App Router), Tailwind CSS og MDX. Beregnet på hosting på Vercel med deployment fra GitHub.

## Krav

- Node.js 18+
- npm

## Kom i gang

```bash
npm install
npm run build
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000).

## Prosjektstruktur

- **`/content`** – MDX-innhold. Struktur: `content/kapittel-1/side-1.mdx`. Frontmatter: `title`, `order`, `chapterTitle`.
- **`/public/images`** – Bilder brukt i MDX (bruk `![alt](/images/fil.jpg)` eller `<Image src="/images/fil.jpg" />`).
- **`/src/app`** – Next.js App Router (layout, forside, dynamisk `[...slug]` for MDX-sider).
- **`/src/components`** – Sidebar, søk, MDX-komponenter (bl.a. `next/image` for bilder).
- **`/src/lib`** – Innlasting av innhold (`content.ts`), MDX-kompilering (`mdx.ts`), søk (FlexSearch).

## Funksjoner

- **Navigasjon**: Collapsible sidebar (Kapittel > Underkapittel).
- **Søk**: FlexSearch i toppen. Trykk **⌘K / Ctrl+K** for å fokusere søkefeltet. Søkeresultater viser titler og tekstutdrag (snippets).
- **URL-er**: Filnavn og titler vaskes for norske tegn (æ, ø, å → e, o, a) i `src/lib/slug.ts`, f.eks. `6.0 Økonomi og støtteordninger` → `/6-0-okonomi-og-stotteordninger`. Viktig for stabilitet på Vercel.
- **PDF**: Utskrift skjuler sidebar, søk og admin-knapper; sideskift før hvert H1; logo øverst og sidetekst nederst (legg `public/images/logo.png` for eget logo). Styrer av `src/app/print.css`.
- **Bilder**: Klikk-forstørring med `react-medium-image-zoom`. Bruk beskrivende alt-tekst for universell utforming (støttes i Tina som felt på bilder).
- **Branding**: Sauda IL-farger (blå/hvit) og font Inter i `tailwind.config.ts` og `src/app/globals.css`.
- **Base path**: Interne lenker er relative; egnet for masking under f.eks. `saudail.no/handbok` via `BASE_PATH` / `NEXT_PUBLIC_BASE_PATH`.

## Admin med TinaCMS

For redigering i nettleseren og commit til GitHub:

1. Kjør: `npx @tinacms/cli@latest init`. Velg public-mappen når du blir bedt om det.
2. Opprett [Tina Cloud](https://app.tina.io)-prosjekt og legg inn `NEXT_PUBLIC_TINA_CLIENT_ID` og `TINA_TOKEN` i miljøvariabler (lokal og Vercel).
3. Åpne `/admin` for å redigere innhold. Endringer committes til repoet ved bruk av Tina Cloud.

Konfigurasjonen ligger i `tina/config.ts`. I innholdsfeltet kan administratorer dra og slippe bilder; bilder har eget felt for **alt-tekst** (beskrivelse for skjermlesere). Feltet **Sist oppdatert** kan settes manuelt eller oppdateres automatisk ved lagring via en Tina Cloud-hook.

## Deployment (Vercel + GitHub)

1. Push prosjektet til et GitHub-repo.
2. I Vercel: New Project → Import fra GitHub, velg repoet.
3. Build command: `npm run build`. Output: `.next`. Root: prosjektmappen.
4. Hvis håndboken skal ligge under en subpath (f.eks. `saudail.no/handbok`), sett i Vercel:
   - `BASE_PATH=/handbok`
   - `NEXT_PUBLIC_BASE_PATH=/handbok`

## Scripts

- `npm run dev` – Utviklingsserver.
- `npm run build` – Bygger søkeindeks (`node scripts/build-search.mjs`) og deretter Next.js.
- `npm run start` – Produksjonsserver.
- `npm run lint` – ESLint.

## Lisens

Internt bruk Sauda IL.
