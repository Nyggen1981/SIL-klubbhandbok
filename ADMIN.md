# Admin – innlogging og redigering

Admin er **passordbeskyttet** på selve nettsiden. Innhold lagres i **Neon** (Postgres), ikke i Git. Du trenger ikke Tina Cloud.

---

## 1. Hvor logge inn

- **Lokal:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Produksjon:** `https://ditt-domene.vercel.app/admin`

Bruk **brukernavn** og **passord** du setter i miljøvariabler (se nedenfor).

---

## 2. Hvor sette admin-passord og database

### Lokalt (`.env.local`)

```env
ADMIN_USERNAME=admin
ADMIN_EMAIL=din-epost@eksempel.no
ADMIN_PASSWORD=velg-et-sterkt-passord
ADMIN_SECRET=samme-eller-annen-hemmelig-streng

# Neon (connection string fra console.neon.tech)
DATABASE_URL=postgresql://...
```

- **ADMIN_USERNAME** – brukernavn for innlogging (standard: `admin`). Admin kan logge inn med dette.
- **ADMIN_EMAIL** – valgfritt. Hvis satt, kan admin også logge inn med denne e-postadressen (samme passord).
- **ADMIN_PASSWORD** – passord for innlogging. **Må** være satt.
- **ADMIN_SECRET** – brukes til å signere session-cookie. Kan være lik passordet eller en egen streng.
- **DATABASE_URL** – Neon connection string. Uten denne kan du ikke lagre endringer; siden viser da bare innhold fra filer under `content/` (hvis du ikke har satt Neon ennå).

### På Vercel

**Settings** → **Environment Variables** → legg til de samme variablene (ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_SECRET, DATABASE_URL) for Production (og evt. Preview). **Redeploy** etterpå.

---

## 3. Neon (database) – første gangs oppsett

Innholdet lever i **Neon**. Se **[NEON.md](NEON.md)** for:

- Opprette prosjekt og tabell i Neon
- Kjøre `scripts/init-neon.sql` i Neon SQL Editor
- Fylle databasen fra eksisterende MDX-filer: `node scripts/seed-neon-from-files.mjs`

Etter det kan admin redigere på nettsiden, og endringer lagres i Neon.

---

## 4. Hvem kan logge inn

Alle som kjenner **ADMIN_PASSWORD** og enten **ADMIN_USERNAME** eller **ADMIN_EMAIL** som er satt i miljøvariabler. Det finnes ikke egne brukerkontoer – ett felles admin-passord. Du kan logge inn med brukernavn eller e-post (hvis ADMIN_EMAIL er satt). Bytt passord ved å endre **ADMIN_PASSWORD** i Vercel/lokalt og redeploy eller restart.
