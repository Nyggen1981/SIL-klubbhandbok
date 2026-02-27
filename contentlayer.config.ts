/**
 * Innholdsstruktur for klubbhåndboken.
 * MDX-filer ligger under /content med struktur: kapittel-X/side-Y.mdx
 * Eksempel: content/kapittel-1/innledning.mdx → URL /kapittel-1/innledning
 *
 * Den faktiske innlasting og indeksering skjer i src/lib/content.ts (filbasert, uten Contentlayer-pakke).
 */

export const contentDirPath = 'content';
export const contentDirInclude = ['**/*.mdx'];
export const publicImagesPath = 'public/images';
