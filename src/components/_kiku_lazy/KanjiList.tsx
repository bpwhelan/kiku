import { For } from "solid-js";
import { useCardStore } from "../shared/Context";
import { ArrowLeftIcon } from "./Icons";

export default function KanjiList(props: {
  onBackClick?: () => void;
  onNextClick?: (noteId: number) => void;
}) {
  const [card, setCard] = useCardStore();

  return (
    <>
      <div class="flex flex-row justify-between items-center animate-fade-in">
        <div class="h-5">
          <ArrowLeftIcon
            class="h-full w-full cursor-pointer text-base-content-soft"
            on:click={props.onBackClick}
          ></ArrowLeftIcon>
        </div>
        <div class="flex flex-row gap-2 items-center"></div>
      </div>
      <div class="flex flex-col gap-2 sm:gap-4 ">
        <For each={Object.entries(card.kanji)}>
          {([kanji, data]) => {
            return (
              <div class="collapse bg-base-200 border border-base-300">
                <input type="checkbox" checked={true} />
                <div class="collapse-title justify-center flex font-secondary expression">
                  {kanji}
                </div>
                <div class="collapse-content text-sm">
                  <div class="flex flex-col gap-2 sm:gap-4">
                    <div class="text-xl sm:text-2xl font-bold">Shared</div>
                    <div>
                      <ul class="list bg-base-100 rounded-box shadow-md">
                        <For each={data.shared}>
                          {(data) => {
                            return (
                              <>
                                <li class="p-4 pb-0 tracking-wide flex gap-2 items-end">
                                  <div
                                    class=" font-secondary sentence"
                                    innerHTML={data.fields.Expression.value.replaceAll(
                                      kanji,
                                      `<span class="text-base-content-primary">${kanji}</span>`,
                                    )}
                                  ></div>
                                  <div class="text-base-content-calm">
                                    {new Date(data.noteId).toLocaleDateString()}
                                  </div>
                                </li>

                                <li class="list-row">
                                  <div></div>
                                  <div
                                    class="text-base sm:text-xl text-base-content-calm font-secondary"
                                    innerHTML={data.fields.Sentence.value.replaceAll(
                                      kanji,
                                      `<span class="text-base-content-primary">${kanji}</span>`,
                                    )}
                                  ></div>
                                  <div class="flex justify-center items-center">
                                    <ArrowLeftIcon
                                      class="size-5 sm:size-8 text-base-content-soft rotate-180 cursor-pointer"
                                      on:click={() => {
                                        props.onNextClick?.(data.noteId);
                                      }}
                                    ></ArrowLeftIcon>
                                  </div>
                                </li>
                              </>
                            );
                          }}
                        </For>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
        </For>
      </div>
    </>
  );
}
