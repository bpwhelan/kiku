import { cp, stat } from "node:fs/promises";
import { join } from "node:path";

// folders
const ANKI_MEDIA_DIR = join(
  process.env.HOME || "",
  ".local/share/Anki2/yym/collection.media",
);
await stat(ANKI_MEDIA_DIR);

// files to copy
const FILES = ["_kiku.js"];

for (const file of FILES) {
  const src = join(import.meta.dirname, "../dist", file);
  await stat(src);
  const dest = join(ANKI_MEDIA_DIR, file);

  await cp(src, dest);
  console.log(`✅ Copied ${src} to ${dest}`);
}

console.log("🎉 Done!");
