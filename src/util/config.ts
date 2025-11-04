import { type OnlineFont, onlineFonts } from "./fonts";
import { type DaisyUITheme, daisyUIThemes } from "./theme";

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

export function validateConfig(config: any): KikuConfig {
  try {
    if (typeof config !== "object" || config === null) throw new Error();

    const valid: KikuConfig = {
      theme: daisyUIThemes.includes(config.theme)
        ? config.theme
        : defaultConfig.theme,
      onlineFont: onlineFonts.includes(config.onlineFont)
        ? config.onlineFont
        : defaultConfig.onlineFont,
      systemFont:
        typeof config.systemFont === "string"
          ? config.systemFont
          : defaultConfig.systemFont,
      ankiConnectPort:
        typeof config.ankiConnectPort === "number" && config.ankiConnectPort > 0
          ? config.ankiConnectPort
          : defaultConfig.ankiConnectPort,
    };

    return valid;
  } catch {
    return defaultConfig;
  }
}
