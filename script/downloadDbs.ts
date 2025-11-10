import fs from "node:fs";
import https from "node:https";
import path from "node:path";

const baseUrl =
  "https://raw.githubusercontent.com/youyoumu/wanikani-userscripts/refs/heads/master/wanikani-similar-kanji/db/";

const dbFiles = [
  "from_keisei.json",
  "stroke_edit_dist.json",
  "yl_radical.json",
  "old_script.json",
  "wk_niai_noto.json",
  "manual.json",
  "lookup.json",
];

const outputDir = path.join(import.meta.dirname, "../.db");
fs.mkdirSync(outputDir, { recursive: true });

function downloadFile(url: string, dest: string) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to fetch ${url}: ${res.statusCode}`));
          return;
        }
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", (err) => {
        fs.unlink(dest, () => reject(err));
      });
  });
}

async function main() {
  console.log(`Downloading databases to ${outputDir}...\n`);
  for (const file of dbFiles) {
    const url = `${baseUrl}${file}`;
    const fileName = `_kiku_db_similar_kanji_${file}`;
    const dest = path.join(outputDir, fileName);
    console.log(`→ ${file}`);
    try {
      await downloadFile(url, dest);
    } catch (err) {
      console.error(`Failed to download ${file}:`, err.message);
    }
  }
  console.log("\n✅ All downloads complete!");
}

main();
