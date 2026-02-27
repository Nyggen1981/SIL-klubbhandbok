# Push til GitHub og deploy på Vercel

Git er initialisert og første commit er tatt. Følg disse stegene for å pushe til GitHub og deploye på Vercel.

## 1. Opprett repo på GitHub

1. Gå til [github.com/new](https://github.com/new).
2. Velg **Repository name** (f.eks. `klubbhandbok-saudail`).
3. La repoet være **Private** eller **Public** etter behov.
4. **Ikke** kryss av for "Add a README" – du har allerede kode lokalt.
5. Klikk **Create repository**.

## 2. Koble til og push

I terminalen, fra prosjektmappen (`Klubbhåndbok`):

```bash
git remote add origin https://github.com/DITT-BRUKERNAVN/REPO-NAVN.git
git push -u origin main
```

Erstatt `DITT-BRUKERNAVN` og `REPO-NAVN` med ditt GitHub-brukernavn og repo-navnet du valgte.

(Etter å ha opprettet repo viser GitHub deg den eksakte URL – du kan kopiere den der.)

## 3. Deploy på Vercel

1. Gå til [vercel.com](https://vercel.com) og logg inn (med GitHub).
2. Klikk **Add New…** → **Project**.
3. **Import** GitHub-repoet du nettopp pushet (f.eks. `klubbhandbok-saudail`).
4. La **Framework Preset** være **Next.js** (Vercel oppdager det).
5. **Build Command:** `npm run build`  
   **Output Directory:** `.next`  
   (står som regel riktig som standard)
6. Klikk **Deploy**.

Etter noen minutter får du en URL (f.eks. `klubbhandbok-saudail.vercel.app`).

## 4. Valgfritt: subpath (f.eks. saudail.no/handbok)

Hvis håndboken skal ligge under en subpath (f.eks. `saudail.no/handbok`):

1. I Vercel: **Project** → **Settings** → **Environment Variables**.
2. Legg til:
   - `BASE_PATH` = `/handbok`
   - `NEXT_PUBLIC_BASE_PATH` = `/handbok`
3. Redeploy (Deployments → … → Redeploy).

## 5. Egendomenet (saudail.no)

1. I Vercel: **Settings** → **Domains**.
2. Legg til `saudail.no` (eller underdomene, f.eks. `handbok.saudail.no`).
3. Følg instruksjonene for DNS (CNAME eller A-record hos domeneleverandøren).

---

**Oppsummert:** Opprett repo på GitHub → `git remote add origin …` og `git push -u origin main` → Import repo i Vercel → Deploy.
