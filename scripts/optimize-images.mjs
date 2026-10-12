import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { createHash } from 'node:crypto';

const directory = path.resolve('public/assets');
await mkdir(path.join(directory, 'generated'), { recursive: true });
const manifest = {};
for (const filename of await readdir(directory)) {
  if (!/\.(png|jpe?g)$/i.test(filename)) continue;
  const input = path.join(directory, filename);
  const { width, height } = await sharp(input).metadata();
  const variants = [];
  for (const target of [...new Set([480, 960, 1440, 1920, width].filter(value => value <= width))]) {
    const buffer = await sharp(input).resize({ width: target, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
    const hash = createHash('sha256').update(buffer).digest('hex').slice(0, 12);
    const output = `${path.parse(filename).name}-${target}-${hash}.webp`;
    await writeFile(path.join(directory, 'generated', output), buffer);
    variants.push({ target, url: `/assets/generated/${output}` });
  }
  variants.sort((a, b) => a.target - b.target);
  manifest[filename] = { width, height, fallback: variants.at(-1).url, srcSet: variants.map(({ target, url }) => `${url} ${target}w`).join(', ') };
}
await writeFile('src/data/images.json', `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Optimized ${Object.keys(manifest).length} local images for static CDN delivery.`);
