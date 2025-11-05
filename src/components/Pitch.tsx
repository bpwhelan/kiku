import { hatsuon } from "#/util/hatsuon";

export default function Pitch(props: {
  kana: string;
  pitchNum: number;
  index: number;
}) {
  const pitchInfo = hatsuon({ reading: props.kana, pitchNum: props.pitchNum });
  const isEven = props.index % 2 === 0;

  return (
    <div class="flex items-start gap-1">
      <div data-is-even={isEven}>
        {pitchInfo.morae.map((mora, i) => {
          return (
            <span
              classList={{
                "border-primary": isEven,
                "border-secondary": !isEven,
                "border-t-2": pitchInfo.pattern[i] === 1,
                "pitch-segment":
                  pitchInfo.pattern[i] === 1 && pitchInfo.pattern[i + 1] === 0,
              }}
            >
              {mora}
            </span>
          );
        })}
      </div>
      <div
        class="text-sm px-0.5 rounded-sm leading-tight"
        classList={{
          "bg-primary": isEven,
          "bg-secondary": !isEven,
          "text-primary-content": isEven,
          "text-secondary-content": !isEven,
        }}
      >
        {pitchInfo.pitchNum}
      </div>
    </div>
  );
}
