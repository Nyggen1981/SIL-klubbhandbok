import { compileMDX as compile } from 'next-mdx-remote/rsc';
import { mdxComponents } from '@/components/MdxComponents';

export async function compileMDX(source: string, _filePath?: string) {
  const { content } = await compile({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
    },
  });
  return { content };
}
