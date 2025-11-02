import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Simple helper for calling AnkiConnect API */
async function callAnki<T extends string>(
  action: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  const res = await fetch("http://localhost:8765", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, version: 6, params }),
  });

  const result = await res.json();
  if (result.error) {
    throw new Error(result.error);
  }
  return result;
}

async function main() {
  const modelName = "Kiku"; // ← change to your note type name
  const frontPath = join(import.meta.dirname, "../src/front.html");
  const backPath = join(import.meta.dirname, "../src/back.html");
  const stylePath = join(import.meta.dirname, "../dist/_kiku.css");

  // Read your local HTML templates
  const [front, back, style] = await Promise.all([
    readFile(frontPath, "utf8"),
    readFile(backPath, "utf8"),
    readFile(stylePath, "utf8"),
  ]);

  // Send them to AnkiConnect
  const result = await callAnki("updateModelTemplates", {
    model: {
      name: modelName,
      templates: {
        Mining: {
          Front: front,
          Back: back,
        },
      },
    },
  });

  console.log(result);
  console.log(
    `✅ Updated Anki model "${modelName}" templates from ${frontPath} and ${backPath}`,
  );

  const result2 = await callAnki("updateModelStyling", {
    model: {
      name: modelName,
      css: style,
    },
  });

  console.log(result2);
  console.log(`✅ Updated Anki model "${modelName}" style from ${stylePath}`);
}

main().catch((err) => {
  console.error("❌ Failed to update templates:", err);
  process.exit(1);
});
