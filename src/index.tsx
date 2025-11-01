/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App.tsx";
import "./tailwind.css";
import tailwind from "./tailwind.css?inline";

import { exampleFields } from "./types.ts";

const root = document.getElementById("root");
if (!root) throw new Error("root not found");
const shadow = root.attachShadow({ mode: "closed" });
const sheet = new CSSStyleSheet();
sheet.replaceSync(tailwind.replaceAll(":root", ":host"));
shadow.adoptedStyleSheets = [sheet];

render(() => <App ankiFields={exampleFields} />, shadow);

document.documentElement.setAttribute("data-theme", "coffee");
