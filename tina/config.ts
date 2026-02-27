import { defineConfig } from 'tinacms';

export default defineConfig({
  branch: process.env.VERCEL_GIT_COMMIT_REF || process.env.GIT_BRANCH || 'main',
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID ?? '',
  token: process.env.TINA_TOKEN ?? '',
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  schema: {
    collections: [
      {
        name: 'handbook',
        label: 'Klubbhåndbok',
        path: 'content',
        format: 'mdx',
        match: { include: '**/*' },
        fields: [
          { type: 'string', name: 'title', label: 'Tittel', required: true },
          { type: 'number', name: 'order', label: 'Rekkefølge', ui: { description: 'Lavt tall = øverst i kapittelet' } },
          { type: 'string', name: 'chapterTitle', label: 'Kapitteltittel', ui: { description: 'Vises i sidemenyen' } },
          {
            type: 'datetime',
            name: 'sistOppdatert',
            label: 'Sist oppdatert',
            ui: { description: 'Oppdateres ved lagring (sett manuelt eller via Tina Cloud-hook)' },
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Innhold',
            isBody: true,
            templates: [
              {
                name: 'image',
                label: 'Bilde',
                fields: [
                  { type: 'image', name: 'src', label: 'Bilde', required: true },
                  { type: 'string', name: 'alt', label: 'Alt-tekst (beskrivelse for skjermlesere)', required: true, ui: { description: 'Beskriv bildet for universell utforming' } },
                ],
              },
            ],
          },
        ],
        defaultItem: () => ({ title: 'Ny side', order: 99 }),
      },
    ],
  },
});
