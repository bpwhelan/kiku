import type { AnkiFrontFields } from "../types";
import { Layout } from "./Layout";

export function Front(props: { ankiFields: AnkiFrontFields }) {
  return (
    <Layout>
      <div class="flex justify-end flex-row">
        <div class="flex gap-2 items-center relative hover:[&_>_#frequency]:block h-5 text-secondary-content/50"></div>
      </div>
      <div class="flex rounded-lg gap-4 sm:h-56 flex-col sm:flex-row">
        <div class="flex-1 bg-base-200 p-4 rounded-lg flex flex-col items-center justify-center">
          <div
            class="text-5xl sm:text-6xl"
            innerHTML={props.ankiFields.Expression}
          ></div>
        </div>
      </div>
    </Layout>
  );
}
