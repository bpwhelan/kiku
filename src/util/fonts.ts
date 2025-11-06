export const onlineFonts = [
  "Hina Mincho",
  "Inter",
  "Klee One",
  "Kosugi Maru",
  "M PLUS Rounded 1c",
  "Noto Sans JP",
  "Noto Serif JP",
  "Sawarabi Mincho",
  "Zen Kaku Gothic New",
  "Zen Old Mincho",
] as const;

export type OnlineFont = (typeof onlineFonts)[number];

export function setSystemFont(font: string) {
  const root = globalThis.KIKU_STATE.root;
  if (root) root.style.fontFamily = font;
}
