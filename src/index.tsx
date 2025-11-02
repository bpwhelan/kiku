/* @refresh reload */
import { render } from "solid-js/web";
import { Back } from "./Back.tsx";
import { type AnkiFields, exampleFields } from "./types.ts";
import "./tailwind.css";
import { Front } from "./Front.tsx";

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

  document.documentElement.setAttribute("data-theme", "coffee");
  root.setAttribute("data-theme", "coffee");

  if (side === "front") {
    render(() => <Front ankiFields={ankiFields} />, shadow);
  } else if (side === "back") {
    render(() => <Back ankiFields={ankiFields} />, shadow);
  }
}

if (import.meta.env.DEV) {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop as string),
  });
  // @ts-expect-error
  const side = params.side;
  init({ ankiFields: exampleFields, side: side ?? "back" });
}
