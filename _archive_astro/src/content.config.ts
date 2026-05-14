import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const baseSchema = z.object({
  title: z.string(),
  description: z.string(),
  order: z.number().optional(),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().default(false),
  updated: z.coerce.date().optional(),
  toc: z.boolean().default(true),
  badge: z.string().optional(),
});

const collection = (folder: string) =>
  defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: `./src/content/${folder}` }),
    schema: baseSchema,
  });

export const collections = {
  architecture: collection('architecture'),
  'cortex-m': collection('cortex-m'),
  'cortex-a': collection('cortex-a'),
  'cortex-r': collection('cortex-r'),
  peripherals: collection('peripherals'),
  programming: collection('programming'),
  rtos: collection('rtos'),
  tools: collection('tools'),
  vendors: collection('vendors'),
  systems: collection('systems'),
};
