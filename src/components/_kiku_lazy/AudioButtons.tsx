import { onMount } from "solid-js";
import { useAnkiField, useCardStore } from "../shared/Context";
import { PlayIcon } from "./Icons";

export function NotePlayIcon(props: {
  "on:click"?: () => void;
  color: "primary" | "secondary";
}) {
  return (
    <PlayIcon
      class="bg-primary rounded-full text-primary-content p-1 w-8 h-8 cursor-pointer animate-fade-in-sm"
      classList={{
        "bg-primary text-primary-content": props.color === "primary",
        "bg-secondary text-secondary-content": props.color === "secondary",
      }}
      on:click={props["on:click"]}
    />
  );
}

export default function AudioButtons(props: { position: 1 | 2 }) {
  const { ankiFields } = useAnkiField<"back">();
  const [card, setCard] = useCardStore();
  const hiddenStyle = {
    width: "0",
    height: "0",
    overflow: "hidden",
    position: "absolute",
  } as const;

  onMount(() => {
    const aaa = card.sentenceAudioRef?.querySelectorAll("a");
    if (aaa && !card.sentenceAudios) setCard("sentenceAudios", Array.from(aaa));
  });

  if (props.position === 1)
    return (
      <>
        <div
          style={hiddenStyle}
          ref={(ref) => setCard("expressionAudioRef", ref)}
          innerHTML={ankiFields.ExpressionAudio}
        ></div>
        <div
          style={hiddenStyle}
          ref={(ref) => setCard("sentenceAudioRef", ref)}
          innerHTML={ankiFields.SentenceAudio}
        ></div>
        {ankiFields.ExpressionAudio && (
          <NotePlayIcon
            color="primary"
            on:click={() => {
              card.expressionAudioRef?.querySelector("a")?.click();
            }}
          ></NotePlayIcon>
        )}
        {card.sentenceAudios?.map((el) => {
          return (
            <NotePlayIcon
              color="secondary"
              on:click={() => {
                el.click();
              }}
            ></NotePlayIcon>
          );
        })}
      </>
    );

  if (props.position === 2)
    return (
      <div class="absolute bottom-4 left-4 flex sm:hidden flex-col gap-2 items-center">
        {ankiFields.ExpressionAudio && (
          <NotePlayIcon
            color="primary"
            on:click={() => {
              card.expressionAudioRef?.querySelector("a")?.click();
            }}
          ></NotePlayIcon>
        )}
        {card.sentenceAudios?.map((el) => {
          return (
            <NotePlayIcon
              color="secondary"
              on:click={() => {
                el.click();
              }}
            ></NotePlayIcon>
          );
        })}
      </div>
    );
}
