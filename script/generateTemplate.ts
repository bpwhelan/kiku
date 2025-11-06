import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { getSsrTemplate } from "./ssr.js";

async function main() {
  const frontPath = join(import.meta.dirname, "../src/front.html");
  const frontDestPath = join(import.meta.dirname, "../dist/front.html");
  const backPath = join(import.meta.dirname, "../src/back.html");
  const backDestPath = join(import.meta.dirname, "../dist/back.html");

  const [front, back] = await Promise.all([
    readFile(frontPath, "utf8"),
    readFile(backPath, "utf8"),
  ]);

  let { backTemplate, hydrationScript } = getSsrTemplate();

  backTemplate = back.replace("<!-- SSR_TEMPLATE -->", backTemplate);
  backTemplate = backTemplate.replace(
    "<!-- HYDRATION_SCRIPT -->",
    hydrationScript,
  );
  await writeFile(backDestPath, backTemplate);
  await writeFile(frontDestPath, front);
}
main()
  .catch((err) => {
    console.error("❌ Failed to generate template:", err);
    process.exit(1);
  })
  .then(() => {
    console.log("✅ Generated template");
  });
