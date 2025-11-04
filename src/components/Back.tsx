import { createSignal, lazy, onMount } from "solid-js";
import type { AnkiBackFields } from "../types";
import { isMobile } from "../util/general";
import { Layout } from "./Layout";
import { useAnkiField, useConfig } from "./shared/Context";

const Lazy = {
  Settings: lazy(async () => ({
    default: (await import("./_kiku_lazy")).Settings,
  })),
  BackHeader: lazy(async () => ({
    default: (await import("./_kiku_lazy")).BackHeader,
  })),
  BackFooter: lazy(async () => ({
    default: (await import("./_kiku_lazy")).BackFooter,
  })),
  AudioButtons: lazy(async () => ({
    default: (await import("./_kiku_lazy")).AudioButtons,
  })),
  ImageModal: lazy(async () => ({
    default: (await import("./_kiku_lazy")).ImageModal,
  })),
  BackBody: lazy(async () => ({
    default: (await import("./_kiku_lazy")).BackBody,
  })),
};

let relax = false;

export function Back() {
  const expressionAudioRefSignal = createSignal<HTMLDivElement | undefined>();
  const sentenceAudioRefSignal = createSignal<HTMLDivElement | undefined>();
  const [config] = useConfig();

  const ankiFields = useAnkiField() as AnkiBackFields;
  const [showSettings, setShowSettings] = createSignal(false);
  const [ready, setReady] = createSignal(false);
  const [showImageModal, setShowImageModal] = createSignal(false);

  const tags = ankiFields.Tags.split(" ");
  const isNsfw = tags.map((tag) => tag.toLowerCase()).includes("nsfw");

  onMount(() => {
    setTimeout(() => {
      setReady(true);
      relax = true;
    }, 50);
  });

  let prefetch = document.getElementById("prefetch-picture");
  if (import.meta.env.DEV) {
    prefetch = document.createElement("div");
    prefetch.innerHTML = ankiFields.Picture ?? "";
  }
  if (!prefetch) throw new Error("Prefetch picture not found");
  const img = prefetch.querySelector("img");

  return (
    <Layout>
      {showSettings() && (
        <Lazy.Settings
          onBackClick={() => setShowSettings(false)}
          onCancelClick={() => setShowSettings(false)}
        />
      )}
      {!showSettings() && (
        <>
          <div class="flex justify-between flex-row h-5 min-h-5">
            {ready() && (
              <Lazy.BackHeader onSettingsClick={() => setShowSettings(true)} />
            )}
          </div>
          <div
            class="flex rounded-lg gap-4 sm:h-56 flex-col sm:flex-row"
            classList={{
              "animate-fade-in": relax,
            }}
          >
            <div class="flex-1 bg-base-200 p-4 rounded-lg flex flex-col items-center justify-center">
              <div
                class={`${config.fontSizeBaseExpression} ${config.fontSizeSmExpression}`}
                innerHTML={
                  ankiFields.ExpressionFurigana
                    ? ankiFields["furigana:ExpressionFurigana"]
                    : ankiFields.Expression
                }
              ></div>
              <div
                class={`${config.fontSizeBasePitch} ${config.fontSizeSmPitch}`}
              >
                {/* TODO: pitch  */}
              </div>
              <div
                class="flex gap-2"
                classList={{
                  "h-8 pt-4": !isMobile(),
                }}
              >
                {ready() && (
                  <Lazy.AudioButtons
                    position={1}
                    expressionAudioRefSignal={expressionAudioRefSignal}
                    sentenceAudioRefSignal={sentenceAudioRefSignal}
                  />
                )}
              </div>
            </div>

            <div
              class="sm:[&_img]:h-full [&_img]:rounded-lg [&_img]:object-contain [&_img]:h-48 [&_img]:mx-auto bg-base-200 rounded-lg transition-[filter] hover:filter-none cursor-pointer"
              classList={{
                "filter blur-[16px] brightness-50": isNsfw,
              }}
              on:click={() => setShowImageModal(true)}
            >
              {img}
            </div>
          </div>
          {ready() && <Lazy.BackBody />}
          {ready() && (
            <>
              <Lazy.BackFooter tags={tags} />
              <Lazy.AudioButtons
                position={2}
                expressionAudioRefSignal={expressionAudioRefSignal}
                sentenceAudioRefSignal={sentenceAudioRefSignal}
              />
            </>
          )}
        </>
      )}
      {ready() && img && (
        <Lazy.ImageModal
          show={showImageModal()}
          img={img.cloneNode()}
          on:click={() => setShowImageModal(false)}
        />
      )}
    </Layout>
  );
}
