import { createEffect } from "solid-js";
import { useCardStore } from "#/components/shared/CardContext";
import { useFieldGroup } from "../shared/FieldGroupContext";

export default function Sentence() {
  const [card, setCard] = useCardStore();
  const { group } = useFieldGroup();

  createEffect(() => {
    if (card.sentenceFieldRef && group.sentenceField) {
      const ruby = card.sentenceFieldRef.querySelectorAll("ruby");
      ruby.forEach((el) => {
        el.classList.add(..."[&_rt]:invisible hover:[&_rt]:visible".split(" "));
      });
    }
  });

  return (
    <div
      class={`[&_b]:text-base-content-primary sentence font-secondary flex-1 animate-fade-in`}
      ref={(ref) => setCard("sentenceFieldRef", ref)}
      innerHTML={group.sentenceField}
    ></div>
  );
}
