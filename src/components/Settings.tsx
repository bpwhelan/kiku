import { BoltIcon } from "lucide-solid";
import { getTheme, nextTheme, setTheme } from "../util/theme";

export function Settings(props: { onHomeClick: () => void }) {
  return (
    <>
      <div class="flex flex-row justify-start">
        <div class="h-5">
          <BoltIcon
            class="h-full w-full cursor-pointer text-base-content/50"
            on:click={props.onHomeClick}
          ></BoltIcon>
        </div>
      </div>
      <div></div>
      <button
        class="btn text-nowrap btn-sm"
        on:click={() => setTheme(nextTheme(getTheme()))}
      >
        Next Theme
      </button>
    </>
  );
}
