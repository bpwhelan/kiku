import { useCardStore } from "../shared/CardContext";
import { useFieldGroup } from "../shared/FieldGroupContext";
import { ArrowLeftIcon } from "./Icons";

export default function PicturePagination() {
  const { group, nextGroup, prevGroup, groupIds } = useFieldGroup();
  const [card, setCard] = useCardStore();

  return (
    groupIds.size > 1 && (
      <>
        <ArrowLeftIcon
          class="cursor-pointer size-5 sm:size-8 hover:scale-110 transition-transform"
          on:click={() => {
            prevGroup();
            const el = card.sentenceAudios?.[0];
            if (el) {
              el.click();
              if (el instanceof HTMLAudioElement) el.play();
            }
          }}
        ></ArrowLeftIcon>
        {`${group.index + 1} / ${groupIds.size}`}
        <ArrowLeftIcon
          class="cursor-pointer size-5 sm:size-8 rotate-180 hover:scale-110 transition-transform"
          on:click={() => {
            nextGroup();
            const el = card.sentenceAudios?.[0];
            if (el) {
              el.click();
              if (el instanceof HTMLAudioElement) el.play();
            }
          }}
        ></ArrowLeftIcon>
      </>
    )
  );
}
