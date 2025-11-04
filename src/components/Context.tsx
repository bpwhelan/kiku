import { createContext, createEffect, type JSX, useContext } from "solid-js";
import type { SetStoreFunction, Store } from "solid-js/store";
import type { KikuConfig } from "../util/config";
import { type OnlineFont, onlineFonts, setOnlineFont } from "../util/fonts";
import { setTheme } from "../util/theme";

const ConfigContext =
  createContext<[Store<KikuConfig>, SetStoreFunction<KikuConfig>]>();

export function ConfigContextProvider(props: {
  children: JSX.Element;
  value: [Store<KikuConfig>, SetStoreFunction<KikuConfig>];
}) {
  const [config] = props.value;
  createEffect(() => {
    setTheme(config.theme);
    const font = onlineFonts.includes(config.font as OnlineFont)
      ? config.font
      : undefined;
    if (font) setOnlineFont(font as OnlineFont);
  });

  return (
    <ConfigContext.Provider value={props.value}>
      {props.children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const config = useContext(ConfigContext);
  if (!config) throw new Error("Missing ConfigContext");
  return config;
}
