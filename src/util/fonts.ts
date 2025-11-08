export const fonts = ["Hina Mincho", "Klee One", "IBM Plex Sans JP"] as const;

export type Font = (typeof fonts)[number];
