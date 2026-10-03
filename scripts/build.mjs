import { copyFile, mkdir, readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
// The generated directory is always confined to this project.
if (path.dirname(output) !== path.resolve(root)) throw new Error('Invalid build output');
await rm(output, { recursive: true, force: true });
await mkdir(path.join(output, 'assets'), { recursive: true });
for (const file of ['index.html', 'base.css', 'styles.css', 'app.js', 'interactions.js']) {
  await copyFile(path.join(root, file), path.join(output, file));
}
for (const asset of await readdir(path.join(root, 'assets'), { withFileTypes: true })) {
  if (asset.isFile() && /\.(png|jpe?g|webp|svg|ico|avif|mp4)$/i.test(asset.name)) {
    await copyFile(path.join(root, 'assets', asset.name), path.join(output, 'assets', asset.name));
  }
}
console.log('Đại An demo 02 ready at dist/index.html');
