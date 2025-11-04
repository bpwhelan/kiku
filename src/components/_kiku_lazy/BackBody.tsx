import { createSignal, onMount } from "solid-js";
import type { AnkiBackFields } from "#/types";
import { useAnkiField, useConfig } from "../shared/Context";

export default function BackBody() {
  let sentenceEl: HTMLDivElement | undefined;
  const [config] = useConfig();
  const ankiFields = useAnkiField() as AnkiBackFields;
  const [definitionPage, setDefinitionPage] = createSignal(
    ankiFields.SelectionText ? 0 : 1,
  );

  const pages = [
    ankiFields.SelectionText,
    ankiFields.MainDefinition,
    ankiFields.Glossary,
  ];
  const availablePagesCount = pages.filter((page) => page?.trim()).length;
  const page = () => pages[definitionPage()];
  const pageType = () => {
    if (definitionPage() === 0) return "Selection text";
    if (definitionPage() === 1) return "Main definition";
    if (definitionPage() === 2) return "Glossary";
  };

  onMount(() => {
    if (sentenceEl) {
      const ruby = sentenceEl.querySelectorAll("ruby");
      ruby.forEach((el) => {
        el.classList.add(..."[&_rt]:invisible hover:[&_rt]:visible".split(" "));
      });
    }
  });

  return (
    <div class="flex sm:flex-col gap-8 flex-col-reverse animate-fade-in">
      <div class="flex flex-col gap-4 items-center text-center">
        <div
          class={`[&_b]:text-base-content-primary ${config.fontSizeBaseSentence} ${config.fontSizeSmSentence}`}
          ref={sentenceEl}
          innerHTML={
            ankiFields["furigana:SentenceFurigana"] ??
            ankiFields["furigana:Sentence"]
          }
        ></div>
      </div>
      {availablePagesCount > 0 && (
        <div>
          {availablePagesCount > 1 && (
            <div class="text-end text-base-content/50">{pageType()}</div>
          )}
          <div class="relative bg-base-200 p-4 border-s-4 border-primary text-base sm:text-xl rounded-lg [&_ol]:list-inside [&_ul]:list-inside">
            <div innerHTML={page()}></div>
            {availablePagesCount > 1 && (
              <>
                <button
                  class="cursor-pointer w-8 h-full absolute top-0 left-0 hover:bg-base-content/10"
                  on:click={() => {
                    setDefinitionPage((prev) => {
                      let next = (prev - 1 + pages.length) % pages.length;
                      for (let i = 0; i < pages.length; i++) {
                        if (pages[next]?.trim()) break;
                        next = (next - 1 + pages.length) % pages.length;
                      }
                      return next;
                    });
                  }}
                ></button>
                <button
                  class="cursor-pointer w-8 h-full absolute top-0 right-0 hover:bg-base-content/10"
                  on:click={() => {
                    setDefinitionPage((prev) => {
                      let next = (prev + 1) % pages.length;
                      for (let i = 0; i < pages.length; i++) {
                        if (pages[next]?.trim()) break;
                        next = (next + 1) % pages.length;
                      }
                      return next;
                    });
                  }}
                ></button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
