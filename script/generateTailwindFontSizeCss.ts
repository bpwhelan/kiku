// const tailwindBreakpoints = ["sm", "md", "lg", "xl", "2xl"];
const tailwindBreakpoints = ["sm"];
const sizes = [
  "text-xs",
  "text-sm",
  "text-base",
  "text-lg",
  "text-xl",
  "text-2xl",
  "text-3xl",
  "text-4xl",
  "text-5xl",
  "text-6xl",
  "text-7xl",
  "text-8xl",
  "text-9xl",
];
const fields = ["expression", "pitch", "sentence", "misc-info", "hint"];

let css = `@layer utilities {\n`;

// Base font size (no breakpoint)
for (const field of fields) {
  for (const size of sizes) {
    css += `  [data-font-size-base-${field}="${size}"] .${field} { @apply ${size}; }\n`;
  }
}

// Responsive variants
for (const field of fields) {
  for (const bp of tailwindBreakpoints) {
    for (const size of sizes) {
      css += `  [data-font-size-${bp}-${field}="${bp}:${size}"] .${field} { @apply ${bp}:${size}; }\n`;
    }
  }
}

css += `}\n`;
console.log(css);

console.log("✅ Generated src/generated/fontsize.css");
