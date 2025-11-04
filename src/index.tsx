/* @refresh reload */
import { render } from "solid-js/web";
import { Back } from "./components/Back.tsx";
import { type AnkiFields, exampleFields2 } from "./types.ts";
import "./tailwind.css";
import { createStore } from "solid-js/store";
import { ConfigContextProvider } from "./components/Context.tsx";
import { Front } from "./components/Front.tsx";
import type { KikuConfig } from "./util/config.ts";
import { type OnlineFont, onlineFonts, setOnlineFont } from "./util/fonts.ts";
import { env } from "./util/general.ts";

export async function init({
  ankiFields,
  side,
}: {
  ankiFields: AnkiFields;
  side: "front" | "back";
}) {
  const root = document.getElementById("root");
  if (!root) throw new Error("root not found");

  const shadow = root.attachShadow({ mode: "closed" });
  const config_ = (await (
    await fetch(env.KIKU_CONFIG_FILE)
  ).json()) as KikuConfig;

  if (import.meta.env.DEV) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/src/tailwind.css";
    const link2 = link.cloneNode();
    document.head.appendChild(link);
    shadow.appendChild(link2);
  } else {
    const qa = document.getElementById("qa");
    const style = qa?.querySelector("style");
    if (style) {
      shadow.appendChild(style.cloneNode(true));
    }
  }

  document.documentElement.setAttribute("data-theme", config_.theme);
  root.setAttribute("data-theme", config_.theme);
  if (onlineFonts.includes(config_.font as OnlineFont)) {
    setOnlineFont(config_.font as OnlineFont);
  }

  const [config, setConfig] = createStore(config_);

  if (side === "front") {
    render(
      () => (
        <ConfigContextProvider value={[config, setConfig]}>
          <Front ankiFields={ankiFields} />
        </ConfigContextProvider>
      ),
      shadow,
    );
  } else if (side === "back") {
    render(
      () => (
        <ConfigContextProvider value={[config, setConfig]}>
          <Back ankiFields={ankiFields} />
        </ConfigContextProvider>
      ),
      shadow,
    );
  }
}

if (import.meta.env.DEV) {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop as string),
  });
  // @ts-expect-error
  const side = params.side;
  init({ ankiFields: exampleFields2, side: side ?? "back" });
}
