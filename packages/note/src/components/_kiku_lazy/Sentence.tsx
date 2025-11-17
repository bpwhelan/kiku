import { useCardStore } from "#/components/shared/CardContext";
import { useAnkiField } from "../shared/Context";
import { useFieldGroup } from "../shared/FieldGroupContext";

export function SentenceBack() {
  const { ankiFields } = useAnkiField<"back">();
  const [card, setCard] = useCardStore();
  const { group } = useFieldGroup();

  const innerHTML = () => {
    if (card.nested) return ankiFields.Sentence;
    return ankiFields["furigana:SentenceFurigana"]
      ? ankiFields["furigana:SentenceFurigana"]
      : ankiFields["kanji:Sentence"];
  };

  return (
    <div
      class={`[&_b]:text-base-content-primary sentence font-secondary flex-1`}
      ref={(ref) => setCard("sentenceFieldRef", ref)}
      innerHTML={group.sentenceField}
    ></div>
  );
}
