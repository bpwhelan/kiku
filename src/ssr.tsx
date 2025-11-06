import { createStore } from "solid-js/store";
import { renderToString } from "solid-js/web";
import { Back } from "./components/Back";
import {
  AnkiFieldContextProvider,
  ConfigContextProvider,
} from "./components/shared/Context";
import { exampleFields6 } from "./types";
import { defaultConfig } from "./util/config";

const [config, setConfig] = createStore(defaultConfig);

const html = renderToString(() => (
  <AnkiFieldContextProvider
    //@ts-expect-error
    value={{ ankiFields: exampleFields6, ankiFieldNodes: {} }}
  >
    <ConfigContextProvider value={[config, setConfig]}>
      <Back />
    </ConfigContextProvider>
  </AnkiFieldContextProvider>
));
console.log("DEBUG[885]: html=", html);
