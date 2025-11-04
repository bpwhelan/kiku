import { type OnlineFont, onlineFonts } from "./fonts";
import { type DaisyUITheme, daisyUIThemes } from "./theme";

export const tailwindFontSize = [
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
export const tailwindBreakpoints = ["sm", "md", "lg", "xl", "2xl"] as const;

export type TailwindFontSize = (typeof tailwindFontSize)[number];
export type TailwindBreakpoint = (typeof tailwindBreakpoints)[number];

/**
 * Allows "text-lg" or "sm:text-lg" etc.
 */
export type ResponsiveFontSize =
  | TailwindFontSize
  | `${TailwindBreakpoint}:${TailwindFontSize}`;

export type KikuConfig = {
  theme: DaisyUITheme;
  onlineFont: OnlineFont;
  systemFont: string;
  ankiConnectPort: number;
  fontSizeBaseExpression: ResponsiveFontSize;
  fontSizeBasePitch: ResponsiveFontSize;
  fontSizeBaseSentence: ResponsiveFontSize;
  fontSizeBaseMiscInfo: ResponsiveFontSize;
  fontSizeBaseHint: ResponsiveFontSize;
  fontSizeSmExpression: ResponsiveFontSize;
  fontSizeSmPitch: ResponsiveFontSize;
  fontSizeSmSentence: ResponsiveFontSize;
  fontSizeSmMiscInfo: ResponsiveFontSize;
  fontSizeSmHint: ResponsiveFontSize;
};

export const defaultConfig: KikuConfig = {
  theme: "coffee",
  onlineFont: "Noto Serif JP",
  systemFont: "",
  ankiConnectPort: 8765,
  fontSizeBaseExpression: "text-5xl",
  fontSizeBasePitch: "text-3xl",
  fontSizeBaseSentence: "text-2xl",
  fontSizeBaseMiscInfo: "text-sm",
  fontSizeBaseHint: "text-lg",
  fontSizeSmExpression: "sm:text-6xl",
  fontSizeSmPitch: "sm:text-4xl",
  fontSizeSmSentence: "sm:text-4xl",
  fontSizeSmMiscInfo: "sm:text-sm",
  fontSizeSmHint: "sm:text-2xl",
};

function validateResponsiveFontSize(
  value: any,
  fallback: ResponsiveFontSize,
): ResponsiveFontSize {
  if (typeof value !== "string") return fallback;
  if (tailwindFontSize.includes(value as TailwindFontSize))
    return value as ResponsiveFontSize;
  for (const bp of tailwindBreakpoints) {
    for (const fs of tailwindFontSize) {
      if (value === `${bp}:${fs}`) return value as ResponsiveFontSize;
    }
  }
  return fallback;
}

export function validateConfig(config: any): KikuConfig {
  try {
    if (typeof config !== "object" || config === null) throw new Error();

    // biome-ignore format: this looks nicer
    const valid: KikuConfig = {
      theme: daisyUIThemes.includes(config.theme) ? config.theme : defaultConfig.theme,
      onlineFont: onlineFonts.includes(config.onlineFont) ? config.onlineFont : defaultConfig.onlineFont,
      systemFont: typeof config.systemFont === "string" ? config.systemFont : defaultConfig.systemFont,
      ankiConnectPort: typeof config.ankiConnectPort === "number" && config.ankiConnectPort > 0 ? config.ankiConnectPort : defaultConfig.ankiConnectPort,

      fontSizeBaseExpression: validateResponsiveFontSize( config.fontSizeBaseExpression, defaultConfig.fontSizeBaseExpression,),
      fontSizeBasePitch: validateResponsiveFontSize( config.fontSizeBasePitch, defaultConfig.fontSizeBasePitch,),
      fontSizeBaseSentence: validateResponsiveFontSize( config.fontSizeBaseSentence, defaultConfig.fontSizeBaseSentence,),
      fontSizeBaseMiscInfo: validateResponsiveFontSize( config.fontSizeBaseMiscInfo, defaultConfig.fontSizeBaseMiscInfo,),
      fontSizeBaseHint: validateResponsiveFontSize( config.fontSizeBaseHint, defaultConfig.fontSizeBaseHint,),
      fontSizeSmExpression: validateResponsiveFontSize( config.fontSizeSmExpression, defaultConfig.fontSizeSmExpression,),
      fontSizeSmPitch: validateResponsiveFontSize( config.fontSizeSmPitch, defaultConfig.fontSizeSmPitch,),
      fontSizeSmSentence: validateResponsiveFontSize( config.fontSizeSmSentence, defaultConfig.fontSizeSmSentence,),
      fontSizeSmMiscInfo: validateResponsiveFontSize( config.fontSizeSmMiscInfo, defaultConfig.fontSizeSmMiscInfo,),
      fontSizeSmHint: validateResponsiveFontSize( config.fontSizeSmHint, defaultConfig.fontSizeSmHint,),
    };

    return valid;
  } catch {
    return defaultConfig;
  }
}
