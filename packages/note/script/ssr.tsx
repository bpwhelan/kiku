import { createStore } from "solid-js/store";
import { generateHydrationScript, renderToString } from "solid-js/web";
import { Front } from "#/components/Front";
import { Logger } from "#/util/logger";
import { Back } from "../src/components/Back";
import {
  AnkiFieldContextProvider,
  BreakpointContextProvider,
  CardStoreContextProvider,
  ConfigContextProvider,
} from "../src/components/shared/Context";
import { defaultConfig } from "../src/util/config";

const [config, setConfig] = createStore(defaultConfig);

const logger = new Logger();

globalThis.KIKU_STATE = {
  rootDataset: defaultConfig,
  assetsPath: "",
  logger,
};

export function getSsrTemplate() {
  const frontTemplate = renderToString(() => (
    <AnkiFieldContextProvider>
      <CardStoreContextProvider side="front">
        <BreakpointContextProvider>
          <ConfigContextProvider value={[config, setConfig]}>
            <Front />
          </ConfigContextProvider>
        </BreakpointContextProvider>
      </CardStoreContextProvider>
    </AnkiFieldContextProvider>
  ));
  const backTemplate = renderToString(() => (
    <AnkiFieldContextProvider>
      <CardStoreContextProvider side="back">
        <BreakpointContextProvider>
          <ConfigContextProvider value={[config, setConfig]}>
            <Back />
          </ConfigContextProvider>
        </BreakpointContextProvider>
      </CardStoreContextProvider>
    </AnkiFieldContextProvider>
  ));

  const hydrationScript = generateHydrationScript();

  const result = {
    frontTemplate,
    backTemplate,
    hydrationScript,
  };
  console.log(result);
  return result;
}
