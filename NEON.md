# Klubbhåndbok med Neon (Postgres)

Innholdet kan lagres i **Neon** (serverless Postgres) i stedet for i Git. Da lever håndboken «på nettsiden»: admin redigerer i `/admin`, endringer lagres i databasen, og siden henter alltid nyeste innhold derfra.

---

## 1. Opprett prosjekt og tabell i Neon

1. Logg inn på [console.neon.tech](https://console.neon.tech).
2. Opprett et **nytt prosjekt** (eller bruk eksisterende), f.eks. `SIL-klubbhandbok`.
3. Kopier **connection string** (Connection details / Connect) og legg den i **DATABASE_URL** (se under).
4. **Opprett tabellen** – velg én måte:
   - **Enklest:** I prosjektmappen: `node scripts/init-neon.mjs` (krever at DATABASE_URL er satt i .env.local). Da opprettes `handbook_pages` automatisk.
   - **Manuelt:** Gå til **SQL Editor** i Neon og kjør SQL-en i **`scripts/init-neon.sql`**.
5. Connection string ser omtrent slik ut:
   ```text
   postgresql://bruker:passord@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

---

## 2. Miljøvariabler

### Lokalt

Opprett eller rediger `.env.local`:

```env
DATABASE_URL=postgresql://...  (din Neon connection string)
ADMIN_USERNAME=admin
ADMIN_EMAIL=din-epost@eksempel.no
ADMIN_PASSWORD=velg-et-sterkt-passord
ADMIN_SECRET=samme-eller-annen-hemmelig-streng
```

- **ADMIN_USERNAME** – brukernavn (standard: `admin`).
- **ADMIN_EMAIL** – valgfritt; hvis satt kan du også logge inn med e-post.

### På Vercel

1. **Vercel** → prosjektet → **Settings** → **Environment Variables**.
2. Legg til:
   - **DATABASE_URL** = Neon connection string (Production + Preview)
   - **ADMIN_PASSWORD** = passordet admin bruker for å logge inn på `/admin`
   - **ADMIN_SECRET** = en hemmelig streng (kan være lik ADMIN_PASSWORD)
3. **Save** og **Redeploy**.

---

## 3. Fylle databasen første gang (fra MDX-filer)

Hvis du allerede har innhold i `content/*.mdx` og vil kopiere det til Neon:

```bash
# Sett DATABASE_URL i .env.local eller miljøet
node scripts/seed-neon-from-files.mjs
```

Dette leser alle `.mdx`-filer under `content/` og legger dem inn i `handbook_pages`. Du trenger bare kjøre det én gang.

---

## 4. Bygg og søk

- Ved **build** (`npm run build`): Hvis `DATABASE_URL` er satt, bygges søkeindeksen fra Neon (scriptet `build-search-from-db.mjs`). Sørg for at `DATABASE_URL` også er satt i Vercel under build.
- Hvis du **ikke** bruker Neon: La `DATABASE_URL` være utelatt. Da leses innhold fra filer under `content/` som før, og søkeindeks bygges derfra.

---

## 5. Admin

- Gå til **/admin** på nettsiden (lokal: `http://localhost:3000/admin`, produksjon: `https://ditt-domene.vercel.app/admin`).
- Logg inn med **ADMIN_USERNAME** (standard: `admin`) og **ADMIN_PASSWORD**.
- Rediger sider og lagre – endringer skrives til Neon. Ingen Git-commit nødvendig.

Se også **ADMIN.md** for innlogging og passord.
