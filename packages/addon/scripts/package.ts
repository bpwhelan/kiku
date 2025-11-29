import fs from "node:fs";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import archiver from "archiver";

async function zipFiles(
  files: { abs: string; rel: string }[],
  outputPath: string,
) {
  const output = fs.createWriteStream(outputPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  output.on("close", () => {
    console.log(`✅ Created ${outputPath} (${archive.pointer()} bytes)`);
  });

  archive.on("error", (err) => {
    throw err;
  });

  archive.pipe(output);

  for (const file of files) {
    archive.file(file.abs, { name: file.rel });
  }

  await archive.finalize();
}

async function getFilesRecursively(
  dir: string,
  baseDir: string = dir,
): Promise<{ abs: string; rel: string }[]> {
  const entries = await readdir(dir, { withFileTypes: true });

  const out: { abs: string; rel: string }[] = [];
  for (const entry of entries) {
    if (entry.name === "__pycache__") continue;
    if (entry.name.endsWith(".pyc")) continue;

    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      out.push(...(await getFilesRecursively(fullPath, baseDir)));
    } else {
      out.push({ abs: fullPath, rel: relPath });
    }
  }
  return out;
}

const rootDir = path.join(import.meta.dirname, "../");

// Root files
const rootFiles = ["__init__.py", "config.json", "manifest.json"].map(
  (file) => ({
    abs: path.join(rootDir, file),
    rel: file,
  }),
);

// Add src/ recursively
const srcDir = path.join(rootDir, "src");
const srcFiles = await getFilesRecursively(srcDir, rootDir);

// Combine
const allFiles = [...rootFiles, ...srcFiles];

const outputDir = path.join(rootDir, "dist");
await mkdir(outputDir, { recursive: true });

const outputZip = path.join(outputDir, "kiku_note_manager.ankiaddon");

await zipFiles(allFiles, outputZip);
