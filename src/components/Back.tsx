import { BoltIcon, CircleChevronDownIcon, InfoIcon } from "lucide-solid";
import { createSignal, For, Match, onMount, Show, Switch } from "solid-js";
import type { AnkiBackFields } from "../types";
import { Layout } from "./Layout";
import { Settings } from "./Settings";

export function Back(props: { ankiFields: AnkiBackFields }) {
  let sentenceEl: HTMLDivElement | undefined;
  const [definitionPage, setDefinitionPage] = createSignal(0);
  const [showSettings, setShowSettings] = createSignal(false);

  const tags = props.ankiFields.Tags.split(" ");

  onMount(() => {
    if (sentenceEl) {
      const ruby = sentenceEl.querySelectorAll("ruby");
      ruby.forEach((el) => {
        el.classList.add(..."[&_rt]:invisible hover:[&_rt]:visible".split(" "));
      });
    }
  });

  return (
    <Layout>
      <Switch>
        <Match when={showSettings()}>
          <Settings
            onBackClick={() => setShowSettings(false)}
            onCancelClick={() => setShowSettings(false)}
          />
        </Match>
        <Match when={!showSettings()}>
          <div class="flex justify-between flex-row">
            <div class="relative h-5 ">
              <BoltIcon
                class="h-full w-full cursor-pointer text-base-content/50"
                on:click={() => setShowSettings(!showSettings())}
              ></BoltIcon>
            </div>
            <div class="flex gap-2 items-center relative hover:[&_>_#frequency]:block h-5">
              <div
                innerHTML={props.ankiFields.FreqSort}
                class="text-base-content/50"
              ></div>
              <CircleChevronDownIcon class="h-full w-full text-base-content/50" />
              <div
                id="frequency"
                class="absolute top-0 translate-y-6 right-2 w-fit [&_li]:text-nowrap bg-base-300 p-4 rounded-lg hidden"
                innerHTML={props.ankiFields.Frequency}
              ></div>
            </div>
          </div>
          <div class="flex rounded-lg gap-4 sm:h-56 flex-col sm:flex-row">
            <div class="flex-1 bg-base-200 p-4 rounded-lg flex flex-col items-center justify-center">
              <div
                class="text-2xl sm:text-3xl"
                innerHTML={props.ankiFields["kana:ExpressionFurigana"]}
              ></div>
              <div
                class="text-5xl sm:text-6xl"
                innerHTML={props.ankiFields.Expression}
              ></div>
              <div class="text-3xl">{/* TODO: pitch  */}</div>
            </div>
            <div
              class="sm:[&_img]:h-full [&_img]:rounded-lg [&_img]:object-contain [&_img]:h-48 [&_img]:mx-auto bg-base-200 rounded-lg"
              innerHTML={props.ankiFields.Picture}
            ></div>
          </div>
          <div class="flex sm:flex-col gap-8 flex-col-reverse">
            <div class="flex flex-col gap-4 items-center text-center">
              <div
                class="text-2xl sm:text-4xl [&_b]:text-primary"
                ref={sentenceEl}
                innerHTML={
                  props.ankiFields["furigana:SentenceFurigana"] ??
                  props.ankiFields["furigana:Sentence"]
                }
              ></div>
            </div>
            <div>
              <div class="text-end text-base-content/50">
                {definitionPage() === 0 ? "Main definition" : "Glossary"}
              </div>
              <div class="relative bg-base-200 p-4 border-s-4 text-base sm:text-xl rounded-lg [&_ol]:list-inside [&_ul]:list-inside">
                <div
                  style={{
                    display: definitionPage() === 0 ? "block" : "none",
                  }}
                  innerHTML={props.ankiFields.MainDefinition}
                ></div>
                <div
                  style={{
                    display: definitionPage() === 1 ? "block" : "none",
                  }}
                  innerHTML={props.ankiFields.Glossary}
                ></div>

                <button
                  class="cursor-pointer w-8 h-full absolute top-0 left-0 hover:bg-white/10"
                  on:click={() =>
                    setDefinitionPage((prev) => Math.abs((prev - 1) % 2))
                  }
                ></button>
                <button
                  class="cursor-pointer w-8 h-full absolute top-0 right-0 hover:bg-white/10"
                  on:click={() =>
                    setDefinitionPage((prev) => Math.abs((prev + 1) % 2))
                  }
                ></button>
              </div>
            </div>
          </div>
          <Show when={props.ankiFields.MiscInfo}>
            <div class="flex gap-2 items-center justify-center bg-base-200 p-2 rounded-lg text-sm">
              <InfoIcon class="h-5 w-5" />
              <div innerHTML={props.ankiFields.MiscInfo}></div>
            </div>
          </Show>
          <div class="flex gap-4 items-center justify-center">
            <For each={tags}>
              {(tag) => {
                return (
                  <div class="badge badge-primary badge-sm opacity-75">
                    {tag}
                  </div>
                );
              }}
            </For>
          </div>
        </Match>
      </Switch>
    </Layout>
  );
}
