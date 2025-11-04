import type { OnlineFont } from "./fonts";
import type { DaisyUITheme } from "./theme";

export type KikuConfig = {
  theme: DaisyUITheme;
  onlineFont: OnlineFont;
  systemFont: string;
  ankiConnectPort: number;
};

export const defaultConfig: KikuConfig = {
  theme: "coffee",
  onlineFont: "Noto Serif JP",
  systemFont: "",
  ankiConnectPort: 8765,
};
